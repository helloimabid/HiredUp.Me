import { NextResponse } from "next/server";
import { saveJob, unsaveJob, getSavedJobs } from "@/lib/appwrite";

/**
 * POST /api/jobs/save - Save a job
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, jobId, jobTitle, company, location, apply_url } = body;

    if (!userId || !jobId) {
      return NextResponse.json(
        { error: "User ID and Job ID required" },
        { status: 400 },
      );
    }

    const result = await saveJob(userId, {
      jobId,
      jobTitle,
      company,
      location,
      apply_url,
    });

    if (result.alreadySaved) {
      return NextResponse.json({
        success: true,
        message: "Job already saved",
        alreadySaved: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Job saved successfully",
      savedJob: result,
    });
  } catch (error) {
    console.error("Save job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/jobs/save - Unsave a job
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");

    if (!userId || !jobId) {
      return NextResponse.json(
        { error: "User ID and Job ID required" },
        { status: 400 },
      );
    }

    await unsaveJob(userId, jobId);

    return NextResponse.json({
      success: true,
      message: "Job unsaved successfully",
    });
  } catch (error) {
    console.error("Unsave job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/jobs/save?userId=xxx - Get saved jobs for a user
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const savedJobs = await getSavedJobs(userId);

    return NextResponse.json({
      success: true,
      savedJobs,
    });
  } catch (error) {
    console.error("Get saved jobs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
