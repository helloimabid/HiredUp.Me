"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// Popular job categories for quick selection
const popularCategories = [
  { name: "Software Developer", icon: "solar:code-linear" },
  { name: "UI/UX Designer", icon: "solar:pallete-2-linear" },
  { name: "Data Analyst", icon: "solar:chart-2-linear" },
  { name: "Marketing Manager", icon: "solar:graph-up-linear" },
  { name: "Sales Representative", icon: "solar:chat-round-money-linear" },
  { name: "Content Writer", icon: "solar:pen-new-square-linear" },
  { name: "Project Manager", icon: "solar:clipboard-list-linear" },
  { name: "Accountant", icon: "solar:calculator-linear" },
  { name: "HR Manager", icon: "solar:users-group-rounded-linear" },
  { name: "Customer Support", icon: "solar:headphones-round-linear" },
  { name: "Teacher", icon: "solar:book-2-linear" },
  { name: "Nurse", icon: "solar:heart-pulse-linear" },
];

const locations = [
  "Remote",
  "Dhaka, Bangladesh",
  "Chittagong, Bangladesh",
  "Sylhet, Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "Singapore",
  "India",
  "Worldwide",
];

// Loading fallback for Suspense
function SearchLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-96 mx-auto mb-8"></div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                <div className="h-12 bg-slate-200 rounded mb-4"></div>
                <div className="h-12 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Main search component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Remote");
  const [saveToDb, setSaveToDb] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  // Auto-search if URL has query params
  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("loc");

    if (q) {
      setQuery(q);
      if (loc) setLocation(loc);
      handleSearch(q, loc || "Remote");
    }
  }, [searchParams]);

  const handleSearch = async (
    searchQuery = query,
    searchLocation = location,
  ) => {
    if (!searchQuery.trim()) {
      setError("Please enter a job type to search");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          location: searchLocation,
          save: saveToDb,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to search for jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setQuery(category);
    handleSearch(category, location);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Search Any Job Type
            </h1>
            <p className="text-slate-500 mb-8">
              Find jobs in any field - from tech to healthcare, marketing to
              finance. Just tell us what you&apos;re looking for.
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                    Job Title / Type
                  </label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Marketing Manager, Teacher, Nurse..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearch(query, location)
                    }
                  />
                </div>
                <div className="md:w-48">
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={saveToDb}
                    onChange={(e) => setSaveToDb(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Save results to job board
                </label>
                <button
                  onClick={() => handleSearch(query, location)}
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <iconify-icon
                        icon="solar:magnifer-linear"
                        width="18"
                      ></iconify-icon>
                      Search Jobs
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        {!results && !loading && (
          <section className="py-12">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 text-center">
                Popular Job Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {popularCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <iconify-icon
                        icon={category.icon}
                        width="20"
                      ></iconify-icon>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Error Message */}
        {error && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <iconify-icon
                  icon="solar:danger-triangle-linear"
                  class="text-red-500 text-2xl mb-2"
                ></iconify-icon>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Searching for jobs...
              </h3>
              <p className="text-slate-500 text-sm">
                Using AI to find the best matches for &quot;{query}&quot;
              </p>
            </div>
          </section>
        )}

        {/* Results */}
        {results && (
          <section className="py-8">
            <div className="max-w-5xl mx-auto px-4">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {results.success
                      ? `Found ${results.totalExtracted} jobs`
                      : "No results"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {results.message}
                    {results.method && (
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-xs">
                        via {results.method}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setResults(null)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  New Search
                </button>
              </div>

              {/* Job Cards */}
              {results.jobs && results.jobs.length > 0 ? (
                <div className="space-y-4">
                  {results.jobs.map((job, index) => (
                    <div
                      key={job.$id || index}
                      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-lg mb-1">
                            {job.title}
                          </h3>
                          <p className="text-indigo-600 font-medium mb-2">
                            {job.company}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                              <iconify-icon
                                icon="solar:map-point-linear"
                                width="16"
                              ></iconify-icon>
                              {job.location}
                            </span>
                          </div>
                          {job.description && (
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {job.description}
                            </p>
                          )}
                        </div>
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          Apply
                          <iconify-icon
                            icon="solar:arrow-right-up-linear"
                            width="16"
                          ></iconify-icon>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <iconify-icon
                    icon="solar:folder-open-linear"
                    class="text-slate-300 text-5xl mb-4"
                  ></iconify-icon>
                  <p className="text-slate-500">
                    No jobs found. Try a different search term.
                  </p>
                </div>
              )}

              {/* View All Link */}
              {results.savedCount > 0 && (
                <div className="text-center mt-8">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View all jobs on the board
                    <iconify-icon
                      icon="solar:arrow-right-linear"
                      width="18"
                    ></iconify-icon>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

// Export default with Suspense wrapper
export default function SearchJobsPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
