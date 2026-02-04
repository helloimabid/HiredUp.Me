import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Client, Databases } from "node-appwrite";

// Allow longer execution time for AI generation
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Logo.dev configuration (fallback)
const LOGO_DEV_KEY =
  process.env.LOGO_DEV_PUBLISHABLE_KEY || "pk_XCMtoIJ7RMy7XgG2Ruf6UA";

// Tavily API for logo search
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// Initialize Appwrite
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

// Initialize Puter.js for AI (unlimited usage)
let puter = null;
async function initPuter() {
  if (puter) return puter;
  try {
    const { init } = await import("@heyputer/puter.js/src/init.cjs");
    const authToken = process.env.PUTER_AUTH_TOKEN;
    if (!authToken) {
      console.log("[Puter] No auth token found, will fall back to OpenRouter");
      return null;
    }
    puter = init(authToken);
    console.log("[Puter] Initialized successfully");
    return puter;
  } catch (err) {
    console.error("[Puter] Failed to initialize:", err.message);
    return null;
  }
}

// Call AI using Puter.js (unlimited, no rate limits) with OpenRouter fallback
async function callAI(prompt) {
  // Add timeout to prevent Vercel gateway timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

  try {
    // Try Puter.js first (unlimited)
    const puterClient = await initPuter();
    if (puterClient) {
      console.log("[AI] Using Puter.js for generation...");
      try {
        const response = await puterClient.ai.chat(prompt);
        clearTimeout(timeoutId);
        // Puter returns the message directly or as an object
        const content =
          typeof response === "string"
            ? response
            : response?.message?.content ||
              response?.content ||
              JSON.stringify(response);
        console.log("[AI] Puter response received, length:", content?.length);
        return content;
      } catch (puterErr) {
        console.error(
          "[AI] Puter error, falling back to OpenRouter:",
          puterErr.message,
        );
      }
    }

    // Fallback to OpenRouter
    console.log("[AI] Using OpenRouter fallback...");
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error(
        "No AI service available (Puter failed and no OpenRouter key)",
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://hiredup.me",
          "X-Title": "HiredUp.me Job Board",
        },
        body: JSON.stringify({
          model: "tngtech/deepseek-r1t2-chimera:free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter error:", error);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      const timeoutError = new Error("AI_TIMEOUT");
      timeoutError.isTimeout = true;
      throw timeoutError;
    }
    throw err;
  }
}

// Fetch company logo using Tavily search (with Logo.dev fallback)
async function fetchCompanyLogo(companyName) {
  // Try Tavily first for more accurate logo search
  if (TAVILY_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for logo

      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: TAVILY_API_KEY,
          query: `${companyName} company official logo`,
          search_depth: "basic",
          include_images: true,
          max_results: 5,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        // Check for images in results
        if (data.images && data.images.length > 0) {
          // Filter for likely logo images (png, svg, or contains 'logo')
          const logoImage =
            data.images.find(
              (img) =>
                img.toLowerCase().includes("logo") ||
                img.toLowerCase().endsWith(".svg") ||
                img.toLowerCase().endsWith(".png"),
            ) || data.images[0];

          if (logoImage) {
            console.log(`Tavily found logo for ${companyName}: ${logoImage}`);
            return logoImage;
          }
        }

        // Check result URLs for logo hints
        if (data.results && data.results.length > 0) {
          for (const result of data.results) {
            if (
              result.url &&
              (result.url.includes("logo") ||
                result.url.includes("brand") ||
                result.url.includes("cdn"))
            ) {
              // Try to extract image from the result
              if (result.url.match(/\.(png|jpg|jpeg|svg|webp)(\?|$)/i)) {
                console.log(
                  `Tavily found logo URL for ${companyName}: ${result.url}`,
                );
                return result.url;
              }
            }
          }
        }
      }
    } catch (err) {
      console.log("Tavily logo search failed:", err.message);
    }
  }

  // Fallback to Logo.dev
  const cleanName = companyName
    .toLowerCase()
    .replace(
      /\s+(ltd|limited|inc|corp|corporation|llc|pvt|private|co|company)\.?$/i,
      "",
    )
    .trim()
    .replace(/\s+/g, "");

  const domains = [
    `${cleanName}.com`,
    `${cleanName}.io`,
    `${cleanName}.co`,
    `${cleanName}.org`,
    `${cleanName}.com.bd`,
  ];

  for (const domain of domains) {
    const url = `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        console.log(`Logo.dev found logo for ${companyName}: ${url}`);
        return url;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function POST(request) {
  console.log("[generate-ai] Request received");

  try {
    const { jobId, job } = await request.json();
    console.log(`[generate-ai] Processing job: ${jobId} - ${job?.title}`);

    if (!jobId || !job) {
      console.log("[generate-ai] Error: Missing jobId or job data");
      return NextResponse.json(
        { error: "Missing jobId or job data" },
        { status: 400 },
      );
    }

    // Step 1: Generate AI content
    console.log("[generate-ai] Step 1: Calling AI...");
    const prompt = `You are creating professional content for a job posting page. Analyze this job thoroughly.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
${job.description ? `- Description: ${job.description.substring(0, 2000)}` : ""}

Create a comprehensive JSON response with these EXACT fields:
{
  "summary": "Write a compelling 2-3 sentence summary of this opportunity",
  "about": "Write 2-3 detailed paragraphs about this role, the company culture, and what makes it exciting. Be specific and engaging.",
  "responsibilities": ["Write 5-6 specific, detailed responsibilities"],
  "requirements": ["Write 5-6 specific qualifications and requirements"],
  "skills": ["List 6-8 relevant technical and soft skills"],
  "experienceLevel": "entry or mid or senior",
  "salaryRange": "Realistic salary range (use BDT for Bangladesh jobs)",
  "industry": "Specific industry category",
  "workType": "remote or hybrid or onsite",
  "benefits": ["List 4-5 typical benefits for this role"],
  "whyApply": "Write 2-3 compelling reasons why someone should apply",
  "applicationTips": "Write 2-3 specific tips for applying to this role",
  "highlights": ["3-4 key highlights or selling points of this job"]
}

Return ONLY valid JSON. No markdown, no explanation.`;

    console.log("[generate-ai] Calling OpenRouter API...");
    const aiResponse = await callAI(prompt);
    console.log(
      "[generate-ai] AI response received, length:",
      aiResponse?.length,
    );

    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(
        "[generate-ai] No JSON found in AI response:",
        aiResponse?.substring(0, 500),
      );
      throw new Error("AI response was not valid JSON");
    }

    console.log("[generate-ai] Step 2: Parsing AI response...");
    const analysis = JSON.parse(jsonMatch[0]);
    console.log(
      "[generate-ai] Parsed successfully, summary:",
      analysis.summary?.substring(0, 100),
    );

    // Step 2: Fetch company logo
    console.log("[generate-ai] Step 3: Fetching logo for", job.company);
    let companyLogo = null;
    try {
      companyLogo = await fetchCompanyLogo(job.company);
    } catch (e) {
      console.log("Logo fetch failed:", e.message);
    }

    // Step 3: Build enhanced content
    const enhanced = {
      company_logo_url: companyLogo,
      header: {
        title: job.title,
        company: job.company,
        location: job.location,
        location_type:
          analysis.workType === "remote"
            ? "Remote"
            : analysis.workType === "hybrid"
              ? "Hybrid"
              : "On-site",
        employment_type: "Full-time",
      },
      quick_info: [
        { label: "Experience", value: analysis.experienceLevel || "Mid-level" },
        { label: "Salary", value: analysis.salaryRange || "Competitive" },
        { label: "Industry", value: analysis.industry || "General" },
        {
          label: "Work Type",
          value:
            analysis.workType === "remote"
              ? "Remote"
              : analysis.workType === "hybrid"
                ? "Hybrid"
                : "On-site",
        },
      ],
      highlights:
        analysis.highlights ||
        [
          analysis.summary?.substring(0, 100),
          "Opportunity at " + job.company,
          job.location,
        ].filter(Boolean),
      sections: [
        {
          id: "about",
          title: "About This Role",
          type: "paragraph",
          content: analysis.about || analysis.summary,
        },
        {
          id: "responsibilities",
          title: "Key Responsibilities",
          type: "bullet-list",
          items: analysis.responsibilities || [],
        },
        {
          id: "requirements",
          title: "Requirements",
          type: "bullet-list",
          items: analysis.requirements || [],
        },
        {
          id: "skills",
          title: "Required Skills",
          type: "tags",
          items: analysis.skills || [],
        },
        {
          id: "benefits",
          title: "Benefits",
          type: "bullet-list",
          items: analysis.benefits || [],
        },
        {
          id: "why-apply",
          title: "Why Apply?",
          type: "paragraph",
          content: analysis.whyApply || "",
        },
        {
          id: "tips",
          title: "Application Tips",
          type: "paragraph",
          content: analysis.applicationTips || "",
        },
      ],
      seo: {
        meta_title: job.title + " at " + job.company + " | HiredUp.me",
        meta_description: analysis.summary,
        keywords: analysis.skills || [],
      },
      aiEnhanced: true,
      aiEnhancedAt: new Date().toISOString(),
      needsAI: false,
    };

    // Step 4: Save to database
    console.log("[generate-ai] Step 4: Saving to database...");
    console.log(
      `[generate-ai] Database: ${DATABASE_ID}, Collection: ${JOBS_COLLECTION_ID}, Job: ${jobId}`,
    );

    // First, get the job's slug for cache revalidation
    let jobSlug = null;
    try {
      const existingJob = await databases.getDocument(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        jobId,
      );
      jobSlug = existingJob.slug;
      console.log(`[generate-ai] Found job slug: ${jobSlug}`);
    } catch (fetchError) {
      console.warn(
        "[generate-ai] Could not fetch job slug:",
        fetchError.message,
      );
    }

    try {
      await databases.updateDocument(DATABASE_ID, JOBS_COLLECTION_ID, jobId, {
        description: (analysis.about || analysis.summary || "").substring(
          0,
          5000,
        ),
        enhanced_json: JSON.stringify(enhanced).substring(0, 50000),
      });
      console.log("[generate-ai] Database update successful!");

      // Revalidate the job page cache so the new content shows immediately
      if (jobSlug) {
        console.log(`[generate-ai] Revalidating cache for /jobs/${jobSlug}`);
        revalidatePath(`/jobs/${jobSlug}`);
      }
      // Also revalidate the jobs list page
      revalidatePath("/jobs");
    } catch (dbError) {
      console.error("[generate-ai] Database error:", dbError.message);
      console.error("[generate-ai] DB Error details:", JSON.stringify(dbError));
      throw new Error(`Database save failed: ${dbError.message}`);
    }

    console.log("[generate-ai] Complete! Returning success response.");
    return NextResponse.json({
      success: true,
      enhanced,
      message: "Job enhanced with AI successfully",
    });
  } catch (error) {
    console.error("[generate-ai] Error:", error.message);
    console.error("[generate-ai] Stack:", error.stack);

    // Handle timeout specifically with a user-friendly message
    if (error.isTimeout || error.message === "AI_TIMEOUT") {
      console.log("[generate-ai] AI timed out, returning friendly message");
      return NextResponse.json({
        timeout: true,
        message:
          "AI generation is taking longer than expected. Please refresh the page in 1-2 minutes to try again.",
        suggestion:
          "The AI service may be experiencing high demand. Your job page will still work with the basic content.",
      });
    }

    return NextResponse.json(
      { error: error.message || "AI generation failed" },
      { status: 500 },
    );
  }
}
