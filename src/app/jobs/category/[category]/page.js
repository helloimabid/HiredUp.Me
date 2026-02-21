// src/app/jobs/category/[category]/page.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getJobs } from "@/lib/appwrite";
import {
  JOB_CATEGORIES,
  JOB_LOCATIONS,
  getCategoryBySlug,
  filterJobsByCategory,
} from "@/lib/job-categories";

export const revalidate = 3600;

export async function generateStaticParams() {
  return JOB_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeAgo(date) {
  if (!date) return "";
  const diffDays = Math.floor(
    (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function parseEnhanced(job) {
  if (!job?.enhanced_json) return null;
  if (typeof job.enhanced_json === "object" && job.enhanced_json !== null)
    return job.enhanced_json;
  try {
    return JSON.parse(job.enhanced_json);
  } catch {
    return null;
  }
}

function getJobMeta(job) {
  try {
    const e = parseEnhanced(job);
    if (!e) return {};
    const qi = Array.isArray(e.quick_info) ? e.quick_info : [];
    const get = (label) => {
      const item = qi.find(
        (q) => q?.label?.toLowerCase() === label.toLowerCase(),
      );
      return typeof item?.value === "string" ? item.value : "";
    };
    return {
      logo: e.company_logo_url || null,
      workType: get("Work Type"),
      experience: get("Experience"),
      salary: get("Salary"),
    };
  } catch {
    return {};
  }
}

function buildStats(jobs) {
  const workTypes = {};
  const experienceLevels = {};
  for (const job of jobs) {
    const { workType, experience } = getJobMeta(job);
    if (workType) workTypes[workType] = (workTypes[workType] || 0) + 1;
    if (experience) {
      const key = experience.charAt(0).toUpperCase() + experience.slice(1);
      experienceLevels[key] = (experienceLevels[key] || 0) + 1;
    }
  }
  return { workTypes, experienceLevels };
}

const WORK_TYPE_COLORS = {
  Remote:
    "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  Hybrid:
    "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  "On-site":
    "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

const EXP_COLORS = {
  entry:
    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
  mid: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400",
  senior:
    "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
};

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Not Found" };

  const keywords = [
    ...(cat.industryMatch || []),
    ...(cat.titleMatch || []),
    ...(cat.skillMatch || []).slice(0, 6),
    "jobs in bangladesh",
    "job vacancy bd",
    "find jobs",
    "bangladesh job portal",
  ].join(", ");

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    keywords,
    alternates: { canonical: `https://hiredup.me/jobs/category/${slug}` },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      url: `https://hiredup.me/jobs/category/${slug}`,
      siteName: "HiredUp.me",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: cat.metaTitle,
      description: cat.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const allJobs = await getJobs(300);
  const filteredJobs = filterJobsByCategory(allJobs, cat);
  const stats = buildStats(filteredJobs);
  const relatedCategories = JOB_CATEGORIES.filter((c) => c.slug !== slug).slice(
    0,
    8,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.plural + " in Bangladesh",
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
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressCountry: "BD",
          },
        },
        url: `https://hiredup.me/jobs/${job.slug || job.$id}`,
        datePosted: job.$createdAt,
      },
    })),
  };

  const heroTags = [
    ...new Set([
      ...(cat.skillMatch || []).slice(0, 4),
      ...(cat.titleMatch || []).slice(0, 4),
    ]),
  ].slice(0, 7);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen bg-white dark:bg-slate-900">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="text-xs text-slate-500 dark:text-slate-400 mb-7"
            >
              <ol className="flex items-center gap-1.5 flex-wrap">
                <li>
                  <Link
                    href="/"
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/jobs"
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/jobs/categories"
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white font-medium">
                  {cat.label}
                </li>
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <iconify-icon
                    icon={cat.icon}
                    class="text-indigo-600 dark:text-indigo-400 text-2xl"
                  ></iconify-icon>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    {cat.plural} in Bangladesh
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 max-w-xl leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                      <iconify-icon
                        icon="solar:case-minimalistic-bold"
                        class="text-indigo-500"
                      ></iconify-icon>
                      {filteredJobs.length} open positions
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">
                      •
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <iconify-icon
                        icon="solar:refresh-circle-linear"
                        class="text-slate-400"
                      ></iconify-icon>
                      Updated daily
                    </span>
                    {Object.entries(stats.workTypes)
                      .slice(0, 2)
                      .map(([type, count]) => (
                        <span
                          key={type}
                          className="text-xs text-slate-500 dark:text-slate-400"
                        >
                          {count} {type.toLowerCase()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href={`/jobs?q=${encodeURIComponent(cat.titleMatch?.[0] || cat.label)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
                >
                  <iconify-icon icon="solar:magnifer-linear"></iconify-icon>
                  Search {cat.label} jobs
                </Link>
              </div>
            </div>

            {/* Keyword tag cloud */}
            {heroTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {heroTags.map((kw) => (
                  <Link
                    key={kw}
                    href={`/jobs?q=${encodeURIComponent(kw)}`}
                    className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* ── Job Listings ───────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Latest {cat.label} Jobs
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({filteredJobs.length})
                  </span>
                </h2>
                <Link
                  href={`/jobs?q=${encodeURIComponent(cat.titleMatch?.[0] || cat.label)}`}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  See all{" "}
                  <iconify-icon
                    icon="solar:arrow-right-linear"
                    class="text-xs"
                  ></iconify-icon>
                </Link>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <iconify-icon
                      icon={cat.icon}
                      class="text-3xl text-slate-300 dark:text-slate-600"
                    ></iconify-icon>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    No {cat.label} jobs right now
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    New positions are posted daily. Check back soon or search
                    all jobs.
                  </p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <iconify-icon icon="solar:magnifer-linear"></iconify-icon>
                    Browse all jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredJobs.map((job) => {
                    const { logo, workType, experience } = getJobMeta(job);
                    const expKey = (experience || "").toLowerCase();
                    return (
                      <Link
                        key={job.$id}
                        href={`/jobs/${job.slug || job.$id}`}
                        className="block group"
                      >
                        <article className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all duration-150">
                          <div className="flex items-start gap-3">
                            {/* Company logo */}
                            <div className="w-10 h-10 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {logo ? (
                                <img
                                  src={logo}
                                  alt={`${job.company} logo`}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 select-none">
                                  {String(job.company || "?")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                    {job.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {job.company}
                                  </p>
                                </div>
                                <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                  Apply →
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                {job.location && (
                                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                    <iconify-icon
                                      icon="solar:map-point-linear"
                                      class="text-xs"
                                    ></iconify-icon>
                                    {job.location}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                    <iconify-icon
                                      icon="solar:wallet-linear"
                                      class="text-xs"
                                    ></iconify-icon>
                                    {job.salary}
                                  </span>
                                )}
                                {workType && (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs border ${WORK_TYPE_COLORS[workType] || "bg-slate-50 dark:bg-slate-700/50 text-slate-500 border-slate-200 dark:border-slate-600"}`}
                                  >
                                    {workType}
                                  </span>
                                )}
                                {expKey && EXP_COLORS[expKey] && (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${EXP_COLORS[expKey]}`}
                                  >
                                    {expKey === "entry"
                                      ? "Fresher"
                                      : expKey === "mid"
                                        ? "Mid-level"
                                        : "Senior"}
                                  </span>
                                )}
                                <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
                                  {getTimeAgo(job.$createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}

              {filteredJobs.length > 0 && (
                <div className="mt-8 text-center">
                  <Link
                    href={`/jobs?q=${encodeURIComponent(cat.titleMatch?.[0] || cat.label)}`}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Browse All {cat.label} Jobs
                    <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
                  </Link>
                </div>
              )}

              {/* SEO FAQ */}
              <section className="mt-14" aria-labelledby="faq-heading">
                <h2
                  id="faq-heading"
                  className="text-base font-semibold text-slate-900 dark:text-white mb-5"
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      q: `How many ${cat.label} jobs are available in Bangladesh?`,
                      a: `There are currently ${filteredJobs.length} ${cat.label} job${filteredJobs.length !== 1 ? "s" : ""} listed on HiredUp.me. New positions are added daily across Dhaka, Chittagong, Sylhet, and remote roles across Bangladesh.`,
                    },
                    {
                      q: `How do I find ${cat.label} jobs in Dhaka?`,
                      a: `Browse ${cat.label} vacancies on HiredUp.me and filter by location. You can search specifically for positions in Dhaka, Chittagong, Sylhet, or Rajshahi — or search for remote jobs you can do from anywhere in Bangladesh.`,
                    },
                    {
                      q: `What qualifications do I need for ${cat.label} jobs?`,
                      a: `Requirements vary by employer and role level. Entry-level ${cat.label} positions often require a relevant bachelor's degree, while senior roles typically ask for 3–7 years of experience. Check individual job postings on HiredUp.me for specific requirements.`,
                    },
                    {
                      q: `Are there remote ${cat.label} jobs in Bangladesh?`,
                      a: `Yes — remote and hybrid ${cat.label} positions are available on HiredUp.me. Browse the Remote Jobs category or filter your search by "Remote" work type to find work-from-home opportunities in Bangladesh.`,
                    },
                  ].map((faq, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Keyword-rich closing paragraph */}
                <div className="mt-8 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    HiredUp.me is Bangladesh&apos;s growing job portal BD for
                    finding{" "}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {cat.label.toLowerCase()} job vacancies
                    </strong>
                    . Whether you&apos;re looking for fresher entry-level
                    positions or senior roles, browse the latest employment
                    opportunities in Bangladesh and apply directly to top
                    employers. Our platform connects job seekers with
                    {cat.label.toLowerCase()} jobs in Dhaka, Chittagong, Sylhet,
                    Rajshahi, and remote positions — updated daily with new job
                    postings from leading companies across Bangladesh.
                  </p>
                </div>
              </section>
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Breakdown stats */}
                {filteredJobs.length > 0 && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                      Job Breakdown
                    </h3>

                    {Object.keys(stats.workTypes).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide font-medium mb-2">
                          Work type
                        </p>
                        <div className="space-y-1.5">
                          {Object.entries(stats.workTypes)
                            .sort((a, b) => b[1] - a[1])
                            .map(([type, count]) => (
                              <div
                                key={type}
                                className="flex items-center justify-between"
                              >
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs border ${WORK_TYPE_COLORS[type] || "bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"}`}
                                >
                                  {type}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs">
                                  {count} jobs
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {Object.keys(stats.experienceLevels).length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide font-medium mb-2">
                          Experience
                        </p>
                        <div className="space-y-1.5">
                          {Object.entries(stats.experienceLevels)
                            .sort((a, b) => b[1] - a[1])
                            .map(([level, count]) => (
                              <div
                                key={level}
                                className="flex items-center justify-between"
                              >
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs ${EXP_COLORS[level.toLowerCase()] || "bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300"}`}
                                >
                                  {level}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs">
                                  {count} jobs
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Jobs by city */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                    {cat.label} Jobs by City
                  </h3>
                  <div className="space-y-1">
                    {JOB_LOCATIONS.map((loc) => (
                      <Link
                        key={loc.slug}
                        href={`/jobs?q=${encodeURIComponent(cat.titleMatch?.[0] || cat.label)}&location=${encodeURIComponent(loc.label)}`}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-sm text-slate-700 dark:text-slate-300"
                      >
                        <iconify-icon
                          icon="solar:map-point-linear"
                          class="text-slate-400 group-hover:text-indigo-500 flex-shrink-0 transition-colors text-xs"
                        ></iconify-icon>
                        <span className="text-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cat.label} in {loc.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Related Categories */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                    Related Categories
                  </h3>
                  <div className="space-y-1">
                    {relatedCategories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/jobs/category/${c.slug}`}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                      >
                        <iconify-icon
                          icon={c.icon}
                          class="text-slate-400 group-hover:text-indigo-500 flex-shrink-0 transition-colors text-sm"
                        ></iconify-icon>
                        <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {c.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/jobs/categories"
                    className="mt-3 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline pl-2"
                  >
                    View all categories{" "}
                    <iconify-icon
                      icon="solar:arrow-right-linear"
                      class="text-xs"
                    ></iconify-icon>
                  </Link>
                </div>

                {/* Employer CTA */}
                <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-5">
                  <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                    Hiring {cat.label}?
                  </p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-4 leading-relaxed">
                    Post your job on HiredUp.me and reach thousands of qualified
                    candidates in Bangladesh.
                  </p>
                  <Link
                    href="/post-job"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
                  >
                    <iconify-icon icon="solar:add-circle-linear"></iconify-icon>
                    Post a Job — Free
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Bottom: All Categories Grid ─────────────────────────────────── */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-6">
              Browse All Job Categories in Bangladesh
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {JOB_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/jobs/category/${c.slug}`}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-150 ${
                    c.slug === slug
                      ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm"
                  }`}
                >
                  <iconify-icon
                    icon={c.icon}
                    class={`text-2xl ${c.slug === slug ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
                  ></iconify-icon>
                  <span
                    className={`text-xs font-medium leading-tight ${c.slug === slug ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}
                  >
                    {c.label}
                  </span>
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
