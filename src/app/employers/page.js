import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "For Employers - hiredup.me",
  description:
    "Find top talent in Bangladesh and worldwide. Post jobs, search candidates, and build your dream team.",
};

export default function EmployersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold mb-6">
              Find Top Talent
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Access a pool of verified professionals in Bangladesh and
              worldwide. Build your dream team today.
            </p>
            <a
              href="/post-job"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Post a Job
              <iconify-icon
                icon="solar:arrow-right-linear"
                width="20"
              ></iconify-icon>
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  50K+
                </div>
                <div className="text-sm text-slate-500">Active Job Seekers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  1.2K+
                </div>
                <div className="text-sm text-slate-500">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  10K+
                </div>
                <div className="text-sm text-slate-500">Jobs Posted</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  85%
                </div>
                <div className="text-sm text-slate-500">Hire Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 text-center mb-12">
              Why Companies Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <iconify-icon
                    icon="solar:users-group-rounded-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Verified Talent Pool
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Access pre-verified candidates with confirmed skills and
                  experience. No more guessing.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  <iconify-icon
                    icon="solar:target-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Smart Matching
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our AI matches your job requirements with the best candidates
                  automatically.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <iconify-icon
                    icon="solar:clock-circle-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Quick Hiring
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Reduce time-to-hire by 60% with our streamlined recruitment
                  process.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                  <iconify-icon
                    icon="solar:hand-money-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Cost Effective
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Flexible pricing plans that scale with your hiring needs. Pay
                  only for what you use.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                  <iconify-icon
                    icon="solar:chart-square-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Analytics Dashboard
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Track applications, measure engagement, and optimize your job
                  postings.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                  <iconify-icon
                    icon="solar:shield-check-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Secure Platform
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enterprise-grade security to protect your company and
                  candidate data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 text-center mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-500 text-center mb-12">
              Start free, upgrade when you need more
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Starter
                </h3>
                <div className="text-3xl font-bold text-slate-900 mb-4">
                  Free
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500"
                    ></iconify-icon>
                    1 active job posting
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500"
                    ></iconify-icon>
                    Basic candidate search
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500"
                    ></iconify-icon>
                    Email support
                  </li>
                </ul>
                <a
                  href="/signup"
                  className="block text-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white transition-colors"
                >
                  Get Started
                </a>
              </div>

              <div className="bg-indigo-600 p-8 rounded-2xl border border-indigo-500 text-white relative">
                <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
                  Popular
                </span>
                <h3 className="text-lg font-semibold mb-2">Professional</h3>
                <div className="text-3xl font-bold mb-4">
                  $99
                  <span className="text-lg font-normal text-indigo-200">
                    /mo
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-indigo-100 mb-8">
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300"
                    ></iconify-icon>
                    10 active job postings
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300"
                    ></iconify-icon>
                    Advanced talent search
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300"
                    ></iconify-icon>
                    Analytics dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300"
                    ></iconify-icon>
                    Priority support
                  </li>
                </ul>
                <a
                  href="/signup"
                  className="block text-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Start Trial
                </a>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Enterprise
                </h3>
                <div className="text-3xl font-bold text-slate-900 mb-4">
                  Custom
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500"
                    ></iconify-icon>
                    Unlimited job postings
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500"
                    ></iconify-icon>
                    Dedicated account manager
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500"
                    ></iconify-icon>
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500"
                    ></iconify-icon>
                    SLA guarantee
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="block text-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
