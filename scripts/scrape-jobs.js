require("dotenv").config({ path: ".env.local" });
const crypto = require("crypto");

// We'll use node-appwrite directly since we're in Node
const { Client, Databases, ID, Query } = require("node-appwrite");

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

// Import Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Fetch HTML from a URL using ScraperAPI
 */
async function fetchWithScraperAPI(targetUrl) {
  const scraperApiKey = process.env.SCRAPERAPI_KEY;
  if (!scraperApiKey) {
    throw new Error("SCRAPERAPI_KEY is not configured");
  }

  const apiUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error(
      `ScraperAPI request failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.text();
}

/**
 * Parse HTML using Gemini 2.0 Flash to extract job listings
 */
async function parseJobsWithGemini(html, sourceUrl) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a job listing parser. Extract job listings from the following HTML content.

Return a JSON array with the latest 10 jobs. Each job object should have these fields:
- title: The job title (string)
- company: The company name (string)
- location: The job location (string, use "Remote" if applicable)
- apply_url: The direct application link/URL (string, must be a valid URL)
- description: A brief job description if available (string, max 500 chars)

Important rules:
1. Only return valid JSON - no markdown, no code blocks, just the raw JSON array
2. If you can't find 10 jobs, return as many as you can find
3. If a field is not available, use a reasonable placeholder like "Not specified"
4. For apply_url, if only a relative path is found, prepend the base domain
5. Ensure all URLs are properly formatted

HTML Content:
${html.substring(0, 50000)}

Return only the JSON array:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\n?/, "")
        .replace(/\n?```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const jobs = JSON.parse(cleanedText);

    if (!Array.isArray(jobs)) {
      throw new Error("Gemini did not return a valid JSON array");
    }

    return jobs.map((job) => ({
      ...job,
      source_id: generateSourceId(job.title, job.company, sourceUrl),
    }));
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error(`Failed to parse jobs with Gemini: ${error.message}`);
  }
}

/**
 * Generate a unique source_id for duplicate detection
 */
function generateSourceId(title, company, sourceUrl) {
  const data = `${title}-${company}-${sourceUrl}`.toLowerCase();
  return crypto.createHash("md5").update(data).digest("hex").substring(0, 16);
}

/**
 * Check if job exists
 */
async function jobExists(sourceId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [Query.equal("source_id", sourceId)],
    );
    return response.total > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Create a job document
 */
async function createJob(jobData) {
  return await databases.createDocument(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
    ID.unique(),
    {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      apply_url: jobData.apply_url,
      description: jobData.description || "",
      source_id: jobData.source_id,
    },
  );
}

/**
 * Scrape jobs from a URL
 */
async function scrapeAndSaveJobs(targetUrl) {
  console.log(`\n📥 Scraping: ${targetUrl}`);

  try {
    // Step 1: Fetch HTML with ScraperAPI
    console.log("  Fetching HTML...");
    const html = await fetchWithScraperAPI(targetUrl);
    console.log(`  Fetched ${html.length} characters`);

    // Step 2: Parse jobs with Gemini
    console.log("  Parsing with Gemini...");
    const jobs = await parseJobsWithGemini(html, targetUrl);
    console.log(`  Found ${jobs.length} jobs`);

    // Step 3: Save new jobs
    let savedCount = 0;
    let skippedCount = 0;

    for (const job of jobs) {
      const exists = await jobExists(job.source_id);

      if (exists) {
        skippedCount++;
        continue;
      }

      try {
        await createJob(job);
        savedCount++;
        console.log(`  ✅ Saved: ${job.title} at ${job.company}`);
      } catch (error) {
        console.error(`  ❌ Failed: ${job.title}`, error.message);
      }
    }

    return { savedCount, skippedCount, total: jobs.length };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { savedCount: 0, skippedCount: 0, total: 0, error: error.message };
  }
}

// Target URLs to scrape (using simpler ones that are more likely to work)
const targetUrls = [
  // Remote job boards (more reliable HTML structure)
  "https://remoteok.com/remote-dev-jobs",
  "https://weworkremotely.com/remote-jobs/search?term=developer",

  // Indeed Bangladesh
  "https://bd.indeed.com/jobs?q=developer&l=Dhaka",

  // LinkedIn (public job search)
  "https://www.linkedin.com/jobs/search/?keywords=software%20developer&location=Bangladesh&f_TPR=r86400",
];

async function main() {
  console.log("🚀 Starting job scraper...\n");
  console.log(
    `ScraperAPI Key: ${process.env.SCRAPERAPI_KEY ? "✅ Set" : "❌ Missing"}`,
  );
  console.log(
    `Gemini API Key: ${process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing"}`,
  );
  console.log(
    `Appwrite configured: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? "✅ Yes" : "❌ No"}`,
  );

  let totalSaved = 0;
  let totalSkipped = 0;

  for (const url of targetUrls) {
    const result = await scrapeAndSaveJobs(url);
    totalSaved += result.savedCount;
    totalSkipped += result.skippedCount;

    // Wait a bit between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Scraping complete!`);
  console.log(`   Total saved: ${totalSaved} new jobs`);
  console.log(`   Total skipped: ${totalSkipped} duplicates`);
}

main().catch(console.error);
