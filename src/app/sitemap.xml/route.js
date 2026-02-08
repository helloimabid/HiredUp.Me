import { getExactJobCount } from "@/lib/appwrite";

const BASE_URL = "https://hiredup.me";
const JOBS_PER_SITEMAP = 10000;

export async function GET() {
  try {
    const totalJobs = await getExactJobCount();
    const numSitemaps = Math.ceil(totalJobs / JOBS_PER_SITEMAP);

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(
  { length: Math.max(numSitemaps, 3) },
  (_, i) => `  <sitemap>
    <loc>${BASE_URL}/sitemap-${i}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
).join("\n")}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return new Response("Error", { status: 500 });
  }
}
