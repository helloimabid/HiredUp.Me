import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllJobs } from "@/lib/appwrite";
import Link from "next/link";
import JobListLogo from "@/components/JobListLogo";

export const revalidate = 60;

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
  const jobs = await fetchAllJobs();
  const params = await searchParams;
  const typeFilter = params?.type || "";
  const searchQuery = params?.q || "";
  const page = parseInt(params?.page || "1", 10);
  const perPage = 25;

  // Filter jobs based on query params
  let filteredJobs = jobs;

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
        job.description?.toLowerCase().includes(query),
    );
  }

  // Pagination
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + perPage);

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
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Find your next opportunity from{" "}
              <span className="text-slate-900 dark:text-white font-medium">
                {jobs.length}
              </span>{" "}
              available positions
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="sticky top-14 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm pb-4 pt-1 border-b border-transparent">
            <form className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <iconify-icon
                    icon="solar:magnifer-linear"
                    class="text-slate-400"
                  ></iconify-icon>
                </div>
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search jobs..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:border-transparent placeholder-slate-400"
                />
              </div>
              <select
                name="type"
                defaultValue={typeFilter}
                className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="dhaka">Dhaka</option>
              </select>
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white text-xs font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Job List */}
          {paginatedJobs.length > 0 ? (
            <>
              <div className="mt-2 space-y-px bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                {/* List Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Showing {paginatedJobs.length} of {totalJobs} jobs
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
                  const href = job.slug
                    ? `/jobs/${job.slug}`
                    : `/jobs/${job.$id}`;
                  const logoUrl = getLogoUrl(job);

                  return (
                    <Link
                      key={job.$id}
                      href={href}
                      className="group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {/* Company Logo */}
                      <JobListLogo company={job.company} logoUrl={logoUrl} />

                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {job.title}
                          </h3>
                          {job.location?.toLowerCase().includes("remote") && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                              Remote
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                          <span>{job.company || "Company"}</span>
                          <span className="text-slate-300 dark:text-slate-600">
                            •
                          </span>
                          <span>
                            {job.location || "Location not specified"}
                          </span>
                        </p>
                      </div>

                      {/* Time Ago */}
                      <div className="text-xs text-slate-400 whitespace-nowrap tabular-nums">
                        {formatTimeAgo(job.$createdAt)}
                      </div>
                    </Link>
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
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
