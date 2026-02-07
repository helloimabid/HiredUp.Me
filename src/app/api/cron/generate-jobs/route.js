import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Client, Databases, Query } from "node-appwrite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { stringifyEnhancedForStorage } from "@/lib/enhanced-storage";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max for Vercel Pro, 60s for Hobby

/**
 * Vercel Cron Job — Auto-generate AI job pages in background
 *
 * Runs every hour, processes a batch of unenhanced jobs using Gemma 3 free tier.
 * 30 RPM + 14.4K RPD per model = effectively unlimited throughput.
 *
 * Configure in vercel.json:
 * { "path": "/api/cron/generate-jobs", "schedule": "0 * * * *" }
 */

// ============ CONFIG ============

// Gemma 3 models — much higher free-tier limits (30 RPM, 14.4K RPD each)
const GEMINI_MODELS = [
  { name: "gemma-3-27b-it", rpm: 30, rpd: 14400 },
  { name: "gemma-3-12b-it", rpm: 30, rpd: 14400 },
  { name: "gemma-3-4b-it", rpm: 30, rpd: 14400 },
];

// How many jobs to process per cron invocation
// With Gemma 3's 30 RPM, we can process ~25 jobs per minute
// Hobby plan (60s): ~20 jobs | Pro plan (300s): ~100 jobs
const BATCH_SIZE = parseInt(process.env.CRON_BATCH_SIZE || "20", 10);

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
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

const GOOGLE_API_KEY =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY;

// ============ HELPERS ============

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateJobSlug(title, company, id) {
  const text = `${title}-at-${company}`;
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
  const shortId = String(id || "").substring(0, 6);
  return shortId ? `${slug}-${shortId}` : slug;
}

// ============ GEMINI ============

async function callGemini(prompt, modelName) {
  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });

  const attempt = async () => {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });
      return (await result.response).text();
    } catch {
      const result = await model.generateContent(prompt);
      return (await result.response).text();
    }
  };

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("GEMINI_TIMEOUT")), 25000),
  );

  return Promise.race([attempt(), timeout]);
}

// ============ FETCH UNENHANCED JOBS ============

async function fetchUnenhancedJobs(limit) {
  const allJobs = [];
  let lastId = null;
  const batchSize = 100;

  while (true) {
    const queries = [Query.orderDesc("$createdAt"), Query.limit(batchSize)];
    if (lastId) queries.push(Query.cursorAfter(lastId));

    const response = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      queries,
    );
    allJobs.push(...response.documents);

    if (response.documents.length < batchSize) break;
    lastId = response.documents[response.documents.length - 1].$id;
  }

  const unenhanced = allJobs.filter((job) => {
    if (!job.enhanced_json) return true;
    try {
      const parsed = JSON.parse(job.enhanced_json);
      return parsed.needsAI === true || parsed.aiEnhanced !== true;
    } catch {
      return true;
    }
  });

  // Return oldest first so new jobs don't starve old ones
  unenhanced.reverse();
  return unenhanced.slice(0, limit);
}

// ============ GENERATE ONE JOB ============

async function generateOneJob(job, modelName) {
  const extraFields = [];
  if (job.salary) extraFields.push(`Salary: ${job.salary}`);
  if (job.experience) extraFields.push(`Experience: ${job.experience}`);
  if (job.education) extraFields.push(`Education: ${job.education}`);
  if (job.deadline) extraFields.push(`Deadline: ${job.deadline}`);
  const extraFieldsText =
    extraFields.length > 0
      ? `\n\nADDITIONAL METADATA:\n${extraFields.join("\n")}`
      : "";

  const prompt = `You are creating professional content for a job posting page. Analyze this job thoroughly.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
${extraFieldsText}

RAW JOB POSTING CONTENT:
${(job.description || "No description available").substring(0, 4000)}

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

  const aiResponse = await callGemini(prompt, modelName);

  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI response was not valid JSON");

  const analysis = JSON.parse(jsonMatch[0]);

  const enhanced = {
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

  // Build slug if missing
  let jobSlug = job.slug;
  let shouldUpdateSlug = false;
  if (!jobSlug) {
    jobSlug = generateJobSlug(job.title, job.company, job.$id);
    shouldUpdateSlug = true;
  }

  const updatePayload = {
    description: (analysis.about || analysis.summary || "").substring(0, 5000),
    enhanced_json: stringifyEnhancedForStorage(enhanced, 50000),
  };
  if (shouldUpdateSlug && jobSlug) {
    updatePayload.slug = jobSlug;
  }

  await databases.updateDocument(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
    job.$id,
    updatePayload,
  );

  // Revalidate cache
  if (jobSlug) revalidatePath(`/jobs/${jobSlug}`);

  return { jobId: job.$id, title: job.title, model: modelName, slug: jobSlug };
}

// ============ ROUTE HANDLER ============

export async function GET(request) {
  const startTime = Date.now();

  try {
    // Verify cron secret in production
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization");
      const cronSecret = process.env.CRON_SECRET;
      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "No Gemini API key configured" },
        { status: 500 },
      );
    }

    // Fetch unenhanced jobs
    const jobs = await fetchUnenhancedJobs(BATCH_SIZE);

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All jobs already have AI-generated pages",
        processed: 0,
        duration: `${Date.now() - startTime}ms`,
      });
    }

    console.log(
      `[cron/generate-jobs] Processing ${jobs.length} unenhanced jobs...`,
    );

    // Track per-model usage within this invocation
    const modelUsage = {};
    GEMINI_MODELS.forEach((m) => {
      modelUsage[m.name] = { used: 0, rpm: m.rpm };
    });

    // Pick a model — rotate through models for this batch
    let currentModelIdx = 0;
    const pickModel = () => {
      // Simple round-robin across models
      const model = GEMINI_MODELS[currentModelIdx % GEMINI_MODELS.length];
      currentModelIdx++;
      return model;
    };

    const results = { succeeded: 0, failed: 0, generated: [], errors: [] };

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const modelConfig = pickModel();
      const delay = Math.ceil(60000 / modelConfig.rpm) + 500;

      try {
        const result = await generateOneJob(job, modelConfig.name);
        results.succeeded++;
        results.generated.push(result);
        console.log(
          `[cron] ✅ ${i + 1}/${jobs.length} ${job.title} (${modelConfig.name})`,
        );
      } catch (error) {
        results.failed++;
        results.errors.push({
          jobId: job.$id,
          title: job.title,
          error: error.message,
        });
        console.error(
          `[cron] ❌ ${i + 1}/${jobs.length} ${job.title}: ${error.message}`,
        );

        // If rate limited, try switching to next model on next iteration
        if (
          error.message?.includes("429") ||
          error.message?.includes("RESOURCE_EXHAUSTED")
        ) {
          console.log(
            `[cron] Rate limited on ${modelConfig.name}, will try next model`,
          );
        }
      }

      // Respect RPM rate limit between calls
      if (i < jobs.length - 1) {
        await sleep(delay);
      }
    }

    // Revalidate main jobs listing
    revalidatePath("/jobs");
    revalidatePath("/search");

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: `Processed ${results.succeeded + results.failed} jobs`,
      processed: results.succeeded + results.failed,
      succeeded: results.succeeded,
      failed: results.failed,
      generated: results.generated,
      errors: results.errors,
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error("[cron/generate-jobs] Fatal error:", error);
    return NextResponse.json(
      { error: error.message || "Cron job failed" },
      { status: 500 },
    );
  }
}
