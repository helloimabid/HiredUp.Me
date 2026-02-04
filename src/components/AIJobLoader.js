"use client";

import { useState, useEffect, useRef } from "react";

export default function AIJobLoader({ job, onComplete, onError }) {
  const [status, setStatus] = useState("initializing");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Preparing AI generation...");
  const [step, setStep] = useState(0);
  const generationStartedRef = useRef(false);

  useEffect(() => {
    if (!generationStartedRef.current) {
      startGeneration();
    }
  }, []);

  const updateProgress = (stepNum, msg, percent) => {
    setStep(stepNum);
    setMessage(msg);
    setProgress(percent);
    setStatus("generating");
  };

  const startGeneration = async () => {
    if (generationStartedRef.current) return;
    generationStartedRef.current = true;

    try {
      updateProgress(1, "Preparing job data...", 10);

      // Step 2: Send to server-side AI
      updateProgress(2, "Connecting to AI service...", 20);

      updateProgress(3, "AI is analyzing the job...", 40);

      // Call server-side API that uses your Puter token
      const response = await fetch("/api/jobs/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.$id,
          job: {
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description || "",
          },
        }),
      });

      updateProgress(4, "AI is writing content...", 60);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "AI generation failed");
      }

      updateProgress(5, "Fetching company logo...", 70);

      updateProgress(6, "Creating job page...", 80);

      updateProgress(7, "Saving to database...", 90);

      updateProgress(8, "Done! Loading page...", 100);
      setStatus("complete");

      // Reload page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (error) {
      console.error("AI generation error:", error);
      setStatus("error");
      setMessage(error.message || "An error occurred");
      onError?.(error.message);
    }
  };

  const steps = [
    { num: 1, label: "Preparing" },
    { num: 2, label: "Connecting" },
    { num: 3, label: "Analyzing" },
    { num: 4, label: "Writing" },
    { num: 5, label: "Logo" },
    { num: 6, label: "Creating" },
    { num: 7, label: "Saving" },
    { num: 8, label: "Done!" },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          {/* AI Icon Animation */}
          <div className="mb-6">
            {status === "error" ? (
              <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            ) : status === "complete" ? (
              <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10 text-white"
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
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {status === "error"
              ? "Generation Failed"
              : status === "complete"
                ? "Page Generated!"
                : "AI Generating Job Page"}
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

          {/* Progress Steps */}
          {status !== "error" && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {steps.map((s) => (
                  <div
                    key={s.num}
                    className={`flex flex-col items-center ${
                      step >= s.num
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                        step > s.num
                          ? "bg-green-500 text-white"
                          : step === s.num
                            ? "bg-blue-600 text-white animate-pulse"
                            : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {step > s.num ? "✓" : s.num}
                    </div>
                    <span className="text-[10px] hidden sm:block">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {progress}% complete
              </p>
            </div>
          )}

          {/* Error Retry Button */}
          {status === "error" && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              Try Again
            </button>
          )}

          {/* Job Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generating page for:
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {job.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job.company} • {job.location}
            </p>
          </div>

          {/* AI Credit */}
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Powered by DeepSeek AI via Puter
          </p>
        </div>
      </div>
    </div>
  );
}
