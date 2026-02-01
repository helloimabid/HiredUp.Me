"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search page with the query
    if (keyword.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(keyword)}&loc=${encodeURIComponent(location || "Remote")}`,
      );
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-200 p-2 lg:p-3">
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100"
        >
          {/* Keyword */}
          <div className="flex-1 px-4 py-3 lg:py-2 flex items-center gap-3">
            <iconify-icon
              icon="solar:magnifer-linear"
              class="text-slate-400 text-xl"
            ></iconify-icon>
            <div className="w-full">
              <label className="block text-xs font-medium text-slate-500 mb-0.5">
                What
              </label>
              <input
                type="text"
                placeholder="Job title, skill, or company"
                className="w-full text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent font-medium"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex-1 px-4 py-3 lg:py-2 flex items-center gap-3">
            <iconify-icon
              icon="solar:map-point-linear"
              class="text-slate-400 text-xl"
            ></iconify-icon>
            <div className="w-full">
              <label className="block text-xs font-medium text-slate-500 mb-0.5">
                Where
              </label>
              <input
                type="text"
                placeholder="Dhaka, Remote, or Global"
                className="w-full text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex-1 px-4 py-3 lg:py-2 flex items-center gap-3">
            <iconify-icon
              icon="solar:case-minimalistic-linear"
              class="text-slate-400 text-xl"
            ></iconify-icon>
            <div className="w-full relative group">
              <label className="block text-xs font-medium text-slate-500 mb-0.5">
                Type
              </label>
              <select
                className="w-full text-sm text-slate-900 bg-transparent outline-none appearance-none font-medium cursor-pointer"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="freelance">Freelance</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
              <iconify-icon
                icon="solar:alt-arrow-down-linear"
                class="absolute right-0 top-1 text-slate-400 pointer-events-none"
              ></iconify-icon>
            </div>
          </div>

          {/* Button */}
          <div className="p-2">
            <button
              type="submit"
              className="w-full lg:w-auto h-full px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <p className="text-center mt-3 text-xs text-slate-400">
        Popular: UI Design, React Developer, Content Writing, SEO Specialist
      </p>
    </section>
  );
}
