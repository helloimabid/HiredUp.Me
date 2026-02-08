"use client";

import { useState, useTransition } from "react";
import { fetchJobBatch } from "@/app/actions"; // Import the action we just created
import JobListLogo from "@/components/JobListLogo"; // Keep your existing logo component
import Link from "next/link";

export default function JobFeed({ initialJobs, searchParams }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await fetchJobBatch(nextPage, 25, searchParams);

      if (result.jobs.length === 0) {
        setHasMore(false);
      } else {
        setJobs((prev) => [...prev, ...result.jobs]);
        setPage(nextPage);
      }
    });
  };

  return (
    <div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {jobs.map((job) => (
          <JobCard key={`${job.$id}-${job.source}`} job={job} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Loading more...
              </>
            ) : (
              "Load more jobs"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Simple JobCard component extracted from your page.js
function JobCard({ job }) {
  // Helpers from your original code
  const isCareerJet = job.source === "careerjet";
  const isLiveCareerJet = isCareerJet && !job.slug;
  const href = isLiveCareerJet ? job.apply_url : `/jobs/${job.slug || job.$id}`;

  let logoUrl = null;
  if (!isLiveCareerJet && job.enhanced_json) {
    try {
      logoUrl = JSON.parse(job.enhanced_json)?.company_logo_url;
    } catch {}
  }

  return (
    <a
      href={href}
      className="group relative p-5 hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all flex gap-5 items-start block"
    >
      <JobListLogo
        company={job.company}
        logoUrl={logoUrl}
        className="w-12 h-12 rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 line-clamp-1">
            {job.title}
          </h3>
          <span className="text-[11px] font-medium text-slate-400">
            {new Date(job.$createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-2">{job.company}</p>

        <div className="flex gap-2 flex-wrap">
          {job.location?.toLowerCase().includes("remote") && (
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] border border-emerald-100">
              Remote
            </span>
          )}
          {job.salary && (
            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] border border-slate-100">
              {job.salary}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
