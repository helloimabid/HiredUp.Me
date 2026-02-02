"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

function ApplicationsContent() {
  // Placeholder for applications - would be fetched from database
  const applications = [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          My Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track the status of your job applications.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <iconify-icon
                icon="solar:document-text-linear"
                class="text-slate-400 dark:text-slate-500 text-3xl"
              ></iconify-icon>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No applications yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              You haven&apos;t applied to any jobs yet. Start exploring
              opportunities and submit your first application.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <iconify-icon
                icon="solar:magnifer-linear"
                width="18"
              ></iconify-icon>
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {applications.map((app, index) => (
              <div
                key={index}
                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {/* Application item would go here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <ApplicationsContent />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
