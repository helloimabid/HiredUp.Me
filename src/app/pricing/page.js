import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing - Affordable Job Posting Plans | HiredUp.me",
  description:
    "Simple, transparent pricing for employers. Start free, upgrade when you need more. Post jobs from ৳0/month. No hidden fees. Compare our Starter, Pro & Enterprise plans.",
  keywords: [
    "job posting price",
    "hiring cost Bangladesh",
    "recruitment pricing",
    "free job posting",
    "employer plans",
    "hiring platform pricing",
  ],
  openGraph: {
    title: "Affordable Hiring Plans - Start Free | HiredUp.me",
    description: "Transparent job posting pricing. No hidden fees.",
    url: "https://hiredup.me/pricing",
  },
  alternates: {
    canonical: "https://hiredup.me/pricing",
  },
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-semibold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, no
              surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Starter
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Perfect for small businesses
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">
                    Free
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>1 active job posting</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Basic candidate search</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>30-day job listing</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Email support</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-400">
                    <iconify-icon
                      icon="solar:close-circle-linear"
                      class="text-slate-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-400">
                    <iconify-icon
                      icon="solar:close-circle-linear"
                      class="text-slate-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Featured listings</span>
                  </li>
                </ul>
                <a
                  href="/signup"
                  className="block text-center w-full py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Get Started Free
                </a>
              </div>

              {/* Professional */}
              <div className="bg-indigo-600 rounded-2xl p-8 text-white relative hover:shadow-xl transition-shadow">
                <span className="absolute top-0 right-6 -translate-y-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  Most Popular
                </span>
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <p className="text-indigo-200 text-sm mb-6">
                  For growing companies
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-indigo-200">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-indigo-100">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>10 active job postings</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-indigo-100">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Advanced candidate search</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-indigo-100">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>60-day job listings</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-indigo-100">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-indigo-100">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-indigo-100">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-indigo-300 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>2 featured listings/month</span>
                  </li>
                </ul>
                <a
                  href="/signup"
                  className="block text-center w-full py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Start 14-Day Trial
                </a>
              </div>

              {/* Enterprise */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Enterprise
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  For large organizations
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">
                    Custom
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Unlimited job postings</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Unlimited candidate access</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Custom integrations (ATS)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>SLA guarantee</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <iconify-icon
                      icon="solar:check-circle-linear"
                      class="text-green-500 mt-0.5"
                      width="18"
                    ></iconify-icon>
                    <span>Invoice billing</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="block text-center w-full py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Can I upgrade or downgrade anytime?
                </h3>
                <p className="text-sm text-slate-600">
                  Yes, you can change your plan at any time. Changes take effect
                  immediately and are prorated.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-sm text-slate-600">
                  We accept all major credit cards, bKash, Nagad, and bank
                  transfers for Bangladesh customers.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Is there a contract or commitment?
                </h3>
                <p className="text-sm text-slate-600">
                  No long-term contracts. All plans are month-to-month and you
                  can cancel anytime.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Do you offer discounts for startups?
                </h3>
                <p className="text-sm text-slate-600">
                  Yes! We offer 50% off for verified startups in Bangladesh.
                  Contact us to learn more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
