import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { fetchJobBatch } from "@/app/actions";
import JobFeed from "@/components/JobFeed";

export const metadata = {
  title: "Browse Jobs | HiredUp.me",
  description: "Find your perfect job from thousands of opportunities.",
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
