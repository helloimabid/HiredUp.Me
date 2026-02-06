import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Employers - Coming Soon | HiredUp.me",
  description:
    "Employer tools are coming soon. Post jobs and hire faster with HiredUp.me.",
  openGraph: {
    title: "Employers - Coming Soon",
    description: "Employer tools and hiring workflows — coming soon",
    url: "https://hiredup.me/employers",
  },
  alternates: {
    canonical: "https://hiredup.me/employers",
  },
};

export default function EmployersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-20">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center mb-8">
            <iconify-icon
              icon="solar:briefcase-linear"
              class="text-indigo-500 dark:text-indigo-400"
              width="40"
            ></iconify-icon>
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight mb-3">
            Employers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mb-8 max-w-sm mx-auto">
            We're building employer tools to help you post jobs, manage
            applicants, and hire faster. Stay tuned!
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-8">
            <iconify-icon
              icon="solar:clock-circle-linear"
              class="text-amber-500"
              width="16"
            ></iconify-icon>
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Coming Soon
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
            >
              <iconify-icon
                icon="solar:case-minimalistic-linear"
                width="16"
              ></iconify-icon>
              Post a Job
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
