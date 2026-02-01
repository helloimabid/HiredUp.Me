import { NextResponse } from "next/server";
import {
  canUserSearch,
  isUserPremium,
  FREE_SEARCH_LIMIT,
} from "@/lib/appwrite";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check if user is premium
    const isPremium = await isUserPremium(userId);

    // Get search usage
    const usage = await canUserSearch(userId, isPremium);

    return NextResponse.json({
      ...usage,
      isPremium,
      limit: isPremium ? 100 : FREE_SEARCH_LIMIT,
    });
  } catch (error) {
    console.error("Search usage check error:", error);
    // Return default values on error
    return NextResponse.json({
      canSearch: true,
      searchesUsed: 0,
      searchesRemaining: FREE_SEARCH_LIMIT,
      isPremium: false,
      limit: FREE_SEARCH_LIMIT,
    });
  }
}
