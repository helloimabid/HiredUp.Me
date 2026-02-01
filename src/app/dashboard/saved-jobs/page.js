"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

function SavedJobsContent() {
  // Placeholder for saved jobs - would be fetched from database
  const savedJobs = [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Saved Jobs</h1>
        <p className="text-slate-500 mt-1">
          Jobs you&apos;ve bookmarked for later.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        {savedJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <iconify-icon
                icon="solar:bookmark-linear"
                class="text-slate-400 text-3xl"
              ></iconify-icon>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No saved jobs
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Save jobs you&apos;re interested in to review them later. Click
              the bookmark icon on any job listing.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <iconify-icon
                icon="solar:magnifer-linear"
                width="18"
              ></iconify-icon>
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {savedJobs.map((job, index) => (
              <div
                key={index}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                {/* Saved job item would go here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SavedJobsPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <SavedJobsContent />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
