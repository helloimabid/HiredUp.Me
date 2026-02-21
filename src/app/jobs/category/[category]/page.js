// src/app/jobs/category/[category]/page.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobs } from "@/lib/appwrite";
import {
  JOB_CATEGORIES,
  getCategoryBySlug,
  filterJobsByCategory,
} from "@/lib/job-categories";

export const revalidate = 3600;

export async function generateStaticParams() {
  return JOB_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

function getTimeAgo(date) {
  const diffDays = Math.floor(
    (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Date(date).toLocaleDateString();
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Not Found" };
  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    keywords: [...(cat.industryMatch || []), ...(cat.titleMatch || [])].join(
      ", ",
    ),
    alternates: { canonical: `https://hiredup.me/jobs/category/${slug}` },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      url: `https://hiredup.me/jobs/category/${slug}`,
      siteName: "HiredUp.me",
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const allJobs = await getJobs(200);
  // Uses enhanced_json industry/skills/experienceLevel as primary signal
  const filteredJobs = filterJobsByCategory(allJobs, cat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.plural,
    description: cat.description,
    url: `https://hiredup.me/jobs/category/${slug}`,
    numberOfItems: filteredJobs.length,
    itemListElement: filteredJobs.slice(0, 10).map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        hiringOrganization: { "@type": "Organization", name: job.company },
        jobLocation: {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressLocality: job.location },
        },
        url: `https://hiredup.me/jobs/${job.slug || job.$id}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen pb-20 bg-white dark:bg-slate-900">
        {/* Hero */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <nav className="flex text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    href="/jobs"
                    className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Jobs
                  </Link>
                </li>
                <li>/</li>
                <li className="text-slate-900 dark:text-white">{cat.label}</li>
              </ol>
            </nav>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <iconify-icon
                  icon={cat.icon}
                  class="text-indigo-600 dark:text-indigo-400 text-2xl"
                ></iconify-icon>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-2">
                  {cat.plural} in Bangladesh
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                  {cat.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {filteredJobs.length} open positions
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Updated daily
                  </span>
                </div>
              </div>
            </div>

            {/* Skill tags as visual keywords */}
            <div className="flex flex-wrap gap-2 mt-6">
              {(cat.skillMatch || cat.titleMatch || [])
                .slice(0, 8)
                .map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs bg-white dark:bg-slate-800"
                  >
                    {kw}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Latest {cat.label} Jobs
            </h2>
            <Link
              href={`/jobs?q=${encodeURIComponent(cat.titleMatch?.[0] || cat.label)}`}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Search all →
            </Link>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <iconify-icon
                icon="solar:case-minimalistic-linear"
                class="text-4xl mb-3 opacity-40"
              ></iconify-icon>
              <p className="text-sm">
                No {cat.label} jobs found right now. Check back soon!
              </p>
              <Link
                href="/jobs"
                className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
              >
                Browse all jobs →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <Link
                  key={job.$id}
                  href={`/jobs/${job.slug || job.$id}`}
                  className="block group"
                >
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all duration-150">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <iconify-icon icon="solar:map-point-linear"></iconify-icon>
                              {job.location}
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <iconify-icon icon="solar:wallet-linear"></iconify-icon>
                              {job.salary}
                            </span>
                          )}
                          <span>{getTimeAgo(job.$createdAt)}</span>
                        </div>
                      </div>
                      <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                        Apply →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href={`/jobs?q=${encodeURIComponent(cat.titleMatch?.[0] || cat.label)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
            >
              Browse All {cat.label} Jobs
              <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
            </Link>
          </div>
        </div>

        {/* Related Categories */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
              Browse Other Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {JOB_CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/jobs/category/${c.slug}`}
                  className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-sm text-slate-700 dark:text-slate-300 group"
                >
                  <iconify-icon
                    icon={c.icon}
                    class="text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0"
                  ></iconify-icon>
                  <span className="truncate">{c.label}</span>
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
