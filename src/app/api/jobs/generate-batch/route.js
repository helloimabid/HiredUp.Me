import { NextResponse } from "next/server";
import { Client, Databases, Query } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

/**
 * Scrape job details from URL
 */
async function scrapeJobUrl(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) return null;

    const html = await response.text();
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 12000);

    return { fullPageText: textContent };
  } catch {
    return null;
  }
}

/**
 * Generate enhanced content using OpenRouter API
 */
async function generateEnhancedContent(job, scrapedData) {
  const systemPrompt = `You are a job content creator for hiredup.me. Generate rich, professional job page content in JSON format:
{
  "enhanced_title": "Clean job title",
  "company_description": "2-3 sentence company overview",
  "about_role": "2-3 paragraph role description",
  "responsibilities": ["5-8 responsibilities"],
  "qualifications": {"required": ["4-6 items"], "preferred": ["3-4 items"]},
  "benefits": ["5-8 benefits"],
  "skills": ["6-10 skills"],
  "experience_level": "Entry Level | Mid-Level | Senior | Lead | Executive",
  "salary_range": "Extracted or 'Competitive'",
  "job_highlights": ["3-4 highlights"],
  "work_environment": "Work setup description",
  "application_tips": ["2-3 tips"],
  "seo_description": "150-160 char description"
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting or code blocks.`;

  const userPrompt = `Generate content for: ${job.title} at ${job.company} (${job.location || "Remote"})

${scrapedData?.fullPageText ? `Scraped content:\n${scrapedData.fullPageText.substring(0, 4000)}` : "No scraped data."}`;

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hiredup.me",
        "X-Title": "HiredUp.me Job Enhancement",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // Fast and cost-effective
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response (handle markdown code blocks if any)
    let jsonContent = content;
    if (content.includes("```json")) {
      jsonContent = content.match(/```json\n?([\s\S]*?)\n?```/)?.[1] || content;
    } else if (content.includes("```")) {
      jsonContent = content.match(/```\n?([\s\S]*?)\n?```/)?.[1] || content;
    }

    return JSON.parse(jsonContent.trim());
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    return null;
  }
}

/**
 * POST handler - Batch generate content for multiple jobs
 */
export async function POST(request) {
  try {
    const { batchSize = 5, onlyUnenhanced = true } = await request.json();

    // Verify admin authorization
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY || "admin-secret-key";

    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build query
    const queries = [Query.limit(batchSize), Query.orderDesc("$createdAt")];

    // Filter to only unenhanced jobs if specified
    if (onlyUnenhanced) {
      queries.push(Query.isNull("enhanced_json"));
    }

    const jobsResponse = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      queries,
    );

    const jobs = jobsResponse.documents;

    const results = {
      total: jobs.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      jobs: [],
    };

    // Process each job
    for (const job of jobs) {
      try {
        console.log(`Processing: ${job.title}`);
        results.processed++;

        // Scrape if URL available
        let scrapedData = null;
        if (job.apply_url) {
          scrapedData = await scrapeJobUrl(job.apply_url);
        }

        // Generate content
        const enhancedContent = await generateEnhancedContent(job, scrapedData);

        if (enhancedContent) {
          // Add metadata
          enhancedContent.generated_at = new Date().toISOString();
          enhancedContent.source_url = job.apply_url;

          // Store as single JSON field (5KB limit)
          let jsonString = JSON.stringify(enhancedContent);
          if (jsonString.length > 4900) {
            // Trim if needed
            if (enhancedContent.application_tips)
              delete enhancedContent.application_tips;
            if (enhancedContent.seo_description)
              delete enhancedContent.seo_description;
            enhancedContent._trimmed = true;
            jsonString = JSON.stringify(enhancedContent);
          }

          await databases.updateDocument(
            DATABASE_ID,
            JOBS_COLLECTION_ID,
            job.$id,
            {
              enhanced_json: jsonString.substring(0, 4999),
            },
          );

          results.succeeded++;
          results.jobs.push({
            id: job.$id,
            title: job.title,
            status: "success",
          });
        } else {
          results.failed++;
          results.jobs.push({
            id: job.$id,
            title: job.title,
            status: "failed",
          });
        }

        // Rate limit delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        results.failed++;
        results.jobs.push({
          id: job.$id,
          title: job.title,
          status: "error",
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} jobs: ${results.succeeded} succeeded, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Batch API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET handler - Get batch processing status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkType = searchParams.get("check") || "stats";

    if (checkType === "stats") {
      // Get count of enhanced vs non-enhanced jobs
      const [totalResponse, enhancedJobs] = await Promise.all([
        databases.listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [
          Query.limit(1),
        ]),
        databases.listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [
          Query.isNotNull("enhanced_json"),
          Query.limit(1),
        ]),
      ]);

      return NextResponse.json({
        totalJobs: totalResponse.total,
        enhancedJobs: enhancedJobs.total,
        pendingJobs: totalResponse.total - enhancedJobs.total,
        enhancementRate:
          ((enhancedJobs.total / totalResponse.total) * 100).toFixed(1) + "%",
      });
    }

    return NextResponse.json({ error: "Invalid check type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
