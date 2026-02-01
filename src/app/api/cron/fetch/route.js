import { NextResponse } from "next/server";
import { scrapeAndSaveJobs, getTargetUrls } from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for the cron job

/**
 * Vercel Cron Job Handler
 * Triggered once every 24 hours to scrape job listings
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/fetch",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */
export async function GET(request) {
  try {
    // Verify the request is from Vercel Cron or has the secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // In production, verify the cron secret
    if (process.env.NODE_ENV === "production") {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("🚀 Starting scheduled job scraping...");
    const startTime = Date.now();

    // Get all target URLs to scrape
    const targetUrls = getTargetUrls();
    const results = [];

    // Scrape each URL
    for (const url of targetUrls) {
      console.log(`\n📍 Scraping: ${url}`);
      try {
        const result = await scrapeAndSaveJobs(url);
        results.push({
          url,
          ...result,
        });
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
        results.push({
          url,
          success: false,
          message: error.message,
        });
      }
    }

    const duration = Date.now() - startTime;
    const totalSaved = results.reduce((sum, r) => sum + (r.savedCount || 0), 0);
    const totalSkipped = results.reduce(
      (sum, r) => sum + (r.skippedCount || 0),
      0,
    );

    console.log(`\n✅ Cron job completed in ${duration}ms`);
    console.log(
      `   Total saved: ${totalSaved}, Total skipped: ${totalSkipped}`,
    );

    return NextResponse.json({
      success: true,
      message: "Cron job completed",
      duration: `${duration}ms`,
      totalSaved,
      totalSkipped,
      results,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
