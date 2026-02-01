import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, getJobs, generateJobSlug } from "@/lib/appwrite";
import SaveJobButton from "@/components/SaveJobButton";
import ApplyButton from "@/components/ApplyButton";

// Revalidate every 5 minutes
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

// Helper: Clean HTML entities from job titles
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

// Helper: Extract job type from title/location
function detectJobType(title, location) {
  const text = `${title} ${location}`.toLowerCase();
  if (text.includes("remote")) return "Remote";
  if (text.includes("hybrid")) return "Hybrid";
  if (text.includes("contract")) return "Contract";
  if (text.includes("freelance")) return "Freelance";
  if (text.includes("part-time") || text.includes("part time"))
    return "Part-time";
  if (text.includes("intern")) return "Internship";
  return "Full-time";
}

// Helper: Extract experience level
function detectExperienceLevel(title) {
  const titleLower = title.toLowerCase();
  if (
    titleLower.includes("senior") ||
    titleLower.includes("sr.") ||
    titleLower.includes("lead")
  )
    return "Senior";
  if (
    titleLower.includes("junior") ||
    titleLower.includes("jr.") ||
    titleLower.includes("entry")
  )
    return "Entry Level";
  if (
    titleLower.includes("principal") ||
    titleLower.includes("staff") ||
    titleLower.includes("director")
  )
    return "Executive";
  if (titleLower.includes("mid") || titleLower.includes("intermediate"))
    return "Mid-Level";
  return "Mid-Level";
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

// Helper: Get company color
function getCompanyColor(company) {
  const colors = [
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-orange-100", text: "text-orange-600" },
    { bg: "bg-purple-100", text: "text-purple-600" },
    { bg: "bg-teal-100", text: "text-teal-600" },
    { bg: "bg-pink-100", text: "text-pink-600" },
    { bg: "bg-green-100", text: "text-green-600" },
    { bg: "bg-indigo-100", text: "text-indigo-600" },
  ];
  const index = company.charCodeAt(0) % colors.length;
  return colors[index];
}

// Generate rich metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found | HiredUp.me",
      description:
        "This job posting is no longer available. Browse thousands of other opportunities on HiredUp.me",
    };
  }

  const title = cleanText(job.title);
  const company = cleanText(job.company);
  const location = job.location || "Remote";
  const jobType = detectJobType(title, location);

  const metaDescription = job.description
    ? cleanText(job.description).slice(0, 155) + "..."
    : `${title} job at ${company}. ${jobType} position in ${location}. Apply now on HiredUp.me!`;

  return {
    title: `${title} at ${company} | ${location} | HiredUp.me`,
    description: metaDescription,
    keywords: [
      title,
      company,
      location,
      jobType,
      `${title} jobs`,
      `${company} careers`,
      "job opening",
      "career opportunity",
    ].join(", "),
    openGraph: {
      title: `${title} at ${company} - Now Hiring!`,
      description: metaDescription,
      type: "website",
      url: `https://hiredup.me/jobs/${slug}`,
      siteName: "HiredUp.me",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} at ${company}`,
      description: metaDescription,
    },
    alternates: { canonical: `https://hiredup.me/jobs/${slug}` },
    robots: { index: true, follow: true },
  };
}

// Generate job content based on role
function generateJobContent(job) {
  const title = cleanText(job.title);
  const company = cleanText(job.company);
  const location = job.location || "Remote";
  const titleLower = title.toLowerCase();
  const jobType = detectJobType(title, location);
  const experienceLevel = detectExperienceLevel(title);

  // Default content template
  let aboutRole = `Join ${company} as a ${title}. This ${jobType.toLowerCase()} position in ${location} offers an excellent opportunity to grow your career and make an impact.`;

  let responsibilities = [
    "Execute core job responsibilities with excellence",
    "Collaborate effectively with cross-functional teams",
    "Contribute to team goals and company objectives",
    "Maintain high standards of quality in all deliverables",
    "Continuously learn and adapt to new challenges",
  ];

  let qualifications = [
    "Relevant experience in the field",
    "Strong communication and interpersonal skills",
    "Ability to work independently and in teams",
    "Problem-solving mindset with attention to detail",
    "Passion for professional growth",
  ];

  let skills = [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Time Management",
    "Adaptability",
  ];

  // Customize based on role type
  if (
    titleLower.includes("developer") ||
    titleLower.includes("engineer") ||
    titleLower.includes("software")
  ) {
    aboutRole = `As a ${title} at ${company}, you'll be building innovative software solutions. This ${jobType.toLowerCase()} position in ${location} offers the chance to work with cutting-edge technologies.`;
    responsibilities = [
      "Design, develop, and maintain high-quality software applications",
      "Write clean, efficient, and well-documented code",
      "Collaborate with cross-functional teams on features",
      "Participate in code reviews and knowledge sharing",
      "Debug and resolve technical issues",
    ];
    qualifications = [
      `${experienceLevel === "Senior" ? "5+ years" : experienceLevel === "Entry Level" ? "0-2 years" : "2-5 years"} of software development experience`,
      "Proficiency in relevant programming languages",
      "Experience with version control systems (Git)",
      "Strong problem-solving skills",
      "Excellent communication abilities",
    ];
    skills = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Git",
      "AWS",
      "Docker",
      "SQL",
      "REST APIs",
    ];
  } else if (
    titleLower.includes("designer") ||
    titleLower.includes("ux") ||
    titleLower.includes("ui")
  ) {
    aboutRole = `Join ${company} as a ${title} and shape exceptional user experiences. This ${jobType.toLowerCase()} role in ${location} offers creative freedom and impact.`;
    responsibilities = [
      "Create intuitive and visually appealing user interfaces",
      "Conduct user research and translate insights into designs",
      "Develop wireframes, prototypes, and high-fidelity mockups",
      "Collaborate with developers to bring designs to life",
      "Maintain and evolve the design system",
    ];
    skills = [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Prototyping",
      "User Research",
      "Wireframing",
      "Design Systems",
    ];
  } else if (
    titleLower.includes("manager") ||
    titleLower.includes("lead") ||
    titleLower.includes("director")
  ) {
    aboutRole = `${company} is seeking a ${title} to lead strategic initiatives. This ${jobType.toLowerCase()} position in ${location} offers the opportunity to shape key business functions.`;
    responsibilities = [
      "Lead and mentor a team of professionals",
      "Develop and execute strategic plans",
      "Manage budgets and resources effectively",
      "Build relationships across the organization",
      "Drive continuous improvement",
    ];
    skills = [
      "Leadership",
      "Strategic Planning",
      "Team Management",
      "Budget Management",
      "Communication",
    ];
  } else if (
    titleLower.includes("marketing") ||
    titleLower.includes("content") ||
    titleLower.includes("seo")
  ) {
    aboutRole = `Join ${company} as a ${title} and help build our brand. This ${jobType.toLowerCase()} position in ${location} offers the chance to execute creative campaigns.`;
    responsibilities = [
      "Develop and execute marketing strategies",
      "Create compelling content for target audiences",
      "Manage and optimize digital campaigns",
      "Analyze performance and report on ROI",
      "Collaborate on go-to-market strategies",
    ];
    skills = [
      "Digital Marketing",
      "Content Marketing",
      "SEO/SEM",
      "Social Media",
      "Analytics",
      "Copywriting",
    ];
  } else if (titleLower.includes("sales") || titleLower.includes("account")) {
    aboutRole = `${company} is looking for a ${title} to drive revenue growth. This ${jobType.toLowerCase()} opportunity in ${location} offers unlimited earning potential.`;
    responsibilities = [
      "Identify and pursue new business opportunities",
      "Build strong relationships with clients",
      "Meet and exceed sales targets",
      "Conduct product demonstrations",
      "Negotiate and close deals",
    ];
    skills = [
      "Sales Strategy",
      "Negotiation",
      "CRM",
      "Lead Generation",
      "Account Management",
      "Presentation",
    ];
  }

  const benefits = [
    "Competitive salary",
    "Health insurance",
    "Professional development",
    "Flexible work arrangements",
    "Collaborative team culture",
  ];

  return {
    aboutRole,
    responsibilities,
    qualifications,
    skills,
    benefits,
    jobType,
    experienceLevel,
  };
}

export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const title = cleanText(job.title);
  const company = cleanText(job.company);
  const content = generateJobContent(job);
  const companyColor = getCompanyColor(company);
  const timeAgo = getTimeAgo(job.$createdAt);

  // JSON-LD structured data for Google Jobs
  const isRemote = (job.location || "").toLowerCase().includes("remote");
  const validThroughDate = new Date();
  validThroughDate.setDate(validThroughDate.getDate() + 30);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: title,
    description: `${content.aboutRole}\n\nResponsibilities:\n${content.responsibilities.join("\n")}\n\nQualifications:\n${content.qualifications.join("\n")}`,
    datePosted: job.$createdAt,
    validThrough: validThroughDate.toISOString(),
    employmentType: content.jobType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: company,
      sameAs: `https://hiredup.me/companies?search=${encodeURIComponent(company)}`,
    },
    jobLocation: isRemote
      ? undefined
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality:
              job.location?.split(",")[0]?.trim() || job.location,
            addressCountry: job.location?.includes("Bangladesh")
              ? "BD"
              : undefined,
          },
        },
    jobLocationType: isRemote ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: isRemote
      ? { "@type": "Country", name: "Bangladesh" }
      : undefined,
    directApply: true,
    identifier: {
      "@type": "PropertyValue",
      name: "HiredUp.me",
      value: job.$id,
    },
    skills: content.skills.join(", "),
    experienceRequirements: content.experienceLevel,
  };

  // Remove undefined fields
  Object.keys(jsonLd).forEach(
    (key) => jsonLd[key] === undefined && delete jsonLd[key],
  );

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hiredup.me",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jobs",
        item: "https://hiredup.me/jobs",
      },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <iconify-icon
                  icon="solar:alt-arrow-right-linear"
                  width="16"
                ></iconify-icon>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <iconify-icon
                  icon="solar:alt-arrow-right-linear"
                  width="16"
                ></iconify-icon>
              </li>
              <li className="text-slate-900 font-medium truncate max-w-[200px]">
                {title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero Header */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left: Job Info */}
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div
                  className={`w-14 h-14 lg:w-16 lg:h-16 ${companyColor.bg} rounded-xl flex items-center justify-center ${companyColor.text} font-bold text-xl lg:text-2xl shrink-0`}
                >
                  {company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                    {title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-sm">
                    <span className="flex items-center gap-1.5">
                      <iconify-icon
                        icon="solar:buildings-2-linear"
                        width="18"
                      ></iconify-icon>
                      {company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <iconify-icon
                        icon="solar:map-point-linear"
                        width="18"
                      ></iconify-icon>
                      {job.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <iconify-icon
                        icon="solar:clock-circle-linear"
                        width="18"
                      ></iconify-icon>
                      {timeAgo}
                    </span>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {content.jobType}
                    </span>
                    <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium">
                      {content.experienceLevel}
                    </span>
                    {job.location?.toLowerCase().includes("remote") && (
                      <span className="px-3 py-1 rounded-md bg-green-50 text-green-600 text-xs font-medium">
                        🌍 Remote
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-3 lg:flex-col lg:items-stretch">
                <SaveJobButton job={job} />
                <ApplyButton applyUrl={job.apply_url} />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About This Role */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <iconify-icon
                    icon="solar:info-circle-linear"
                    width="22"
                    class="text-indigo-600"
                  ></iconify-icon>
                  About This Role
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {content.aboutRole}
                </p>
                {job.description && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h3 className="font-medium text-slate-800 mb-2">
                      From the Employer:
                    </h3>
                    <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed">
                      {cleanText(job.description)}
                    </p>
                  </div>
                )}
              </div>

              {/* What You'll Do */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <iconify-icon
                    icon="solar:checklist-minimalistic-linear"
                    width="22"
                    class="text-indigo-600"
                  ></iconify-icon>
                  What You'll Do
                </h2>
                <ul className="space-y-3">
                  {content.responsibilities.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-600"
                    >
                      <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What We're Looking For */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <iconify-icon
                    icon="solar:user-check-linear"
                    width="22"
                    class="text-indigo-600"
                  ></iconify-icon>
                  What We're Looking For
                </h2>
                <ul className="space-y-3">
                  {content.qualifications.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-600"
                    >
                      <iconify-icon
                        icon="solar:check-circle-bold"
                        width="18"
                        class="text-green-500 mt-0.5 shrink-0"
                      ></iconify-icon>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <iconify-icon
                    icon="solar:gift-linear"
                    width="22"
                    class="text-indigo-600"
                  ></iconify-icon>
                  Benefits & Perks
                </h2>
                <div className="flex flex-wrap gap-2">
                  {content.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm border border-slate-100"
                    >
                      ✨ {benefit}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  * Benefits may vary. Check with employer for details.
                </p>
              </div>

              {/* Apply CTA */}
              <div className="bg-slate-900 rounded-xl p-6 text-white">
                <h2 className="text-xl font-semibold mb-2">Ready to Apply?</h2>
                <p className="text-slate-300 mb-4 text-sm">
                  Don't miss this opportunity at {company}. Click below to
                  submit your application.
                </p>
                <ApplyButton applyUrl={job.apply_url} fullWidth />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Apply */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Quick Apply
                </h3>
                <ApplyButton applyUrl={job.apply_url} fullWidth />
                <p className="text-xs text-slate-500 mt-3 text-center">
                  You'll be redirected to the employer's site
                </p>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <iconify-icon
                    icon="solar:star-linear"
                    width="18"
                    class="text-indigo-600"
                  ></iconify-icon>
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Job Summary
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Job Type</dt>
                    <dd className="text-slate-900 font-medium">
                      {content.jobType}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Experience</dt>
                    <dd className="text-slate-900 font-medium">
                      {content.experienceLevel}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Location</dt>
                    <dd className="text-slate-900 font-medium">
                      {job.location || "Remote"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Posted</dt>
                    <dd className="text-slate-900 font-medium">{timeAgo}</dd>
                  </div>
                </dl>
              </div>

              {/* Share */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Share This Job
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  Know someone perfect for this role?
                </p>
                <div className="flex gap-2">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://hiredup.me/jobs/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006699] transition-colors text-sm"
                  >
                    <iconify-icon icon="mdi:linkedin" width="18"></iconify-icon>
                    LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚀 ${title} at ${company}!`)}&url=${encodeURIComponent(`https://hiredup.me/jobs/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                  >
                    <iconify-icon icon="mdi:twitter" width="18"></iconify-icon>
                    Tweet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Jobs CTA */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
              Explore More Opportunities
            </h2>
            <p className="text-slate-500 mb-6 max-w-xl mx-auto">
              Didn't find what you're looking for? We have thousands of jobs
              waiting for talented professionals like you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/search?q=${encodeURIComponent(title.split(" ").slice(0, 2).join(" "))}`}
                className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <iconify-icon
                  icon="solar:magnifer-linear"
                  width="18"
                ></iconify-icon>
                Find Similar Jobs
              </Link>
              <Link
                href="/jobs"
                className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
