import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "404 - Page Not Found | HiredUp.me",
  description:
    "The page you're looking for doesn't exist. Find your dream job among thousands of opportunities on HiredUp.me.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="max-w-md mx-auto text-center px-4">
          {/* 404 Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <iconify-icon
              icon="solar:map-point-search-bold-duotone"
              width="48"
              class="text-indigo-600"
            ></iconify-icon>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            Oops! The page you&apos;re looking for seems to have wandered off.
            Let&apos;s get you back on track to finding your dream job.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <iconify-icon icon="solar:home-2-bold" width="20"></iconify-icon>
              Go Home
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <iconify-icon
                icon="solar:magnifer-bold"
                width="20"
              ></iconify-icon>
              Browse Jobs
            </Link>
          </div>

          {/* Popular Links */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              Popular Pages
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/search"
                className="px-3 py-1.5 text-sm text-slate-600 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Search Jobs
              </Link>
              <Link
                href="/companies"
                className="px-3 py-1.5 text-sm text-slate-600 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Companies
              </Link>
              <Link
                href="/salary-estimator"
                className="px-3 py-1.5 text-sm text-slate-600 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Salary Estimator
              </Link>
              <Link
                href="/blog"
                className="px-3 py-1.5 text-sm text-slate-600 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Career Blog
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
