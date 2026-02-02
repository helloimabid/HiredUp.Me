import { NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Gemini API configuration (backup)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBSEI8zDAuPvzbmeSERnjzxsdKMTOKvfb0";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

/**
 * Scrape job details from source URL
 */
async function scrapeJobUrl(url) {
  try {
    console.log(`Scraping: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract text content while preserving structure
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\n\s+/g, "\n")
      .trim()
      .substring(0, 15000);

    return {
      content: textContent,
      url: url,
    };
  } catch (error) {
    console.error("Scrape error:", error.message);
    return null;
  }
}

/**
 * Generate enhanced job content using AI - creates flexible page sections
 */
async function generateEnhancedContent(job, scrapedData) {
  const systemPrompt = `You are an expert job page designer for HiredUp.me, a modern job board.

YOUR TASK: Extract ALL real information from the scraped job posting and create a structured page layout. DO NOT fabricate any details - only use what's in the source.

DESIGN REFERENCE (follow this exact aesthetic from our reference design):
The design follows a clean, minimal, professional aesthetic similar to this structure:

1. JOB HEADER: Company logo (colored square with initial), job title (text-2xl/3xl font-semibold), company name below, then metadata row showing location/time/applicants with icons. Tags below for job type (Full-time, On-site, AI Enhanced).

2. KEY HIGHLIGHTS SECTION: bg-slate-50 rounded-xl border border-slate-100 p-6. Title with star icon and "Key Highlights". List items with check-circle icons (text-slate-400).

3. JOB OVERVIEW: Grid of 3 cards with border border-slate-200 rounded-lg p-4. Each card has: label (text-xs text-slate-400 uppercase tracking-wider), value (font-semibold text-slate-900).

4. CONTENT SECTIONS separated by <hr class="border-slate-100">:
   - "About the Role" - paragraph text (text-sm text-slate-500)
   - "Job Responsibilities" - numbered list with circular number badges (w-6 h-6 rounded-full bg-slate-100)
   - "Requirements" - grouped by Education, Experience with list-disc list-inside
   - "Skills Required" - rounded-full pill tags with border border-slate-200
   - "Additional Requirements" - bullet points with small dots (w-1.5 h-1.5 rounded-full bg-slate-300)

5. BOTTOM CTA: bg-slate-900 rounded-xl p-8 with white "Apply Now" button

6. SIDEBAR: Job Summary card with icon+label+value rows, Apply button at bottom

COLOR PALETTE:
- Backgrounds: white, slate-50
- Text: slate-900 (headings), slate-600 (body), slate-500 (secondary), slate-400 (muted)
- Borders: slate-100, slate-200
- Accent: purple for "AI Enhanced" badge only
- Icons: text-slate-400, amber-500 for star icon

OUTPUT FORMAT (JSON):
{
  "header": {
    "title": "Exact job title",
    "company": "Company name",
    "location": "EXACT location from source (e.g., 'Dhaka (Uttara Sector 11)')",
    "location_type": "On-site | Remote | Hybrid",
    "employment_type": "Full-time | Part-time | Contract",
    "posted_date": "If available or null",
    "applicants": "If mentioned or null"
  },
  "quick_info": [
    {"icon": "solar:wallet-linear", "label": "Salary", "value": "Exact salary or 'Competitive'"},
    {"icon": "solar:clock-circle-linear", "label": "Experience", "value": "Exact requirement"},
    {"icon": "solar:diploma-linear", "label": "Education", "value": "Degree requirement"},
    {"icon": "solar:buildings-2-linear", "label": "Department", "value": "If mentioned"}
  ],
  "highlights": ["3-5 key attractive points about this job - exact from source"],
  "sections": [
    {
      "id": "about",
      "title": "About the Role",
      "icon": "solar:info-circle-linear",
      "type": "paragraph",
      "content": "Description paragraph from source"
    },
    {
      "id": "responsibilities",
      "title": "Job Responsibilities",
      "icon": "solar:checklist-minimalistic-linear",
      "type": "numbered-list",
      "items": ["Exact responsibilities from source"]
    },
    {
      "id": "requirements",
      "title": "Requirements",
      "icon": "solar:user-check-linear",
      "type": "grouped-list",
      "groups": [
        {"title": "Education", "icon": "solar:square-academic-cap-linear", "items": ["BSc", "MSc", "etc"]},
        {"title": "Experience", "icon": "solar:history-linear", "items": ["2+ years", "etc"]}
      ]
    },
    {
      "id": "skills",
      "title": "Skills Required",
      "icon": "solar:star-linear",
      "type": "tags",
      "items": ["Skill 1", "Skill 2", "etc - displayed as rounded-full pill badges"]
    },
    {
      "id": "benefits",
      "title": "Benefits & Perks",
      "icon": "solar:gift-linear",
      "type": "bullet-list",
      "items": ["Exact benefits from source"]
    },
    {
      "id": "additional",
      "title": "Additional Requirements",
      "icon": "solar:document-text-linear",
      "type": "bullet-list",
      "items": ["Any additional info from source"]
    }
  ],
  "company_info": {
    "name": "Company name",
    "description": "About the company if mentioned",
    "industry": "If mentioned"
  },
  "apply_info": {
    "deadline": "If mentioned",
    "how_to_apply": "Instructions if any",
    "contact": "If mentioned"
  },
  "seo": {
    "meta_title": "Job Title at Company | Location",
    "meta_description": "150 char description",
    "keywords": ["keyword1", "keyword2"]
  }
}

SECTION TYPES:
- "paragraph": Single text content
- "bullet-list": Array of items with bullet points
- "numbered-list": Array of items with numbers
- "tags": Array of items displayed as tags/chips
- "grouped-list": Multiple groups with title and items
- "table": { "headers": [], "rows": [[]] }
- "key-value": Array of {"label": "", "value": ""} for info tables

IMPORTANT:
1. Extract EVERY piece of information from the source
2. Use EXACT text from the source - don't paraphrase
3. Include the exact location (e.g., "Dhaka (Uttara Sector 11)" not just "Dhaka")
4. Include ALL requirements, skills, benefits exactly as listed
5. Only include sections that have real data from the source
6. Skip sections with no data rather than making up content`;

  const userPrompt = `Create a job page layout from this posting. Extract ALL real details:

=== SCRAPED SOURCE CONTENT ===
${scrapedData?.content || "No scraped content available"}

=== DATABASE RECORD (fallback) ===
Title: ${job.title || "Unknown"}
Company: ${job.company || "Unknown"}  
Location: ${job.location || "Not specified"}
Description: ${job.description?.substring(0, 1000) || "None"}

=== SOURCE URL ===
${scrapedData?.url || job.apply_url || "Not available"}

IMPORTANT: Use the SCRAPED SOURCE CONTENT as the primary source. Extract exact text, locations, requirements, and all details. Output valid JSON only.`;

  // Helper function to call Gemini API
  async function callGeminiAPI() {
    console.log("🔄 Trying Gemini API as backup...");
    const geminiResponse = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 6000,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini error:", errorText);
      return null;
    }

    const geminiData = await geminiResponse.json();
    return geminiData.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  // Helper function to call OpenRouter API
  async function callOpenRouterAPI() {
    console.log("🤖 Trying OpenRouter API...");
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hiredup.me",
        "X-Title": "HiredUp.me Job Enhancement",
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", errorText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  }

  try {
    // Try OpenRouter first, then fall back to Gemini
    let content = await callOpenRouterAPI();
    
    if (!content) {
      console.log("OpenRouter failed, trying Gemini backup...");
      content = await callGeminiAPI();
    }

    if (!content) {
      console.error("Both APIs failed");
      return null;
    }

    // Parse JSON from response
    let jsonContent = content;
    if (content.includes("```json")) {
      jsonContent = content.match(/```json\n?([\s\S]*?)\n?```/)?.[1] || content;
    } else if (content.includes("```")) {
      jsonContent = content.match(/```\n?([\s\S]*?)\n?```/)?.[1] || content;
    }

    const parsed = JSON.parse(jsonContent.trim());
    parsed.generated_at = new Date().toISOString();
    parsed.source_url = scrapedData?.url || job.apply_url;
    parsed.job_id = job.$id;

    return parsed;
  } catch (error) {
    console.error("AI generation error:", error.message);
    return null;
  }
}

/**
 * POST handler - Generate enhanced content for a job
 */
export async function POST(request) {
  try {
    const { jobId, regenerate = false } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    // Verify admin API key
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY || "admin-secret-key";

    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the job
    const job = await databases.getDocument(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      jobId,
    );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if already enhanced (using new field)
    if (job.enhanced_json && !regenerate) {
      return NextResponse.json({
        success: true,
        message: "Job already has enhanced content",
        jobId,
        content: JSON.parse(job.enhanced_json),
      });
    }

    // Scrape source URL if available
    let scrapedData = null;
    if (job.apply_url) {
      scrapedData = await scrapeJobUrl(job.apply_url);
    }

    // Generate enhanced content
    const enhancedContent = await generateEnhancedContent(job, scrapedData);

    if (!enhancedContent) {
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 },
      );
    }

    // Store all content in single JSON field (5000 char limit)
    let jsonString = JSON.stringify(enhancedContent);

    // Trim content to fit in 5KB field if needed
    if (jsonString.length > 4900) {
      // Progressively trim less important data
      if (enhancedContent.sections?.length > 2) {
        enhancedContent.sections = enhancedContent.sections.slice(0, 2);
      }
      if (enhancedContent.seo) {
        delete enhancedContent.seo;
      }
      if (enhancedContent.additional_info) {
        delete enhancedContent.additional_info;
      }
      if (
        jsonString.length > 4900 &&
        enhancedContent.requirements?.skills_preferred
      ) {
        enhancedContent.requirements.skills_preferred =
          enhancedContent.requirements.skills_preferred.slice(0, 3);
      }
      enhancedContent._trimmed = true;
      jsonString = JSON.stringify(enhancedContent);
    }

    await databases.updateDocument(DATABASE_ID, JOBS_COLLECTION_ID, jobId, {
      enhanced_json: jsonString.substring(0, 4999),
    });

    return NextResponse.json({
      success: true,
      message: "Job page content generated successfully",
      jobId,
      content: enhancedContent,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET handler - Check generation status or get enhanced content
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = await databases.getDocument(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      jobId,
    );

    const hasEnhanced = Boolean(job.enhanced_json);
    let content = null;

    if (hasEnhanced) {
      try {
        content = JSON.parse(job.enhanced_json);
      } catch {
        content = null;
      }
    }

    return NextResponse.json({
      jobId,
      is_enhanced: hasEnhanced,
      generated_at: content?.generated_at || null,
      content: content,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
