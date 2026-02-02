import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title:
    "Career Blog - Job Tips, Interview Guides & Industry Insights | HiredUp.me",
  description:
    "Expert career advice for Bangladesh job seekers. Resume tips, interview guides, salary negotiation strategies, remote work tips & industry trends. Level up your career!",
  keywords: [
    "career blog",
    "job tips Bangladesh",
    "interview tips",
    "resume writing",
    "salary negotiation",
    "career advice",
    "job search tips",
    "remote work guide",
  ],
  openGraph: {
    title: "HiredUp.me Career Blog - Expert Job Search Advice",
    description:
      "Tips, guides and insights to accelerate your career in Bangladesh",
    url: "https://hiredup.me/blog",
  },
  alternates: {
    canonical: "https://hiredup.me/blog",
  },
};

const blogPosts = [
  {
    id: 1,
    slug: "top-10-in-demand-tech-skills-bangladesh-2026",
    title: "Top 10 In-Demand Tech Skills in Bangladesh for 2026",
    excerpt:
      "Discover which technical skills are most sought after by employers in the Bangladeshi tech industry this year.",
    category: "Career Tips",
    date: "Jan 28, 2026",
    readTime: "5 min read",
  },
  {
    id: 2,
    slug: "how-to-negotiate-your-salary-complete-guide",
    title: "How to Negotiate Your Salary: A Complete Guide",
    excerpt:
      "Learn effective strategies to negotiate your salary and get paid what you deserve in your next job offer.",
    category: "Career Tips",
    date: "Jan 25, 2026",
    readTime: "8 min read",
  },
  {
    id: 3,
    slug: "remote-work-bangladesh-opportunities-challenges",
    title: "Remote Work in Bangladesh: Opportunities and Challenges",
    excerpt:
      "An in-depth look at the remote work landscape in Bangladesh and how to find international remote opportunities.",
    category: "Industry Insights",
    date: "Jan 22, 2026",
    readTime: "6 min read",
  },
  {
    id: 4,
    slug: "building-portfolio-that-gets-you-hired",
    title: "Building a Portfolio That Gets You Hired",
    excerpt:
      "Tips from hiring managers on what makes a portfolio stand out and land you more interviews.",
    category: "Career Tips",
    date: "Jan 18, 2026",
    readTime: "7 min read",
  },
  {
    id: 5,
    slug: "rise-of-fintech-jobs-bangladesh",
    title: "The Rise of Fintech Jobs in Bangladesh",
    excerpt:
      "Exploring the booming fintech sector and the career opportunities it offers for tech professionals.",
    category: "Industry Insights",
    date: "Jan 15, 2026",
    readTime: "5 min read",
  },
  {
    id: 6,
    slug: "interview-tips-common-questions-how-to-answer",
    title: "Interview Tips: Common Questions and How to Answer Them",
    excerpt:
      "Prepare for your next interview with these frequently asked questions and expert-approved answers.",
    category: "Career Tips",
    date: "Jan 12, 2026",
    readTime: "10 min read",
  },
];

// Category badge styles
function getCategoryStyles(category) {
  if (category === "Industry Insights") {
    return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800";
  }
  return "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800";
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 pt-12 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blog Header */}
          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">
              Blog
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Career tips, industry insights, and job market trends to help you
              navigate your professional journey.
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all duration-300"
              >
                {/* Category & Date Row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getCategoryStyles(post.category)}`}
                  >
                    {post.category}
                  </span>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {post.date}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Read Time Footer */}
                <div className="mt-auto flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium pt-4 border-t border-slate-100 dark:border-slate-700">
                  <iconify-icon
                    icon="solar:clock-circle-linear"
                    width="14"
                  ></iconify-icon>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-200/50 dark:bg-slate-700/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-slate-200/50 dark:bg-slate-700/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-lg">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Get the latest career tips and job market insights delivered to
                your inbox
              </p>

              <form className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:border-slate-900 dark:focus:border-indigo-500 transition-all"
                  />
                </div>
                <button
                  type="button"
                  className="h-10 px-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Subscribe
                  <iconify-icon icon="solar:letter-linear"></iconify-icon>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
