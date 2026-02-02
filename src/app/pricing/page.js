import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

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
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <iconify-icon
                icon="solar:tag-price-linear"
                class="text-slate-400 dark:text-slate-500 text-4xl"
              ></iconify-icon>
            </div>

            {/* Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-100 dark:border-amber-800 mb-4">
              Coming Soon
            </span>

            {/* Title */}
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">
              Pricing Plans
            </h1>

            {/* Description */}
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
              We&apos;re working on simple, transparent pricing plans for
              employers. Right now, all job postings are completely free!
            </p>

            {/* Explicit Message Card */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-6 max-w-md mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <iconify-icon
                  icon="solar:verified-check-bold"
                  class="text-emerald-600 dark:text-emerald-400 text-xl"
                ></iconify-icon>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Currently Free for Everyone!
                </span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                During our launch period, employers can post unlimited jobs at
                no cost. Enjoy premium features for free while we build out our
                pricing tiers.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
            >
              <iconify-icon
                icon="solar:add-circle-linear"
                width="18"
              ></iconify-icon>
              Post a Job for Free
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
