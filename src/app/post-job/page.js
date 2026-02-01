import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Post a Job - Hire Top Talent in Bangladesh | HiredUp.me",
  description:
    "Post your job listing and reach 50,000+ qualified candidates in Bangladesh. Free job posting, premium features available. Hire developers, designers, marketers & more!",
  keywords: [
    "post job Bangladesh",
    "hire developers Bangladesh",
    "job posting",
    "free job posting",
    "recruit Bangladesh",
    "hire remote workers",
  ],
  openGraph: {
    title: "Post a Job & Hire Top Talent | HiredUp.me",
    description:
      "Reach qualified candidates in Bangladesh with your job listing",
    url: "https://hiredup.me/post-job",
  },
  alternates: {
    canonical: "https://hiredup.me/post-job",
  },
};

export default function PostJobPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Post a New Job
            </h1>
            <p className="text-slate-500 mb-8">
              Fill in the details below to create your job listing
            </p>

            <form className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Inc."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh or Remote"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Salary Min
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $50,000"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Salary Max
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $80,000"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Application URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Application URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://yourcompany.com/careers/apply"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  placeholder="Describe the role, responsibilities, requirements, and benefits..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Post Job
                </button>
                <button
                  type="button"
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-900 mb-2">
              Tips for a Great Job Post
            </h3>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li>
                • Use a clear, specific job title that candidates will search
                for
              </li>
              <li>
                • Include salary range to attract more qualified applicants
              </li>
              <li>• Describe your company culture and benefits</li>
              <li>• List required skills and nice-to-haves separately</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
