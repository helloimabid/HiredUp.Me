export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-slate-200 dark:bg-slate-700 -z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mb-6">
              <span className="font-bold text-xl">1</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Create your profile
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Sign up as a freelancer or employer. Build a profile that
              highlights your skills or brand.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mb-6">
              <span className="font-bold text-xl">2</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Post or Find a Job
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Browse listings with smart filters or post a detailed job
              description to attract talent.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mb-6">
              <span className="font-bold text-xl">3</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Get hired up
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Connect, interview, and start working securely. We handle the
              platform trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
