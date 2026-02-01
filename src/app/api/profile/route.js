import { NextResponse } from "next/server";
import { upsertProfile, getProfile } from "@/lib/appwrite";

/**
 * GET /api/profile?userId=xxx
 * Get user profile
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = await getProfile(userId);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/profile
 * Create or update user profile
 * Body: { userId, name, email, ... }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, ...profileData } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = await upsertProfile(userId, profileData);

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Create/update profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/profile
 * Update user profile (same as POST, for REST semantics)
 */
export async function PUT(request) {
  return POST(request);
}
