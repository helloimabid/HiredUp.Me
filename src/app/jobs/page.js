// IMPROVED: src/app/jobs/page.js
// Removed disclaimer banner that hurts SEO
// Added better loading states and error handling

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { fetchJobBatch } from "@/app/actions";
import JobFeed from "@/components/JobFeed";

export const metadata = {
  title: "Browse 10,000+ Jobs in Bangladesh & Remote | HiredUp.me",
  description:
    "Find your perfect job from 10,000+ opportunities in Dhaka, Chittagong, Sylhet & remote worldwide. Updated daily with fresh listings. Apply now on HiredUp.me!",
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
    "latest jobs Bangladesh",
    "new job openings",
  ],
  openGraph: {
    title: "Browse Jobs - Find Your Dream Career | HiredUp.me",
    description:
      "10,000+ job opportunities waiting for you. Software developers, designers, marketers, accountants & more. Updated daily.",
    url: "https://hiredup.me/jobs",
    images: [{
      url: "https://hiredup.me/og-jobs.png",
      width: 1200,
      height: 630,
      alt: "Browse thousands of jobs on HiredUp.me"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Jobs on HiredUp.me",
    description: "Find your dream job from thousands of opportunities. Updated daily.",
    images: ["https://hiredup.me/og-jobs.png"],
  },
  alternates: {
    canonical: "https://hiredup.me/jobs",
  },
  robots: {
    index: true,
    follow: true,
    maxImagePreview: "large",
    maxSnippet: -1,
  }
};

export default async function JobsPage({ searchParams }) {
  const params = await searchParams;

  // Fetch initial jobs server-side
  const { jobs } = await fetchJobBatch(1, 25, params);

  // If search query active, show count
  const hasSearch = params?.q || params?.location || params?.category;

  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 pt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-2 dark:text-white">
              Browse Jobs
            </h1>
            {hasSearch && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {jobs.length > 0 
                  ? `Found ${jobs.length}+ matching opportunities`
                  : 'Refine your search to find more jobs'
                }
              </p>
            )}
            <SearchBar wrapperClassName="w-full max-w-4xl" />
          </div>
<<<<<<< HEAD

          {/* Only show help text if NO jobs found AND user searched */}
          {jobs.length === 0 && hasSearch && (
            <div className="w-full max-w-5xl mb-8 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No exact matches found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Try broadening your search or browse all available positions below
              </p>
              <button
                onClick={() => window.location.href = '/jobs'}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
              >
                View all jobs →
              </button>
            </div>
          )}

          {/* Pass initial jobs to Client Component for "Load More" */}
=======
          {/* Disclaimer Message */}
          <div className="w-full max-w-3xl mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-center">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm md:text-base">
              Many job posts may currently be unavailable. Please ignore these
              posts as our system is working to remove them.
            </p>
            <p className="text-yellow-800 dark:text-yellow-200 font-medium mt-1 text-sm md:text-base">
              Please search for your desired job in the search box.
            </p>
          </div>
          {/* Pass initial jobs to Client Component for "Load More" functionality */}
>>>>>>> parent of 75d5533 (feat: enhance SearchBar with loading state and city auto-detection)
          <JobFeed initialJobs={jobs} searchParams={params} />
        </div>
      </main>
      <Footer />
    </>
  );
}