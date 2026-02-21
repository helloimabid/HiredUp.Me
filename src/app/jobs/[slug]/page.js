// src/app/jobs/[slug]/page.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getJobBySlugOrId, getJobs } from "@/lib/appwrite";
import SaveJobButton from "@/components/SaveJobButton";
import ApplyButton from "@/components/ApplyButton";
import CompanyLogo from "@/components/CompanyLogo";
import JobPageContent from "@/components/JobPageContent";
import {
  JOB_CATEGORIES,
  JOB_LOCATIONS,
  filterJobsByCategory,
} from "@/lib/job-categories";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const jobs = await getJobs(50);
    return jobs.filter((job) => job.slug).map((job) => ({ slug: job.slug }));
  } catch {
    return [];
  }
}

function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/&amp;#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function getTimeAgo(date) {
  const now = new Date();
  const posted = new Date(date);
  const diffMs = now - posted;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return posted.toLocaleDateString();
}

function getCompanyLogoColor(company) {
  const colors = [
    "bg-green-600",
    "bg-blue-600",
    "bg-purple-600",
    "bg-orange-600",
    "bg-pink-600",
    "bg-teal-600",
    "bg-indigo-600",
  ];
  return colors[(company || "A").charCodeAt(0) % colors.length];
}

function parseEnhancedContent(job) {
  if (!job?.enhanced_json) {
    return {
      header: {
        title: job?.title,
        company: job?.company,
        location: job?.location,
      },
      apply_info: { url: job?.apply_url },
      needsAI: true,
      aiEnhanced: false,
    };
  }
  try {
    const parsed = JSON.parse(job.enhanced_json);
    if (parsed && typeof parsed === "object")
      return { needsAI: true, aiEnhanced: false, ...parsed };
    return { needsAI: true, aiEnhanced: false };
  } catch {
    return {
      header: {
        title: job?.title,
        company: job?.company,
        location: job?.location,
      },
      apply_info: { url: job?.apply_url },
      needsAI: true,
      aiEnhanced: false,
    };
  }
}

function cleanHtml(text) {
  if (!text) return "";
  return text
    .replace(/<\/?b>/gi, "")
    .replace(/<\/?i>/gi, "")
    .replace(/<\/?strong>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function buildCareerJetJob(params) {
  if (!params?.title || !params?.company || !params?.apply_url) return null;
  return {
    $id: "careerjet-external",
    title: params.title,
    company: params.company,
    location: params.location || "",
    description: cleanHtml(params.description || ""),
    salary: params.salary || "",
    apply_url: params.apply_url,
    source_site: params.source_site || "",
    $createdAt: params.date || new Date().toISOString(),
    _isCareerJet: true,
  };
}

/**
 * Detect which categories a job belongs to using enhanced_json fields.
 * Returns up to 3 matching category configs.
 */
function detectJobCategories(job) {
  return JOB_CATEGORIES.filter(
    (cat) => filterJobsByCategory([job], cat).length > 0,
  ).slice(0, 3);
}

/**
 * Detect which location page this job belongs to.
 */
function detectJobLocation(enhanced) {
  const loc = (enhanced?.header?.location || "").toLowerCase();
  return (
    JOB_LOCATIONS.find((l) => l.keywords.some((kw) => loc.includes(kw))) || null
  );
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const job = await getJobBySlugOrId(slug);

  if (!job) {
    const sp = await searchParams;
    const cjJob = buildCareerJetJob(sp);
    if (cjJob) {
      return {
        title: `${cjJob.title} at ${cjJob.company} | HiredUp.me`,
        description: `${cjJob.title} position at ${cjJob.company}${cjJob.location ? ` in ${cjJob.location}` : ""}. Apply now on HiredUp.me!`,
        openGraph: {
          title: `${cjJob.title} at ${cjJob.company} - Now Hiring!`,
          description: `${cjJob.title} position at ${cjJob.company}. Apply now!`,
        },
        robots: { index: false, follow: false },
      };
    }
    return {
      title: "Job Not Found | HiredUp.me",
      description: "This job posting is no longer available.",
    };
  }

  const enhanced = parseEnhancedContent(job);
  const title = cleanText(enhanced?.header?.title || job.title);
  const company = cleanText(enhanced?.header?.company || job.company);
  const location = enhanced?.header?.location || job.location || "Remote";
  const jobImage =
    enhanced?.company_logo_url ||
    enhanced?.job_image_url ||
    `https://hiredup.me/api/og/job?title=${encodeURIComponent(title)}&company=${encodeURIComponent(company)}&location=${encodeURIComponent(location)}`;
  const metaDescription =
    enhanced?.seo?.meta_description ||
    `${title} job at ${company}. ${enhanced?.header?.employment_type || "Full-time"} position in ${location}. Apply now on HiredUp.me!`;

  return {
    title:
      enhanced?.seo?.meta_title ||
      `${title} at ${company} | ${location} | HiredUp.me`,
    description: metaDescription,
    keywords:
      enhanced?.seo?.keywords?.join(", ") || `${title}, ${company}, jobs`,
    openGraph: {
      title: `${title} at ${company} - Now Hiring!`,
      description: metaDescription,
      type: "website",
      url: `https://hiredup.me/jobs/${job.slug || slug}`,
      siteName: "HiredUp.me",
      images: [
        {
          url: jobImage,
          width: 1200,
          height: 630,
          alt: `${title} at ${company}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} at ${company}`,
      description: metaDescription,
      images: [jobImage],
    },
    alternates: { canonical: `https://hiredup.me/jobs/${job.slug || slug}` },
    robots: { index: true, follow: true },
  };
}

// ── Section Renderers ──────────────────────────────────────────────────────

function ParagraphSection({ section }) {
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
        {section.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
        {section.content}
      </p>
    </section>
  );
}

function NumberedListSection({ section }) {
  if (!section.items?.length) return null;
  return (
    <section>
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
        {section.title}
      </h4>
      <ul className="space-y-3">
        {section.items.map((item, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BulletListSection({ section }) {
  if (!section.items?.length) return null;
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
        {section.title}
      </h3>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        {section.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-2 flex-shrink-0"></div>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TagsSection({ section }) {
  if (!section.items?.length) return null;
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
        {section.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {section.items.map((item, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium bg-white dark:bg-slate-800"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function GroupedListSection({ section }) {
  if (!section.groups?.length) return null;
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
        {section.title}
      </h3>
      <div className="space-y-4">
        {section.groups.map(
          (group, gi) =>
            group.items?.length > 0 && (
              <div key={gi}>
                <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  {group.title}
                </h5>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                  {group.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </div>
    </section>
  );
}

function TableSection({ section }) {
  if (!section.content?.headers?.length) return null;
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
        {section.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {section.content.headers.map((h, i) => (
                <th
                  key={i}
                  className="py-2 px-3 text-left font-medium text-slate-700 dark:text-slate-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {section.content.rows?.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="py-2 px-3 text-slate-600 dark:text-slate-400"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function KeyValueSection({ section }) {
  if (!section.items?.length) return null;
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
        {section.title}
      </h3>
      <dl className="space-y-2 text-sm">
        {section.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <dt className="font-medium text-slate-700 dark:text-slate-300">
              {item.label}:
            </dt>
            <dd className="text-slate-600 dark:text-slate-400">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function RenderSection({ section }) {
  switch (section.type) {
    case "paragraph":
      return <ParagraphSection section={section} />;
    case "numbered-list":
      return <NumberedListSection section={section} />;
    case "bullet-list":
      return <BulletListSection section={section} />;
    case "tags":
      return <TagsSection section={section} />;
    case "grouped-list":
      return <GroupedListSection section={section} />;
    case "table":
      return <TableSection section={section} />;
    case "key-value":
      return <KeyValueSection section={section} />;
    default:
      if (section.content) return <ParagraphSection section={section} />;
      if (section.items) return <BulletListSection section={section} />;
      return null;
  }
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default async function JobDetailPage({ params, searchParams }) {
  const { slug } = await params;
  let job = await getJobBySlugOrId(slug);

  const sp = await searchParams;
  const isFromQueryParams = !job && buildCareerJetJob(sp);
  if (!job) {
    job = buildCareerJetJob(sp);
    if (!job) notFound();
  }

  const isCareerJet = Boolean(isFromQueryParams) || job.source === "careerjet";

  if (!isFromQueryParams && job.slug && job.slug !== slug)
    redirect(`/jobs/${job.slug}`);

  const enhanced = parseEnhancedContent(job);
  const isEnhanced = Boolean(enhanced);

  const header = enhanced?.header || {
    title: job.title,
    company: job.company,
    location: job.location,
    location_type: job.location?.toLowerCase().includes("remote")
      ? "Remote"
      : "On-site",
    employment_type: "Full-time",
  };

  const title = cleanText(header.title);
  const company = cleanText(header.company);
  const logoUrl = enhanced?.company_logo_url || null;
  const timeAgo = getTimeAgo(job.$createdAt);

  const quickInfo =
    enhanced?.quick_info?.filter(
      (item) => item.value && item.value !== "null",
    ) || [];
  if (quickInfo.length === 0) {
    if (job.salary) quickInfo.push({ label: "Salary", value: job.salary });
    if (job.experience)
      quickInfo.push({ label: "Experience", value: job.experience });
    if (job.deadline)
      quickInfo.push({ label: "Deadline", value: job.deadline });
    if (job.education)
      quickInfo.push({ label: "Education", value: job.education });
  }

  const highlights = enhanced?.highlights || [];
  const sections = enhanced?.sections || [];
  const applyInfo = enhanced?.apply_info;

  // Detect categories & location from enhanced_json for sidebar links
  const matchedCategories = detectJobCategories(job);
  const matchedLocation = detectJobLocation(enhanced);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description:
      sections.find((s) => s.id === "about")?.content || job.description || "",
    datePosted: job.$createdAt,
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: (header.employment_type || "Full-time")
      .toUpperCase()
      .replace("-", "_"),
    hiringOrganization: { "@type": "Organization", name: company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: header.location },
    },
    directApply: true,
  };

  const needsAI =
    isCareerJet || (enhanced?.needsAI === true && !enhanced?.aiEnhanced);

  return (
    <JobPageContent job={job} enhanced={enhanced} autoGenerate={needsAI}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen pb-20 bg-white dark:bg-slate-900">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex text-xs font-medium text-slate-500 dark:text-slate-400">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <iconify-icon
                  icon="solar:alt-arrow-right-linear"
                  class="text-slate-400"
                ></iconify-icon>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Jobs
                </Link>
              </li>
              {/* Show first matched category in breadcrumb */}
              {matchedCategories[0] && (
                <>
                  <li>
                    <iconify-icon
                      icon="solar:alt-arrow-right-linear"
                      class="text-slate-400"
                    ></iconify-icon>
                  </li>
                  <li>
                    <Link
                      href={`/jobs/category/${matchedCategories[0].slug}`}
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {matchedCategories[0].label}
                    </Link>
                  </li>
                </>
              )}
              <li>
                <iconify-icon
                  icon="solar:alt-arrow-right-linear"
                  class="text-slate-400"
                ></iconify-icon>
              </li>
              <li className="text-slate-900 dark:text-white truncate max-w-[200px]">
                {title}
              </li>
            </ol>
          </nav>
        </div>

        {/* Job Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="flex gap-5">
              <CompanyLogo company={company} logoUrl={logoUrl} size="md" />
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
                  {title}
                </h1>
                <div className="text-sm md:text-base font-medium text-slate-900 dark:text-white mb-3">
                  {company}
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <iconify-icon
                      icon="solar:map-point-linear"
                      class="text-slate-400"
                    ></iconify-icon>
                    {header.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1">
                    <iconify-icon
                      icon="solar:clock-circle-linear"
                      class="text-slate-400"
                    ></iconify-icon>
                    {timeAgo}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wide">
                    {header.employment_type || "Full-time"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wide">
                    {header.location_type || "On-site"}
                  </span>
                  {/* Category badges — link to category pages */}
                  {matchedCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/jobs/category/${cat.slug}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold uppercase tracking-wide hover:bg-indigo-100 transition-colors"
                    >
                      <iconify-icon icon={cat.icon}></iconify-icon>
                      {cat.label}
                    </Link>
                  ))}
                  {isEnhanced && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-semibold uppercase tracking-wide">
                      <iconify-icon icon="solar:stars-minimalistic-linear"></iconify-icon>{" "}
                      AI Enhanced
                    </span>
                  )}
                  {isCareerJet && job.source_site && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold uppercase tracking-wide">
                      <iconify-icon icon="solar:global-linear"></iconify-icon>{" "}
                      via {job.source_site}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
              {!isCareerJet && (
                <SaveJobButton jobId={job.$id} variant="outline" />
              )}
              <ApplyButton applyUrl={job.apply_url} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-10">
              {highlights.length > 0 && (
                <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 p-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <iconify-icon
                      icon="solar:star-fall-linear"
                      class="text-amber-500"
                    ></iconify-icon>
                    Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    {highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <iconify-icon
                          icon="solar:check-circle-linear"
                          class="text-slate-400 mt-0.5 flex-shrink-0"
                        ></iconify-icon>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {quickInfo.length > 0 && (
                <section>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                    Job Overview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickInfo.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                          {item.label}
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <hr className="border-slate-100 dark:border-slate-800" />

              {sections.map((section, i) => (
                <div key={section.id || i}>
                  <RenderSection section={section} />
                  {i < sections.length - 1 && (
                    <hr className="border-slate-100 dark:border-slate-800 mt-10" />
                  )}
                </div>
              ))}

              {!isEnhanced && job.description && (
                <section>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                    Job Description
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {cleanText(job.description)}
                  </p>
                </section>
              )}

              {/* Bottom CTA */}
              <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Ready to Apply?
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md">
                    Don't miss this opportunity at {company}.
                  </p>
                  {applyInfo?.deadline && (
                    <p className="text-amber-400 text-xs mt-2">
                      ⏰ Deadline: {applyInfo.deadline}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-6 rounded bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors inline-flex items-center justify-center whitespace-nowrap"
                  >
                    Apply Now
                  </a>
                  <span className="text-[10px] text-slate-500 text-center">
                    You'll be redirected to the employer's site
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Job Summary Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Job Summary
                    </h4>
                  </div>
                  <div className="p-5 space-y-5">
                    {[
                      {
                        icon: "solar:buildings-linear",
                        label: "Company",
                        value: company,
                      },
                      {
                        icon: "solar:map-point-linear",
                        label: "Location",
                        value: header.location || "Remote",
                      },
                      {
                        icon: "solar:case-minimalistic-linear",
                        label: "Job Type",
                        value: header.employment_type || "Full-time",
                      },
                      {
                        icon: "solar:laptop-minimalistic-linear",
                        label: "Work Mode",
                        value: header.location_type || "On-site",
                      },
                      {
                        icon: "solar:calendar-linear",
                        label: "Posted",
                        value: timeAgo,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <iconify-icon
                          icon={item.icon}
                          class="text-slate-400 text-lg mt-0.5"
                        ></iconify-icon>
                        <div>
                          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                            {item.label}
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <iconify-icon
                        icon="solar:clock-circle-linear"
                        class="text-slate-400 text-sm"
                      ></iconify-icon>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Apply before it's too late
                      </span>
                    </div>
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 px-6 rounded bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-lg shadow-slate-900/20 dark:shadow-indigo-600/20 inline-flex items-center justify-center gap-2"
                    >
                      Apply Now{" "}
                      <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon>
                    </a>
                  </div>
                </div>

                {/* ── Browse Similar Jobs ───────────────────────────────── */}
                {(matchedCategories.length > 0 || matchedLocation) && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Browse Similar Jobs
                      </h4>
                    </div>
                    <div className="p-4 space-y-2">
                      {matchedCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/jobs/category/${cat.slug}`}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <iconify-icon
                              icon={cat.icon}
                              class="text-indigo-500 flex-shrink-0"
                            ></iconify-icon>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                              More {cat.label} Jobs
                            </span>
                          </div>
                          <iconify-icon
                            icon="solar:arrow-right-linear"
                            class="text-slate-400 group-hover:text-indigo-500 flex-shrink-0 text-xs"
                          ></iconify-icon>
                        </Link>
                      ))}
                      {matchedLocation && (
                        <Link
                          href={`/jobs/location/${matchedLocation.slug}`}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <iconify-icon
                              icon="solar:map-point-linear"
                              class="text-green-500 flex-shrink-0"
                            ></iconify-icon>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                              More Jobs in {matchedLocation.label}
                            </span>
                          </div>
                          <iconify-icon
                            icon="solar:arrow-right-linear"
                            class="text-slate-400 group-hover:text-green-500 flex-shrink-0 text-xs"
                          ></iconify-icon>
                        </Link>
                      )}
                      <Link
                        href="/jobs/categories"
                        className="flex items-center justify-center gap-2 p-2 text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        Browse all categories →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Share This Job */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 pl-1">
                    Share This Job
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://hiredup.me/jobs/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <iconify-icon
                        icon="mdi:linkedin"
                        class="text-[#0077b5]"
                      ></iconify-icon>{" "}
                      LinkedIn
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://hiredup.me/jobs/${slug}`)}&text=${encodeURIComponent(`Check out this job: ${title} at ${company}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <iconify-icon icon="ri:twitter-x-fill"></iconify-icon>{" "}
                      Twitter
                    </a>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center gap-1 mx-auto transition-colors">
                    <iconify-icon icon="solar:flag-linear"></iconify-icon>{" "}
                    Report this job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </JobPageContent>
  );
}
