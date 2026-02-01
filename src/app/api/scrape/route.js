import { NextResponse } from "next/server";
import { scrapeAndSaveJobs, scrapeJobsByQuery } from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * User-driven job search endpoint
 * POST /api/scrape
 * Body: { query: "marketing", location: "Dhaka", save: true }
 * Or legacy: { url: "https://example.com/jobs" }
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // New query-based search
    if (body.query) {
      const { query, location = "Remote", save = true } = body;

      console.log(`Job search requested: "${query}" in "${location}"`);
      const result = await scrapeJobsByQuery(query, location, save);

      return NextResponse.json(result);
    }

    // Legacy URL-based scrape
    if (body.url) {
      console.log(`Manual scrape requested for: ${body.url}`);
      const result = await scrapeAndSaveJobs(body.url);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Either 'query' or 'url' is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Scrape endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET endpoint for quick searches without saving
 * GET /api/scrape?query=developer&location=Remote
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const location = searchParams.get("location") || "Remote";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    console.log(`Quick search: "${query}" in "${location}"`);
    const result = await scrapeJobsByQuery(query, location, false); // Don't save to DB

    return NextResponse.json(result);
  } catch (error) {
    console.error("Quick search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
