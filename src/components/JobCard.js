import Link from "next/link";
import JobListLogo from "./JobListLogo";

// Job type badge colors
const jobTypeBadge = {
  "full-time": { bg: "bg-slate-100", text: "text-slate-600" },
  hybrid: { bg: "bg-slate-100", text: "text-slate-600" },
  contract: { bg: "bg-slate-100", text: "text-slate-600" },
  remote: { bg: "bg-green-50 border border-green-100", text: "text-green-700" },
  freelance: { bg: "bg-blue-50 border border-blue-100", text: "text-blue-700" },
};

function getJobType(location) {
  const loc = location?.toLowerCase() || "";
  if (loc.includes("remote")) return "remote";
  if (loc.includes("hybrid")) return "hybrid";
  if (loc.includes("contract")) return "contract";
  if (loc.includes("freelance")) return "freelance";
  return "full-time";
}

function getLogoUrl(job) {
  if (!job) return null;
  if (job.company_logo_url) return job.company_logo_url;
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

export default function JobCard({ job }) {
  const jobType = getJobType(job.location);
  const badge = jobTypeBadge[jobType] || jobTypeBadge["full-time"];
  const logoUrl = getLogoUrl(job);

  // Use slug URL if available, fallback to ID, then external URL
  const href = job.slug
    ? `/jobs/${job.slug}`
    : job.$id
      ? `/jobs/${job.$id}`
      : job.apply_url || "#";
  const isExternal = !job.slug && !job.$id;

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-500/5 transition-all bg-white dark:bg-slate-800"
    >
      <div className="flex justify-between items-start mb-4">
        <JobListLogo
          company={job.company}
          logoUrl={logoUrl}
          className="w-10 h-10 rounded-lg"
        />
        <span
          className={`px-2 py-1 rounded-md ${badge.bg} ${badge.text} text-xs font-medium capitalize dark:bg-opacity-20`}
        >
          {jobType.replace("-", " ")}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
        {job.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
        {job.company} • {job.location}
      </p>
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <iconify-icon icon="solar:clock-circle-linear"></iconify-icon>
        <span>{formatTimeAgo(job.$createdAt)}</span>
      </div>
    </Link>
  );
}
