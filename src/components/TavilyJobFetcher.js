"use client";

import { useState, useCallback } from "react";

/**
 * TavilyJobFetcher - Uses Tavily Search + Extract + Puter.js AI to fetch and organize jobs
 *
 * Flow:
 * 1. Tavily Search → Find job posting URLs from job sites
 * 2. Tavily Extract → Get raw content from those URLs
 * 3. Puter.js AI → Organize and structure the job data (client-side, unlimited)
 */
export default function TavilyJobFetcher({
  query,
  location,
  onJobsFound,
  onError,
}) {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  // Wait for Puter.js to load
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

  // Call Puter AI to organize job data
  const organizeWithPuterAI = async (rawContent, jobUrl) => {
    const puter = await waitForPuter();

    const prompt = `You are a job data extractor. Extract job posting information from this content.

RAW CONTENT FROM JOB POSTING:
${rawContent.substring(0, 4000)}

SOURCE URL: ${jobUrl}

Extract and return a JSON object with these fields (use null for missing data):
{
  "title": "Job title",
  "company": "Company name",
  "location": "Job location",
  "description": "Full job description (keep detailed)",
  "salary": "Salary range if mentioned",
  "jobType": "full-time, part-time, contract, or remote",
  "experienceLevel": "entry, mid, or senior",
  "skills": ["array", "of", "required", "skills"],
  "requirements": ["array", "of", "requirements"],
  "benefits": ["array", "of", "benefits"],
  "applyUrl": "Application URL if found",
  "postedDate": "When job was posted if mentioned"
}

Return ONLY valid JSON. No markdown, no explanation.`;

    console.log("[Puter] Organizing job data from:", jobUrl);

    const response = await puter.ai.chat(prompt, {
      model: "gpt-4.1-nano",
      temperature: 0.3, // Lower temperature for more consistent extraction
    });

    // Parse response
    const responseText =
      typeof response === "string"
        ? response
        : response?.message?.content ||
          response?.content ||
          JSON.stringify(response);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("[Puter] Could not parse job data from response");
      return null;
    }

    try {
      const jobData = JSON.parse(jsonMatch[0]);
      jobData.sourceUrl = jobUrl;
      return jobData;
    } catch (e) {
      console.warn("[Puter] JSON parse error:", e.message);
      return null;
    }
  };

  // Main fetch function
  const fetchJobs = useCallback(async () => {
    if (!query) return;

    setStatus("fetching");
    setProgress(0);
    setMessage("Searching job sites...");

    try {
      // Step 1: Call Tavily API to search and extract
      setProgress(10);
      setMessage("Searching for job postings with Tavily...");

      const tavilyResponse = await fetch("/api/jobs/fetch-tavily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location }),
      });

      const tavilyData = await tavilyResponse.json();

      if (!tavilyResponse.ok) {
        throw new Error(tavilyData.error || "Tavily search failed");
      }

      if (!tavilyData.extractedContent?.length) {
        setStatus("complete");
        setMessage("No jobs found");
        onJobsFound?.([]);
        return;
      }

      setProgress(40);
      setMessage(
        `Found ${tavilyData.extractedContent.length} job postings. Organizing with AI...`,
      );

      // Step 2: Use Puter.js AI to organize each job (client-side, unlimited)
      const organizedJobs = [];
      const totalJobs = tavilyData.extractedContent.length;

      for (let i = 0; i < totalJobs; i++) {
        const content = tavilyData.extractedContent[i];
        setProgress(40 + Math.round((i / totalJobs) * 50));
        setMessage(`Processing job ${i + 1} of ${totalJobs}...`);

        try {
          const jobData = await organizeWithPuterAI(
            content.rawContent,
            content.url,
          );

          if (jobData && jobData.title) {
            organizedJobs.push(jobData);
          }
        } catch (err) {
          console.warn(
            `[TavilyJobFetcher] Failed to process job ${i + 1}:`,
            err.message,
          );
        }
      }

      setProgress(95);
      setMessage(`Organized ${organizedJobs.length} jobs!`);

      // Complete
      setProgress(100);
      setStatus("complete");
      setMessage(`Found ${organizedJobs.length} jobs`);

      onJobsFound?.(organizedJobs);
    } catch (error) {
      console.error("[TavilyJobFetcher] Error:", error);
      setStatus("error");
      setMessage(error.message || "Failed to fetch jobs");
      onError?.(error.message);
    }
  }, [query, location, onJobsFound, onError]);

  return {
    fetchJobs,
    status,
    progress,
    message,
    isLoading: status === "fetching",
    isComplete: status === "complete",
    isError: status === "error",
  };
}

/**
 * TavilyJobFetcherUI - A standalone UI component for Tavily job fetching
 */
export function TavilyJobFetcherUI({ query, location, onJobsFound }) {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  const handleJobsFound = (foundJobs) => {
    setJobs(foundJobs);
    onJobsFound?.(foundJobs);
  };

  const { fetchJobs, status, progress, message, isLoading } = TavilyJobFetcher({
    query,
    location,
    onJobsFound: handleJobsFound,
    onError: setError,
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Job Search
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by Tavily + Puter.js AI
          </p>
        </div>
        <button
          onClick={fetchJobs}
          disabled={isLoading || !query}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isLoading
              ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? "Searching..." : "Search Jobs"}
        </button>
      </div>

      {/* Progress */}
      {isLoading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>{message}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results summary */}
      {status === "complete" && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
          ✓ {message}
        </div>
      )}

      {/* Job list preview */}
      {jobs.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Found Jobs:
          </h4>
          {jobs.slice(0, 5).map((job, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                {job.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.company} • {job.location}
              </p>
            </div>
          ))}
          {jobs.length > 5 && (
            <p className="text-sm text-gray-500">
              + {jobs.length - 5} more jobs
            </p>
          )}
        </div>
      )}
    </div>
  );
}
