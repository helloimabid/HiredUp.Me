export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-56 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mt-2" />
        </div>

        {/* Search bar skeleton */}
        <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse mb-6" />

        {/* Job list skeleton */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          {/* List header */}
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>

          {/* Job item skeletons */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
            >
              {/* Logo skeleton */}
              <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />

              {/* Content skeleton */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              </div>

              {/* Time skeleton */}
              <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
