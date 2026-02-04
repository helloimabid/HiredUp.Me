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

  // Wait for Puter.js to load (it's loaded async)
  const waitForPuter = (timeout = 15000) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (typeof window !== "undefined" && window.puter?.ai?.chat) {
          resolve(window.puter);
        } else if (Date.now() - start > timeout) {
          reject(new Error("Puter.js failed to load"));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };

  // Call Puter AI directly from browser (free, unlimited)
  const callPuterAI = async (prompt) => {
    const puter = await waitForPuter();
    console.log("[Puter] Calling AI with model: gpt-4.1-nano...");

    const response = await puter.ai.chat(prompt, {
      model: "gpt-4.1-nano", // Fast free model
      temperature: 0.7,
    });

    // Handle response - can be string or object
    if (typeof response === "string") {
      return response;
    }
    if (response?.message?.content) {
      return response.message.content;
    }
    if (response?.content) {
      return response.content;
    }
    return JSON.stringify(response);
  };

  // Optionally fetch more info from Tavily if job has a source URL
  const fetchTavilyInfo = async () => {
    // Check if job has a source URL or apply URL we can extract more info from
    const sourceUrl = job.apply_url || job.sourceUrl || job.url;
    if (!sourceUrl || !sourceUrl.startsWith("http")) {
      return null;
    }

    try {
      console.log("[AIJobLoader] Fetching extra info from:", sourceUrl);
      const response = await fetch("/api/jobs/extract-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content;
      }
    } catch (err) {
      console.log(
        "[AIJobLoader] Tavily extract failed (continuing without):",
        err.message,
      );
    }
    return null;
  };

  const startGeneration = async () => {
    if (generationStartedRef.current) return;
    generationStartedRef.current = true;

    try {
      updateProgress(1, "Preparing job data...", 10);

      // Step 1: Try to fetch extra info from source URL via Tavily
      updateProgress(2, "Fetching job details...", 20);
      let extraContent = "";
      try {
        const tavilyInfo = await fetchTavilyInfo();
        if (tavilyInfo) {
          extraContent = `\n\nADDITIONAL INFO FROM SOURCE:\n${tavilyInfo.substring(0, 3000)}`;
          console.log(
            "[AIJobLoader] Got extra content from Tavily, length:",
            tavilyInfo.length,
          );
        }
      } catch (e) {
        console.log("[AIJobLoader] Skipping Tavily (optional):", e.message);
      }

      updateProgress(3, "Loading AI service...", 30);

      // Build the AI prompt with any extra content
      const prompt = `You are creating professional content for a job posting page. Analyze this job thoroughly.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
${job.description ? `- Description: ${job.description.substring(0, 2000)}` : ""}${extraContent}

Create a comprehensive JSON response with these EXACT fields:
{
  "summary": "Write a compelling 2-3 sentence summary of this opportunity",
  "about": "Write 2-3 detailed paragraphs about this role, the company culture, and what makes it exciting. Be specific and engaging.",
  "responsibilities": ["Write 5-6 specific, detailed responsibilities"],
  "requirements": ["Write 5-6 specific qualifications and requirements"],
  "skills": ["List 6-8 relevant technical and soft skills"],
  "experienceLevel": "entry or mid or senior",
  "salaryRange": "Realistic salary range (use BDT for Bangladesh jobs)",
  "industry": "Specific industry category",
  "workType": "remote or hybrid or onsite",
  "benefits": ["List 4-5 typical benefits for this role"],
  "whyApply": "Write 2-3 compelling reasons why someone should apply",
  "applicationTips": "Write 2-3 specific tips for applying to this role",
  "highlights": ["3-4 key highlights or selling points of this job"]
}

Return ONLY valid JSON. No markdown, no explanation.`;

      updateProgress(4, "AI is analyzing the job...", 50);

      // Call Puter AI directly from browser (free, unlimited!)
      console.log("[AIJobLoader] Calling Puter.js AI directly...");
      const aiResponse = await callPuterAI(prompt);
      console.log(
        "[AIJobLoader] AI response received, length:",
        aiResponse?.length,
      );

      updateProgress(5, "AI is writing content...", 65);

      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(
          "[AIJobLoader] No JSON found in AI response:",
          aiResponse?.substring(0, 500),
        );
        throw new Error("AI response was not valid JSON");
      }

      const analysis = JSON.parse(jsonMatch[0]);
      console.log(
        "[AIJobLoader] Parsed successfully, summary:",
        analysis.summary?.substring(0, 100),
      );

      updateProgress(6, "Content generated!", 75);

      // Send to server to save (logo fetch + database save)
      updateProgress(7, "Saving to database...", 85);

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
          },
          analysis, // Send the AI analysis to server for saving
          clientGenerated: true, // Flag that AI was done client-side
        }),
      });

      const result = await saveResponse.json();

      if (!saveResponse.ok) {
        console.error("Save API returned error:", result);
        throw new Error(result.error || "Failed to save generated content");
      }

      console.log("AI generation successful:", result.message);

      updateProgress(8, "Done! Reloading...", 100);
      setStatus("complete");

      // Reload page after short delay with cache bust
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("_t", Date.now());
        window.location.href = url.toString();
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
    { num: 2, label: "Fetching" },
    { num: 3, label: "Loading" },
    { num: 4, label: "Analyzing" },
    { num: 5, label: "Writing" },
    { num: 6, label: "Generated" },
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
            ) : status === "timeout" ? (
              <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-amber-600 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
              : status === "timeout"
                ? "Taking Longer Than Expected"
                : status === "complete"
                  ? "Page Generated!"
                  : "AI Generating Job Page"}
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

          {/* Progress Steps */}
          {status !== "error" && status !== "timeout" && (
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

          {/* Timeout Buttons */}
          {status === "timeout" && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-semibold transition-colors"
              >
                Go Back
              </button>
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
        </div>
      </div>
    </div>
  );
}
