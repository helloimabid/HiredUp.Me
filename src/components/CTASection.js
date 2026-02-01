export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-6">
          Ready to get hired up?
        </h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          Join thousands of professionals and companies building the future of
          work in Bangladesh and beyond.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Find Jobs
          </button>
          <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
            Post a Job
          </button>
        </div>
      </div>
    </section>
  );
}
