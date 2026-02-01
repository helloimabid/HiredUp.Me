export default function HeroSection() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              New jobs added in Dhaka &amp; Remote
            </div>
            <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Get hired up, <br />
              <span className="text-slate-400">not just hired.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
              The premier platform connecting top-tier freelancers and
              corporates. Find your next opportunity in Bangladesh and beyond
              with tools designed for modern careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Find Jobs
                <iconify-icon
                  icon="solar:arrow-right-linear"
                  width="18"
                  stroke-width="1.5"
                ></iconify-icon>
              </button>
              <button className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
                Post a Job
              </button>
            </div>
          </div>

          {/* Visual Illustration */}
          <div className="relative hidden lg:block h-full min-h-[400px]">
            {/* Abstract Laptop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-white rounded-xl border border-slate-200 shadow-2xl z-10 flex flex-col overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
              {/* Screen Header */}
              <div className="h-6 border-b border-slate-100 bg-slate-50 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              </div>
              {/* Screen Body */}
              <div className="flex-1 bg-slate-50/50 p-4 relative">
                {/* Abstract UI Elements */}
                <div className="w-1/3 h-3 bg-slate-200 rounded mb-3"></div>
                <div className="w-2/3 h-2 bg-slate-100 rounded mb-2"></div>
                <div className="w-1/2 h-2 bg-slate-100 rounded mb-6"></div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-white rounded border border-slate-100 p-2 shadow-sm">
                    <div className="w-6 h-6 rounded bg-indigo-100 mb-2"></div>
                    <div className="w-16 h-2 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-20 bg-white rounded border border-slate-100 p-2 shadow-sm">
                    <div className="w-6 h-6 rounded bg-emerald-100 mb-2"></div>
                    <div className="w-16 h-2 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Pin Element */}
            <div
              className="absolute top-20 right-10 bg-white p-3 rounded-lg shadow-xl border border-slate-100 z-20 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <iconify-icon
                    icon="solar:map-point-linear"
                    width="18"
                  ></iconify-icon>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-800">Bangladesh</div>
                  <div className="text-slate-400">1.2k+ Active Jobs</div>
                </div>
              </div>
            </div>

            {/* Abstract Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100/40 to-slate-100/40 rounded-full filter blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
