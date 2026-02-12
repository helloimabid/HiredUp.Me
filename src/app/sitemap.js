
import { getJobs } from "@/lib/appwrite";

const BASE_URL = "https://hiredup.me";
const JOBS_PER_SITEMAP = 5000; // Google allows up to 50,000, but keep it smaller for performance

// Helper to generate static pages
const staticPages = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/jobs`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/companies`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/job-seekers`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/employers`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/talent-search`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/post-job`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/pricing`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/salary-estimator`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/resources`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/success-stories`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/cookies`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

// Main sitemap handler
export default async function sitemap(req) {
  // If requesting the sitemap index
  if (req?.url?.endsWith("sitemap.xml") || req?.url?.endsWith("/sitemap.xml")) {
    // Get total job count
    let jobs = [];
    try {
      jobs = await getJobs(40000); // Fetch all jobs (adjust as needed)
    } catch (error) {
      console.error("Failed to fetch jobs for sitemap index:", error);
    }
    const numSitemaps = Math.ceil(jobs.length / JOBS_PER_SITEMAP);
    // Return sitemap index XML
    return [
      {
        type: "sitemap-index",
        sitemaps: Array.from({ length: numSitemaps }, (_, i) => ({
          loc: `${BASE_URL}/sitemap-jobs-${i + 1}.xml`,
          lastmod: new Date().toISOString(),
        })),
      },
      ...staticPages,
    ];
  }

  // If requesting a specific jobs sitemap chunk
  const match = req?.url?.match(/\/sitemap-jobs-(\d+)\.xml$/);
  if (match) {
    const chunk = parseInt(match[1], 10) - 1;
    let jobs = [];
    try {
      jobs = await getJobs(40000); // Fetch all jobs (adjust as needed)
    } catch (error) {
      console.error("Failed to fetch jobs for sitemap chunk:", error);
    }
    const start = chunk * JOBS_PER_SITEMAP;
    const end = start + JOBS_PER_SITEMAP;
    const jobPages = jobs.slice(start, end)
      .filter((job) => job.slug)
      .map((job) => ({
        url: `${BASE_URL}/jobs/${job.slug}`,
        lastModified: new Date(job.$updatedAt || job.$createdAt),
        changeFrequency: "daily",
        priority: 0.8,
      }));
    return jobPages;
  }

  // Default: return static pages only
  return staticPages;
}
