import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Hiring Resources - Free Templates & Guides | HiredUp.me",
  description:
    "Free hiring resources for employers. Download job description templates, interview guides, salary benchmarks, and onboarding checklists. Build better teams!",
  keywords: [
    "hiring resources",
    "job description templates",
    "interview guide",
    "hiring tips",
    "recruitment resources",
    "HR templates",
  ],
  openGraph: {
    title: "Free Hiring Resources for Employers | HiredUp.me",
    description: "Templates, guides, and tools to help you hire better",
    url: "https://hiredup.me/resources",
  },
  alternates: {
    canonical: "https://hiredup.me/resources",
  },
};

const resources = [
  {
    title: "Job Description Templates",
    description:
      "Ready-to-use templates for common tech roles. Just customize and post.",
    icon: "solar:document-text-linear",
    color: "bg-blue-100 text-blue-600",
    link: "#",
  },
  {
    title: "Interview Question Bank",
    description: "Curated questions for technical and behavioral interviews.",
    icon: "solar:chat-round-check-linear",
    color: "bg-green-100 text-green-600",
    link: "#",
  },
  {
    title: "Salary Benchmarks",
    description: "Up-to-date salary data for Bangladesh and remote positions.",
    icon: "solar:chart-2-linear",
    color: "bg-purple-100 text-purple-600",
    link: "/salary-estimator",
  },
  {
    title: "Hiring Process Guide",
    description: "Best practices for structuring your recruitment process.",
    icon: "solar:routing-linear",
    color: "bg-orange-100 text-orange-600",
    link: "#",
  },
  {
    title: "Offer Letter Templates",
    description:
      "Professional offer letter templates that comply with local regulations.",
    icon: "solar:letter-linear",
    color: "bg-pink-100 text-pink-600",
    link: "#",
  },
  {
    title: "Remote Hiring Guide",
    description:
      "Everything you need to know about hiring remote workers in Bangladesh.",
    icon: "solar:globe-linear",
    color: "bg-teal-100 text-teal-600",
    link: "#",
  },
];

const guides = [
  {
    title: "How to Write a Great Job Post",
    readTime: "5 min read",
  },
  {
    title: "Screening Candidates Effectively",
    readTime: "8 min read",
  },
  {
    title: "Making Competitive Offers",
    readTime: "6 min read",
  },
  {
    title: "Onboarding Best Practices",
    readTime: "10 min read",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              Employer Resources
            </h1>
            <p className="text-slate-500">
              Tools, templates, and guides to help you hire better.
            </p>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Tools & Templates
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.link}
                  className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all"
                >
                  <div
                    className={`w-12 h-12 ${resource.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <iconify-icon
                      icon={resource.icon}
                      width="24"
                    ></iconify-icon>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {resource.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Hiring Guides
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {guides.map((guide, index) => (
                <Link
                  key={index}
                  href="#"
                  className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <iconify-icon
                      icon="solar:book-bookmark-linear"
                      class="text-indigo-500 text-xl"
                    ></iconify-icon>
                    <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {guide.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {guide.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Need Personalized Help?
            </h2>
            <p className="text-slate-500 mb-8">
              Our team can help you build a hiring strategy tailored to your
              needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Contact Our Team
              <iconify-icon
                icon="solar:arrow-right-linear"
                width="18"
              ></iconify-icon>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
