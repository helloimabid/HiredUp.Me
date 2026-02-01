import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Talent Search - Find Top Candidates in Bangladesh | HiredUp.me",
  description:
    "Search 50,000+ verified candidates in Bangladesh. Find developers, designers, marketers & more. Use filters for skills, experience, and availability. Hire faster!",
  keywords: [
    "talent search Bangladesh",
    "find candidates",
    "hire developers",
    "candidate database",
    "recruitment search",
    "talent pool Bangladesh",
  ],
  openGraph: {
    title: "Search Top Talent in Bangladesh | HiredUp.me",
    description: "Find and connect with verified professionals",
    url: "https://hiredup.me/talent-search",
  },
  alternates: {
    canonical: "https://hiredup.me/talent-search",
  },
};

export default function TalentSearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-6">
              Find Top Talent
            </h1>

            <form className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="React, Python, Design..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Location
                  </label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Any Location</option>
                    <option>Bangladesh</option>
                    <option>Dhaka</option>
                    <option>Remote Only</option>
                    <option>Worldwide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Experience
                  </label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Any Experience</option>
                    <option>Entry Level (0-2 years)</option>
                    <option>Mid Level (3-5 years)</option>
                    <option>Senior (5+ years)</option>
                    <option>Lead/Principal (8+ years)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Search Talent
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500 mb-6">
              Showing sample talent profiles. Sign up to access full database.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Talent Cards */}
              {[
                {
                  name: "Ahmed K.",
                  role: "Senior React Developer",
                  location: "Dhaka",
                  skills: ["React", "TypeScript", "Node.js"],
                  experience: "6 years",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  name: "Fatima R.",
                  role: "UI/UX Designer",
                  location: "Remote",
                  skills: ["Figma", "User Research", "Prototyping"],
                  experience: "4 years",
                  color: "bg-pink-100 text-pink-600",
                },
                {
                  name: "Rifat I.",
                  role: "Full Stack Developer",
                  location: "Chittagong",
                  skills: ["Python", "Django", "React"],
                  experience: "5 years",
                  color: "bg-green-100 text-green-600",
                },
                {
                  name: "Sarah M.",
                  role: "Product Manager",
                  location: "Dhaka",
                  skills: ["Agile", "Analytics", "Strategy"],
                  experience: "7 years",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  name: "Tanvir A.",
                  role: "DevOps Engineer",
                  location: "Remote",
                  skills: ["AWS", "Kubernetes", "CI/CD"],
                  experience: "5 years",
                  color: "bg-orange-100 text-orange-600",
                },
                {
                  name: "Nadia K.",
                  role: "Data Scientist",
                  location: "Dhaka",
                  skills: ["Python", "ML", "SQL"],
                  experience: "4 years",
                  color: "bg-teal-100 text-teal-600",
                },
              ].map((talent, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl ${talent.color} flex items-center justify-center font-bold text-lg`}
                    >
                      {talent.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {talent.name}
                      </h3>
                      <p className="text-sm text-slate-500">{talent.role}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        <iconify-icon
                          icon="solar:map-point-linear"
                          class="mr-1"
                        ></iconify-icon>
                        {talent.location} • {talent.experience}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {talent.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2 border border-indigo-200 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                    View Profile
                  </button>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Unlock Full Talent Database
              </h2>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                Get access to 50,000+ verified professionals with advanced
                filters, direct messaging, and candidate tracking.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                View Pricing
                <iconify-icon
                  icon="solar:arrow-right-linear"
                  width="18"
                ></iconify-icon>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
