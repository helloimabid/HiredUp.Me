import Link from "next/link";
import JobCard from "./JobCard";

// Sample jobs for display when database is empty
const sampleLocalJobs = [
  {
    $id: "sample-1",
    slug: "product-designer-at-pathao-sample1",
    title: "Product Designer",
    company: "Pathao",
    location: "Gulshan, Dhaka",
    apply_url: "#",
    $createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "sample-2",
    slug: "frontend-developer-at-shopup-sample2",
    title: "Frontend Developer",
    company: "ShopUp",
    location: "Banani, Dhaka (Hybrid)",
    apply_url: "#",
    $createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "sample-3",
    slug: "content-writer-at-brain-station-sample3",
    title: "Content Writer",
    company: "Brain Station",
    location: "Remote (BD)",
    apply_url: "#",
    $createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "sample-4",
    slug: "marketing-manager-at-ten-minute-sample4",
    title: "Marketing Manager",
    company: "Ten Minute",
    location: "Mirpur, Dhaka",
    apply_url: "#",
    $createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const sampleRemoteJobs = [
  {
    $id: "sample-5",
    slug: "senior-react-engineer-at-vercel-sample5",
    title: "Senior React Engineer",
    company: "Vercel",
    location: "San Francisco, USA (Remote)",
    apply_url: "#",
    $createdAt: new Date().toISOString(),
  },
  {
    $id: "sample-6",
    slug: "payment-integrator-at-stripe-sample6",
    title: "Payment Integrator",
    company: "Stripe",
    location: "Dublin, Ireland (Remote)",
    apply_url: "#",
    $createdAt: new Date().toISOString(),
  },
  {
    $id: "sample-7",
    slug: "visual-designer-at-dribbble-sample7",
    title: "Visual Designer",
    company: "Dribbble",
    location: "Vancouver, CA (Remote)",
    apply_url: "#",
    $createdAt: new Date().toISOString(),
  },
  {
    $id: "sample-8",
    slug: "seo-specialist-at-lemonade-sample8",
    title: "SEO Specialist",
    company: "Lemonade",
    location: "Berlin, DE (Remote)",
    apply_url: "#",
    $createdAt: new Date().toISOString(),
  },
];

export default function JobsSection({ jobs = [], showSampleData = true }) {
  // Separate jobs by location type
  const localJobs = jobs.filter(
    (job) =>
      !job.location?.toLowerCase().includes("remote") ||
      job.location?.toLowerCase().includes("bangladesh") ||
      job.location?.toLowerCase().includes("dhaka"),
  );

  const remoteJobs = jobs.filter(
    (job) =>
      job.location?.toLowerCase().includes("remote") &&
      !job.location?.toLowerCase().includes("bangladesh"),
  );

  // Use sample data if no real jobs exist
  const displayLocalJobs =
    localJobs.length > 0
      ? localJobs.slice(0, 4)
      : showSampleData
        ? sampleLocalJobs
        : [];
  const displayRemoteJobs =
    remoteJobs.length > 0
      ? remoteJobs.slice(0, 4)
      : showSampleData
        ? sampleRemoteJobs
        : [];

  return (
    <>
      {/* Trending Jobs (Bangladesh) */}
      <section className="py-20 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Trending jobs in Bangladesh
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                 Recent job listings in Bangladesh and across the world, updated daily.
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
            >
              View all
              <iconify-icon
                icon="solar:arrow-right-linear"
                class="group-hover:translate-x-0.5 transition-transform"
              ></iconify-icon>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayLocalJobs.map((job, index) => (
              <JobCard key={job.$id} job={job} index={index} />
            ))}
          </div>

          {displayLocalJobs.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <p>No local jobs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Remote Jobs (Worldwide) */}
      {/* <section className="py-20 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Remote jobs worldwide
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Work from anywhere for global companies.
              </p>
            </div>
            <Link
              href="/jobs?type=remote"
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
            >
              View all
              <iconify-icon
                icon="solar:arrow-right-linear"
                class="group-hover:translate-x-0.5 transition-transform"
              ></iconify-icon>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayRemoteJobs.map((job, index) => (
              <JobCard key={job.$id} job={job} index={index + 4} />
            ))}
          </div>

          {displayRemoteJobs.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <p>No remote jobs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section> */}
    </>
  );
}
