import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Success Stories - Real Career Transformations | HiredUp.me",
  description:
    "Read inspiring stories from Bangladeshi professionals who landed dream jobs through HiredUp.me. Remote jobs at Vercel, Stripe, Google & more. See how they 3x their salary!",
  keywords: [
    "job success stories",
    "career transformation",
    "Bangladesh remote jobs",
    "hired at Google",
    "remote job success",
    "career change stories",
  ],
  openGraph: {
    title: "Real Success Stories from HiredUp.me Users",
    description:
      "Inspiring career transformations from Bangladesh professionals",
    url: "https://hiredup.me/success-stories",
  },
  alternates: {
    canonical: "https://hiredup.me/success-stories",
  },
};

export default function SuccessStoriesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <iconify-icon
                icon="solar:star-shine-linear"
                class="text-slate-400 dark:text-slate-500 text-4xl"
              ></iconify-icon>
            </div>

            {/* Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-100 dark:border-amber-800 mb-4">
              Coming Soon
            </span>

            {/* Title */}
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">
              Success Stories
            </h1>

            {/* Description */}
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
              Inspiring career transformations from Bangladesh professionals.
              We&apos;re collecting stories from job seekers who found their
              dream roles.
            </p>

            {/* CTA */}
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
            >
              <iconify-icon
                icon="solar:magnifer-linear"
                width="18"
              ></iconify-icon>
              Start Your Story
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
