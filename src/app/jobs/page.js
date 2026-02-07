import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getJobsPage, getExactJobCount } from "@/lib/appwrite";
import Link from "next/link";
import { headers } from "next/headers";
import { Suspense } from "react";
import JobListLogo from "@/components/JobListLogo";
import SearchBar from "@/components/SearchBar";

export const revalidate = 120;

// ============ COUNTRY / LOCALE HELPERS ============
const COUNTRY_LOCALE_MAP = {
  BD: { locale: "en_BD", name: "Bangladesh" },
  US: { locale: "en_US", name: "United States" },
  GB: { locale: "en_GB", name: "United Kingdom" },
  CA: { locale: "en_CA", name: "Canada" },
  AU: { locale: "en_AU", name: "Australia" },
  IN: { locale: "en_IN", name: "India" },
  DE: { locale: "de_DE", name: "Germany" },
  FR: { locale: "fr_FR", name: "France" },
  SG: { locale: "en_SG", name: "Singapore" },
  AE: { locale: "en_AE", name: "United Arab Emirates" },
  MY: { locale: "en_MY", name: "Malaysia" },
  PK: { locale: "en_PK", name: "Pakistan" },
  NL: { locale: "nl_NL", name: "Netherlands" },
  SE: { locale: "sv_SE", name: "Sweden" },
  IE: { locale: "en_IE", name: "Ireland" },
  NZ: { locale: "en_NZ", name: "New Zealand" },
  ZA: { locale: "en_ZA", name: "South Africa" },
  PH: { locale: "en_PH", name: "Philippines" },
};

function getLocaleForCountry(countryCode) {
  return COUNTRY_LOCALE_MAP[countryCode]?.locale || "en_GB";
}

function getCountryName(countryCode) {
  return COUNTRY_LOCALE_MAP[countryCode]?.name || "";
}

// ============ IP-API GEO LOOKUP ============
async function getUserCountry(ip) {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,countryCode`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return "";
    const data = await res.json();
    return data.status === "success" ? data.countryCode : "";
  } catch {
    return "";
  }
}

// ============ CAREERJET API HELPER ============
const CAREERJET_API_KEY = process.env.CAREERJET_API_KEY;
const CAREERJET_ENDPOINT = "https://search.api.careerjet.net/v4/query";

async function fetchCareerJetJobs(keywords, location = "", countryCode = "") {
  if (!CAREERJET_API_KEY || !keywords) return [];

  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const userIp = forwarded?.split(",")[0]?.trim() || "127.0.0.1";
    const userAgent = headersList.get("user-agent") || "Mozilla/5.0 HiredUp.me";

    // Use user's country as default location if none specified
    const searchLocation = location || getCountryName(countryCode);
    const localeCode = getLocaleForCountry(countryCode);

    const params = new URLSearchParams({
      locale_code: localeCode,
      keywords,
      sort: "relevance",
      page: "1",
      page_size: "15",
      fragment_size: "200",
      user_ip: userIp,
      user_agent: userAgent,
    });
    if (searchLocation) params.set("location", searchLocation);

    const credentials = Buffer.from(`${CAREERJET_API_KEY}:`).toString("base64");

    const response = await fetch(`${CAREERJET_ENDPOINT}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
        Referer: "https://hiredup.me",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (data.type !== "JOBS" || !data.jobs) return [];

    return data.jobs.map((cj, index) => ({
      $id: `cj_${index}_${Buffer.from(cj.url || "")
        .toString("base64url")
        .substring(0, 36)}`,
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

export default async function JobsPage({ searchParams }) {
  const params = await searchParams;
  const perPage = parseInt(params?.perPage || "25", 10);
  const validPerPage = [25, 50, 75, 100].includes(perPage) ? perPage : 25;
  const suspenseKey = `${params?.q || ""}-${params?.page || "1"}-${params?.type || ""}-${params?.location || ""}-${validPerPage}`;

  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 pt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-8 dark:text-white ">
              Browse Jobs
            </h1>

            {/* Search Box */}
            <SearchBar
              wrapperClassName="w-full max-w-4xl"
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 p-2"
            />

            {/* Popular Tags - hardcoded to match reference for now
            <div className="mt-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-xs text-slate-500">
              <span className="text-slate-400 font-medium">Popular:</span>
              <Link
                href="/jobs?q=UI+Design"
                className="hover:text-blue-600 transition-colors hover:underline decoration-slate-200 underline-offset-2"
              >
                UI Design
              </Link>
              <Link
                href="/jobs?q=React+Developer"
                className="hover:text-blue-600 transition-colors hover:underline decoration-slate-200 underline-offset-2"
              >
                React Developer
              </Link>
              <Link
                href="/jobs?q=Content+Writing"
                className="hover:text-blue-600 transition-colors hover:underline decoration-slate-200 underline-offset-2"
              >
                Content Writing
              </Link>
              <Link
                href="/jobs?q=SEO+Specialist"
                className="hover:text-blue-600 transition-colors hover:underline decoration-slate-200 underline-offset-2"
              >
                SEO Specialist
              </Link>
            </div> */}
          </div>

          {/* Job List — wrapped in Suspense so skeleton shows on every param change */}
          <Suspense key={suspenseKey} fallback={<JobListSkeleton />}>
            <JobResults params={params} perPage={validPerPage} />
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
    <>
      {/* Progress indicator */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Loading jobs...
            </span>
          </div>
        </div>
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 rounded-full animate-[loading-bar_2.5s_ease-in-out_infinite]"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
        <style jsx>{`
          @keyframes loading-bar {
            0% {
              width: 0%;
              opacity: 1;
            }
            50% {
              width: 70%;
              opacity: 1;
            }
            80% {
              width: 90%;
              opacity: 0.7;
            }
            100% {
              width: 100%;
              opacity: 0;
            }
          }
        `}</style>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 gap-4">
          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>

        {/* List items with staggered animation */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-5 flex gap-5 items-start animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 min-w-0 pt-0.5 space-y-3">
                <div className="flex justify-between">
                  <div
                    className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
                    style={{ width: `${45 + (i % 3) * 15}%` }}
                  />
                  <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div
                  className="h-3 bg-slate-100 dark:bg-slate-800 rounded"
                  style={{ width: `${30 + (i % 4) * 10}%` }}
                />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ============ PER-PAGE SELECTOR (client component) ============
function PerPageSelector({ current, params }) {
  const options = [25, 50, 75, 100];
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
      <span>Show:</span>
      <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-[2px] shadow-sm">
        {options.map((n) => {
          const qp = new URLSearchParams();
          if (params?.q) qp.set("q", params.q);
          if (params?.type) qp.set("type", params.type);
          if (params?.location) qp.set("location", params.location);
          qp.set("perPage", String(n));
          const isActive = current === n;
          return (
            <Link
              key={n}
              href={`/jobs?${qp.toString()}`}
              className={`px-2 py-0.5 rounded transition-colors ${
                isActive
                  ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {n}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ============ ASYNC JOB RESULTS COMPONENT ============
async function JobResults({ params, perPage = 25 }) {
  const typeFilter = params?.type || "";
  const searchQuery = params?.q || "";
  const locationFilter = params?.location || "";
  const page = parseInt(params?.page || "1", 10);

  // Detect user's country via ip-api.com (primary), headers as fallback
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const userIp = forwarded?.split(",")[0]?.trim() || "";
  const ipApiCountry = userIp ? await getUserCountry(userIp) : "";
  const userCountry =
    ipApiCountry ||
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    "";

  // Fetch Appwrite jobs, cached exact count, and (optionally) CareerJet in parallel
  const jobsPagePromise = getJobsPage({
    page,
    perPage,
    searchQuery,
    locationFilter,
    typeFilter,
  });

  // Exact count is cached (60s) so it's fast on subsequent loads
  const exactCountPromise =
    !searchQuery && !locationFilter && !typeFilter
      ? getExactJobCount()
      : Promise.resolve(null);

  const careerjetPromise = searchQuery
    ? fetchCareerJetJobs(
        searchQuery,
        locationFilter || typeFilter,
        userCountry,
      ).catch(() => [])
    : Promise.resolve([]);

  const [
    { documents: appwriteJobs, total: appwriteTotal },
    exactCount,
    careerjetJobs,
  ] = await Promise.all([jobsPagePromise, exactCountPromise, careerjetPromise]);

  // Use exact count when available, otherwise fall back to Appwrite's capped total
  const realAppwriteTotal = exactCount ?? appwriteTotal;
  const totalPages = Math.ceil(realAppwriteTotal / perPage);
  // Only count CareerJet in displayed total on page 1 where they actually appear
  const careerjetOnPage = searchQuery && page === 1 ? careerjetJobs.length : 0;
  const totalJobs = realAppwriteTotal + careerjetOnPage;

  let paginatedJobs = appwriteJobs.map((j) => ({ ...j, source: "appwrite" }));

  // When searching, show CareerJet results on page 1 after Appwrite results
  if (searchQuery && careerjetJobs.length > 0 && page === 1) {
    paginatedJobs = [...paginatedJobs, ...careerjetJobs];
  }

  if (paginatedJobs.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
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
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        {/* List Header / Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 gap-4">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            Showing {paginatedJobs.length} of {totalJobs} Jobs
          </span>
          <div className="flex items-center gap-5">
            <PerPageSelector current={perPage} params={params} />
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>
            <Link
              href="/jobs"
              className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors group"
            >
              Clear filters
              <iconify-icon
                icon="lucide:x"
                width="10"
                class="group-hover:text-red-500"
              ></iconify-icon>
            </Link>
          </div>
        </div>

        {/* Job Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {paginatedJobs.map((job) => {
            const isCareerJet = job.source === "careerjet";
            const href = isCareerJet
              ? `/jobs/${job.$id}?${new URLSearchParams({
                  title: job.title,
                  company: job.company,
                  location: job.location,
                  description: job.description,
                  salary: job.salary,
                  apply_url: job.apply_url,
                  source_site: job.source_site,
                  date: job.$createdAt,
                }).toString()}`
              : job.slug
                ? `/jobs/${job.slug}`
                : `/jobs/${job.$id}`;
            const logoUrl = isCareerJet ? null : getLogoUrl(job);
            const deadline = formatDeadline(job.deadline);

            return (
              <a
                key={job.$id}
                href={href}
                className="group relative p-5 hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer flex gap-5 items-start"
              >
                {/* Company Logo */}
                <JobListLogo
                  company={job.company}
                  logoUrl={logoUrl}
                  className="w-12 h-12 rounded-lg"
                />

                {/* Job Info */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 pr-4">
                      {job.title}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {formatTimeAgo(job.$createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {job.company || "Company"}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">
                      •
                    </span>
                    <span>{job.location || "Location not specified"}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Location Tag */}
                    {job.location?.toLowerCase().includes("remote") && (
                      <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-100 dark:border-emerald-800">
                        Remote
                      </span>
                    )}

                    {/* Salary Tag */}
                    {job.salary && (
                      <span className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium border border-slate-100 dark:border-slate-700 flex items-center gap-1">
                        <iconify-icon
                          icon="solar:wallet-linear"
                          width="10"
                        ></iconify-icon>
                        {job.salary}
                      </span>
                    )}

                    {/* Experience Tag */}
                    {job.experience && (
                      <span className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium border border-slate-100 dark:border-slate-700 flex items-center gap-1">
                        <iconify-icon
                          icon="solar:case-minimalistic-linear"
                          width="10"
                        ></iconify-icon>
                        {job.experience}
                      </span>
                    )}

                    {/* Deadline Tag */}
                    {deadline && (
                      <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-medium border border-amber-100 dark:border-amber-800 flex items-center gap-1">
                        <iconify-icon
                          icon="solar:clock-circle-linear"
                          width="10"
                        ></iconify-icon>
                        {deadline}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 ? (
            <Link
              href={`/jobs?page=${page - 1}${
                typeFilter ? `&type=${typeFilter}` : ""
              }${searchQuery ? `&q=${searchQuery}` : ""}${
                locationFilter ? `&location=${locationFilter}` : ""
              }${perPage !== 25 ? `&perPage=${perPage}` : ""}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-all text-xs"
            >
              <iconify-icon
                icon="lucide:chevron-left"
                width="14"
              ></iconify-icon>
            </Link>
          ) : (
            <button
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed text-xs"
            >
              <iconify-icon
                icon="lucide:chevron-left"
                width="14"
              ></iconify-icon>
            </button>
          )}

          <div className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
            Page {page} of {totalPages}
          </div>

          {page < totalPages ? (
            <Link
              href={`/jobs?page=${page + 1}${
                typeFilter ? `&type=${typeFilter}` : ""
              }${searchQuery ? `&q=${searchQuery}` : ""}${
                locationFilter ? `&location=${locationFilter}` : ""
              }${perPage !== 25 ? `&perPage=${perPage}` : ""}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-all text-xs"
            >
              <iconify-icon
                icon="lucide:chevron-right"
                width="14"
              ></iconify-icon>
            </Link>
          ) : (
            <button
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed text-xs"
            >
              <iconify-icon
                icon="lucide:chevron-right"
                width="14"
              ></iconify-icon>
            </button>
          )}
        </div>
      )}
    </>
  );
}
