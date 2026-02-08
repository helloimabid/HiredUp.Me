"use client";

import { useState, useEffect, useRef } from "react";

// Step definitions with icons matching the reference design
const STEPS = [
  {
    num: 1,
    label: "Preparing",
    icon: "solar:file-text-linear",
    doneIcon: "solar:check-circle-linear",
  },
  {
    num: 2,
    label: "Analyzing",
    icon: "solar:refresh-circle-linear",
    doneIcon: "solar:check-circle-linear",
  },
  {
    num: 3,
    label: "Writing",
    icon: "solar:pen-new-square-linear",
    doneIcon: "solar:check-circle-linear",
  },
  {
    num: 4,
    label: "Optimizing",
    icon: "solar:stars-minimalistic-linear",
    doneIcon: "solar:check-circle-linear",
  },
  {
    num: 5,
    label: "Generated",
    icon: "solar:file-check-linear",
    doneIcon: "solar:check-circle-linear",
  },
  {
    num: 6,
    label: "Saving",
    icon: "solar:diskette-linear",
    doneIcon: "solar:check-circle-linear",
  },
  {
    num: 7,
    label: "Complete",
    icon: "solar:check-circle-linear",
    doneIcon: "solar:check-circle-linear",
  },
  {
    num: 8,
    label: "Done",
    icon: "solar:flag-2-linear",
    doneIcon: "solar:check-circle-linear",
  },
];

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
      updateProgress(1, "Preparing job data...", 12);

      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateProgress(2, "AI is analyzing the job with Groq...", 25);

      // Call server-side Groq AI API
      console.log("[AIJobLoader] Calling server-side Groq AI...");
      const saveResponse = await fetch("/api/jobs/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.$id,
          job: {
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description || "",
            salary: job.salary || "",
            experience: job.experience || "",
            education: job.education || "",
            deadline: job.deadline || "",
          },
        }),
      });

      const result = await saveResponse.json();

      // Handle timeout
      if (result.timeout) {
        updateProgress(3, "Generation is taking longer than expected...", 40);
        setMessage(result.message);
        // Auto-retry after delay
        setTimeout(() => {
          setMessage("Retrying...");
          window.location.reload();
        }, 5000);
        return;
      }

      if (!saveResponse.ok) {
        throw new Error(result.error || "Failed to generate AI content");
      }

      updateProgress(3, "AI is writing content...", 50);
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateProgress(4, "Optimizing content structure...", 65);
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateProgress(5, "Content generated!", 75);
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateProgress(6, "Saving to database...", 85);
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateProgress(7, "Finalizing...", 95);
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateProgress(8, "Done! Redirecting...", 100);
      setStatus("complete");

      // Notify parent component
      if (onComplete) {
        onComplete(result.enhanced);
      }

      // Redirect to refresh the page with new content
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("_t", Date.now());
        window.location.href = url.toString();
      }, 800);
    } catch (error) {
      console.error("AI generation error:", error);
      setStatus("error");
      setMessage(error.message || "An error occurred");
      if (onError) {
        onError(error.message);
      }
    }
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col">
      {/* Subtle background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-grow flex items-center justify-center p-4 py-16 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Context Pill */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <iconify-icon
                icon="solar:magic-stick-3-linear"
                class="text-indigo-400"
                width="16"
              ></iconify-icon>
              <span className="text-xs font-medium text-slate-400">
                {status === "error"
                  ? "Generation failed"
                  : status === "complete"
                    ? "Generation complete"
                    : "AI generating job page with Groq"}
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Card Header */}
            <div className="p-8 pb-6 text-center border-b border-slate-800/50">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-50" />
                {status === "error" ? (
                  <iconify-icon
                    icon="solar:danger-triangle-linear"
                    class="text-red-400 relative z-10"
                    width="32"
                  ></iconify-icon>
                ) : status === "complete" ? (
                  <iconify-icon
                    icon="solar:check-circle-linear"
                    class="text-emerald-400 relative z-10"
                    width="32"
                  ></iconify-icon>
                ) : (
                  <iconify-icon
                    icon="solar:magic-stick-3-linear"
                    class="text-indigo-400 relative z-10 animate-pulse"
                    width="32"
                  ></iconify-icon>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
                {status === "error"
                  ? "Generation Failed"
                  : status === "complete"
                    ? "Page Generated!"
                    : "AI Generating Job Page"}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
                {status === "error" ? (
                  <span>{message}</span>
                ) : status === "complete" ? (
                  <span>Your job page is ready. Redirecting now...</span>
                ) : (
                  <>
                    Analyzing job details for{" "}
                    <span className="text-slate-200 font-medium">
                      {job.title}
                    </span>{" "}
                    to create an optimized listing.
                  </>
                )}
              </p>
            </div>

            {/* Progress Section */}
            {status !== "error" && (
              <div className="p-8 bg-slate-900/50">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8 relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  {status !== "complete" && (
                    <div
                      className="absolute top-0 left-0 h-full w-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  )}
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                  {STEPS.map((s) => {
                    const isDone = step > s.num;
                    const isActive = step === s.num;
                    const isPending = step < s.num;

                    return (
                      <div
                        key={s.num}
                        className={`flex items-center gap-3 ${isPending ? "opacity-40" : ""}`}
                      >
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <iconify-icon
                              icon="solar:check-circle-linear"
                              width="14"
                            ></iconify-icon>
                          </div>
                        ) : isActive ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white relative">
                            <span className="absolute -inset-1 rounded-full border border-indigo-500/30 animate-ping" />
                            <iconify-icon
                              icon="solar:refresh-circle-linear"
                              width="14"
                              class="animate-spin"
                            ></iconify-icon>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500">
                            <iconify-icon
                              icon={s.icon}
                              width="12"
                            ></iconify-icon>
                          </div>
                        )}
                        <span
                          className={`text-xs font-medium ${
                            isDone
                              ? "text-emerald-400"
                              : isActive
                                ? "text-white"
                                : "text-slate-500"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error content */}
            {status === "error" && (
              <div className="p-8 bg-slate-900/50 text-center">
                <p className="text-sm text-slate-400 mb-6">
                  Something went wrong while generating the page. You can try
                  again or go back.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <iconify-icon
                      icon="solar:refresh-circle-linear"
                      width="16"
                    ></iconify-icon>
                    Try Again
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors border border-slate-700"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

            {/* Card Footer */}
            <div className="bg-slate-950/50 p-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <iconify-icon
                  icon="solar:briefcase-linear"
                  width="14"
                ></iconify-icon>
                <span>{job.company}</span>
                <span className="text-slate-700">•</span>
                <span>{job.location}</span>
              </div>
              {status !== "complete" && status !== "error" && (
                <button
                  onClick={() => window.history.back()}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <iconify-icon
                    icon="solar:close-circle-linear"
                    width="14"
                  ></iconify-icon>
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Bottom text */}
          <p className="mt-6 text-center text-xs text-slate-600">
            {status === "error"
              ? "If the problem persists, the AI service may be temporarily unavailable."
              : status === "complete"
                ? "Redirecting to your generated job page..."
                : "This process usually takes about 3–5 seconds with Groq AI."}
          </p>
        </div>
      </main>

      {/* Shimmer keyframe (injected via style tag) */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
