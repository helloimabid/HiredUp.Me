import { NextResponse } from "next/server";
import { searchJobs } from "@/lib/appwrite";

export const dynamic = "force-dynamic";

/**
 * Search jobs from database (no scraping)
 * GET /api/jobs/search?q=developer&location=Remote
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query");
    const location =
      searchParams.get("location") || searchParams.get("loc") || "Remote";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 },
      );
    }

    console.log(
      `[Search API] Searching database for: "${query}" in "${location}"`,
    );

    const jobs = await searchJobs(query, location, limit);

    return NextResponse.json({
      jobs,
      total: jobs.length,
      query,
      location,
      source: "database",
      cached: true,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
