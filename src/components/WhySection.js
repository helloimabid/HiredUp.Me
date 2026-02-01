export default function WhySection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">
            Why hiredup.me?
          </h2>
          <p className="text-slate-500">
            Built for the modern workforce, connecting local talent with global
            opportunities seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <iconify-icon
                icon="solar:user-hand-up-linear"
                width="24"
              ></iconify-icon>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              For Freelancers
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Showcase your portfolio, get paid securely, and find projects that
              match your skills—locally or globally.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <iconify-icon
                icon="solar:buildings-2-linear"
                width="24"
              ></iconify-icon>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              For Corporates
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Streamline hiring with verified profiles. From quick gigs to
              full-time roles, find talent that delivers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <iconify-icon icon="solar:globe-linear" width="24"></iconify-icon>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Bangladesh-first, Global-ready
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Localized payment gateways and support, built with international
              standards to bridge the gap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
