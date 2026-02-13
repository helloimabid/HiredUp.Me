// src/app/sitemap/jobs.xml/route.js
import { getJobs } from "@/lib/appwrite";

const BASE_URL = "https://hiredup.me";

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  let jobs = [];

  try {
    // Fetch all jobs - this happens at request time, not build time
    jobs = await getJobs(50000); // Increased limit to handle all your jobs
  } catch (error) {
    console.error("Failed to fetch jobs for sitemap:", error);
    // Return empty sitemap on error rather than failing
    return new Response(generateSitemapXML([]), {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Shorter cache on error
      },
    });
  }

  const jobPages = jobs
    .filter((job) => job.slug)
    .map((job) => ({
      url: `${BASE_URL}/jobs/${job.slug}`,
      lastModified: new Date(job.$updatedAt || job.$createdAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const sitemap = generateSitemapXML(jobPages);

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400", // Cache for 1 hour
    },
  });
}

function generateSitemapXML(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.toISOString()}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
}
