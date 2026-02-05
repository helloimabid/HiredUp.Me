import { NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";
import { stringifyEnhancedForStorage } from "@/lib/enhanced-storage";

// Initialize Appwrite (use NEXT_PUBLIC_ vars as fallback)
const client = new Client()
  .setEndpoint(
    process.env.APPWRITE_ENDPOINT ||
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
      "https://sgp.cloud.appwrite.io/v1",
  )
  .setProject(
    process.env.APPWRITE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
      "hiredupme",
  )
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID =
  process.env.DATABASE_ID || process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID =
  process.env.JOBS_COLLECTION_ID ||
  process.env.APPWRITE_JOBS_COLLECTION_ID ||
  "jobs";

export async function POST(request) {
  try {
    const { jobId, enhanced, description } = await request.json();

    if (!jobId || !enhanced) {
      return NextResponse.json(
        { error: "Missing jobId or enhanced content" },
        { status: 400 },
      );
    }

    // Update the job document with enhanced content
    await databases.updateDocument(DATABASE_ID, JOBS_COLLECTION_ID, jobId, {
      description: (description || "").substring(0, 5000),
      enhanced_json: stringifyEnhancedForStorage(enhanced, 50000),
    });

    return NextResponse.json({
      success: true,
      message: "Job enhanced successfully",
    });
  } catch (error) {
    console.error("Save enhanced error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save enhanced content" },
      { status: 500 },
    );
  }
}
