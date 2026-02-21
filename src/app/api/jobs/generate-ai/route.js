import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Client, Databases } from "node-appwrite";
import { stringifyEnhancedForStorage } from "@/lib/enhanced-storage";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const LOGO_DEV_KEY =
  process.env.LOGO_DEV_PUBLISHABLE_KEY || "pk_XCMtoIJ7RMy7XgG2Ruf6UA";
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

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

// ─── SEO Keyword Strategy ────────────────────────────────────────────────────
// Sourced from keyword research CSVs — sorted by: LOW competition, highest volume
//
// BANGLADESH keywords (local audience — use for BD-location jobs)
const BD_KEYWORDS = {
  // Primary high-volume, LOW competition targets
  primary: [
    "jobs in bangladesh",
    "job vacancy bd",
    "job opportunities in bangladesh",
    "find jobs",
    "job vacancies",
    "bangladesh job portal",
    "job portal bd",
    "bd careers",
    "bd recruitment",
    "employment opportunities",
  ],
  // Remote-specific BD keywords
  remote: [
    "remote jobs bangladesh",
    "remote jobs in bangladesh",
    "remote jobs from bangladesh",
    "remote work",
    "work from home bangladesh",
  ],
  // IT/tech specific BD keywords (high demand)
  tech: ["bangladesh it jobs", "it jobs jobs", "remote it jobs bangladesh"],
  // Suffix phrases to append to meta titles/descriptions
  suffix: "| HiredUp.me - Job Portal BD",
};

// GLOBAL keywords (for remote/international jobs or non-BD audience)
const GLOBAL_KEYWORDS = {
  primary: [
    "jobs hiring",
    "job vacancies",
    "career jobs",
    "employment opportunities",
    "job opportunities",
    "find jobs",
    "work remotely jobs",
    "apply jobs",
  ],
  remote: [
    "remote jobs",
    "remote work",
    "work remotely jobs",
    "remote job opportunities",
    "remote careers",
    "jobs hiring remote",
  ],
  tech: ["remote it jobs", "it jobs jobs", "career discover"],
  suffix: "| HiredUp.me",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBangladeshJob(location = "") {
  const loc = location.toLowerCase();
  return (
    loc.includes("bangladesh") ||
    loc.includes("dhaka") ||
    loc.includes("chittagong") ||
    loc.includes("chattogram") ||
    loc.includes("sylhet") ||
    loc.includes("rajshahi") ||
    loc.includes("bd")
  );
}

function isRemoteJob(location = "", workType = "") {
  const loc = (location + " " + workType).toLowerCase();
  return (
    loc.includes("remote") ||
    loc.includes("work from home") ||
    loc.includes("wfh")
  );
}

/**
 * Pick the best 5-8 SEO keywords for a job based on its location, type, and title.
 * Returns keywords most likely to rank (low competition, high volume).
 */
function pickSeoKeywords(
  title = "",
  location = "",
  industry = "",
  workType = "",
) {
  const isBD = isBangladeshJob(location);
  const isRemote = isRemoteJob(location, workType);
  const isTech =
    /software|developer|engineer|IT|data|cloud|devops|programmer/i.test(
      title + industry,
    );

  const pool = isBD ? BD_KEYWORDS : GLOBAL_KEYWORDS;
  const keywords = [
    ...pool.primary.slice(0, 4),
    ...(isRemote ? pool.remote.slice(0, 3) : []),
    ...(isTech ? pool.tech.slice(0, 2) : []),
  ];

  // Add job-specific terms
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const locationClean = location.split(",")[0].trim(); // e.g. "Dhaka"

  return [
    `${title} jobs`,
    `${title} job vacancy`,
    locationClean ? `${title} jobs in ${locationClean}` : null,
    ...keywords,
  ]
    .filter(Boolean)
    .slice(0, 10);
}

/**
 * Build an SEO-optimized meta title using high-value keyword patterns.
 * Pattern: "[Job Title] Jobs in [Location] - Apply Now | HiredUp.me"
 * This matches search intent for "jobs hiring", "job vacancies", "find jobs" queries.
 */
function buildMetaTitle(title, company, location, isBD) {
  const locationClean = location?.split(",")[0]?.trim() || "Bangladesh";
  if (isBD) {
    // "Software Developer Jobs in Dhaka Bangladesh - Job Vacancy | HiredUp.me"
    return `${title} Jobs in ${locationClean} Bangladesh - Job Vacancy | HiredUp.me`;
  }
  // "Remote Marketing Manager Jobs - Now Hiring | HiredUp.me"
  return `${title} at ${company} - Now Hiring | HiredUp.me`;
}

/**
 * Build an SEO-optimized meta description that naturally includes
 * high-volume keyword phrases from the research.
 * Target: ~155 chars, includes primary keyword 1-2x, clear CTA.
 */
function buildMetaDescription(
  title,
  company,
  location,
  summary,
  isBD,
  isRemote,
) {
  const locationClean = location?.split(",")[0]?.trim() || "Bangladesh";

  if (isBD && isRemote) {
    return `${title} job opportunity at ${company}. Remote jobs from Bangladesh - apply now on HiredUp.me, Bangladesh's leading job portal. Find jobs & advance your career.`.substring(
      0,
      160,
    );
  }
  if (isBD) {
    return `${title} job vacancy at ${company} in ${locationClean}. Find jobs in Bangladesh on HiredUp.me - your trusted job portal BD. Browse employment opportunities & apply today.`.substring(
      0,
      160,
    );
  }
  if (isRemote) {
    return `${title} remote job at ${company}. Work remotely - apply now on HiredUp.me. Browse remote job opportunities, remote careers & jobs hiring worldwide.`.substring(
      0,
      160,
    );
  }
  // Fallback: use AI-generated summary if available, inject keyword naturally
  if (summary) {
    const base = summary.substring(0, 110);
    return `${base} Apply now on HiredUp.me.`.substring(0, 160);
  }
  return `${title} job at ${company}. Find this job opportunity and thousands more on HiredUp.me. Apply now.`.substring(
    0,
    160,
  );
}

function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("AI_TIMEOUT")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timeoutId),
  );
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

// ─── Groq AI ─────────────────────────────────────────────────────────────────

async function callGroq(prompt) {
  if (!GROQ_API_KEY) throw new Error("No Groq API key configured");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    console.log("[AI] Using Groq AI for generation...");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a professional job content analyzer. Always respond with valid JSON only, no markdown formatting or explanations.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    console.log("[AI] Groq response received, length:", content.length);
    return content;
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

// ─── Logo Fetch ───────────────────────────────────────────────────────────────

async function fetchCompanyLogo(companyName) {
  if (TAVILY_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        if (data.images?.length > 0) {
          const logoImage =
            data.images.find(
              (img) =>
                img.toLowerCase().includes("logo") ||
                img.toLowerCase().endsWith(".svg") ||
                img.toLowerCase().endsWith(".png"),
            ) || data.images[0];
          if (logoImage) return logoImage;
        }
      }
    } catch (err) {
      console.log("Tavily logo search failed:", err.message);
    }
  }

  const cleanName = companyName
    .toLowerCase()
    .replace(
      /\s+(ltd|limited|inc|corp|corporation|llc|pvt|private|co|company)\.?$/i,
      "",
    )
    .trim()
    .replace(/\s+/g, "");

  for (const domain of [
    `${cleanName}.com`,
    `${cleanName}.io`,
    `${cleanName}.co`,
    `${cleanName}.org`,
    `${cleanName}.com.bd`,
  ]) {
    const url = `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return url;
    } catch {
      continue;
    }
  }
  return null;
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function POST(request) {
  console.log("[generate-ai] Request received");

  try {
    const { jobId, job } = await request.json();
    console.log(`[generate-ai] Processing job: ${jobId} - ${job?.title}`);

    if (!jobId || !job) {
      return NextResponse.json(
        { error: "Missing jobId or job data" },
        { status: 400 },
      );
    }

    // Detect job context upfront — used for keyword selection
    const isBD = isBangladeshJob(job.location || "");
    const jobContext = isBD ? "Bangladesh" : "global";
    console.log(
      `[generate-ai] Job context: ${jobContext}, location: ${job.location}`,
    );

    // Build keyword hints to guide AI content generation
    const pool = isBD ? BD_KEYWORDS : GLOBAL_KEYWORDS;
    const keywordHints = [
      ...pool.primary.slice(0, 4),
      ...(isRemoteJob(job.location || "") ? pool.remote.slice(0, 3) : []),
    ].join(", ");

    // Build extra metadata fields
    const extraFields = [];
    if (job.salary) extraFields.push(`Salary: ${job.salary}`);
    if (job.experience) extraFields.push(`Experience: ${job.experience}`);
    if (job.education) extraFields.push(`Education: ${job.education}`);
    if (job.deadline) extraFields.push(`Deadline: ${job.deadline}`);
    const extraFieldsText =
      extraFields.length > 0
        ? `\n\nADDITIONAL METADATA:\n${extraFields.join("\n")}`
        : "";

    const hasSalaryInfo = !!(
      job.salary ||
      (job.description &&
        /(?:salary|compensation|pay|BDT|৳|tk\.?\s*\d|\d+\s*[-–]\s*\d+\s*(?:BDT|tk|taka|per\s*month))/i.test(
          job.description,
        ))
    );

    // ── Step 1: AI Content Generation ──────────────────────────────────────
    console.log("[generate-ai] Step 1: Calling Groq AI...");

    const prompt = `You are creating professional content for a job posting page on HiredUp.me, a ${jobContext} job portal.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
${extraFieldsText}

RAW JOB POSTING CONTENT:
${job.description ? job.description.substring(0, 4000) : "No description available"}

SEO CONTEXT:
This page targets job seekers searching for: ${keywordHints}
Naturally weave 1-2 of these search phrases into the "about" and "summary" fields where they fit organically.
Do NOT keyword-stuff. Write for humans first, search engines second.

IMPORTANT RULES:
- For "salaryRange": ONLY include a salary if explicitly mentioned. Otherwise return "Not specified".
- For "benefits": ONLY list benefits explicitly stated in the posting. Return empty array if none.
- For "industry": Return a specific, consistent industry name (e.g. "Accounting", "Software Development", "Marketing", "Human Resources", "Sales", "Engineering", "Customer Service", "Data Analytics"). Do NOT return "General".
- For "experienceLevel": Return exactly one of: "entry", "mid", or "senior".
- For "workType": Return exactly one of: "remote", "hybrid", or "onsite".

Return this EXACT JSON structure:
{
  "summary": "2-3 sentence compelling summary. Naturally include 1 relevant search phrase.",
  "about": "2-3 detailed paragraphs about the role and company. Write engaging, human content.",
  "responsibilities": ["5-6 specific, detailed responsibilities"],
  "requirements": ["5-6 specific qualifications and requirements"],
  "skills": ["6-8 relevant technical and soft skills — use standard names like 'Microsoft Excel' not 'MS Excel'"],
  "experienceLevel": "entry or mid or senior",
  "salaryRange": "${hasSalaryInfo ? "Extract exact salary from posting (use BDT for Bangladesh jobs)" : "Not specified"}",
  "industry": "Specific industry name — must be one of: Software Development, IT & Technology, Accounting, Finance, Marketing, Human Resources, Sales, Design, Customer Service, Engineering, Data Analytics, Healthcare, Education, Logistics, Manufacturing, Legal, Media, Hospitality",
  "workType": "remote or hybrid or onsite",
  "benefits": ["Only explicitly mentioned benefits"],
  "whyApply": "2-3 compelling reasons to apply",
  "applicationTips": "2-3 specific tips for applying",
  "highlights": ["3-4 key selling points of this job"]
}

Return ONLY valid JSON. No markdown, no explanation.`;

    const aiResponse = await callGroq(prompt);
    console.log(
      "[generate-ai] AI response received, length:",
      aiResponse?.length,
    );

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(
          "[generate-ai] No JSON found in AI response:",
          aiResponse?.substring(0, 500),
        );
        throw new Error("AI response was not valid JSON");
      }
      analysis = JSON.parse(jsonMatch[0]);
    }

    console.log(
      "[generate-ai] Analysis ready, industry:",
      analysis.industry,
      "experience:",
      analysis.experienceLevel,
    );

    // ── Step 2: Company Logo ────────────────────────────────────────────────
    console.log("[generate-ai] Fetching logo for", job.company);
    let companyLogo = null;
    try {
      companyLogo = await fetchCompanyLogo(job.company);
    } catch (e) {
      console.log("Logo fetch failed:", e.message);
    }

    // ── Step 3: Build SEO fields using keyword strategy ────────────────────
    const isRemote = isRemoteJob(job.location || "", analysis.workType || "");
    const seoKeywords = pickSeoKeywords(
      job.title,
      job.location,
      analysis.industry,
      analysis.workType,
    );
    const metaTitle = buildMetaTitle(
      job.title,
      job.company,
      job.location,
      isBD,
    );
    const metaDescription = buildMetaDescription(
      job.title,
      job.company,
      job.location,
      analysis.summary,
      isBD,
      isRemote,
    );

    console.log(`[generate-ai] SEO meta title: ${metaTitle}`);
    console.log(
      `[generate-ai] SEO keywords (${seoKeywords.length}): ${seoKeywords.slice(0, 4).join(", ")}...`,
    );

    // ── Step 4: Build enhanced content object ──────────────────────────────
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
        {
          label: "Salary",
          value:
            analysis.salaryRange && analysis.salaryRange !== "Not specified"
              ? analysis.salaryRange
              : job.salary || "Not specified",
        },
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
        meta_title: metaTitle,
        meta_description: metaDescription,
        // Combine AI skills + researched keyword phrases for the <meta keywords> tag
        // and for structured data
        keywords: [...seoKeywords, ...(analysis.skills || []).slice(0, 5)],
      },
      aiEnhanced: true,
      aiEnhancedAt: new Date().toISOString(),
      needsAI: false,
    };

    // ── Step 5: Save to database ───────────────────────────────────────────
    console.log("[generate-ai] Step 5: Saving to database...");

    let jobSlug = null;
    let shouldUpdateSlug = false;
    try {
      const existingJob = await databases.getDocument(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        jobId,
      );
      jobSlug = existingJob.slug;
      if (!jobSlug) {
        jobSlug = generateJobSlug(
          existingJob.title || job.title,
          existingJob.company || job.company,
          jobId,
        );
        shouldUpdateSlug = true;
      }
      console.log(`[generate-ai] Found job slug: ${jobSlug}`);
    } catch (fetchError) {
      console.warn(
        "[generate-ai] Could not fetch job slug:",
        fetchError.message,
      );
      if (!jobSlug && job?.title && job?.company) {
        jobSlug = generateJobSlug(job.title, job.company, jobId);
        shouldUpdateSlug = true;
      }
    }

    try {
      const updatePayload = {
        description: (analysis.about || analysis.summary || "").substring(
          0,
          5000,
        ),
        enhanced_json: stringifyEnhancedForStorage(enhanced, 50000),
      };
      if (shouldUpdateSlug && jobSlug) updatePayload.slug = jobSlug;

      await databases.updateDocument(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        jobId,
        updatePayload,
      );
      console.log("[generate-ai] Database update successful!");

      if (jobSlug) {
        console.log(`[generate-ai] Revalidating cache for /jobs/${jobSlug}`);
        revalidatePath(`/jobs/${jobSlug}`);
      }
      revalidatePath("/jobs");
    } catch (dbError) {
      console.error("[generate-ai] Database error:", dbError.message);
      throw new Error(`Database save failed: ${dbError.message}`);
    }

    console.log("[generate-ai] Complete!");
    return NextResponse.json({
      success: true,
      enhanced,
      message: "Job enhanced with Groq AI successfully",
    });
  } catch (error) {
    console.error("[generate-ai] Error:", error.message);

    if (error.isTimeout || error.message === "AI_TIMEOUT") {
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
