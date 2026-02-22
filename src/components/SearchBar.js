"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function SearchBar({ className, wrapperClassName }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading after navigation
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    // Navigate to jobs page with the query
    if (keyword.trim()) {
      const params = new URLSearchParams();
      params.set("q", keyword);
      if (location) params.set("location", location);
      if (jobType) params.set("type", jobType);
      router.push(`/jobs?${params.toString()}`);
    } else {
      router.push("/jobs");
    }
    // Loader will reset after navigation
  };

  return (
    <section
      className={
        wrapperClassName ||
        "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20"
      }
    >
      <div
        className={
          className ||
          "bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-200 dark:border-slate-700 p-2 lg:p-3"
        }
      >
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-700"
        >
          {/* Keyword */}
          <div className="flex-1 px-4 py-3 lg:py-2 flex items-center gap-3">
            <iconify-icon
              icon="solar:magnifer-linear"
              class="text-slate-400 dark:text-slate-500 text-xl"
            ></iconify-icon>
            <div className="w-full">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                What
              </label>
              <input
                type="text"
                placeholder="Job title, skill, or company"
                className="w-full text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none bg-transparent font-medium"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex-1 px-4 py-3 lg:py-2 flex items-center gap-3">
            <iconify-icon
              icon="solar:map-point-linear"
              class="text-slate-400 dark:text-slate-500 text-xl"
            ></iconify-icon>
            <div className="w-full">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                Where
              </label>
              <input
                type="text"
                placeholder="Dhaka, Remote, or Global"
                className="w-full text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none bg-transparent font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex-1 px-4 py-3 lg:py-2 flex items-center gap-3">
            <iconify-icon
              icon="solar:case-minimalistic-linear"
              class="text-slate-400 dark:text-slate-500 text-xl"
            ></iconify-icon>
            <div className="w-full relative group">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                Type
              </label>
              <select
                className="w-full text-sm text-slate-900 dark:text-white bg-transparent outline-none appearance-none font-medium cursor-pointer"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="" className="dark:bg-slate-800">
                  All Job Types
                </option>
                <option value="freelance" className="dark:bg-slate-800">
                  Freelance
                </option>
                <option value="full-time" className="dark:bg-slate-800">
                  Full-time
                </option>
                <option value="contract" className="dark:bg-slate-800">
                  Contract
                </option>
                <option value="remote" className="dark:bg-slate-800">
                  Remote
                </option>
              </select>
              <iconify-icon
                icon="solar:alt-arrow-down-linear"
                class="absolute right-0 top-1 text-slate-400 dark:text-slate-500 pointer-events-none"
              ></iconify-icon>
            </div>
          </div>

          {/* Button */}
          <div className="p-2">
            <button
              type="submit"
              className="w-full lg:w-auto h-full px-8 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>
      </div>
      <p className="text-center mt-3 text-xs text-slate-400 dark:text-slate-500">
        Popular: UI Design, React Developer, Content Writing, SEO Specialist
      </p>
    </section>
  );
}

export default SearchBar;
