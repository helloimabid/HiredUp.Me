#!/usr/bin/env node
/**
 * Auto-Generate Job Pages using Gemini (Free Tier)
 *
 * Processes unenhanced jobs using Google Gemini API within free tier rate limits.
 * Rotates across multiple Gemini models to maximize daily throughput (~60 jobs/day free).
 * Uses keyword research data to maximize SEO positioning per job.
 *
 * Usage:
 *   node scripts/auto-generate-jobs.js                  # Process all unenhanced jobs
 *   node scripts/auto-generate-jobs.js --limit 10       # Process only 10 jobs
 *   node scripts/auto-generate-jobs.js --model gemini-2.5-flash-lite  # Use specific model
 *   node scripts/auto-generate-jobs.js --dry-run        # Preview without generating
 *
 * Rate limits (free tier per model):
 *   Gemma 3 27B  — 30 RPM, 14.4K RPD (best quality)
 *   Gemma 3 12B  — 30 RPM, 14.4K RPD
 *   Gemma 3 4B   — 30 RPM, 14.4K RPD (fastest)
 *   Total across models: ~43,200 jobs/day (effectively unlimited)
 */

const { Client, Databases, Query } = require("node-appwrite");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

// ─── Configuration ────────────────────────────────────────────────────────────

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  "https://sgp.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "hiredupme";
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";
const GOOGLE_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const GEMINI_MODELS = [
  { name: "gemma-3-27b-it", rpm: 30, rpd: 14400 },
  { name: "gemma-3-12b-it", rpm: 30, rpd: 14400 },
  { name: "gemma-3-4b-it", rpm: 30, rpd: 14400 },
];

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const limitArgIdx = args.indexOf("--limit");
const jobLimit =
  limitArgIdx !== -1 ? parseInt(args[limitArgIdx + 1], 10) : Infinity;
const modelArgIdx = args.indexOf("--model");
const forcedModel = modelArgIdx !== -1 ? args[modelArgIdx + 1] : null;
const modelsToUse = forcedModel
  ? GEMINI_MODELS.filter((m) => m.name === forcedModel)
  : GEMINI_MODELS;

if (forcedModel && modelsToUse.length === 0) {
  console.error(`❌ Unknown model: ${forcedModel}`);
  console.log("Available models:", GEMINI_MODELS.map((m) => m.name).join(", "));
  process.exit(1);
}

const modelUsage = {};
modelsToUse.forEach((m) => {
  modelUsage[m.name] = { used: 0, rpd: m.rpd, rpm: m.rpm, requestTimes: [] };
});

// ─── SEO Keyword Strategy ─────────────────────────────────────────────────────
// Sourced from keyword research CSVs (LOW competition, highest search volume)
//
// BANGLADESH audience — use for BD-location jobs
const BD_KEYWORDS = {
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
  remote: [
    "remote jobs bangladesh",
    "remote jobs in bangladesh",
    "remote jobs from bangladesh",
    "remote work",
    "work from home bangladesh",
  ],
  tech: ["bangladesh it jobs", "it jobs jobs", "remote it jobs bangladesh"],
};

// GLOBAL audience — for remote/international jobs
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
};

// ─── Keyword Helper Functions ─────────────────────────────────────────────────

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
  const text = (location + " " + workType).toLowerCase();
  return (
    text.includes("remote") ||
    text.includes("work from home") ||
    text.includes("wfh")
  );
}

/**
 * Pick best-fit SEO keywords for a job based on location, type, and title.
 * Prioritises LOW competition, high volume keywords from research.
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

  const locationClean = location.split(",")[0].trim();
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
 * SEO-optimised meta title.
 * BD pattern:     "Software Developer Jobs in Dhaka Bangladesh - Job Vacancy | HiredUp.me"
 * Global pattern: "Marketing Manager at Acme - Now Hiring | HiredUp.me"
 */
function buildMetaTitle(title, company, location, isBD) {
  const locationClean = location?.split(",")[0]?.trim() || "Bangladesh";
  if (isBD) {
    return `${title} Jobs in ${locationClean} Bangladesh - Job Vacancy | HiredUp.me`;
  }
  return `${title} at ${company} - Now Hiring | HiredUp.me`;
}

/**
 * SEO-optimised meta description (~155 chars).
 * Naturally includes primary keyword phrases from research data.
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
  if (summary) {
    return `${summary.substring(0, 110)} Apply now on HiredUp.me.`.substring(
      0,
      160,
    );
  }
  return `${title} job at ${company}. Find this opportunity and thousands more on HiredUp.me. Apply now.`.substring(
    0,
    160,
  );
}

// ─── Init clients ─────────────────────────────────────────────────────────────

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);
const databases = new Databases(client);
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function pickModel() {
  const available = modelsToUse
    .filter((m) => modelUsage[m.name].used < m.rpd)
    .sort((a, b) => b.rpm - a.rpm);
  return available[0] || null;
}

async function waitForRateLimit(modelConfig) {
  const usage = modelUsage[modelConfig.name];
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  usage.requestTimes = usage.requestTimes.filter((t) => t > oneMinuteAgo);

  if (usage.requestTimes.length < modelConfig.rpm) {
    usage.requestTimes.push(now);
    return 0;
  }

  const oldestRequestInWindow = usage.requestTimes[0];
  const timeToWait = oldestRequestInWindow + 60000 - now;

  if (timeToWait > 0) {
    console.log(
      `         ⏳ Rate limit: waiting ${(timeToWait / 1000).toFixed(1)}s...`,
    );
    await sleep(timeToWait + 100);
  }

  usage.requestTimes = usage.requestTimes.filter((t) => t > Date.now() - 60000);
  usage.requestTimes.push(Date.now());
  return timeToWait > 0 ? timeToWait : 0;
}

function getRemainingBudget() {
  return modelsToUse.reduce(
    (sum, m) => sum + Math.max(0, m.rpd - modelUsage[m.name].used),
    0,
  );
}

// ─── Gemini Call ──────────────────────────────────────────────────────────────

async function callGemini(prompt, modelName) {
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
    setTimeout(() => reject(new Error("GEMINI_TIMEOUT")), 30000),
  );
  return Promise.race([attempt(), timeout]);
}

// ─── Enhanced Storage Helpers ─────────────────────────────────────────────────

function truncateAtWord(text, maxChars) {
  if (typeof text !== "string") return "";
  if (text.length <= maxChars) return text;
  const hardCut = Math.max(0, maxChars - 1);
  const slice = text.slice(0, hardCut);
  const minIndex = Math.floor(hardCut * 0.8);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > minIndex) return slice.slice(0, lastSpace).trimEnd() + "…";
  return slice.trimEnd() + "…";
}

function shrinkEnhanced(enhanced, pass) {
  const copy = JSON.parse(JSON.stringify(enhanced));
  if (copy.seo && pass >= 1) delete copy.seo.keywords;
  if (Array.isArray(copy.highlights)) {
    const max = pass === 0 ? 6 : pass === 1 ? 5 : 4;
    copy.highlights = copy.highlights
      .slice(0, max)
      .map((x) => (typeof x === "string" ? truncateAtWord(x, 140) : x))
      .filter(Boolean);
  }
  if (Array.isArray(copy.quick_info)) {
    const max = pass === 0 ? 8 : pass === 1 ? 6 : 5;
    copy.quick_info = copy.quick_info.slice(0, max).map((item) => {
      if (!item || typeof item !== "object") return item;
      return {
        ...item,
        label:
          typeof item.label === "string"
            ? truncateAtWord(item.label, 40)
            : item.label,
        value:
          typeof item.value === "string"
            ? truncateAtWord(item.value, 80)
            : item.value,
      };
    });
  }
  if (Array.isArray(copy.sections)) {
    const maxParagraph =
      pass === 0 ? 2800 : pass === 1 ? 1600 : pass === 2 ? 1000 : 700;
    const maxItems = pass === 0 ? 10 : pass === 1 ? 8 : pass === 2 ? 6 : 4;
    const maxItemLen =
      pass === 0 ? 220 : pass === 1 ? 170 : pass === 2 ? 130 : 95;
    copy.sections = copy.sections.map((section) => {
      if (!section || typeof section !== "object") return section;
      const next = { ...section };
      if (typeof next.content === "string")
        next.content = truncateAtWord(next.content, maxParagraph);
      if (Array.isArray(next.items)) {
        next.items = next.items
          .slice(0, maxItems)
          .map((item) =>
            typeof item === "string" ? truncateAtWord(item, maxItemLen) : item,
          )
          .filter(Boolean);
      }
      return next;
    });
    if (pass >= 3)
      copy.sections = copy.sections.map((s) => ({
        id: s?.id,
        title: s?.title,
        type: s?.type,
      }));
  }
  if (copy.seo && typeof copy.seo.meta_description === "string")
    copy.seo.meta_description = truncateAtWord(
      copy.seo.meta_description,
      pass === 0 ? 300 : 220,
    );
  if (copy.seo && typeof copy.seo.meta_title === "string")
    copy.seo.meta_title = truncateAtWord(copy.seo.meta_title, 120);
  return copy;
}

function stringifyEnhancedForStorage(enhanced, maxLen = 50000) {
  if (!enhanced || typeof enhanced !== "object")
    return JSON.stringify({ needsAI: true, aiEnhanced: false });
  let candidate = enhanced;
  for (let pass = 0; pass < 5; pass++) {
    const json = JSON.stringify(candidate);
    if (json.length <= maxLen) return json;
    candidate = shrinkEnhanced(candidate, pass);
  }
  const minimal = {
    header: enhanced.header,
    apply_info: enhanced.apply_info,
    aiEnhanced: Boolean(enhanced.aiEnhanced),
    aiEnhancedAt: enhanced.aiEnhancedAt,
    needsAI: Boolean(enhanced.needsAI),
  };
  const minimalJson = JSON.stringify(minimal);
  if (minimalJson.length <= maxLen) return minimalJson;
  return JSON.stringify({
    aiEnhanced: Boolean(enhanced.aiEnhanced),
    needsAI: Boolean(enhanced.needsAI),
  });
}

// ─── Fetch Unenhanced Jobs ────────────────────────────────────────────────────

async function fetchUnenhancedJobs() {
  console.log("📥 Fetching unenhanced jobs from Appwrite...");
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

  return { total: allJobs.length, unenhanced };
}

// ─── Generate One Job ─────────────────────────────────────────────────────────

async function generateOneJob(job, modelConfig) {
  // Detect context upfront for keyword selection
  const isBD = isBangladeshJob(job.location || "");
  const jobContext = isBD ? "Bangladesh" : "global";

  const pool = isBD ? BD_KEYWORDS : GLOBAL_KEYWORDS;
  const keywordHints = [
    ...pool.primary.slice(0, 4),
    ...(isRemoteJob(job.location || "") ? pool.remote.slice(0, 3) : []),
  ].join(", ");

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

  const prompt = `You are creating professional content for a job posting page on HiredUp.me, a ${jobContext} job portal.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
${extraFieldsText}

RAW JOB POSTING CONTENT:
${(job.description || "No description available").substring(0, 4000)}

SEO CONTEXT:
This page targets job seekers searching for: ${keywordHints}
Naturally weave 1-2 of these search phrases into the "about" and "summary" fields where they fit organically.
Do NOT keyword-stuff. Write for humans first, search engines second.

IMPORTANT RULES:
- For "salaryRange": ONLY include a salary if the job posting EXPLICITLY mentions it. Otherwise return "Not specified".
- For "benefits": ONLY list benefits explicitly mentioned. Return empty array if none.
- For "industry": Return a specific, consistent name — MUST be one of: Software Development, IT & Technology, Accounting, Finance, Marketing, Human Resources, Sales, Design, Customer Service, Engineering, Data Analytics, Healthcare, Education, Logistics, Manufacturing, Legal, Media, Hospitality. Do NOT return "General".
- For "experienceLevel": Return exactly one of: "entry", "mid", or "senior".
- For "workType": Return exactly one of: "remote", "hybrid", or "onsite".
- For "skills": Use standardised names (e.g. "Microsoft Excel" not "MS Excel", "Node.js" not "NodeJS").

Return this EXACT JSON structure:
{
  "summary": "2-3 sentence compelling summary. Naturally include 1 relevant search phrase.",
  "about": "2-3 detailed paragraphs about the role and company. Write engaging, human content.",
  "responsibilities": ["5-6 specific, detailed responsibilities"],
  "requirements": ["5-6 specific qualifications and requirements"],
  "skills": ["6-8 relevant technical and soft skills with standardised names"],
  "experienceLevel": "entry or mid or senior",
  "salaryRange": "${hasSalaryInfo ? "Extract exact salary from posting (use BDT for Bangladesh jobs)" : "Not specified"}",
  "industry": "One industry from the allowed list above",
  "workType": "remote or hybrid or onsite",
  "benefits": ["Only explicitly mentioned benefits"],
  "whyApply": "2-3 compelling reasons to apply",
  "applicationTips": "2-3 specific tips for applying",
  "highlights": ["3-4 key selling points of this job"]
}

Return ONLY valid JSON. No markdown, no explanation.`;

  await waitForRateLimit(modelConfig);

  const aiResponse = await callGemini(prompt, modelConfig.name);

  // Parse JSON — Gemini sometimes wraps in markdown fences
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI response was not valid JSON");

  const analysis = JSON.parse(jsonMatch[0]);

  // Build SEO fields using keyword strategy
  const isRemote = isRemoteJob(job.location || "", analysis.workType || "");
  const seoKeywords = pickSeoKeywords(
    job.title,
    job.location,
    analysis.industry,
    analysis.workType,
  );
  const metaTitle = buildMetaTitle(job.title, job.company, job.location, isBD);
  const metaDescription = buildMetaDescription(
    job.title,
    job.company,
    job.location,
    analysis.summary,
    isBD,
    isRemote,
  );

  // Build enhanced content object (matches generate-ai/route.js structure exactly)
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
      // Combine researched keyword phrases + AI-generated skill names
      keywords: [...seoKeywords, ...(analysis.skills || []).slice(0, 5)],
    },
    aiEnhanced: true,
    aiEnhancedAt: new Date().toISOString(),
    needsAI: false,
  };

  // Slug handling
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
  if (shouldUpdateSlug && jobSlug) updatePayload.slug = jobSlug;

  await databases.updateDocument(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
    job.$id,
    updatePayload,
  );

  return {
    success: true,
    model: modelConfig.name,
    isBD,
    isRemote,
    industry: analysis.industry,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🤖 Auto-Generate Job Pages (Gemini Free Tier + SEO Keywords)");
  console.log(
    "================================================================",
  );
  console.log(`📡 Appwrite: ${APPWRITE_ENDPOINT}`);
  console.log(`🧠 Models: ${modelsToUse.map((m) => m.name).join(", ")}`);
  console.log(
    `📊 Total daily budget: ${modelsToUse.reduce((s, m) => s + m.rpd, 0).toLocaleString()} jobs`,
  );
  console.log(`🔢 Limit: ${jobLimit === Infinity ? "none" : jobLimit}`);
  console.log(`🧪 Dry run: ${dryRun}`);
  console.log("");

  if (!APPWRITE_API_KEY) {
    console.error("❌ APPWRITE_API_KEY is required");
    process.exit(1);
  }
  if (!GOOGLE_API_KEY) {
    console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is required");
    process.exit(1);
  }

  const { total, unenhanced } = await fetchUnenhancedJobs();
  console.log(`📊 Total jobs in database: ${total.toLocaleString()}`);
  console.log(
    `📊 Jobs needing AI generation: ${unenhanced.length.toLocaleString()}`,
  );

  if (unenhanced.length === 0) {
    console.log("\n✅ All jobs already have AI-generated pages!");
    return;
  }

  const toProcess = unenhanced.slice(0, Math.min(jobLimit, unenhanced.length));
  console.log(`\n🔄 Will process: ${toProcess.length} jobs`);
  console.log(
    "================================================================\n",
  );

  if (dryRun) {
    console.log("🧪 DRY RUN — jobs that would be processed:\n");
    toProcess.forEach((job, i) => {
      const isBD = isBangladeshJob(job.location || "");
      console.log(
        `  ${i + 1}. [${isBD ? "🇧🇩 BD" : "🌐 Global"}] ${job.title} at ${job.company} — ${job.location || "No location"}`,
      );
    });
    console.log(
      `\nRemaining daily budget: ${getRemainingBudget().toLocaleString()} requests`,
    );
    return;
  }

  const results = {
    succeeded: 0,
    failed: 0,
    bdJobs: 0,
    globalJobs: 0,
    errors: [],
  };
  let lastModelName = null;

  for (let i = 0; i < toProcess.length; i++) {
    const job = toProcess[i];
    const progress = `[${i + 1}/${toProcess.length}]`;

    const modelConfig = pickModel();
    if (!modelConfig) {
      console.log(`\n⚠️  All model daily limits reached after ${i} jobs.`);
      console.log("   Run again tomorrow or add more API keys.");
      break;
    }

    if (modelConfig.name !== lastModelName) {
      if (lastModelName)
        console.log(`\n   🔄 Switching to model: ${modelConfig.name}`);
      lastModelName = modelConfig.name;
    }

    const isBD = isBangladeshJob(job.location || "");
    console.log(
      `${progress} ${isBD ? "🇧🇩" : "🌐"} ${job.title} (${job.company})`,
    );
    console.log(
      `         Model: ${modelConfig.name} | Budget left: ${modelConfig.rpd - modelUsage[modelConfig.name].used}`,
    );

    try {
      const result = await generateOneJob(job, modelConfig);
      modelUsage[modelConfig.name].used++;
      results.succeeded++;
      if (result.isBD) results.bdJobs++;
      else results.globalJobs++;
      console.log(
        `         ✅ Done — Industry: ${result.industry} | ${result.isBD ? "BD keywords" : "Global keywords"}`,
      );
    } catch (error) {
      results.failed++;
      results.errors.push({
        jobId: job.$id,
        title: job.title,
        error: error.message,
      });

      if (
        error.message?.includes("429") ||
        error.message?.includes("RESOURCE_EXHAUSTED")
      ) {
        console.log(
          `         ⚠️  Rate limited on ${modelConfig.name} — switching model`,
        );
        modelUsage[modelConfig.name].used = modelConfig.rpd;
      } else {
        console.log(`         ❌ Failed: ${error.message}`);
        modelUsage[modelConfig.name].used++;
      }
    }

    console.log("");
  }

  // Summary
  console.log(
    "================================================================",
  );
  console.log("📊 SUMMARY");
  console.log(
    "================================================================",
  );
  console.log(`   Total processed:   ${results.succeeded + results.failed}`);
  console.log(`   ✅ Succeeded:      ${results.succeeded}`);
  console.log(`   🇧🇩 BD keyword:    ${results.bdJobs} jobs`);
  console.log(`   🌐 Global keyword: ${results.globalJobs} jobs`);
  console.log(`   ❌ Failed:         ${results.failed}`);
  console.log(
    `   📊 Budget left:    ${getRemainingBudget().toLocaleString()} requests`,
  );
  console.log("");
  console.log("   Model usage:");
  modelsToUse.forEach((m) => {
    const u = modelUsage[m.name];
    console.log(`     ${m.name}: ${u.used}/${u.rpd} RPD used`);
  });

  if (results.errors.length > 0) {
    console.log("\n❌ Failed jobs:");
    results.errors.forEach((e) =>
      console.log(`   - ${e.title} (${e.jobId}): ${e.error}`),
    );
  }

  console.log("\n🎉 Done!");
}

main().catch((error) => {
  console.error("❌ Script error:", error);
  process.exit(1);
});
