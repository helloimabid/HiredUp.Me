/**
 * API Route: /api/jobs/generate-batch
 * Proxies batch job generation requests to the deployed job-generator-service on Render
 */

import { NextResponse } from "next/server";

const JOB_GENERATOR_SERVICE_URL =
  process.env.JOB_GENERATOR_SERVICE_URL ||
  "https://job-generator-service.onrender.com";

/**
 * POST handler - Proxy batch generate requests to Render service
 */
export async function POST(request) {
  try {
    // Verify admin authorization
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY || "admin-secret-key";

    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    console.log("Proxying batch job generation request to Render service...");
    console.log("Service URL:", JOB_GENERATOR_SERVICE_URL);

    const response = await fetch(`${JOB_GENERATOR_SERVICE_URL}/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Render service error:", data);
      return NextResponse.json(
        { error: data.error || "Batch job generation service error" },
        { status: response.status },
      );
    }

    console.log("Batch job generation successful");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying to job generator service:", error);
    return NextResponse.json(
      {
        error: "Failed to connect to job generation service",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET handler - Proxy batch status/stats requests to Render service
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const url = queryString
      ? `${JOB_GENERATOR_SERVICE_URL}/batch?${queryString}`
      : `${JOB_GENERATOR_SERVICE_URL}/batch`;

    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Service error" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to connect to job generation service",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
