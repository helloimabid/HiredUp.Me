// src/app/jobs/categories/page.js
// Hub page linking to all category and location pages — great for SEO crawlability

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { JOB_CATEGORIES, JOB_LOCATIONS } from "@/lib/job-categories";

export const metadata = {
  title: "Browse Jobs by Category & Location in Bangladesh | HiredUp.me",
  description:
    "Find jobs by category or location in Bangladesh. Software developer, marketing, accounting, HR, sales jobs in Dhaka, Chittagong, Sylhet & remote.",
  alternates: { canonical: "https://hiredup.me/jobs/categories" },
  openGraph: {
    title: "Browse Jobs by Category & Location | HiredUp.me",
    description:
      "Find the right job for you. Browse by industry, role, or city in Bangladesh.",
    url: "https://hiredup.me/jobs/categories",
    siteName: "HiredUp.me",
  },
  robots: { index: true, follow: true },
};

export default function CategoriesHubPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen pb-20 bg-white dark:bg-slate-900">
        {/* Hero */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-3">
              Browse Jobs by Category & Location
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Find your perfect role in Bangladesh. Explore jobs by industry,
              role type, or city.
            </p>
            <Link
              href="/jobs"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <iconify-icon icon="solar:magnifer-linear"></iconify-icon>
              Search all jobs
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories Section */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Browse by Job Category
              </h2>
              <span className="text-xs text-slate-400">
                {JOB_CATEGORIES.length} categories
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {JOB_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/jobs/category/${cat.slug}`}
                  className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all duration-150"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                    <iconify-icon
                      icon={cat.icon}
                      class="text-indigo-600 dark:text-indigo-400 text-xl"
                    ></iconify-icon>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.plural}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {cat.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Locations Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Browse by Location
              </h2>
              <span className="text-xs text-slate-400">
                {JOB_LOCATIONS.length} locations
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {JOB_LOCATIONS.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/jobs/location/${loc.slug}`}
                  className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-300 dark:hover:border-green-600 hover:shadow-sm transition-all duration-150"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                    <iconify-icon
                      icon="solar:map-point-linear"
                      class="text-green-600 dark:text-green-400 text-xl"
                    ></iconify-icon>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Jobs in {loc.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {loc.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Popular Cross-searches */}
          <section className="mt-14 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Software Developer in Dhaka",
                  href: "/jobs?q=software+developer&location=Dhaka",
                },
                { label: "Remote IT Jobs", href: "/jobs/category/remote-jobs" },
                {
                  label: "Marketing Jobs Dhaka",
                  href: "/jobs?q=marketing&location=Dhaka",
                },
                {
                  label: "Fresher Jobs Bangladesh",
                  href: "/jobs/category/fresher-jobs",
                },
                {
                  label: "Accounting Jobs",
                  href: "/jobs/category/accounting-finance-jobs",
                },
                { label: "HR Jobs Dhaka", href: "/jobs?q=HR&location=Dhaka" },
                {
                  label: "Sales Jobs Bangladesh",
                  href: "/jobs/category/sales-jobs",
                },
                {
                  label: "UI/UX Designer Jobs",
                  href: "/jobs?q=UI+UX+designer",
                },
                {
                  label: "Data Analyst Jobs",
                  href: "/jobs/category/data-analyst-jobs",
                },
                {
                  label: "Customer Service Chittagong",
                  href: "/jobs?q=customer+service&location=Chittagong",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
