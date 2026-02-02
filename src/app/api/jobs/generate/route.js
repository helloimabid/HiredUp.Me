/**
 * API Route: /api/jobs/generate
 * Proxies requests to the deployed job-generator-service on Render
 */

import { NextResponse } from "next/server";

const JOB_GENERATOR_SERVICE_URL =
  process.env.JOB_GENERATOR_SERVICE_URL ||
  "https://job-generator-service.onrender.com";

/**
 * POST /api/jobs/generate
 * Proxies job generation requests to the Render service
 */
export async function POST(request) {
  try {
    const body = await request.json();

    console.log("Proxying job generation request to Render service...");
    console.log("Service URL:", JOB_GENERATOR_SERVICE_URL);

    const response = await fetch(`${JOB_GENERATOR_SERVICE_URL}/generate`, {
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
        { error: data.error || "Job generation service error" },
        { status: response.status },
      );
    }

    console.log("Job generation successful");
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
 * GET /api/jobs/generate
 * Health check / status endpoint
 */
export async function GET() {
  try {
    const response = await fetch(`${JOB_GENERATOR_SERVICE_URL}/health`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: "ok",
        service: "job-generator-proxy",
        renderService: data,
      });
    } else {
      return NextResponse.json({
        status: "degraded",
        service: "job-generator-proxy",
        renderServiceStatus: response.status,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        service: "job-generator-proxy",
        error: error.message,
      },
      { status: 503 },
    );
  }
}
