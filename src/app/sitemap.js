// src/app/sitemap.js
const BASE_URL = "https://hiredup.me";

export default function sitemap() {
  // Return a sitemap index that points to individual sitemaps
  return [
    {
      url: `${BASE_URL}/sitemap/static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/sitemap/jobs.xml`,
      lastModified: new Date(),
    },
  ];
}
