"use server";

import { getJobsPage } from "@/lib/appwrite";
import { headers } from "next/headers";

// Re-use your CareerJet helper here (copy-paste the helper function or import it if you move it to a lib file)
// For simplicity, I will assume you move the fetchCareerJetJobs logic to a shared lib or keep it here.
const CAREERJET_API_KEY = process.env.CAREERJET_API_KEY;
const CAREERJET_ENDPOINT = "https://search.api.careerjet.net/v4/query";

async function fetchCareerJetJobs(keywords, location, userIp, userAgent) {
  if (!CAREERJET_API_KEY || !keywords) return [];
  try {
    const params = new URLSearchParams({
      locale_code: "en_GB", // Simplified for brevity, use your helper logic
      keywords,
      location: location || "Bangladesh",
      sort: "relevance",
      page: "1",
      user_ip: userIp,
      user_agent: userAgent,
    });

    const credentials = Buffer.from(`${CAREERJET_API_KEY}:`).toString("base64");
    const res = await fetch(`${CAREERJET_ENDPOINT}?${params}`, {
      headers: { Authorization: `Basic ${credentials}` },
    });
    const data = await res.json();

    if (!data.jobs) return [];

    return data.jobs.map((cj, index) => ({
      $id: `cj_${Date.now()}_${index}`,
      title: cj.title,
      company: cj.company,
      location: cj.locations,
      description: cj.description,
      salary: cj.salary,
      apply_url: cj.url,
      source: "careerjet",
      $createdAt: cj.date,
    }));
  } catch (e) {
    return [];
  }
}

export async function fetchJobBatch(page, perPage, params) {
  const searchQuery = params?.q || "";
  const locationFilter = params?.location || "";
  const typeFilter = params?.type || "";

  // 1. Fetch Appwrite Jobs
  const appwritePromise = getJobsPage({
    page,
    perPage,
    searchQuery,
    locationFilter,
    typeFilter,
  });

  // 2. Fetch CareerJet (Only on page 1 and if needed)
  let careerjetPromise = Promise.resolve([]);
  if (page === 1) {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const agent = headersList.get("user-agent") || "HiredUp";

    const cjKeywords = searchQuery || "Accountant Finance";
    careerjetPromise = fetchCareerJetJobs(
      cjKeywords,
      locationFilter,
      ip,
      agent,
    );
  }

  const [appwriteResult, careerjetJobs] = await Promise.all([
    appwritePromise,
    careerjetPromise,
  ]);

  // 3. Merge Logic
  let appwriteTagged = appwriteResult.documents.map((j) => ({
    ...j,
    source: j.source || "appwrite",
  }));

  // Remove duplicates
  const cjUrls = new Set(careerjetJobs.map((j) => j.apply_url));
  appwriteTagged = appwriteTagged.filter(
    (j) => !(j.source === "careerjet" && cjUrls.has(j.apply_url)),
  );

  const merged =
    page === 1 ? [...careerjetJobs, ...appwriteTagged] : appwriteTagged;

  return {
    jobs: merged,
    total: appwriteResult.total + (page === 1 ? careerjetJobs.length : 0),
    hasMore: merged.length >= perPage, // Simple check for next page availability
  };
}
