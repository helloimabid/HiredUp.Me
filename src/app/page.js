import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import WhySection from "@/components/WhySection";
import JobsSection from "@/components/JobsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { getJobs } from "@/lib/appwrite";

// Revalidate the page every 60 seconds
export const revalidate = 60;

async function fetchJobs() {
  try {
    const jobs = await getJobs(20);
    return jobs;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function Home() {
  const jobs = await fetchJobs();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SearchBar />
        <WhySection />
        <JobsSection jobs={jobs} showSampleData={jobs.length === 0} />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
