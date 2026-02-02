import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-16 pb-8"
      role="contentinfo"
      aria-label="Site footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Link href="/" aria-label="HiredUp.me Home">
                <Image
                  src="/logo.webp"
                  alt="HiredUp.me - Jobs in Bangladesh"
                  width={120}
                  height={32}
                  className="h-6 w-auto dark:brightness-200"
                />
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Bangladesh&apos;s leading job portal connecting talented
              professionals with top employers worldwide.
            </p>
            {/* SEO: Popular Job Searches */}
            <div className="mt-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                Popular Searches:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/search?q=software+developer"
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Software Developer
                </Link>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Link
                  href="/search?q=remote"
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Remote Jobs
                </Link>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Link
                  href="/search?q=dhaka"
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Dhaka Jobs
                </Link>
              </div>
            </div>
          </div>

          {/* Job Seekers */}
          <nav aria-label="Job seeker links">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
              For Job Seekers
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/salary-estimator"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Salary Estimator
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Career Blog
                </Link>
              </li>
            </ul>
          </nav>

          {/* Employers */}
          <nav aria-label="Employer links">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
              For Employers
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/post-job"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/talent-search"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Talent Search
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            © {currentYear} HiredUp.me. All rights reserved. Made with ❤️ in
            Bangladesh.
          </div>
          <div
            className="flex gap-4 text-slate-400 dark:text-slate-500"
            aria-label="Social media links"
          >
            <a
              href="https://instagram.com/hiredup"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
            >
              <iconify-icon
                icon="solar:camera-linear"
                width="20"
              ></iconify-icon>
            </a>
            <a
              href="https://twitter.com/haborymesadman"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Follow us on Twitter"
            >
              <iconify-icon
                icon="logos:twitter"
                width="18"
                style={{ filter: "grayscale(100%)" }}
              ></iconify-icon>
            </a>
            <a
              href="https://linkedin.com/company/hiredup"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <iconify-icon
                icon="logos:linkedin-icon"
                width="18"
                style={{ filter: "grayscale(100%)" }}
              ></iconify-icon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
