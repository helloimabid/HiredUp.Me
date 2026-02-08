import { getJobs } from "@/lib/appwrite";

const BASE_URL = "https://hiredup.me";
const JOBS_PER_SITEMAP = 10000;

// 1. Tell Next.js to create 3 sitemap chunks (0, 1, 2)
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }];
}

export default async function sitemap({ id }) {
  const offset = id * JOBS_PER_SITEMAP;

  // Fetch the specific 10,000 jobs for this chunk
  let jobs = [];
  try {
    jobs = await getJobs(JOBS_PER_SITEMAP, offset);
  } catch (error) {
    console.error(`Failed to fetch jobs for sitemap ${id}:`, error);
  }

  // Define static pages (Only include them in the first sitemap to avoid duplicates)
  const staticPages =
    id === 0
      ? [
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
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          },
          {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          },
        ]
      : [];

  // Map the 10,000 jobs to sitemap format
  const jobPages = jobs
    .filter((job) => job.slug)
    .map((job) => ({
      url: `${BASE_URL}/jobs/${job.slug}`,
      lastModified: new Date(job.$updatedAt || job.$createdAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [...staticPages, ...jobPages];
}
