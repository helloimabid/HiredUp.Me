import { getJobs } from "@/lib/appwrite";

const BASE_URL = "https://hiredup.me";
const JOBS_PER_SITEMAP = 10000;

export async function GET(request, { params }) {
  const { id } = await params;

  // Remove .xml extension if present (Next.js includes it in the id param)
  const cleanId = id.replace(".xml", "");
  const sitemapId = parseInt(cleanId);
  const offset = sitemapId * JOBS_PER_SITEMAP;

  let jobs = [];
  try {
    jobs = await getJobs(JOBS_PER_SITEMAP, offset);
  } catch (error) {
    console.error(`Failed to fetch jobs for sitemap ${id}:`, error);
  }

  // Static pages only in first sitemap
  const staticPages =
    sitemapId === 0
      ? [
          { url: BASE_URL, lastmod: new Date(), priority: 1.0 },
          { url: `${BASE_URL}/jobs`, lastmod: new Date(), priority: 0.9 },
          { url: `${BASE_URL}/companies`, lastmod: new Date(), priority: 0.8 },
          {
            url: `${BASE_URL}/job-seekers`,
            lastmod: new Date(),
            priority: 0.8,
          },
          { url: `${BASE_URL}/employers`, lastmod: new Date(), priority: 0.8 },
          { url: `${BASE_URL}/blog`, lastmod: new Date(), priority: 0.7 },
          { url: `${BASE_URL}/contact`, lastmod: new Date(), priority: 0.5 },
        ]
      : [];

  const jobPages = jobs
    .filter((job) => job.slug)
    .map((job) => ({
      url: `${BASE_URL}/jobs/${job.slug}`,
      lastmod: new Date(job.$updatedAt || job.$createdAt),
      priority: 0.8,
    }));

  const allPages = [...staticPages, ...jobPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod.toISOString()}</lastmod>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
