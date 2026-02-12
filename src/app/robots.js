export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/login",
          "/signup",
          "/auth/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/"],
      },
    ],
    sitemap: "https://hiredup.me/sitemap.xml", // This will now be a sitemap index
    host: "https://hiredup.me",
  };
}
