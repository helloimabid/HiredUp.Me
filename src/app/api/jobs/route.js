import { NextResponse } from "next/server";
import { getJobs } from "@/lib/appwrite";

export const dynamic = "force-dynamic";

/**
 * GET /api/jobs
 * Fetch all jobs from Appwrite
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const jobs = await getJobs(limit);

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
