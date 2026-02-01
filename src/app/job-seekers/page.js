import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "For Job Seekers - Find Your Dream Job in Bangladesh | HiredUp.me",
  description:
    "Your career journey starts here! Browse 1000+ jobs in Bangladesh - remote, tech, finance, marketing. Free resume builder, salary insights & job alerts. Land your dream job today!",
  keywords: [
    "job search Bangladesh",
    "find jobs Dhaka",
    "career opportunities",
    "remote jobs Bangladesh",
    "job seekers",
    "employment Bangladesh",
    "tech jobs",
  ],
  openGraph: {
    title: "Find Your Dream Job in Bangladesh | HiredUp.me",
    description: "Access thousands of job opportunities from top companies",
    url: "https://hiredup.me/job-seekers",
  },
  alternates: {
    canonical: "https://hiredup.me/job-seekers",
  },
};

export default function JobSeekersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              Access thousands of opportunities from top companies in Bangladesh
              and remote positions worldwide.
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Browse Jobs
              <iconify-icon
                icon="solar:arrow-right-linear"
                width="20"
              ></iconify-icon>
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 text-center mb-12">
              Why Job Seekers Love Us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <iconify-icon
                    icon="solar:magnifer-zoom-in-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Smart Job Matching
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our AI-powered system matches you with jobs that fit your
                  skills, experience, and career goals.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  <iconify-icon
                    icon="solar:verified-check-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Verified Companies
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  All companies on our platform are verified, so you can apply
                  with confidence knowing they&apos;re legitimate.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <iconify-icon
                    icon="solar:bell-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Job Alerts
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Get notified instantly when new jobs matching your preferences
                  are posted. Never miss an opportunity.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                  <iconify-icon
                    icon="solar:document-text-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Easy Applications
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Apply to multiple jobs with just one click using your saved
                  profile and resume.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                  <iconify-icon
                    icon="solar:chart-2-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Salary Insights
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Access salary data and market insights to negotiate better and
                  know your worth.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                  <iconify-icon
                    icon="solar:globe-linear"
                    width="24"
                  ></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Remote Opportunities
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Find remote jobs from companies worldwide. Work from
                  Bangladesh for global companies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 mb-6">
              Ready to Start?
            </h2>
            <p className="text-slate-500 mb-8">
              Create your free account and start applying to jobs today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/signup"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Create Account
              </a>
              <a
                href="/jobs"
                className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Browse Jobs First
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
