// src/app/jobs/page.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { fetchJobBatch } from "@/app/actions";
import JobFeed from "@/components/JobFeed";
import { JOB_CATEGORIES, JOB_LOCATIONS } from "@/lib/job-categories";

export const metadata = {
  title: "Browse 10,000+ Jobs in Bangladesh & Remote | HiredUp.me",
  description:
    "Find your perfect job from 10,000+ opportunities in Dhaka, Chittagong, Sylhet & remote worldwide. Updated daily with fresh listings. Apply now on HiredUp.me!",
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
    "latest jobs Bangladesh",
    "new job openings",
  ],
  openGraph: {
    title: "Browse Jobs - Find Your Dream Career | HiredUp.me",
    description:
      "10,000+ job opportunities waiting for you. Software developers, designers, marketers, accountants & more. Updated daily.",
    url: "https://hiredup.me/jobs",
    images: [
      {
        url: "https://hiredup.me/og-jobs.png",
        width: 1200,
        height: 630,
        alt: "Browse thousands of jobs on HiredUp.me",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Jobs on HiredUp.me",
    description:
      "Find your dream job from thousands of opportunities. Updated daily.",
    images: ["https://hiredup.me/og-jobs.png"],
  },
  alternates: { canonical: "https://hiredup.me/jobs" },
  robots: {
    index: true,
    follow: true,
    maxImagePreview: "large",
    maxSnippet: -1,
  },
};

export default async function JobsPage({ searchParams }) {
  const params = await searchParams;
  const { jobs } = await fetchJobBatch(1, 25, params);

  const hasSearch = params?.q || params?.location || params?.category;
  const activeCategory = params?.category || null;
  const activeLocation = params?.location || null;

  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 pt-10 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title + Search */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white mb-2">
              Browse Jobs
            </h1>
            {hasSearch && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {jobs.length > 0
                  ? `Found ${jobs.length}+ matching opportunities`
                  : "Refine your search to find more jobs"}
              </p>
            )}
            <SearchBar wrapperClassName="w-full max-w-4xl" />
          </div>

          {/* ── Category Filter Chips ─────────────────────────────────── */}
          <div className="mb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {/* All Jobs chip */}
              <Link
                href="/jobs"
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  !activeCategory && !activeLocation && !params?.q
                    ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <iconify-icon
                  icon="solar:case-minimalistic-linear"
                  class="text-sm"
                ></iconify-icon>
                All Jobs
              </Link>

              {JOB_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={`/jobs/category/${cat.slug}`}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    <iconify-icon
                      icon={cat.icon}
                      class="text-sm"
                    ></iconify-icon>
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Location Filter Pills ─────────────────────────────────── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1 mb-8">
            <span className="flex-shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500 mr-1">
              📍
            </span>
            {JOB_LOCATIONS.map((loc) => {
              const isActive = activeLocation === loc.label;
              return (
                <Link
                  key={loc.slug}
                  href={`/jobs/location/${loc.slug}`}
                  className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  {loc.label}
                </Link>
              );
            })}

            {/* Link to full categories hub */}
            <Link
              href="/jobs/category"
              className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all whitespace-nowrap ml-1"
            >
              Browse all →
            </Link>
          </div>

          {/* No results message */}
          {jobs.length === 0 && hasSearch && (
            <div className="w-full mb-8 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No exact matches found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Try broadening your search or browse all available positions
                below
              </p>
              <Link
                href="/jobs"
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
              >
                View all jobs →
              </Link>
            </div>
          )}

          {/* Job Feed */}
          <JobFeed initialJobs={jobs} searchParams={params} />

          {/* ── Bottom SEO links — categories hub ────────────────────── */}
          <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">
              Browse Jobs by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
              {JOB_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/jobs/category/${cat.slug}`}
                  className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-sm text-slate-700 dark:text-slate-300 group"
                >
                  <iconify-icon
                    icon={cat.icon}
                    class="text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0"
                  ></iconify-icon>
                  <span className="truncate text-xs">{cat.plural}</span>
                </Link>
              ))}
            </div>

            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Browse Jobs by Location
            </h2>
            <div className="flex flex-wrap gap-2">
              {JOB_LOCATIONS.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/jobs/location/${loc.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 text-sm text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-all"
                >
                  <iconify-icon
                    icon="solar:map-point-linear"
                    class="text-sm"
                  ></iconify-icon>
                  Jobs in {loc.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
