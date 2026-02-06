import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllJobs } from "@/lib/appwrite";
import Link from "next/link";
import { headers } from "next/headers";
import { Suspense } from "react";
import JobListLogo from "@/components/JobListLogo";
import SearchBar from "@/components/SearchBar";

export const revalidate = 60;

// ============ CAREERJET API HELPER ============
const CAREERJET_API_KEY = process.env.CAREERJET_API_KEY;
const CAREERJET_ENDPOINT = "https://search.api.careerjet.net/v4/query";

async function fetchCareerJetJobs(keywords, location = "") {
  if (!CAREERJET_API_KEY || !keywords) return [];

  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const userIp = forwarded?.split(",")[0]?.trim() || "127.0.0.1";
    const userAgent = headersList.get("user-agent") || "Mozilla/5.0 HiredUp.me";

    const params = new URLSearchParams({
      locale_code: "en_GB",
      keywords,
      sort: "relevance",
      page: "1",
      page_size: "15",
      fragment_size: "200",
      user_ip: userIp,
      user_agent: userAgent,
    });
    if (location) params.set("location", location);

    const credentials = Buffer.from(`${CAREERJET_API_KEY}:`).toString("base64");

    const response = await fetch(`${CAREERJET_ENDPOINT}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (data.type !== "JOBS" || !data.jobs) return [];

    return data.jobs.map((cj) => ({
      $id: `cj_${Buffer.from(cj.url || "")
        .toString("base64url")
        .substring(0, 20)}`,
      title: cj.title || "Untitled",
      company: cj.company || "Unknown Company",
      location: cj.locations || "",
      description: cj.description || "",
      salary: cj.salary || "",
      experience: "",
      deadline: "",
      apply_url: cj.url || "",
      source: "careerjet",
      source_site: cj.site || "",
      $createdAt: cj.date || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("[CareerJet] Server-side fetch failed:", error.message);
    return [];
  }
}

// ============ JOBS PAGE SEO METADATA ============
export const metadata = {
  title: "Browse 10,000+ Jobs in Bangladesh & Remote | HiredUp.me",
  description:
    "Find your perfect job from 10,000+ opportunities in Dhaka, Chittagong, Sylhet & remote worldwide. Filter by industry, experience level, salary. Apply now on HiredUp.me!",
  keywords: [
    "job listings Bangladesh",
    "jobs in Dhaka",
    "remote jobs",
    "IT jobs Bangladesh",
    "fresher jobs",
    "experienced jobs",
    "part time jobs",
    "full time jobs",
    "contract jobs",
    "freelance work",
    "work from home",
  ],
  openGraph: {
    title: "Browse Jobs - Find Your Dream Career | HiredUp.me",
    description:
      "10,000+ job opportunities waiting for you. Software developers, designers, marketers, accountants & more.",
    url: "https://hiredup.me/jobs",
  },
  twitter: {
    title: "Browse Jobs on HiredUp.me",
    description: "Find your dream job from thousands of opportunities",
  },
  alternates: {
    canonical: "https://hiredup.me/jobs",
  },
};

// Helper to parse enhanced_json and get logo URL
function getLogoUrl(job) {
  if (!job.enhanced_json) return null;
  try {
    const enhanced = JSON.parse(job.enhanced_json);
    return enhanced?.company_logo_url || null;
  } catch {
    return null;
  }
}

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffHours < 1) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatDeadline(deadline) {
  if (!deadline) return null;
  // Check if deadline has passed
  try {
    const deadlineDate = new Date(
      deadline.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3"),
    );
    const now = new Date();
    if (deadlineDate < now) return null; // Don't show expired deadlines
  } catch {}
  return deadline;
}

async function fetchAllJobs() {
  try {
    const jobs = await getAllJobs();
    return jobs;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function JobsPage({ searchParams }) {
  const params = await searchParams;
  const suspenseKey = `${params?.q || ""}-${params?.page || "1"}-${params?.type || ""}-${params?.location || ""}`;

  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 pt-8 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-1">
              Browse Jobs
            </h1>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Job List — wrapped in Suspense so skeleton shows on every param change */}
          <Suspense key={suspenseKey} fallback={<JobListSkeleton />}>
            <JobResults params={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ============ LOADING SKELETON ============
function JobListSkeleton() {
  return (
    <div className="mt-2">
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {/* List header skeleton */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
          <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        {/* Job item skeletons */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ASYNC JOB RESULTS COMPONENT ============
async function JobResults({ params }) {
  const jobs = await fetchAllJobs();
  const typeFilter = params?.type || "";
  const searchQuery = params?.q || "";
  const locationFilter = params?.location || "";
  const page = parseInt(params?.page || "1", 10);
  const perPage = 25;

  // Filter Appwrite jobs based on query params
  let filteredJobs = jobs.map((j) => ({ ...j, source: "appwrite" }));

  if (typeFilter) {
    filteredJobs = filteredJobs.filter((job) =>
      job.location?.toLowerCase().includes(typeFilter.toLowerCase()),
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.salary?.toLowerCase().includes(query) ||
        job.experience?.toLowerCase().includes(query),
    );
  }

  // Fetch CareerJet results when user is searching
  let careerjetJobs = [];
  if (searchQuery) {
    try {
      careerjetJobs = await fetchCareerJetJobs(
        searchQuery,
        locationFilter || typeFilter,
      );
    } catch {
      // silently fail
    }
  }

  // Merge: Appwrite results first, then CareerJet
  const allResults = [...filteredJobs, ...careerjetJobs];

  // Pagination
  const totalJobs = allResults.length;
  const totalPages = Math.ceil(totalJobs / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedJobs = allResults.slice(startIndex, startIndex + perPage);

  if (paginatedJobs.length === 0) {
    return (
      <div className="text-center py-20">
        <iconify-icon
          icon="solar:magnifer-linear"
          class="text-slate-300 dark:text-slate-600 text-6xl mb-4"
        ></iconify-icon>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No jobs found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Try adjusting your search or filters
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
        >
          View all jobs
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mt-2 space-y-px bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
        {/* List Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Showing {paginatedJobs.length} of {totalJobs} jobs
            {searchQuery && careerjetJobs.length > 0 && (
              <span className="text-indigo-500 dark:text-indigo-400 ml-1">
                ({careerjetJobs.length} from CareerJet)
              </span>
            )}
          </span>
          {(typeFilter || searchQuery) && (
            <Link
              href="/jobs"
              className="text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
            >
              Clear filters
            </Link>
          )}
        </div>

        {/* Job Items */}
        {paginatedJobs.map((job) => {
          const isCareerJet = job.source === "careerjet";
          const href = isCareerJet
            ? job.apply_url
            : job.slug
              ? `/jobs/${job.slug}`
              : `/jobs/${job.$id}`;
          const logoUrl = isCareerJet ? null : getLogoUrl(job);
          const deadline = formatDeadline(job.deadline);

          const linkProps = isCareerJet
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <a
              key={job.$id}
              href={href}
              {...linkProps}
              className="group relative flex items-start gap-4 p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {/* Company Logo */}
              <JobListLogo company={job.company} logoUrl={logoUrl} />

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {job.title}
                  </h3>
                  {isCareerJet && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 flex items-center gap-0.5">
                      <iconify-icon
                        icon="solar:global-linear"
                        width="10"
                      ></iconify-icon>
                      CareerJet
                    </span>
                  )}
                  {job.location?.toLowerCase().includes("remote") && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                      Remote
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                  <span>{job.company || "Company"}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>{job.location || "Location not specified"}</span>
                  {isCareerJet && job.source_site && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600">
                        •
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">
                        {job.source_site}
                      </span>
                    </>
                  )}
                </p>

                {/* Extra info row: salary, experience, deadline */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                  {job.salary && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <iconify-icon
                        icon="solar:wallet-linear"
                        width="12"
                      ></iconify-icon>
                      {job.salary}
                    </span>
                  )}
                  {job.experience && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <iconify-icon
                        icon="solar:case-minimalistic-linear"
                        width="12"
                      ></iconify-icon>
                      {job.experience}
                    </span>
                  )}
                  {deadline && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <iconify-icon
                        icon="solar:clock-circle-linear"
                        width="12"
                      ></iconify-icon>
                      Deadline: {deadline}
                    </span>
                  )}
                  {isCareerJet && (
                    <span className="text-[11px] text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                      <iconify-icon
                        icon="solar:square-top-down-linear"
                        width="12"
                      ></iconify-icon>
                      External
                    </span>
                  )}
                </div>
              </div>

              {/* Time Ago / External icon */}
              <div className="text-xs text-slate-400 whitespace-nowrap tabular-nums shrink-0 mt-0.5 flex items-center gap-1">
                {isCareerJet ? (
                  <iconify-icon
                    icon="solar:square-top-down-linear"
                    class="text-slate-400"
                    width="14"
                  ></iconify-icon>
                ) : (
                  formatTimeAgo(job.$createdAt)
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
          {page > 1 ? (
            <Link
              href={`/jobs?page=${page - 1}${typeFilter ? `&type=${typeFilter}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
              className="h-9 px-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors inline-flex items-center"
            >
              Previous
            </Link>
          ) : (
            <button
              disabled
              className="h-9 px-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 text-xs font-medium opacity-50 cursor-not-allowed"
            >
              Previous
            </button>
          )}

          <div className="hidden sm:flex text-xs text-slate-500 dark:text-slate-400 font-medium">
            Page {page} of {totalPages}
          </div>

          {page < totalPages ? (
            <Link
              href={`/jobs?page=${page + 1}${typeFilter ? `&type=${typeFilter}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
              className="h-9 px-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors inline-flex items-center"
            >
              Next
            </Link>
          ) : (
            <button
              disabled
              className="h-9 px-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 text-xs font-medium opacity-50 cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      )}
    </>
  );
}
