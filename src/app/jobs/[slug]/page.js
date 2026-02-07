import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getJobBySlugOrId, getJobs } from "@/lib/appwrite";
import SaveJobButton from "@/components/SaveJobButton";
import ApplyButton from "@/components/ApplyButton";
import CompanyLogo from "@/components/CompanyLogo";
import JobPageContent from "@/components/JobPageContent";

// Revalidate every 5 minutes (data layer has its own 300s cache)
export const revalidate = 300;

// Generate static params for popular jobs
export async function generateStaticParams() {
  try {
    const jobs = await getJobs(50);
    return jobs.filter((job) => job.slug).map((job) => ({ slug: job.slug }));
  } catch {
    return [];
  }
}

// Helper: Clean HTML entities
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

// Helper: Get time ago text
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

// Helper: Get company logo color based on first letter
function getCompanyLogoColor(company) {
  const colors = [
    "bg-green-600 shadow-green-600/20",
    "bg-blue-600 shadow-blue-600/20",
    "bg-purple-600 shadow-purple-600/20",
    "bg-orange-600 shadow-orange-600/20",
    "bg-pink-600 shadow-pink-600/20",
    "bg-teal-600 shadow-teal-600/20",
    "bg-indigo-600 shadow-indigo-600/20",
  ];
  const index = (company || "A").charCodeAt(0) % colors.length;
  return colors[index];
}

// Parse enhanced JSON content
function parseEnhancedContent(job) {
  if (!job?.enhanced_json) {
    return {
      header: {
        title: job?.title,
        company: job?.company,
        location: job?.location,
      },
      apply_info: {
        url: job?.apply_url,
      },
      needsAI: true,
      aiEnhanced: false,
    };
  }
  try {
    const parsed = JSON.parse(job.enhanced_json);
    // If it parses but doesn't include flags, default to "needsAI".
    if (parsed && typeof parsed === "object") {
      return {
        needsAI: true,
        aiEnhanced: false,
        ...parsed,
      };
    }
    return {
      needsAI: true,
      aiEnhanced: false,
    };
  } catch {
    return {
      header: {
        title: job?.title,
        company: job?.company,
        location: job?.location,
      },
      apply_info: {
        url: job?.apply_url,
      },
      needsAI: true,
      aiEnhanced: false,
    };
  }
}

// Helper: Clean HTML tags from CareerJet descriptions
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

// Build a fake job object from CareerJet query params
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

// Generate SEO metadata
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const job = await getJobBySlugOrId(slug);

  if (!job) {
    // Fallback: CareerJet job from query params
    const sp = await searchParams;
    const cjJob = buildCareerJetJob(sp);
    if (cjJob) {
      return {
        title: `${cjJob.title} at ${cjJob.company} | HiredUp.me`,
        description: `${cjJob.title} position at ${cjJob.company}${cjJob.location ? ` in ${cjJob.location}` : ""}. Apply now on HiredUp.me!`,
        openGraph: {
          title: `${cjJob.title} at ${cjJob.company} - Now Hiring!`,
          description: `${cjJob.title} position at ${cjJob.company}${cjJob.location ? ` in ${cjJob.location}` : ""}. Apply now!`,
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

  // Get job image - check enhanced_json for scraped image or company logo
  const jobImage =
    enhanced?.company_logo_url ||
    enhanced?.job_image_url ||
    enhanced?.circular_image_url ||
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

// ============ DYNAMIC SECTION RENDERERS ============
// Following reference-job-post-page.html design: clean, minimal, slate colors

// Render a paragraph/description section
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

// Render a numbered list section (like Job Responsibilities)
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

// Render a bullet list section (like Additional Requirements)
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

// Render a tags/skills section (rounded-full pills)
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

// Render a grouped list section (like Requirements with Education, Experience subsections)
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

// Render a table section
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

// Render key-value section
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

// Dynamic section renderer
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

// ============ MAIN PAGE COMPONENT ============

export default async function JobDetailPage({ params, searchParams }) {
  const { slug } = await params;
  let job = await getJobBySlugOrId(slug);

  // If no Appwrite job found, try CareerJet query params
  const sp = await searchParams;
  const isCareerJet = !job && buildCareerJetJob(sp);
  if (!job) {
    job = buildCareerJetJob(sp);
    if (!job) notFound();
  }

  if (!isCareerJet && job.slug && job.slug !== slug) {
    redirect(`/jobs/${job.slug}`);
  }

  // Parse AI-generated content (CareerJet jobs also go through the same flow)
  const enhanced = parseEnhancedContent(job);
  const isEnhanced = Boolean(enhanced);

  // Extract header info (from enhanced or fallback to job record)
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
  const logoColor = getCompanyLogoColor(company);

  // Only use scraped logo from AI content (no external API fallback)
  const logoUrl = enhanced?.company_logo_url || null;
  const timeAgo = getTimeAgo(job.$createdAt);

  // Quick info items (for overview cards) - include new fields from output.json
  const quickInfo =
    enhanced?.quick_info?.filter(
      (item) => item.value && item.value !== "null",
    ) || [];

  // Add salary, experience, deadline from job fields if not in enhanced
  if (quickInfo.length === 0) {
    if (job.salary) quickInfo.push({ label: "Salary", value: job.salary });
    if (job.experience)
      quickInfo.push({ label: "Experience", value: job.experience });
    if (job.deadline)
      quickInfo.push({ label: "Deadline", value: job.deadline });
    if (job.education)
      quickInfo.push({ label: "Education", value: job.education });
  }

  // Highlights
  const highlights = enhanced?.highlights || [];

  // Dynamic sections from AI
  const sections = enhanced?.sections || [];

  // Apply info
  const applyInfo = enhanced?.apply_info;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: title,
    description:
      sections.find((s) => s.id === "about")?.content || job.description || "",
    datePosted: job.$createdAt,
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: (header.employment_type || "Full-time")
      .toUpperCase()
      .replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: company,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: header.location },
    },
    directApply: true,
  };

  // Check if this job needs AI enhancement (CareerJet jobs always need it)
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
            <ol className="flex items-center space-x-2">
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
              <li>
                <iconify-icon
                  icon="solar:alt-arrow-right-linear"
                  class="text-slate-400"
                ></iconify-icon>
              </li>
              <li className="text-slate-900 dark:text-white truncate">
                {title}
              </li>
            </ol>
          </nav>
        </div>

        {/* Job Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="flex gap-5">
              {/* Company Logo */}
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
                  {header.applicants && (
                    <span className="flex items-center gap-1">
                      <iconify-icon
                        icon="solar:users-group-rounded-linear"
                        class="text-slate-400"
                      ></iconify-icon>
                      {header.applicants} Applicants
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wide">
                    {header.employment_type || "Full-time"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wide">
                    {header.location_type || "On-site"}
                  </span>
                  {isEnhanced && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-semibold uppercase tracking-wide">
                      <iconify-icon icon="solar:stars-minimalistic-linear"></iconify-icon>{" "}
                      AI Enhanced
                    </span>
                  )}
                  {isCareerJet && job.source_site && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold uppercase tracking-wide">
                      <iconify-icon icon="solar:global-linear"></iconify-icon>
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

        {/* Main Content Grid - 12 columns like reference */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column (Job Details) - 8 columns */}
            <div className="lg:col-span-8 space-y-10">
              {/* Key Highlights */}
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

              {/* Job Overview Cards */}
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

              {/* Dynamic Sections from AI */}
              {sections.map((section, i) => (
                <div key={section.id || i}>
                  <RenderSection section={section} />
                  {i < sections.length - 1 && (
                    <hr className="border-slate-100 dark:border-slate-800 mt-10" />
                  )}
                </div>
              ))}

              {/* Fallback: If no enhanced content, show basic job description */}
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
                    Don't miss this opportunity at {company}. Click below to
                    submit your application.
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

            {/* Right Column (Sidebar) - 4 columns */}
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
                    <div className="flex items-start gap-3">
                      <iconify-icon
                        icon="solar:buildings-linear"
                        class="text-slate-400 text-lg mt-0.5"
                      ></iconify-icon>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                          Company
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {company}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <iconify-icon
                        icon="solar:map-point-linear"
                        class="text-slate-400 text-lg mt-0.5"
                      ></iconify-icon>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                          Location
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {header.location || "Remote"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <iconify-icon
                        icon="solar:case-minimalistic-linear"
                        class="text-slate-400 text-lg mt-0.5"
                      ></iconify-icon>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                          Job Type
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {header.employment_type || "Full-time"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <iconify-icon
                        icon="solar:laptop-minimalistic-linear"
                        class="text-slate-400 text-lg mt-0.5"
                      ></iconify-icon>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                          Work Mode
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {header.location_type || "On-site"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <iconify-icon
                        icon="solar:calendar-linear"
                        class="text-slate-400 text-lg mt-0.5"
                      ></iconify-icon>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                          Posted
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {timeAgo}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button in Card */}
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

                {/* Report */}
                <div className="text-center pt-4">
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
