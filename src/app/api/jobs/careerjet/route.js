import { NextResponse } from "next/server";

const CAREERJET_API_KEY = process.env.CAREERJET_API_KEY;
const CAREERJET_ENDPOINT = "https://search.api.careerjet.net/v4/query";

/**
 * GET /api/jobs/careerjet?keywords=...&location=...&page=1&page_size=20
 * Proxies search requests to CareerJet API (keeps API key server-side).
 */
export async function GET(request) {
  try {
    if (!CAREERJET_API_KEY) {
      return NextResponse.json(
        { error: "CareerJet API key not configured" },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get("keywords") || "";
    const location = searchParams.get("location") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("page_size") || "20";
    const sort = searchParams.get("sort") || "relevance";

    if (!keywords && !location) {
      return NextResponse.json(
        { error: "Please provide keywords or location" },
        { status: 400 },
      );
    }

    // Get user IP and user agent from request headers
    const forwarded = request.headers.get("x-forwarded-for");
    const userIp = forwarded?.split(",")[0]?.trim() || "127.0.0.1";
    const userAgent =
      request.headers.get("user-agent") || "Mozilla/5.0 HiredUp.me Bot";

    // Build CareerJet query params
    const params = new URLSearchParams({
      locale_code: "en_GB",
      keywords,
      sort,
      page,
      page_size: pageSize,
      fragment_size: "200",
      user_ip: userIp,
      user_agent: userAgent,
    });

    if (location) {
      params.set("location", location);
    }

    // Basic auth: username = API key, password = empty string
    const credentials = Buffer.from(`${CAREERJET_API_KEY}:`).toString("base64");

    console.log(
      `[CareerJet] Searching: "${keywords}" in "${location || "worldwide"}"`,
    );

    const response = await fetch(`${CAREERJET_ENDPOINT}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
      // Cache for 5 minutes to avoid hammering the API
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CareerJet] API error ${response.status}:`, errorText);
      return NextResponse.json(
        {
          error: `CareerJet API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Handle location mode (no actual results)
    if (data.type === "LOCATIONS") {
      return NextResponse.json({
        type: "locations",
        locations: data.locations || [],
        message: data.message,
        jobs: [],
        total: 0,
      });
    }

    // Transform CareerJet jobs to our format
    const jobs = (data.jobs || []).map((cj) => ({
      // Generate a stable ID from the URL
      $id: `cj_${Buffer.from(cj.url || "")
        .toString("base64url")
        .substring(0, 20)}`,
      title: cj.title || "Untitled",
      company: cj.company || "Unknown Company",
      location: cj.locations || "",
      description: cj.description || "",
      salary: cj.salary || "",
      apply_url: cj.url || "",
      source: "careerjet",
      source_site: cj.site || "",
      posted_date: cj.date || "",
      salary_min: cj.salary_min,
      salary_max: cj.salary_max,
      salary_currency: cj.salary_currency_code,
      salary_type: cj.salary_type,
    }));

    return NextResponse.json({
      type: "jobs",
      jobs,
      total: data.hits || 0,
      pages: data.pages || 0,
      message: data.message || "",
      response_time: data.response_time,
    });
  } catch (error) {
    console.error("[CareerJet] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from CareerJet", details: error.message },
      { status: 500 },
    );
  }
}
