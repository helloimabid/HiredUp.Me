import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Success Stories - hiredup.me",
  description:
    "Read inspiring stories from professionals who found their dream jobs through hiredup.me",
};

const stories = [
  {
    id: 1,
    name: "Arafat Hossain",
    role: "Senior UI Designer",
    company: "Vercel",
    location: "Dhaka, Bangladesh (Remote)",
    image: "bg-gradient-to-br from-blue-400 to-indigo-600",
    quote:
      "hiredup.me connected me with a US startup within a week. The platform made it easy to showcase my portfolio and find remote opportunities that matched my skills.",
    previousRole: "Junior Designer at a local agency",
    salaryIncrease: "3x",
  },
  {
    id: 2,
    name: "Fatima Rahman",
    role: "Full Stack Developer",
    company: "Stripe",
    location: "Dublin, Ireland (Remote)",
    image: "bg-gradient-to-br from-green-400 to-teal-600",
    quote:
      "I never thought I could work for a global fintech company from Bangladesh. hiredup.me opened doors I didn&apos;t even know existed.",
    previousRole: "Backend Developer at bKash",
    salaryIncrease: "4x",
  },
  {
    id: 3,
    name: "Tanvir Ahmed",
    role: "DevOps Engineer",
    company: "Shopify",
    location: "Remote",
    image: "bg-gradient-to-br from-orange-400 to-red-600",
    quote:
      "The verified job listings gave me confidence to apply. Within two months, I landed my dream role at Shopify.",
    previousRole: "System Administrator at Grameenphone",
    salaryIncrease: "2.5x",
  },
  {
    id: 4,
    name: "Sarah Khan",
    role: "Product Manager",
    company: "Pathao",
    location: "Dhaka, Bangladesh",
    image: "bg-gradient-to-br from-pink-400 to-rose-600",
    quote:
      "After years in marketing, I wanted to transition to product. hiredup.me helped me find companies willing to take a chance on career changers.",
    previousRole: "Marketing Manager at Robi",
    salaryIncrease: "1.5x",
  },
  {
    id: 5,
    name: "Rifat Islam",
    role: "Data Scientist",
    company: "Remote US Startup",
    location: "Sylhet, Bangladesh (Remote)",
    image: "bg-gradient-to-br from-purple-400 to-indigo-600",
    quote:
      "Coming from a tier-2 city, I thought remote work was impossible. hiredup.me proved me wrong. Now I work for a Silicon Valley startup from Sylhet.",
    previousRole: "Research Assistant at SUST",
    salaryIncrease: "5x",
  },
  {
    id: 6,
    name: "Nadia Akter",
    role: "Content Strategist",
    company: "HubSpot",
    location: "Remote",
    image: "bg-gradient-to-br from-yellow-400 to-orange-600",
    quote:
      "The job alerts feature helped me catch opportunities as soon as they were posted. That&apos;s how I landed my role at HubSpot.",
    previousRole: "Content Writer at Brain Station",
    salaryIncrease: "3x",
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-semibold mb-4">Success Stories</h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Real people, real jobs, real transformations. Get inspired by our
              community.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  15,000+
                </div>
                <div className="text-sm text-slate-500">Jobs Landed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  2.5x
                </div>
                <div className="text-sm text-slate-500">
                  Avg Salary Increase
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  500+
                </div>
                <div className="text-sm text-slate-500">Remote Placements</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  98%
                </div>
                <div className="text-sm text-slate-500">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`${story.image} h-32`}></div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 ${story.image} rounded-full -mt-12 border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-bold`}
                      >
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {story.name}
                        </h3>
                        <p className="text-sm text-slate-500">{story.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                        {story.company}
                      </span>
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                        {story.salaryIncrease} salary
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      &quot;{story.quote}&quot;
                    </p>

                    <div className="text-xs text-slate-400">
                      <span className="font-medium">Previously:</span>{" "}
                      {story.previousRole}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-4">
              Write Your Success Story
            </h2>
            <p className="text-slate-300 mb-8">
              Join thousands who&apos;ve transformed their careers with
              hiredup.me
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Start Your Journey
              <iconify-icon
                icon="solar:arrow-right-linear"
                width="20"
              ></iconify-icon>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
