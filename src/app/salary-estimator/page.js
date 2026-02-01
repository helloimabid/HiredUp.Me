import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Salary Calculator Bangladesh 2025 - Know Your Worth | HiredUp.me",
  description:
    "Free salary calculator for Bangladesh. Get accurate salary estimates for Software Engineers, Developers, Designers, Marketers & more. Negotiate better with data-backed insights!",
  keywords: [
    "salary Bangladesh",
    "software engineer salary Dhaka",
    "developer salary Bangladesh",
    "salary calculator",
    "salary estimator",
    "average salary Bangladesh",
    "tech salary Bangladesh",
  ],
  openGraph: {
    title: "Salary Calculator Bangladesh 2025 | HiredUp.me",
    description: "Know your market value. Get accurate salary data for any role in Bangladesh.",
    url: "https://hiredup.me/salary-estimator",
  },
  alternates: {
    canonical: "https://hiredup.me/salary-estimator",
  },
};

const salaryData = [
  {
    role: "Software Engineer",
    min: "৳50,000",
    max: "৳150,000",
    avg: "৳85,000",
    currency: "BDT",
    location: "Bangladesh",
  },
  {
    role: "Frontend Developer",
    min: "৳45,000",
    max: "৳120,000",
    avg: "৳70,000",
    currency: "BDT",
    location: "Bangladesh",
  },
  {
    role: "Backend Developer",
    min: "৳50,000",
    max: "৳140,000",
    avg: "৳80,000",
    currency: "BDT",
    location: "Bangladesh",
  },
  {
    role: "UI/UX Designer",
    min: "৳40,000",
    max: "৳100,000",
    avg: "৳60,000",
    currency: "BDT",
    location: "Bangladesh",
  },
  {
    role: "Product Manager",
    min: "৳80,000",
    max: "৳200,000",
    avg: "৳120,000",
    currency: "BDT",
    location: "Bangladesh",
  },
  {
    role: "Data Analyst",
    min: "৳45,000",
    max: "৳110,000",
    avg: "৳65,000",
    currency: "BDT",
    location: "Bangladesh",
  },
  {
    role: "DevOps Engineer",
    min: "৳60,000",
    max: "৳180,000",
    avg: "৳100,000",
    currency: "BDT",
    location: "Bangladesh",
  },
  {
    role: "Marketing Manager",
    min: "৳50,000",
    max: "৳120,000",
    avg: "৳75,000",
    currency: "BDT",
    location: "Bangladesh",
  },
];

const remoteSalaryData = [
  {
    role: "Software Engineer",
    min: "$60,000",
    max: "$150,000",
    avg: "$95,000",
    location: "Remote (US)",
  },
  {
    role: "Frontend Developer",
    min: "$50,000",
    max: "$130,000",
    avg: "$80,000",
    location: "Remote (US)",
  },
  {
    role: "Backend Developer",
    min: "$55,000",
    max: "$140,000",
    avg: "$90,000",
    location: "Remote (US)",
  },
  {
    role: "UI/UX Designer",
    min: "$45,000",
    max: "$120,000",
    avg: "$75,000",
    location: "Remote (US)",
  },
  {
    role: "Product Manager",
    min: "$80,000",
    max: "$180,000",
    avg: "$120,000",
    location: "Remote (US)",
  },
  {
    role: "Data Analyst",
    min: "$55,000",
    max: "$110,000",
    avg: "$75,000",
    location: "Remote (US)",
  },
];

export default function SalaryEstimatorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              Salary Estimator
            </h1>
            <p className="text-slate-500">
              Know your worth. Compare salaries across roles and locations.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Job title (e.g. Software Engineer)"
                className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Bangladesh</option>
                <option>Remote (US)</option>
                <option>Remote (EU)</option>
                <option>India</option>
              </select>
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Bangladesh Salaries */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Salaries in Bangladesh (Monthly)
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Min
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Average
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Max
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salaryData.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.min}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-indigo-600">
                          {item.avg}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Remote Salaries */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Remote Salaries (Annual - USD)
            </h2>
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Min
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Average
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Max
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {remoteSalaryData.map((item, index) => (
                    <tr key={index} className="hover:bg-white">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.min}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-green-600">
                          {item.avg}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              * Remote salaries are typically paid by US/EU companies to remote
              workers worldwide.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Salary Negotiation Tips
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <iconify-icon
                    icon="solar:chart-2-linear"
                    width="20"
                  ></iconify-icon>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Research Market Rates
                </h3>
                <p className="text-sm text-slate-500">
                  Know the salary range for your role before negotiating. Data
                  is power.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  <iconify-icon
                    icon="solar:diploma-linear"
                    width="20"
                  ></iconify-icon>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Highlight Your Value
                </h3>
                <p className="text-sm text-slate-500">
                  Quantify your achievements and skills that justify higher
                  compensation.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                  <iconify-icon
                    icon="solar:hand-shake-linear"
                    width="20"
                  ></iconify-icon>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Consider Total Package
                </h3>
                <p className="text-sm text-slate-500">
                  Look beyond base salary—benefits, equity, and growth matter
                  too.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
