import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getJobs } from "@/lib/appwrite";

export const revalidate = 60;

export const metadata = {
  title: "Browse Companies - hiredup.me",
  description:
    "Discover top companies hiring in Bangladesh and worldwide. Find your dream employer.",
};

async function getCompanies() {
  try {
    const jobs = await getJobs(100);
    // Extract unique companies from jobs
    const companyMap = new Map();

    jobs.forEach((job) => {
      if (job.company && !companyMap.has(job.company)) {
        companyMap.set(job.company, {
          name: job.company,
          jobCount: 1,
          locations: [job.location],
        });
      } else if (job.company) {
        const existing = companyMap.get(job.company);
        existing.jobCount++;
        if (!existing.locations.includes(job.location)) {
          existing.locations.push(job.location);
        }
      }
    });

    return Array.from(companyMap.values()).sort(
      (a, b) => b.jobCount - a.jobCount,
    );
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return [];
  }
}

// Sample companies when database is empty
const sampleCompanies = [
  {
    name: "Pathao",
    jobCount: 12,
    locations: ["Dhaka, Bangladesh"],
    industry: "Technology",
  },
  {
    name: "ShopUp",
    jobCount: 8,
    locations: ["Dhaka, Bangladesh"],
    industry: "E-commerce",
  },
  {
    name: "Brain Station",
    jobCount: 15,
    locations: ["Dhaka, Bangladesh", "Remote"],
    industry: "IT Services",
  },
  {
    name: "Vercel",
    jobCount: 5,
    locations: ["San Francisco, USA", "Remote"],
    industry: "Technology",
  },
  {
    name: "Stripe",
    jobCount: 7,
    locations: ["Dublin, Ireland", "Remote"],
    industry: "Fintech",
  },
  {
    name: "Grameenphone",
    jobCount: 20,
    locations: ["Dhaka, Bangladesh"],
    industry: "Telecommunications",
  },
  {
    name: "bKash",
    jobCount: 10,
    locations: ["Dhaka, Bangladesh"],
    industry: "Fintech",
  },
  {
    name: "Chaldal",
    jobCount: 6,
    locations: ["Dhaka, Bangladesh"],
    industry: "E-commerce",
  },
];

const colorMap = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-yellow-100", text: "text-yellow-600" },
];

export default async function CompaniesPage() {
  const companies = await getCompanies();
  const displayCompanies = companies.length > 0 ? companies : sampleCompanies;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              Browse Companies
            </h1>
            <p className="text-slate-500">
              Discover {displayCompanies.length} companies actively hiring
            </p>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayCompanies.map((company, index) => {
                const colors = colorMap[index % colorMap.length];
                return (
                  <Link
                    key={company.name}
                    href={`/jobs?q=${encodeURIComponent(company.name)}`}
                    className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all"
                  >
                    <div
                      className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} font-bold text-xl mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {company.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-1">
                      {company.locations?.join(", ") || "Multiple locations"}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-medium">
                        {company.jobCount} open position
                        {company.jobCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
