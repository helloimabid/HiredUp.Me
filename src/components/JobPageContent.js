"use client";

import { useEffect, useState } from "react";
import AIJobLoader from "./AIJobLoader";

export default function JobPageContent({
  job,
  enhanced,
  children,
  autoGenerate = false,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Check if this job needs AI enhancement
  const needsAI = enhanced?.needsAI === true && !enhanced?.aiEnhanced;

  useEffect(() => {
    if (autoGenerate && needsAI && !showLoader) {
      setShowLoader(true);
      setIsGenerating(true);
    }
  }, [autoGenerate, needsAI, showLoader]);

  const handleGenerateClick = () => {
    setShowLoader(true);
    setIsGenerating(true);
  };

  const handleComplete = (newEnhanced) => {
    // Reload page to show new content
    window.location.reload();
  };

  const handleError = (errorMessage) => {
    console.error("AI generation failed:", errorMessage);
    // The AIJobLoader component will handle showing the error UI
  };

  if (showLoader) {
    return (
      <AIJobLoader
        job={job}
        onComplete={handleComplete}
        onError={handleError}
      />
    );
  }

  // If needs AI, show a prompt to generate
  // Always render the page content; show an AI enhancement banner if needed
  return (
    <>
      {needsAI && !showLoader && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-purple-100 dark:border-purple-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
              <span className="animate-pulse">✨</span>
              <span className="font-medium">
                AI can organize this job info into a cleaner format
              </span>
              <span className="hidden sm:inline text-purple-600 dark:text-purple-400 text-xs">
                • Powered by Groq AI
              </span>
            </div>
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    className="w-4 h-4"
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
                  Enhance with AI
                </>
              )}
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
