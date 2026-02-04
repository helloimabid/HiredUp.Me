import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

/**
 * Step 1: Use Tavily Search to find job posting URLs
 */
async function searchJobPostings(query, location) {
  if (!TAVILY_API_KEY) {
    throw new Error("Tavily API key not configured");
  }

  const searchQuery = `${query} jobs ${location} job posting hiring careers`;

  console.log(`[Tavily Search] Searching for: "${searchQuery}"`);

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query: searchQuery,
      search_depth: "advanced",
      include_domains: [
        "linkedin.com/jobs",
        "indeed.com",
        "glassdoor.com",
        "bdjobs.com",
        "chakri.com",
        "prothomalo.com/chakri",
        "jobsbd.com",
        "jobs.bdjobs.com",
        "remoteok.com",
        "weworkremotely.com",
        "angel.co",
        "wellfound.com",
        "flexjobs.com",
        "monster.com",
        "ziprecruiter.com",
        "simplyhired.com",
      ],
      max_results: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Tavily Search failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log(`[Tavily Search] Found ${data.results?.length || 0} results`);

  // Extract URLs from search results
  const jobUrls = data.results
    ?.filter((r) => r.url && isJobPostingUrl(r.url))
    .map((r) => ({
      url: r.url,
      title: r.title,
      snippet: r.content,
    }));

  return jobUrls || [];
}

/**
 * Check if URL looks like a job posting
 */
function isJobPostingUrl(url) {
  const jobPatterns = [
    /\/jobs?\//i,
    /\/careers?\//i,
    /\/hiring/i,
    /\/vacancy/i,
    /\/position/i,
    /linkedin\.com\/jobs/i,
    /indeed\.com/i,
    /glassdoor\.com/i,
    /bdjobs\.com/i,
  ];
  return jobPatterns.some((pattern) => pattern.test(url));
}

/**
 * Step 2: Use Tavily Extract to get content from job URLs
 */
async function extractJobContent(urls) {
  if (!TAVILY_API_KEY || !urls?.length) {
    return [];
  }

  // Limit to 5 URLs to avoid timeout
  const urlsToExtract = urls.slice(0, 5).map((u) => u.url);

  console.log(`[Tavily Extract] Extracting from ${urlsToExtract.length} URLs`);

  const response = await fetch("https://api.tavily.com/extract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      urls: urlsToExtract,
      extract_depth: "advanced",
      include_images: false,
      format: "markdown",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[Tavily Extract] Failed: ${response.status} - ${error}`);
    return [];
  }

  const data = await response.json();
  console.log(
    `[Tavily Extract] Successfully extracted ${data.results?.length || 0} pages`,
  );

  // Map extracted content with original URL info
  return (
    data.results?.map((result) => {
      const originalInfo = urls.find((u) => u.url === result.url);
      return {
        url: result.url,
        title: originalInfo?.title || "Job Posting",
        rawContent: result.raw_content,
        snippet: originalInfo?.snippet || "",
      };
    }) || []
  );
}

/**
 * POST /api/jobs/fetch-tavily
 * Body: { query: "software developer", location: "Dhaka" }
 *
 * Returns: { jobs: [...], rawContent: [...] } - Raw content for client-side Puter processing
 */
export async function POST(request) {
  console.log("[fetch-tavily] Request received");

  try {
    const { query, location = "Remote" } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!TAVILY_API_KEY) {
      return NextResponse.json(
        { error: "Tavily API not configured" },
        { status: 500 },
      );
    }

    // Step 1: Search for job posting URLs
    console.log(
      `[fetch-tavily] Step 1: Searching for "${query}" in "${location}"`,
    );
    const jobUrls = await searchJobPostings(query, location);

    if (!jobUrls.length) {
      return NextResponse.json({
        success: true,
        jobs: [],
        message: "No job postings found",
      });
    }

    // Step 2: Extract content from found URLs
    console.log(
      `[fetch-tavily] Step 2: Extracting content from ${jobUrls.length} URLs`,
    );
    const extractedContent = await extractJobContent(jobUrls);

    // Return raw content for client-side Puter.js processing
    return NextResponse.json({
      success: true,
      jobUrls,
      extractedContent,
      message: `Found ${jobUrls.length} job postings, extracted ${extractedContent.length}`,
    });
  } catch (error) {
    console.error("[fetch-tavily] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
