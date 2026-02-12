import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import WhySection from "@/components/WhySection";
import JobsSection from "@/components/JobsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { getJobs, getExactJobCount } from "@/lib/appwrite";

// Revalidate the page every 60 seconds
export const revalidate = 60;

// ============ HOMEPAGE SEO METADATA ============
export const metadata = {
  title:
    "HiredUp.me - Find Jobs in Bangladesh & Remote Worldwide | #1 Job Portal",
  description:
    "Bangladesh's leading job portal with 10,000+ opportunities in Dhaka, Chittagong, Sylhet & remote positions worldwide. Free job search for developers, designers, marketers & more. Get hired up today!",
  keywords: [
    "jobs Bangladesh",
    "Dhaka jobs",
    "remote jobs Bangladesh",
    "IT jobs Dhaka",
    "software developer jobs",
    "fresher jobs Bangladesh",
    "part time jobs Dhaka",
    "work from home Bangladesh",
    "government jobs BD",
    "bank jobs Bangladesh",
    "NGO jobs Dhaka",
    "marketing jobs",
    "sales jobs Bangladesh",
    "accounting jobs Dhaka",
  ],
  openGraph: {
    title: "HiredUp.me - Find Your Dream Job in Bangladesh & Worldwide",
    description:
      "Join thousands of professionals finding their perfect career match. Browse 10,000+ jobs in Bangladesh and remote positions globally.",
    url: "https://hiredup.me",
    images: [
      {
        url: "https://hiredup.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "HiredUp.me - Get hired up, not just hired",
      },
    ],
  },
  twitter: {
    title: "HiredUp.me - Jobs in Bangladesh & Remote Worldwide",
    description:
      "Find your dream job today! 10,000+ opportunities in Dhaka, Chittagong & remote positions.",
  },
  alternates: {
    canonical: "https://hiredup.me",
  },
};

async function fetchJobs() {
  // Add a timeout to prevent long waits
  const timeout = 15000; // 15 seconds
  try {
    const jobs = await Promise.race([
      getJobs(20),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching jobs")), timeout))
    ]);
    return jobs;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function Home() {

  // Add timeout to getExactJobCount as well
  const timeout = 15000; // 15 seconds
  let jobs = [];
  let jobCount = 0;
  try {
    [jobs, jobCount] = await Promise.all([
      fetchJobs(),
      Promise.race([
        getExactJobCount(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching job count")), timeout))
      ])
    ]);
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    // Fallback: jobs and jobCount already set to safe defaults
  }

  // JSON-LD Structured Data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HiredUp.me",
    url: "https://hiredup.me",
    logo: "https://hiredup.me/logo.webp",
    description:
      "Bangladesh's premier job portal connecting talented professionals with top employers.",
    foundingDate: "2024",
    founders: [{ "@type": "Person", name: "HiredUp Team" }],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Bangladesh",
      addressLocality: "Dhaka",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://hiredup.me/contact",
    },
    sameAs: [
      "https://twitter.com/haborymesadman",
      "https://linkedin.com/company/hiredup",
      "https://facebook.com/hiredup",
    ],
  };

  // JSON-LD for Website with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HiredUp.me",
    url: "https://hiredup.me",
    description: "Find jobs in Bangladesh and remote positions worldwide",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://hiredup.me/jobs?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // JSON-LD for Job Posting aggregate (guard against empty jobs)
  const jobBoardSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest Job Listings on HiredUp.me",
    description:
      "Browse the latest job opportunities in Bangladesh and remote worldwide",
    numberOfItems: jobs.length,
    itemListElement: Array.isArray(jobs)
      ? jobs.slice(0, 10).map((job, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "JobPosting",
            title: job.title,
            description:
              job.description || `${job.title} position at ${job.company}`,
            datePosted: job.$createdAt,
            hiringOrganization: {
              "@type": "Organization",
              name: job.company,
            },
            jobLocation: {
              "@type": "Place",
              address: job.location || "Remote",
            },
            url: job.slug
              ? `https://hiredup.me/jobs/${job.slug}`
              : `https://hiredup.me/jobs/${job.$id}`,
          },
        }))
      : [],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hiredup.me",
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobBoardSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-38NRXYJ3JQ"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-38NRXYJ3JQ');
      `,
        }}
      />
      <Header />
      <main>
        <HeroSection jobCount={jobCount} />
        <SearchBar />
        <WhySection />
        <JobsSection jobs={jobs} showSampleData={jobs.length === 0} />
        <HowItWorks />
        {/* <Testimonials /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
