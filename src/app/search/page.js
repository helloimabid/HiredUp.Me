"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Search limit for free users
const FREE_SEARCH_LIMIT = 2;

// Job categories organized by industry
const jobCategories = {
  "Technology & IT": [
    { name: "Software Developer", icon: "solar:code-linear" },
    { name: "Frontend Developer", icon: "solar:monitor-linear" },
    { name: "Backend Developer", icon: "solar:server-linear" },
    { name: "Full Stack Developer", icon: "solar:layers-linear" },
    { name: "Mobile App Developer", icon: "solar:smartphone-linear" },
    { name: "DevOps Engineer", icon: "solar:cloud-linear" },
    { name: "Data Scientist", icon: "solar:graph-new-linear" },
    { name: "Data Analyst", icon: "solar:chart-2-linear" },
    { name: "Machine Learning Engineer", icon: "solar:cpu-bolt-linear" },
    { name: "AI Engineer", icon: "solar:magic-stick-linear" },
    { name: "Cybersecurity Analyst", icon: "solar:shield-linear" },
    { name: "Network Engineer", icon: "solar:global-linear" },
    { name: "System Administrator", icon: "solar:settings-linear" },
    { name: "QA Engineer", icon: "solar:bug-linear" },
    { name: "UI/UX Designer", icon: "solar:pallete-2-linear" },
    { name: "Database Administrator", icon: "solar:database-linear" },
    { name: "Cloud Architect", icon: "solar:cloud-bolt-linear" },
    { name: "IT Support Specialist", icon: "solar:monitor-smartphone-linear" },
  ],
  "Business & Finance": [
    { name: "Accountant", icon: "solar:calculator-linear" },
    { name: "Financial Analyst", icon: "solar:chart-square-linear" },
    { name: "Business Analyst", icon: "solar:case-linear" },
    { name: "Investment Banker", icon: "solar:bank-linear" },
    { name: "Auditor", icon: "solar:clipboard-check-linear" },
    { name: "Tax Consultant", icon: "solar:document-linear" },
    { name: "Risk Manager", icon: "solar:shield-warning-linear" },
    { name: "Management Consultant", icon: "solar:lightbulb-linear" },
    { name: "Operations Manager", icon: "solar:diagram-up-linear" },
    { name: "Project Manager", icon: "solar:clipboard-list-linear" },
    { name: "Product Manager", icon: "solar:box-linear" },
    { name: "Entrepreneur", icon: "solar:rocket-linear" },
  ],
  "Marketing & Sales": [
    { name: "Marketing Manager", icon: "solar:graph-up-linear" },
    { name: "Digital Marketing Specialist", icon: "solar:hashtag-linear" },
    { name: "SEO Specialist", icon: "solar:magnifer-linear" },
    { name: "Social Media Manager", icon: "solar:share-circle-linear" },
    { name: "Content Marketing Manager", icon: "solar:document-text-linear" },
    { name: "Brand Manager", icon: "solar:star-linear" },
    { name: "Sales Representative", icon: "solar:chat-round-money-linear" },
    { name: "Sales Manager", icon: "solar:users-group-rounded-linear" },
    { name: "Business Development", icon: "solar:hand-shake-linear" },
    { name: "Account Manager", icon: "solar:user-check-linear" },
    { name: "E-commerce Manager", icon: "solar:cart-large-linear" },
    { name: "Growth Hacker", icon: "solar:graph-up-new-linear" },
  ],
  "Creative & Design": [
    { name: "Graphic Designer", icon: "solar:pallete-linear" },
    { name: "Web Designer", icon: "solar:monitor-linear" },
    { name: "Video Editor", icon: "solar:video-frame-linear" },
    { name: "Motion Designer", icon: "solar:clapperboard-linear" },
    { name: "3D Artist", icon: "solar:box-minimalistic-linear" },
    { name: "Illustrator", icon: "solar:pen-2-linear" },
    { name: "Photographer", icon: "solar:camera-linear" },
    { name: "Art Director", icon: "solar:paint-roller-linear" },
    { name: "Creative Director", icon: "solar:crown-linear" },
    { name: "Animator", icon: "solar:play-circle-linear" },
  ],
  "Content & Writing": [
    { name: "Content Writer", icon: "solar:pen-new-square-linear" },
    { name: "Copywriter", icon: "solar:document-add-linear" },
    { name: "Technical Writer", icon: "solar:code-square-linear" },
    { name: "Editor", icon: "solar:scissors-linear" },
    { name: "Journalist", icon: "solar:newspaper-linear" },
    { name: "Blogger", icon: "solar:text-bold-linear" },
    { name: "Translator", icon: "solar:translation-linear" },
    { name: "Proofreader", icon: "solar:check-read-linear" },
  ],
  "Human Resources": [
    { name: "HR Manager", icon: "solar:users-group-rounded-linear" },
    { name: "Recruiter", icon: "solar:user-plus-linear" },
    { name: "Talent Acquisition", icon: "solar:magnifer-zoom-in-linear" },
    { name: "HR Coordinator", icon: "solar:clipboard-linear" },
    { name: "Training Manager", icon: "solar:presentation-graph-linear" },
    { name: "Compensation Analyst", icon: "solar:wallet-linear" },
    { name: "Employee Relations", icon: "solar:handshake-linear" },
  ],
  "Healthcare & Medical": [
    { name: "Doctor", icon: "solar:stethoscope-linear" },
    { name: "Nurse", icon: "solar:heart-pulse-linear" },
    { name: "Pharmacist", icon: "solar:pills-linear" },
    { name: "Medical Technologist", icon: "solar:test-tube-linear" },
    { name: "Physical Therapist", icon: "solar:running-linear" },
    { name: "Dentist", icon: "solar:health-linear" },
    { name: "Psychologist", icon: "solar:brain-linear" },
    { name: "Healthcare Administrator", icon: "solar:hospital-linear" },
  ],
  "Education & Training": [
    { name: "Teacher", icon: "solar:book-2-linear" },
    { name: "Professor", icon: "solar:mortarboard-linear" },
    { name: "Tutor", icon: "solar:notebook-linear" },
    { name: "Curriculum Developer", icon: "solar:notebook-bookmark-linear" },
    { name: "Education Consultant", icon: "solar:diploma-linear" },
    { name: "Corporate Trainer", icon: "solar:presentation-graph-linear" },
    { name: "Instructional Designer", icon: "solar:pen-new-round-linear" },
  ],
  Engineering: [
    { name: "Mechanical Engineer", icon: "solar:bolt-linear" },
    { name: "Civil Engineer", icon: "solar:buildings-linear" },
    { name: "Electrical Engineer", icon: "solar:plug-circle-linear" },
    { name: "Chemical Engineer", icon: "solar:atom-linear" },
    { name: "Industrial Engineer", icon: "solar:factory-linear" },
    { name: "Environmental Engineer", icon: "solar:leaf-linear" },
    { name: "Aerospace Engineer", icon: "solar:airplane-linear" },
    { name: "Biomedical Engineer", icon: "solar:dna-linear" },
  ],
  "Customer Service & Support": [
    { name: "Customer Support", icon: "solar:headphones-round-linear" },
    { name: "Customer Success Manager", icon: "solar:user-heart-linear" },
    { name: "Technical Support", icon: "solar:widget-linear" },
    { name: "Call Center Agent", icon: "solar:phone-calling-linear" },
    { name: "Help Desk Analyst", icon: "solar:question-circle-linear" },
    { name: "Client Relations", icon: "solar:chat-round-dots-linear" },
  ],
  "Legal & Compliance": [
    { name: "Lawyer", icon: "solar:scale-linear" },
    { name: "Legal Counsel", icon: "solar:gavel-linear" },
    { name: "Paralegal", icon: "solar:documents-linear" },
    { name: "Compliance Officer", icon: "solar:shield-check-linear" },
    { name: "Contract Manager", icon: "solar:file-check-linear" },
    { name: "Legal Secretary", icon: "solar:clipboard-text-linear" },
  ],
  "Government & NGO": [
    { name: "Government Officer", icon: "solar:buildings-2-linear" },
    { name: "Policy Analyst", icon: "solar:document-text-linear" },
    { name: "NGO Worker", icon: "solar:hand-heart-linear" },
    { name: "Social Worker", icon: "solar:people-nearby-linear" },
    { name: "Public Relations", icon: "solar:microphone-linear" },
    { name: "Program Coordinator", icon: "solar:checklist-linear" },
  ],
};

// Flatten categories for quick access
const allCategories = Object.values(jobCategories).flat();

// Popular categories shown at top (most searched)
const popularCategories = [
  { name: "Software Developer", icon: "solar:code-linear" },
  { name: "Data Analyst", icon: "solar:chart-2-linear" },
  { name: "Marketing Manager", icon: "solar:graph-up-linear" },
  { name: "UI/UX Designer", icon: "solar:pallete-2-linear" },
  { name: "Accountant", icon: "solar:calculator-linear" },
  { name: "HR Manager", icon: "solar:users-group-rounded-linear" },
  { name: "Content Writer", icon: "solar:pen-new-square-linear" },
  { name: "Customer Support", icon: "solar:headphones-round-linear" },
  { name: "Sales Representative", icon: "solar:chat-round-money-linear" },
  { name: "Teacher", icon: "solar:book-2-linear" },
  { name: "Nurse", icon: "solar:heart-pulse-linear" },
  { name: "Project Manager", icon: "solar:clipboard-list-linear" },
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
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Remote");
  const [saveToDb, setSaveToDb] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [searchUsage, setSearchUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);

  // Track if a search is in progress to prevent double submissions
  const searchInProgressRef = useRef(false);

  // Check search usage on mount
  useEffect(() => {
    async function checkUsage() {
      if (!user?.$id) return;

      try {
        const response = await fetch(`/api/search-usage?userId=${user.$id}`);
        if (response.ok) {
          const data = await response.json();
          setSearchUsage(data);
        }
      } catch (err) {
        console.error("Failed to check search usage:", err);
      } finally {
        setLoadingUsage(false);
      }
    }
    checkUsage();
  }, [user]);

  // Auto-search if URL has query params
  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("loc");

    if (q && searchUsage?.canSearch) {
      setQuery(q);
      if (loc) setLocation(loc);
      handleSearch(q, loc || "Remote");
    }
  }, [searchParams, searchUsage]);

  const handleSearch = async (
    searchQuery = query,
    searchLocation = location,
  ) => {
    if (!searchQuery.trim()) {
      setError("Please enter a job type to search");
      return;
    }

    // Prevent double submissions
    if (searchInProgressRef.current || loading) {
      console.log("Search already in progress, ignoring duplicate request");
      return;
    }

    // Check if user can search
    if (searchUsage && !searchUsage.canSearch) {
      setError(
        "You've reached your daily search limit. Upgrade to Premium for more searches!",
      );
      return;
    }

    searchInProgressRef.current = true;
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
          userId: user?.$id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data);

      // Update usage count locally
      if (searchUsage) {
        setSearchUsage({
          ...searchUsage,
          searchesUsed: (searchUsage.searchesUsed || 0) + 1,
          searchesRemaining: Math.max(
            0,
            (searchUsage.searchesRemaining || FREE_SEARCH_LIMIT) - 1,
          ),
          canSearch:
            (searchUsage.searchesRemaining || FREE_SEARCH_LIMIT) - 1 > 0,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to search for jobs");
    } finally {
      setLoading(false);
      searchInProgressRef.current = false;
    }
  };

  const handleCategoryClick = (category) => {
    setQuery(category);
    handleSearch(category, location);
  };

  // Show search usage info
  const SearchUsageInfo = () => {
    if (loadingUsage) return null;

    const remaining = searchUsage?.searchesRemaining ?? FREE_SEARCH_LIMIT;
    const isPremium = searchUsage?.isPremium;

    return (
      <div
        className={`mb-6 p-4 rounded-xl border ${remaining > 0 ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <iconify-icon
              icon={
                remaining > 0
                  ? "solar:search-linear"
                  : "solar:shield-warning-linear"
              }
              width="24"
              class={remaining > 0 ? "text-blue-600" : "text-amber-600"}
            ></iconify-icon>
            <div>
              <p
                className={`font-medium ${remaining > 0 ? "text-blue-900" : "text-amber-900"}`}
              >
                {isPremium
                  ? "Premium Member"
                  : `${remaining} search${remaining !== 1 ? "es" : ""} remaining today`}
              </p>
              <p
                className={`text-sm ${remaining > 0 ? "text-blue-600" : "text-amber-600"}`}
              >
                {isPremium
                  ? "Unlimited AI-powered job searches"
                  : remaining > 0
                    ? "Each search uses AI to find the best jobs for you"
                    : "Upgrade to Premium for unlimited searches"}
              </p>
            </div>
          </div>
          {!isPremium && (
            <Link
              href="/pricing"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              <iconify-icon icon="solar:crown-linear" width="16"></iconify-icon>
              Get Premium
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Resource Notice Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 text-center">
          <p className="text-sm flex items-center justify-center gap-2">
            <iconify-icon
              icon="solar:cpu-bolt-linear"
              width="18"
            ></iconify-icon>
            <span>
              Our AI-powered search uses advanced web scraping to find the best
              jobs.
              <span className="hidden sm:inline">
                {" "}
                Computing resources are limited -{" "}
              </span>
              <Link href="/pricing" className="underline font-medium ml-1">
                upgrade for unlimited searches
              </Link>
            </span>
          </p>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              AI-Powered Job Search
            </h1>
            <p className="text-slate-500 mb-8">
              Our AI scans 50+ job boards in real-time to find the best
              opportunities for you.
              <br className="hidden md:block" />
              From tech to healthcare, marketing to finance - we&apos;ve got you
              covered.
            </p>

            {/* Search Usage Info */}
            <SearchUsageInfo />

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
                    disabled={searchUsage && !searchUsage.canSearch}
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
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 text-center">
                Popular Job Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
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

              {/* All Categories by Industry */}
              <details className="group">
                <summary className="flex items-center justify-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium mb-6">
                  <iconify-icon
                    icon="solar:list-linear"
                    width="20"
                  ></iconify-icon>
                  Browse All Categories by Industry
                  <iconify-icon
                    icon="solar:alt-arrow-down-linear"
                    width="20"
                    class="group-open:rotate-180 transition-transform"
                  ></iconify-icon>
                </summary>

                <div className="space-y-8 mt-8">
                  {Object.entries(jobCategories).map(
                    ([industry, categories]) => (
                      <div key={industry}>
                        <h3 className="text-md font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          {industry}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                          {categories.map((category) => (
                            <button
                              key={category.name}
                              onClick={() => handleCategoryClick(category.name)}
                              className="group flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                            >
                              <iconify-icon
                                icon={category.icon}
                                width="18"
                                class="text-slate-400 group-hover:text-indigo-600 transition-colors"
                              ></iconify-icon>
                              <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors truncate">
                                {category.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </details>
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

// Export default with Suspense wrapper and ProtectedRoute
export default function SearchJobsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<SearchLoading />}>
        <SearchContent />
      </Suspense>
    </ProtectedRoute>
  );
}
