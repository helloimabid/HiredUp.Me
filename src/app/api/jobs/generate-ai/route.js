import { NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

// Logo.dev configuration
const LOGO_DEV_KEY =
  process.env.LOGO_DEV_PUBLISHABLE_KEY || "pk_XCMtoIJ7RMy7XgG2Ruf6UA";

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

// Call AI using OpenRouter (free models available)
async function callAI(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
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
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenRouter error:", error);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// Fetch company logo using Logo.dev
async function fetchCompanyLogo(companyName) {
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
      if (res.ok) return url;
    } catch {
      continue;
    }
  }
  return null;
}

export async function POST(request) {
  try {
    const { jobId, job } = await request.json();

    if (!jobId || !job) {
      return NextResponse.json(
        { error: "Missing jobId or job data" },
        { status: 400 },
      );
    }

    // Step 1: Generate AI content
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

    const aiResponse = await callAI(prompt);

    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response was not valid JSON");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Step 2: Fetch company logo
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
    await databases.updateDocument(DATABASE_ID, JOBS_COLLECTION_ID, jobId, {
      description: (analysis.about || analysis.summary || "").substring(
        0,
        5000,
      ),
      enhanced_json: JSON.stringify(enhanced).substring(0, 50000),
    });

    return NextResponse.json({
      success: true,
      enhanced,
      message: "Job enhanced with AI successfully",
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: error.message || "AI generation failed" },
      { status: 500 },
    );
  }
}
