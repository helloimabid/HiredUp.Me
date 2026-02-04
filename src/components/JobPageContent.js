"use client";

import { useState } from "react";
import AIJobLoader from "./AIJobLoader";

export default function JobPageContent({ job, enhanced, children }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Check if this job needs AI enhancement
  const needsAI = enhanced?.needsAI === true && !enhanced?.aiEnhanced;

  const handleGenerateClick = () => {
    setShowLoader(true);
    setIsGenerating(true);
  };

  const handleComplete = (newEnhanced) => {
    // Reload page to show new content
    window.location.reload();
  };

  if (showLoader) {
    return <AIJobLoader job={job} onComplete={handleComplete} />;
  }

  // If needs AI, show a prompt to generate
  if (needsAI) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Basic job header */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
              <span className="animate-pulse">✨</span> AI Enhanced Content
              Available
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {job.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {job.company} • {job.location}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-purple-100 dark:border-purple-800">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Unlock Detailed Job Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Our AI will analyze this job posting and create a comprehensive
              page with responsibilities, requirements, skills, and application
              tips.
            </p>

            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              Takes about 10-15 seconds • Powered by DeepSeek AI
            </p>
          </div>

          {/* Basic Apply Button */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Or apply directly without AI enhancement:
            </p>
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Apply Now →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render normal page content
  return children;
}
