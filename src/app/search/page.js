"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Search limit for free users
const FREE_SEARCH_LIMIT = 10;

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

// Popular Bangla job searches
const banglaCategories = [
  { name: "সরকারি চাকরি", icon: "solar:buildings-2-linear" },
  { name: "শিক্ষক নিয়োগ", icon: "solar:book-2-linear" },
  { name: "ব্যাংক চাকরি", icon: "solar:bank-linear" },
  { name: "এনজিও চাকরি", icon: "solar:hand-heart-linear" },
  { name: "পুলিশ চাকরি", icon: "solar:shield-linear" },
  { name: "সেনাবাহিনী", icon: "solar:star-linear" },
  { name: "রেলওয়ে চাকরি", icon: "solar:bus-linear" },
  { name: "স্বাস্থ্য সেবা", icon: "solar:heart-pulse-linear" },
];

const locations = [
  "Remote",
  "Dhaka, Bangladesh",
  "Chittagong, Bangladesh",
  "Sylhet, Bangladesh",
  "Rajshahi, Bangladesh",
  "Khulna, Bangladesh",
  "Comilla, Bangladesh",
  "Gazipur, Bangladesh",
  "Narayanganj, Bangladesh",
  "Mymensingh, Bangladesh",
  "Rangpur, Bangladesh",
  "Barishal, Bangladesh",
  "United States",
  "New York, USA",
  "San Francisco, USA",
  "Los Angeles, USA",
  "Chicago, USA",
  "Seattle, USA",
  "Austin, USA",
  "United Kingdom",
  "London, UK",
  "Manchester, UK",
  "Canada",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Germany",
  "Berlin, Germany",
  "Munich, Germany",
  "Singapore",
  "India",
  "Mumbai, India",
  "Bangalore, India",
  "Delhi, India",
  "Dubai, UAE",
  "Australia",
  "Sydney, Australia",
  "Melbourne, Australia",
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

  // Auto-search if URL has query params - search DATABASE first (no scraping)
  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("loc");

    if (q) {
      setQuery(q);
      if (loc) setLocation(loc);
      // Search database first (free, no scraping)
      handleDatabaseSearch(q, loc || "Remote");
    }
  }, [searchParams]);

  // Search existing jobs in database (FREE - no usage counted)
  const handleDatabaseSearch = async (
    searchQuery = query,
    searchLocation = location,
  ) => {
    if (!searchQuery.trim()) {
      setError("Please enter a job type to search");
      return;
    }

    if (searchInProgressRef.current || loading) {
      return;
    }

    searchInProgressRef.current = true;
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch(
        `/api/jobs/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}&limit=50`,
      );

      // Get response text first to handle non-JSON responses
      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "Failed to parse response:",
          responseText.substring(0, 200),
        );
        throw new Error(
          "Server returned an invalid response. Please try again.",
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to search for jobs");
    } finally {
      setLoading(false);
      searchInProgressRef.current = false;
    }
  };

  // Scrape fresh jobs (USES QUOTA - only when user explicitly requests)
  const handleScrapeSearch = async (
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

      // Get response text first to handle non-JSON responses
      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "Failed to parse response:",
          responseText.substring(0, 200),
        );
        throw new Error(
          "Server returned an invalid response. Please try again.",
        );
      }

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

  // Default search uses database (free)
  const handleSearch = handleDatabaseSearch;

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
                  ? "Unlimited  job searches"
                  : remaining > 0
                    ? "Each search uses heavy computing resources to find the best jobs for you"
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
      <main className="flex-grow bg-gray-50 dark:bg-slate-900">
        {/* Alert Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-medium">
            <iconify-icon
              icon="solar:bolt-linear"
              className="text-amber-500"
            ></iconify-icon>
            <span>
              Computing resources are limited - upgrade for unlimited searches
            </span>
            <Link
              href="/pricing"
              className="ml-1 underline hover:text-amber-900"
            >
              Get Premium
            </Link>
          </div>
        </div>

        {/* Hero & Search Section */}
        <section className="relative pt-12 pb-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
                Smart Job Discovery
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Our advanced engine scans 50+ job boards in real-time to find
                the best opportunities for you. From tech to healthcare,
                marketing to finance.
              </p>
            </div>

            {/* Search Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Search Inputs */}
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                <div className="p-5">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Job Title / Type
                  </label>
                  <div className="flex items-center gap-3">
                    <iconify-icon
                      icon="solar:magnifer-linear"
                      className="text-slate-400 dark:text-slate-500 text-xl flex-shrink-0"
                    ></iconify-icon>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., Marketing Manager, Developer..."
                      className="w-full text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none bg-transparent font-medium"
                      disabled={searchUsage && !searchUsage.canSearch}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSearch(query, location)
                      }
                    />
                  </div>
                </div>
                <div className="p-5">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Location
                  </label>
                  <div className="flex items-center gap-3">
                    <iconify-icon
                      icon="solar:map-point-linear"
                      className="text-slate-400 dark:text-slate-500 text-xl flex-shrink-0"
                    ></iconify-icon>
                    <input
                      type="text"
                      list="location-suggestions"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Type or select a location..."
                      className="w-full text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none bg-transparent font-medium"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSearch(query, location)
                      }
                    />
                    <datalist id="location-suggestions">
                      {locations.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Filters & Actions */}
              <div className="bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 p-5 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Filters */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={saveToDb}
                        onChange={(e) => setSaveToDb(e.target.checked)}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 transition-all"
                      />
                      <iconify-icon
                        icon="solar:check-read-linear"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs"
                      ></iconify-icon>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors select-none">
                      Save new results
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleDatabaseSearch(query, location)}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-white dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <iconify-icon
                      icon="solar:database-linear"
                      className="text-slate-400"
                    ></iconify-icon>
                    {loading ? "Searching..." : "Search Database"}
                  </button>
                  <button
                    onClick={() => handleScrapeSearch(query, location)}
                    disabled={
                      loading || (searchUsage && !searchUsage.canSearch)
                    }
                    title={
                      searchUsage && !searchUsage.canSearch
                        ? "Daily limit reached"
                        : "Search across 50+ job boards (uses 1 search credit)"
                    }
                    className="px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-lg shadow-slate-200 dark:shadow-slate-950/60 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <iconify-icon
                      icon="solar:refresh-circle-linear"
                      className="group-hover:rotate-180 transition-transform duration-500"
                    ></iconify-icon>
                    Find Fresh Jobs
                  </button>
                </div>
              </div>
            </div>

            {/* Info & Credits */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <SearchUsageInfo />
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 max-w-lg">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  💡 Tip:
                </span>{" "}
                &quot;Search Database&quot; is free. &quot;Find Fresh Jobs&quot;
                scrapes new listings live and uses 1 credit per search.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {!results && !loading && (
          <section className="py-12 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6 text-center">
                Popular Job Categories
              </h3>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {popularCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                  >
                    <iconify-icon
                      icon={category.icon}
                      className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    ></iconify-icon>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Bangla Categories */}
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6 text-center mt-10">
                বাংলায় চাকরি খুঁজুন (Search in Bangla)
              </h3>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {banglaCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
                  >
                    <iconify-icon
                      icon={category.icon}
                      className="text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors"
                    ></iconify-icon>
                    <span style={{ fontFamily: "var(--font-bengali)" }}>
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* All Categories by Industry */}
              <div className="mt-8 text-center">
                <details className="group">
                  <summary className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline underline-offset-4 cursor-pointer">
                    Browse All Categories by Industry
                    <iconify-icon
                      icon="solar:alt-arrow-down-linear"
                      width="16"
                      className="group-open:rotate-180 transition-transform"
                    ></iconify-icon>
                  </summary>

                  <div className="space-y-8 mt-8">
                    {Object.entries(jobCategories).map(
                      ([industry, categories]) => (
                        <div key={industry} className="text-left">
                          <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            {industry}
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                              <button
                                key={category.name}
                                onClick={() =>
                                  handleCategoryClick(category.name)
                                }
                                className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                              >
                                <iconify-icon
                                  icon={category.icon}
                                  className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                                ></iconify-icon>
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </details>
              </div>
            </div>
          </section>
        )}
        {/* Stats / SEO Text */}
        {!results && !loading && (
          <section className="py-12 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                HiredUp.me - Jobs in Bangladesh
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Bangladesh&apos;s leading job portal connecting talented
                professionals with top employers worldwide.
              </p>
              <div className="flex justify-center items-center gap-3 text-xs text-slate-400 dark:text-slate-500 flex-wrap">
                <span>Popular Searches:</span>
                <button
                  onClick={() => handleCategoryClick("Software Developer")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Software Developer
                </button>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <button
                  onClick={() => {
                    setQuery("Remote");
                    handleSearch("Remote", location);
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Remote Jobs
                </button>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <button
                  onClick={() => {
                    setLocation("Dhaka, Bangladesh");
                    handleSearch(query, "Dhaka, Bangladesh");
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Dhaka Jobs
                </button>
              </div>
            </div>
          </section>
        )}
        {/* Error Message */}
        {error && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <iconify-icon
                  icon="solar:danger-triangle-linear"
                  className="text-red-500 text-3xl mb-3"
                ></iconify-icon>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Searching for jobs...
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Using heavy compute to find the best matches for &quot;{query}
                &quot;
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
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {results.success
                      ? `Found ${results.totalExtracted} jobs`
                      : "No results"}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {results.message}
                    {results.method && (
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                        via {results.method}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setResults(null)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
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
                      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                            {job.title}
                          </h3>
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                            {job.company}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                            <span className="flex items-center gap-1">
                              <iconify-icon
                                icon="solar:map-point-linear"
                                width="16"
                              ></iconify-icon>
                              {job.location}
                            </span>
                          </div>
                          {job.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {job.description}
                            </p>
                          )}
                        </div>
                        <Link
                          href={`/jobs/${job.slug || job.$id}`}
                          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          View & Apply
                          <iconify-icon
                            icon="solar:arrow-right-linear"
                            width="16"
                          ></iconify-icon>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <iconify-icon
                    icon="solar:folder-open-linear"
                    className="text-slate-300 dark:text-slate-600 text-5xl mb-4"
                  ></iconify-icon>
                  <p className="text-slate-500 dark:text-slate-400">
                    No jobs found. Try a different search term.
                  </p>
                </div>
              )}

              {/* View All Link */}
              {results.savedCount > 0 && (
                <div className="text-center mt-8">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
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
