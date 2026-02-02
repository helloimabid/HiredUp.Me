export default function CTASection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-6">
          Ready to get hired up?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
          Join thousands of professionals and companies building the future of
          work in Bangladesh and beyond.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-slate-200 dark:shadow-slate-900">
            Find Jobs
          </button>
          <button className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
            Post a Job
          </button>
        </div>
      </div>
    </section>
  );
}
