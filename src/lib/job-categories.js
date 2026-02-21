// src/lib/job-categories.js

export const JOB_CATEGORIES = [
  {
    slug: "software-developer-jobs",
    label: "Software Developer",
    plural: "Software Developer Jobs",
    industryMatch: ["software", "technology", "tech", "it", "information technology"],
    titleMatch: ["software developer", "software engineer", "programmer", "frontend", "backend", "fullstack", "full stack", "web developer", "mobile developer", "react", "node", "flutter"],
    skillMatch: ["react", "node.js", "python", "java", "php", "flutter", "django", "laravel", "javascript", "typescript"],
    icon: "solar:code-square-linear",
    description: "Software developer and engineer jobs in Bangladesh and remote. Full-stack, backend, frontend and more.",
    metaTitle: "Software Developer Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Browse 500+ software developer jobs in Dhaka, Chittagong & remote. React, Node.js, Python, PHP, Java and more. Apply now on HiredUp.me!",
  },
  {
    slug: "it-jobs",
    label: "IT & Technology",
    plural: "IT & Technology Jobs",
    industryMatch: ["information technology", "technology", "it", "tech", "networking", "cloud", "cybersecurity"],
    titleMatch: ["network engineer", "system admin", "devops", "cloud", "IT officer", "IT support", "database admin", "infrastructure", "sysadmin", "security analyst"],
    skillMatch: ["aws", "azure", "linux", "networking", "cisco", "devops", "kubernetes", "docker", "vmware"],
    icon: "solar:server-minimalistic-linear",
    description: "IT and technology jobs including system admin, network engineer, DevOps, and cloud roles.",
    metaTitle: "IT & Technology Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Find IT jobs in Bangladesh. Network engineers, system admins, DevOps, cloud architects & more. Updated daily on HiredUp.me!",
  },
  {
    slug: "accounting-finance-jobs",
    label: "Accounting & Finance",
    plural: "Accounting & Finance Jobs",
    industryMatch: ["accounting", "finance", "financial services", "audit", "banking"],
    titleMatch: ["accountant", "finance", "auditor", "financial analyst", "tax", "bookkeeper", "cpa", "cfa", "treasury", "controller", "ca article", "chartered accountant"],
    skillMatch: ["auditing", "financial accounting", "taxation", "tally", "quickbooks", "ifrs", "gaap", "financial reporting"],
    icon: "solar:calculator-linear",
    description: "Accounting and finance jobs including accountants, financial analysts, auditors and treasury roles.",
    metaTitle: "Accounting & Finance Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Find accounting and finance jobs in Bangladesh. Accountants, financial analysts, auditors & more. Apply now on HiredUp.me!",
  },
  {
    slug: "marketing-jobs",
    label: "Marketing",
    plural: "Marketing Jobs",
    industryMatch: ["marketing", "advertising", "media", "digital marketing"],
    titleMatch: ["marketing", "digital marketing", "seo", "social media", "content", "brand manager", "growth", "campaign", "email marketing"],
    skillMatch: ["seo", "social media marketing", "google ads", "facebook ads", "content marketing", "email marketing", "copywriting"],
    icon: "solar:chart-2-linear",
    description: "Marketing jobs including digital marketing, SEO, social media, content and brand management.",
    metaTitle: "Marketing Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Browse marketing jobs in Bangladesh. Digital marketing, SEO, social media, content & brand roles. Apply now on HiredUp.me!",
  },
  {
    slug: "hr-jobs",
    label: "Human Resources",
    plural: "HR Jobs",
    industryMatch: ["human resources", "hr", "recruitment", "staffing"],
    titleMatch: ["hr", "human resource", "recruiter", "talent acquisition", "payroll", "people operations", "hrbp", "learning and development", "training manager"],
    skillMatch: ["recruitment", "talent acquisition", "payroll", "performance management", "employee relations", "hris"],
    icon: "solar:users-group-rounded-linear",
    description: "Human resources and HR jobs including recruitment, talent acquisition, payroll and people operations.",
    metaTitle: "HR & Human Resources Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Browse HR jobs in Bangladesh. Recruiters, HR managers, talent acquisition, payroll specialists & more. Apply on HiredUp.me!",
  },
  {
    slug: "sales-jobs",
    label: "Sales",
    plural: "Sales Jobs",
    industryMatch: ["sales", "business development", "retail"],
    titleMatch: ["sales", "business development", "account manager", "account executive", "sales representative", "bdm", "relationship manager"],
    skillMatch: ["sales", "b2b sales", "crm", "lead generation", "negotiation", "client management"],
    icon: "solar:hand-money-linear",
    description: "Sales jobs including business development, account management and sales representative roles.",
    metaTitle: "Sales Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Find sales jobs in Bangladesh. Business development, account managers, sales executives & more. Apply now on HiredUp.me!",
  },
  {
    slug: "design-jobs",
    label: "Design & Creative",
    plural: "Design & Creative Jobs",
    industryMatch: ["design", "creative", "media", "advertising"],
    titleMatch: ["designer", "graphic design", "ui", "ux", "ui/ux", "product design", "illustrator", "motion", "video editor", "creative"],
    skillMatch: ["figma", "adobe photoshop", "illustrator", "ui design", "ux design", "after effects", "premiere pro", "canva"],
    icon: "solar:pen-new-square-linear",
    description: "Design and creative jobs including graphic design, UI/UX, product design and video editing.",
    metaTitle: "Design & Creative Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Browse design jobs in Bangladesh. UI/UX designers, graphic designers, product designers & more. Apply on HiredUp.me!",
  },
  {
    slug: "customer-service-jobs",
    label: "Customer Service",
    plural: "Customer Service Jobs",
    industryMatch: ["customer service", "customer support", "call center", "bpo"],
    titleMatch: ["customer service", "customer support", "call center", "help desk", "customer success", "live chat", "support agent"],
    skillMatch: ["customer service", "crm", "zendesk", "freshdesk", "live chat", "call handling"],
    icon: "solar:headphones-round-sound-linear",
    description: "Customer service and support jobs including call center, help desk and customer success roles.",
    metaTitle: "Customer Service Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Find customer service jobs in Bangladesh. Call center, customer support, help desk & success roles. Apply on HiredUp.me!",
  },
  {
    slug: "engineering-jobs",
    label: "Engineering",
    plural: "Engineering Jobs",
    industryMatch: ["engineering", "construction", "manufacturing", "industrial"],
    titleMatch: ["civil engineer", "mechanical engineer", "electrical engineer", "structural engineer", "industrial engineer", "production engineer"],
    skillMatch: ["autocad", "structural analysis", "civil engineering", "mechanical design", "electrical engineering"],
    icon: "solar:settings-minimalistic-linear",
    description: "Engineering jobs including civil, mechanical, electrical and structural engineering roles.",
    metaTitle: "Engineering Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Browse engineering jobs in Bangladesh. Civil, mechanical, electrical engineers & more. Apply now on HiredUp.me!",
  },
  {
    slug: "data-analyst-jobs",
    label: "Data & Analytics",
    plural: "Data & Analytics Jobs",
    industryMatch: ["data", "analytics", "business intelligence"],
    titleMatch: ["data analyst", "data scientist", "data engineer", "business intelligence", "bi analyst", "machine learning", "ai engineer", "analytics"],
    skillMatch: ["sql", "python", "tableau", "power bi", "machine learning", "data analysis", "r programming", "bigquery"],
    icon: "solar:graph-new-linear",
    description: "Data analyst, data scientist, and business intelligence jobs in Bangladesh.",
    metaTitle: "Data Analyst & Data Science Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Browse data analyst, data scientist & BI jobs in Bangladesh. SQL, Python, Tableau, Power BI & more. Apply on HiredUp.me!",
  },
  {
    slug: "remote-jobs",
    label: "Remote",
    plural: "Remote Jobs",
    industryMatch: [],
    titleMatch: [],
    skillMatch: [],
    // Special flag: filter by workType or location keywords instead
    locationMatch: ["remote", "work from home", "wfh"],
    icon: "solar:laptop-minimalistic-linear",
    description: "Remote and work-from-home jobs available to candidates in Bangladesh.",
    metaTitle: "Remote Jobs for Bangladesh | Work From Home | HiredUp.me",
    metaDescription: "Browse remote and work-from-home jobs open to Bangladesh candidates. Software, marketing, customer service & more. Apply on HiredUp.me!",
  },
  {
    slug: "fresher-jobs",
    label: "Fresher / Entry Level",
    plural: "Fresher & Entry Level Jobs",
    industryMatch: [],
    titleMatch: ["trainee", "intern", "junior", "fresher", "graduate trainee", "management trainee", "apprentice", "article student"],
    skillMatch: [],
    // Special flag: also match enhanced_json experienceLevel
    experienceMatch: ["entry", "fresher", "entry level"],
    icon: "solar:diploma-linear",
    description: "Jobs for freshers and entry-level candidates across all industries in Bangladesh.",
    metaTitle: "Fresher & Entry Level Jobs in Bangladesh | HiredUp.me",
    metaDescription: "Find fresher jobs in Bangladesh. Entry-level roles, graduate trainee programs & internships. Start your career on HiredUp.me!",
  },
];

export const JOB_LOCATIONS = [
  {
    slug: "dhaka",
    label: "Dhaka",
    keywords: ["dhaka", "gulshan", "banani", "uttara", "motijheel", "dhanmondi", "mirpur", "mohakhali", "tejgaon"],
    description: "Jobs in Dhaka, the capital and largest city of Bangladesh.",
    metaTitle: "Jobs in Dhaka Bangladesh | Latest Openings | HiredUp.me",
    metaDescription: "Find thousands of jobs in Dhaka, Bangladesh. All industries, all experience levels. Updated daily on HiredUp.me!",
  },
  {
    slug: "chittagong",
    label: "Chittagong",
    keywords: ["chittagong", "chattogram"],
    description: "Jobs in Chittagong (Chattogram), Bangladesh's second-largest city and major port.",
    metaTitle: "Jobs in Chittagong Bangladesh | HiredUp.me",
    metaDescription: "Browse jobs in Chittagong (Chattogram). Manufacturing, IT, shipping & more roles. Apply now on HiredUp.me!",
  },
  {
    slug: "sylhet",
    label: "Sylhet",
    keywords: ["sylhet"],
    description: "Jobs in Sylhet, Bangladesh.",
    metaTitle: "Jobs in Sylhet Bangladesh | HiredUp.me",
    metaDescription: "Find jobs in Sylhet, Bangladesh. Browse the latest openings across all industries. Apply now on HiredUp.me!",
  },
  {
    slug: "rajshahi",
    label: "Rajshahi",
    keywords: ["rajshahi"],
    description: "Jobs in Rajshahi, Bangladesh.",
    metaTitle: "Jobs in Rajshahi Bangladesh | HiredUp.me",
    metaDescription: "Browse jobs in Rajshahi, Bangladesh. Latest openings across all industries. Apply now on HiredUp.me!",
  },
  {
    slug: "remote-bangladesh",
    label: "Remote (Bangladesh)",
    keywords: ["remote", "work from home", "wfh"],
    description: "Remote and work-from-home jobs for candidates based in Bangladesh.",
    metaTitle: "Remote Jobs in Bangladesh | Work From Home | HiredUp.me",
    metaDescription: "Browse remote jobs for Bangladesh candidates. Work from home, flexible roles in tech, marketing & more. Apply on HiredUp.me!",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCategoryBySlug(slug) {
  return JOB_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function getLocationBySlug(slug) {
  return JOB_LOCATIONS.find((l) => l.slug === slug) || null;
}

/**
 * Parse enhanced_json safely — handles both string and object forms.
 * Returns null on any failure so callers can safely fallback.
 */
function parseEnhanced(job) {
  if (!job?.enhanced_json) return null;
  if (typeof job.enhanced_json === "object" && job.enhanced_json !== null) return job.enhanced_json;
  if (typeof job.enhanced_json !== "string") return null;
  try {
    const parsed = JSON.parse(job.enhanced_json);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Extract filterable fields from enhanced_json.
 * All fields have safe defaults — never throws, never returns undefined values.
 *
 * From the sample DB row, enhanced_json looks like:
 * {
 *   quick_info: [
 *     { label: "Experience", value: "entry" },
 *     { label: "Salary",     value: "Not specified" },
 *     { label: "Industry",   value: "Accounting" },
 *     { label: "Work Type",  value: "On-site" },
 *   ],
 *   sections: [
 *     { id: "skills", type: "tags", items: ["Auditing", "Financial Accounting", ...] },
 *     ...
 *   ],
 *   header: { location: "Dhaka, Bangladesh", ... }
 * }
 */
function getEnhancedFields(job) {
  const enhanced = parseEnhanced(job);
  // Always return a safe default shape so callers never get undefined fields
  if (!enhanced) return { industry: "", experienceLevel: "", workType: "", skills: [], location: "" };

  const quickInfo = Array.isArray(enhanced.quick_info) ? enhanced.quick_info : [];

  const getQI = (label) => {
    try {
      const item = quickInfo.find(
        (q) => q && typeof q === "object" && typeof q.label === "string" &&
          q.label.toLowerCase() === label.toLowerCase()
      );
      const val = item?.value;
      return typeof val === "string" ? val.toLowerCase() : "";
    } catch {
      return "";
    }
  };

  // Skills — find the skills/tags section; guard against non-array items
  const sections = Array.isArray(enhanced.sections) ? enhanced.sections : [];
  const skillsSection = sections.find(
    (s) => s && (s.id === "skills" || s.type === "tags")
  );
  const rawItems = Array.isArray(skillsSection?.items) ? skillsSection.items : [];
  const skills = rawItems
    .filter((s) => s && typeof s === "string")
    .map((s) => s.toLowerCase());

  return {
    industry: getQI("industry"),          // e.g. "accounting"
    experienceLevel: getQI("experience"), // e.g. "entry"
    workType: getQI("work type"),         // e.g. "on-site" / "remote"
    skills,                               // e.g. ["auditing", "financial accounting"]
    location: String(enhanced.header?.location || job?.location || "").toLowerCase(),
  };
}

/**
 * Safe string includes — returns false instead of throwing on bad input.
 */
function safeIncludes(haystack, needle) {
  try {
    return typeof haystack === "string" && typeof needle === "string" && haystack.includes(needle);
  } catch {
    return false;
  }
}

/**
 * Filter jobs by category.
 * Priority: enhanced_json industry → enhanced_json skills → raw title
 * Fully defensive — never throws even if job objects are malformed.
 */
export function filterJobsByCategory(jobs, category) {
  if (!Array.isArray(jobs) || !category) return [];

  return jobs.filter((job) => {
    // Skip null/undefined/non-object entries
    if (!job || typeof job !== "object") return false;

    let fields = { industry: "", experienceLevel: "", skills: [], workType: "", location: "" };
    try {
      fields = getEnhancedFields(job);
    } catch {
      // If extraction fails, fall through to title-only matching
    }

    const { industry, experienceLevel, skills, workType, location } = fields;
    const titleLower = String(job.title || "").toLowerCase();

    // ── Remote category: workType or location keywords ─────────────────────
    if (Array.isArray(category.locationMatch) && category.locationMatch.length > 0) {
      if (workType && category.locationMatch.some((kw) => safeIncludes(workType, kw))) return true;
      if (location && category.locationMatch.some((kw) => safeIncludes(location, kw))) return true;
      return false;
    }

    // ── Fresher category: experienceLevel or title keywords ────────────────
    if (Array.isArray(category.experienceMatch) && category.experienceMatch.length > 0) {
      if (experienceLevel && category.experienceMatch.some((kw) => safeIncludes(experienceLevel, kw))) return true;
      if (Array.isArray(category.titleMatch) && category.titleMatch.some((kw) => safeIncludes(titleLower, kw))) return true;
      return false;
    }

    // ── General categories ─────────────────────────────────────────────────

    // 1. Industry from enhanced_json quick_info (highest confidence)
    if (industry && Array.isArray(category.industryMatch) && category.industryMatch.some((kw) => safeIncludes(industry, kw))) return true;

    // 2. Skills from enhanced_json skills tags section
    if (skills.length > 0 && Array.isArray(category.skillMatch) && category.skillMatch.some((kw) => skills.includes(String(kw).toLowerCase()))) return true;

    // 3. Job title fallback
    if (titleLower && Array.isArray(category.titleMatch) && category.titleMatch.some((kw) => safeIncludes(titleLower, String(kw).toLowerCase()))) return true;

    return false;
  });
}

/**
 * Filter jobs by location.
 * Uses enhanced_json header.location first, then raw job.location.
 * Fully defensive — never throws.
 */
export function filterJobsByLocation(jobs, locationConfig) {
  if (!Array.isArray(jobs) || !locationConfig) return [];

  const keywords = Array.isArray(locationConfig.keywords)
    ? locationConfig.keywords.map((k) => String(k).toLowerCase())
    : [];

  if (keywords.length === 0) return [];

  return jobs.filter((job) => {
    if (!job || typeof job !== "object") return false;

    let enhancedLoc = "";
    try {
      const { location } = getEnhancedFields(job);
      enhancedLoc = location || "";
    } catch {
      enhancedLoc = "";
    }

    const rawLoc = String(job.location || "").toLowerCase();
    const locationText = enhancedLoc || rawLoc;

    return keywords.some((kw) => safeIncludes(locationText, kw));
  });
}