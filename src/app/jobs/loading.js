export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header skeleton */}
        <div className="flex flex-col items-center mb-12">
          <div className="h-7 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          {/* Search bar skeleton */}
          <div className="w-full max-w-4xl mt-8 h-[72px] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse shadow-sm border border-slate-100 dark:border-slate-700" />
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Loading jobs...
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
              Fetching latest listings
            </span>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 rounded-full"
              style={{
                animation: "loading-progress 2.5s ease-in-out infinite",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </div>

        {/* Job list skeleton */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          {/* Toolbar skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 gap-4">
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>

          {/* Job item skeletons with staggered animation */}
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="p-5 flex gap-5 items-start animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Logo skeleton */}
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />

                {/* Content skeleton */}
                <div className="flex-1 min-w-0 pt-0.5 space-y-3">
                  <div className="flex justify-between">
                    <div
                      className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
                      style={{ width: `${45 + (i % 3) * 15}%` }}
                    />
                    <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                  <div
                    className="h-3 bg-slate-100 dark:bg-slate-800 rounded"
                    style={{ width: `${30 + (i % 4) * 10}%` }}
                  />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
                    {i % 2 === 0 && (
                      <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="w-32 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Loading progress animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading-progress {
          0% { width: 0%; opacity: 1; }
          50% { width: 70%; opacity: 1; }
          80% { width: 90%; opacity: 0.7; }
          100% { width: 100%; opacity: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
