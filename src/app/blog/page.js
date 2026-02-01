import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Blog - hiredup.me",
  description:
    "Career tips, industry insights, and job market trends from hiredup.me",
};

const blogPosts = [
  {
    id: 1,
    title: "Top 10 In-Demand Tech Skills in Bangladesh for 2026",
    excerpt:
      "Discover which technical skills are most sought after by employers in the Bangladeshi tech industry this year.",
    category: "Career Tips",
    date: "Jan 28, 2026",
    readTime: "5 min read",
    image: "bg-gradient-to-br from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "How to Negotiate Your Salary: A Complete Guide",
    excerpt:
      "Learn effective strategies to negotiate your salary and get paid what you deserve in your next job offer.",
    category: "Career Tips",
    date: "Jan 25, 2026",
    readTime: "8 min read",
    image: "bg-gradient-to-br from-green-500 to-teal-600",
  },
  {
    id: 3,
    title: "Remote Work in Bangladesh: Opportunities and Challenges",
    excerpt:
      "An in-depth look at the remote work landscape in Bangladesh and how to find international remote opportunities.",
    category: "Industry Insights",
    date: "Jan 22, 2026",
    readTime: "6 min read",
    image: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    id: 4,
    title: "Building a Portfolio That Gets You Hired",
    excerpt:
      "Tips from hiring managers on what makes a portfolio stand out and land you more interviews.",
    category: "Career Tips",
    date: "Jan 18, 2026",
    readTime: "7 min read",
    image: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    id: 5,
    title: "The Rise of Fintech Jobs in Bangladesh",
    excerpt:
      "Exploring the booming fintech sector and the career opportunities it offers for tech professionals.",
    category: "Industry Insights",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    image: "bg-gradient-to-br from-indigo-500 to-blue-600",
  },
  {
    id: 6,
    title: "Interview Tips: Common Questions and How to Answer Them",
    excerpt:
      "Prepare for your next interview with these frequently asked questions and expert-approved answers.",
    category: "Career Tips",
    date: "Jan 12, 2026",
    readTime: "10 min read",
    image: "bg-gradient-to-br from-yellow-500 to-orange-600",
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">Blog</h1>
            <p className="text-slate-500">
              Career tips, industry insights, and job market trends
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="#"
              className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-2">
                <div className={`${blogPosts[0].image} h-64 md:h-auto`}></div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-xs font-medium text-indigo-600 mb-2">
                    {blogPosts[0].category}
                  </span>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-slate-500 mb-4">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{blogPosts[0].date}</span>
                    <span>•</span>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <Link
                  key={post.id}
                  href="#"
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`${post.image} h-48`}></div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-indigo-600 mb-2 block">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-indigo-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-indigo-100 mb-8">
              Get the latest career tips and job market insights delivered to
              your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
