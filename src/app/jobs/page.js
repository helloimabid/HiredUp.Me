import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { getJobs } from "@/lib/appwrite";
import Link from "next/link";

export const revalidate = 60;

// ============ JOBS PAGE SEO METADATA ============
export const metadata = {
  title: "Browse 10,000+ Jobs in Bangladesh & Remote | HiredUp.me",
  description:
    "Find your perfect job from 10,000+ opportunities in Dhaka, Chittagong, Sylhet & remote worldwide. Filter by industry, experience level, salary. Apply now on HiredUp.me!",
  keywords: [
    "job listings Bangladesh",
    "jobs in Dhaka",
    "remote jobs",
    "IT jobs Bangladesh",
    "fresher jobs",
    "experienced jobs",
    "part time jobs",
    "full time jobs",
    "contract jobs",
    "freelance work",
    "work from home",
  ],
  openGraph: {
    title: "Browse Jobs - Find Your Dream Career | HiredUp.me",
    description:
      "10,000+ job opportunities waiting for you. Software developers, designers, marketers, accountants & more.",
    url: "https://hiredup.me/jobs",
  },
  twitter: {
    title: "Browse Jobs on HiredUp.me",
    description: "Find your dream job from thousands of opportunities",
  },
  alternates: {
    canonical: "https://hiredup.me/jobs",
  },
};

async function fetchAllJobs() {
  try {
    const jobs = await getJobs(100);
    return jobs;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function JobsPage({ searchParams }) {
  const jobs = await fetchAllJobs();
  const params = await searchParams;
  const typeFilter = params?.type || "";
  const locationFilter = params?.location || "";
  const searchQuery = params?.q || "";

  // Filter jobs based on query params
  let filteredJobs = jobs;

  if (typeFilter) {
    filteredJobs = filteredJobs.filter((job) =>
      job.location?.toLowerCase().includes(typeFilter.toLowerCase()),
    );
  }

  if (locationFilter) {
    filteredJobs = filteredJobs.filter((job) =>
      job.location?.toLowerCase().includes(locationFilter.toLowerCase()),
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query),
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              Browse Jobs
            </h1>
            <p className="text-slate-500">
              Find your next opportunity from {jobs.length} available positions
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b border-slate-100 py-4 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  name="q"
                  placeholder="Search jobs..."
                  defaultValue={searchQuery}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                name="type"
                defaultValue={typeFilter}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="dhaka">Dhaka</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Filter
              </button>
              {(typeFilter || locationFilter || searchQuery) && (
                <Link
                  href="/jobs"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm"
                >
                  Clear filters
                </Link>
              )}
            </form>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredJobs.length > 0 ? (
              <>
                <p className="text-sm text-slate-500 mb-6">
                  Showing {filteredJobs.length} job
                  {filteredJobs.length !== 1 ? "s" : ""}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredJobs.map((job, index) => (
                    <JobCard key={job.$id} job={job} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <iconify-icon
                  icon="solar:magnifer-linear"
                  class="text-slate-300 text-6xl mb-4"
                ></iconify-icon>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-500 mb-6">
                  Try adjusting your search or filters
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  View all jobs
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
