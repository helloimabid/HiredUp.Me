import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

/**
 * POST /api/jobs/extract-info
 * Body: { url: "https://example.com/job-posting" }
 *
 * Uses Tavily Extract to get detailed content from a job posting URL
 */
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!TAVILY_API_KEY) {
      return NextResponse.json(
        { error: "Tavily API not configured" },
        { status: 500 },
      );
    }

    console.log(`[extract-info] Extracting from: ${url}`);

    const response = await fetch("https://api.tavily.com/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        urls: [url],
        extract_depth: "advanced",
        include_images: false,
        format: "markdown",
        timeout: 20,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(
        `[extract-info] Tavily error: ${response.status} - ${error}`,
      );
      return NextResponse.json(
        { error: "Failed to extract content" },
        { status: 500 },
      );
    }

    const data = await response.json();

    if (!data.results?.length) {
      return NextResponse.json({
        success: false,
        content: null,
        message: "No content extracted",
      });
    }

    const content = data.results[0].raw_content;
    console.log(`[extract-info] Extracted ${content?.length || 0} characters`);

    return NextResponse.json({
      success: true,
      content,
      url: data.results[0].url,
    });
  } catch (error) {
    console.error("[extract-info] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Extraction failed" },
      { status: 500 },
    );
  }
}
