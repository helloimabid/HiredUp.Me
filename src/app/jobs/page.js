import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { fetchJobBatch } from "@/app/actions";
import JobFeed from "@/components/JobFeed";

export const metadata = {
  title: "Browse 10,000+ Jobs in Bangladesh & Remote | HiredUp.me",
  description:
    "Find your perfect job from 10,000+ opportunities in Dhaka, Chittagong, Sylhet & remote worldwide. Apply now on HiredUp.me!",
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
  linkedin: {
    title: "Browse Jobs on HiredUp.me",
    description: "Find your dream job from thousands of opportunities",
  },
  alternates: {
    canonical: "https://hiredup.me/jobs",
  },
};

export default async function JobsPage({ searchParams }) {
  const params = await searchParams;

  // Fetch only the first 25 jobs server-side
  // This is now fast because we removed the counting bottleneck
  const { jobs } = await fetchJobBatch(1, 25, params);

  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 pt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-8 dark:text-white">
              Browse Jobs
            </h1>
            <SearchBar wrapperClassName="w-full max-w-4xl" />
          </div>

          {/* Pass initial jobs to Client Component for "Load More" functionality */}
          <JobFeed initialJobs={jobs} searchParams={params} />
        </div>
      </main>
      <Footer />
    </>
  );
}
