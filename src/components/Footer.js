import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/logo.webp"
                alt="hiredup.me"
                width={120}
                height={32}
                className="h-6 w-auto"
              />
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Connecting Bangladesh&apos;s talent with the world. The modern
              platform for freelancers and corporates.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm">
              For Job Seekers
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/jobs" className="hover:text-indigo-600">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-indigo-600">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/salary-estimator"
                  className="hover:text-indigo-600"
                >
                  Salary Estimator
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="hover:text-indigo-600">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm">
              For Employers
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/post-job" className="hover:text-indigo-600">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/talent-search" className="hover:text-indigo-600">
                  Talent Search
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-indigo-600">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-indigo-600">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-400">
            © 2026 hiredup.me. All rights reserved. Made in Bangladesh.
          </div>
          <div className="flex gap-4 text-slate-400">
            <Link href="#" className="hover:text-slate-900 transition-colors">
              <iconify-icon
                icon="solar:camera-linear"
                width="20"
              ></iconify-icon>
            </Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              <iconify-icon
                icon="logos:twitter"
                width="18"
                style={{ filter: "grayscale(100%)" }}
              ></iconify-icon>
            </Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              <iconify-icon
                icon="logos:linkedin-icon"
                width="18"
                style={{ filter: "grayscale(100%)" }}
              ></iconify-icon>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
