import Link from "next/link";

// Color mapping for company initials
const colorMap = {
  0: { bg: "bg-blue-100", text: "text-blue-600" },
  1: { bg: "bg-orange-100", text: "text-orange-600" },
  2: { bg: "bg-purple-100", text: "text-purple-600" },
  3: { bg: "bg-teal-100", text: "text-teal-600" },
  4: { bg: "bg-pink-100", text: "text-pink-600" },
  5: { bg: "bg-yellow-100", text: "text-yellow-600" },
  6: { bg: "bg-indigo-100", text: "text-indigo-600" },
  7: { bg: "bg-green-100", text: "text-green-600" },
};

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

export default function JobCard({ job, index = 0 }) {
  const colorIndex = index % Object.keys(colorMap).length;
  const colors = colorMap[colorIndex];
  const jobType = getJobType(job.location);
  const badge = jobTypeBadge[jobType] || jobTypeBadge["full-time"];
  const initial = job.company?.charAt(0)?.toUpperCase() || "?";

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
      className="group block p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all bg-white"
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text} font-bold text-sm`}
        >
          {initial}
        </div>
        <span
          className={`px-2 py-1 rounded-md ${badge.bg} ${badge.text} text-xs font-medium capitalize`}
        >
          {jobType.replace("-", " ")}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {job.title}
      </h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-1">
        {job.company} • {job.location}
      </p>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <iconify-icon icon="solar:clock-circle-linear"></iconify-icon>
        <span>{formatTimeAgo(job.$createdAt)}</span>
      </div>
    </Link>
  );
}
