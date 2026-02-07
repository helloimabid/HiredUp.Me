import { Client, Databases, ID, Query } from "node-appwrite";
import { unstable_cache } from "next/cache";

// Server-side Appwrite client
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

export const databases = new Databases(client);
export { ID, Query };

// Database and Collection IDs
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
export const JOBS_COLLECTION_ID =
  process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";
export const PROFILES_COLLECTION_ID = "profiles";
export const SAVED_JOBS_COLLECTION_ID = "saved_jobs";
export const APPLICATIONS_COLLECTION_ID = "applications";
export const COMPANIES_COLLECTION_ID = "companies";
export const NOTIFICATIONS_COLLECTION_ID = "notifications";
export const SEARCH_USAGE_COLLECTION_ID = "search_usage";

// Search limits
export const FREE_SEARCH_LIMIT = 10;
export const PREMIUM_SEARCH_LIMIT = 100; // Premium users get 100 searches per day

/**
 * Fetch all jobs from Appwrite (cached for 120s)
 */
export const getJobs = unstable_cache(
  async (limit = 20) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(limit)],
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  },
  ["jobs-list"],
  { revalidate: 120 },
);

/**
 * Fetch ALL jobs from Appwrite using pagination
 * Appwrite limits to 100 docs per request, so we paginate through all
 */
export async function getAllJobs() {
  try {
    const allJobs = [];
    let lastId = null;
    const batchSize = 100; // Appwrite max limit per request

    while (true) {
      const queries = [Query.orderDesc("$createdAt"), Query.limit(batchSize)];

      // Use cursor-based pagination for efficiency
      if (lastId) {
        queries.push(Query.cursorAfter(lastId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        queries,
      );

      allJobs.push(...response.documents);

      // If we got fewer than batchSize, we've reached the end
      if (response.documents.length < batchSize) {
        break;
      }

      // Set cursor for next batch
      lastId = response.documents[response.documents.length - 1].$id;
    }

    return allJobs;
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    return [];
  }
}

/**
 * Fetch a paginated page of jobs with optional search and location filters.
 * Uses fulltext search indexes across multiple fields with relevance scoring.
 * Results cached for 120s by Next.js unstable_cache.
 */
export async function getJobsPage({
  page = 1,
  perPage = 25,
  searchQuery = "",
  locationFilter = "",
  typeFilter = "",
} = {}) {
  // Build a cache key from the params
  const cacheKey = `jobs-page-${page}-${perPage}-${searchQuery}-${locationFilter}-${typeFilter}`;
  const cachedFn = unstable_cache(
    async () => {
      return _getJobsPageInternal({
        page,
        perPage,
        searchQuery,
        locationFilter,
        typeFilter,
      });
    },
    [cacheKey],
    { revalidate: 120 },
  );
  return cachedFn();
}

async function _getJobsPageInternal({
  page = 1,
  perPage = 25,
  searchQuery = "",
  locationFilter = "",
  typeFilter = "",
} = {}) {
  try {
    const normalizedSearch = (searchQuery || "").trim();
    const locationQuery = (locationFilter || typeFilter || "").trim();

    if (normalizedSearch) {
      // ─── Multi-field parallel fulltext search ───
      // Search title, company, description, and location simultaneously
      // Each Appwrite fulltext query only supports one field at a time,
      // so we fire them all in parallel and merge + deduplicate.
      const searchFields = ["title", "company", "description"];
      const batchSize = 200; // fetch more per field to widen the net

      const searchPromises = searchFields.map((field) =>
        databases
          .listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [
            Query.search(field, normalizedSearch),
            Query.limit(batchSize),
          ])
          .then((res) => ({ field, documents: res.documents }))
          .catch(() => ({ field, documents: [] })),
      );

      // Also search location field if user typed a location
      if (locationQuery) {
        searchPromises.push(
          databases
            .listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [
              Query.search("location", locationQuery),
              Query.limit(batchSize),
            ])
            .then((res) => ({
              field: "location",
              documents: res.documents,
            }))
            .catch(() => ({ field: "location", documents: [] })),
        );
      }

      const searchResults = await Promise.all(searchPromises);

      // ─── Merge & deduplicate ───
      const docMap = new Map(); // $id -> { doc, matchedFields: Set }
      for (const { field, documents } of searchResults) {
        for (const doc of documents) {
          if (docMap.has(doc.$id)) {
            docMap.get(doc.$id).matchedFields.add(field);
          } else {
            docMap.set(doc.$id, { doc, matchedFields: new Set([field]) });
          }
        }
      }

      // ─── Relevance scoring ───
      const searchLower = normalizedSearch.toLowerCase();
      const searchTerms = searchLower
        .split(/[\s,]+/)
        .filter((t) => t.length > 1);

      const scored = [...docMap.values()].map(({ doc, matchedFields }) => {
        let score = 0;

        const titleLower = (doc.title || "").toLowerCase();
        const companyLower = (doc.company || "").toLowerCase();
        const descLower = (doc.description || "").toLowerCase();
        const locLower = (doc.location || "").toLowerCase();

        // Exact phrase match bonuses (highest value)
        if (titleLower.includes(searchLower)) score += 100;
        if (companyLower.includes(searchLower)) score += 60;
        if (descLower.includes(searchLower)) score += 20;

        // Field match bonuses — title matches matter most
        if (matchedFields.has("title")) score += 50;
        if (matchedFields.has("company")) score += 30;
        if (matchedFields.has("description")) score += 10;
        if (matchedFields.has("location")) score += 5;

        // Multi-field match bonus (matches across fields = more relevant)
        if (matchedFields.size >= 3) score += 25;
        else if (matchedFields.size >= 2) score += 10;

        // Individual term match counting (rewards more matching terms)
        for (const term of searchTerms) {
          if (titleLower.includes(term)) score += 15;
          if (companyLower.includes(term)) score += 8;
          if (descLower.includes(term)) score += 3;
        }

        // Title starts-with bonus (e.g. "Software" matching "Software Engineer")
        if (titleLower.startsWith(searchLower)) score += 30;

        // Recency bonus — newer jobs get a small boost
        const ageMs = Date.now() - new Date(doc.$createdAt).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        if (ageDays < 1) score += 10;
        else if (ageDays < 3) score += 7;
        else if (ageDays < 7) score += 4;
        else if (ageDays < 14) score += 2;

        return { doc, score };
      });

      // ─── Location sub-filter ───
      let filtered = scored;
      if (locationQuery) {
        const locLower = locationQuery.toLowerCase();
        const locTerms = locLower.split(/[\s,]+/).filter((t) => t.length > 1);
        filtered = scored.filter(({ doc }) => {
          const jobLoc = (doc.location || "").toLowerCase();
          return locTerms.some((term) => jobLoc.includes(term));
        });
        // If location filtering removes everything, fall back to all results
        if (filtered.length === 0) filtered = scored;
      }

      // Sort by relevance score (descending), then by date as tiebreaker
      filtered.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.doc.$createdAt) - new Date(a.doc.$createdAt);
      });

      const total = filtered.length;
      const start = (page - 1) * perPage;
      return {
        documents: filtered.slice(start, start + perPage).map((r) => r.doc),
        total,
      };
    }

    // ─── No search — simple paginated listing ───
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(perPage),
      Query.offset(Math.max(0, (page - 1) * perPage)),
    ];

    if (locationQuery) {
      try {
        queries.push(Query.search("location", locationQuery));
      } catch {
        // fallback: no location fulltext index
      }
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      queries,
    );

    return {
      documents: response.documents,
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching jobs page:", error);
    return { documents: [], total: 0 };
  }
}

/**
 * Get the exact total number of documents in the jobs collection.
 * Appwrite caps the `total` field at 5000 for performance, so we use
 * cursor pagination with minimal payload ($id only) to count accurately.
 * Result is cached for 60s via Next.js unstable_cache to avoid repeated slow counts.
 */
export const getExactJobCount = unstable_cache(
  async () => {
    try {
      let count = 0;
      let lastId = null;
      const batchSize = 100;

      while (true) {
        const queries = [Query.limit(batchSize), Query.select(["$id"])];
        if (lastId) {
          queries.push(Query.cursorAfter(lastId));
        }

        const response = await databases.listDocuments(
          DATABASE_ID,
          JOBS_COLLECTION_ID,
          queries,
        );

        count += response.documents.length;

        if (response.documents.length < batchSize) {
          break;
        }

        lastId = response.documents[response.documents.length - 1].$id;
      }

      return count;
    } catch (error) {
      console.error("Error counting jobs:", error);
      return 0;
    }
  },
  ["exact-job-count"],
  { revalidate: 86400 }, // 24 hours - counting is expensive, so we cache long-term
);

/**
 * Check if a job already exists by source_id
 */
export async function jobExists(sourceId) {
  // Skip check if sourceId is empty or invalid
  if (!sourceId || sourceId.trim() === "") {
    return false;
  }

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [Query.equal("source_id", sourceId)],
    );
    return response.total > 0;
  } catch (error) {
    console.error("Error checking job existence:", error);
    return false;
  }
}

/**
 * Fetch a single job by ID (cached for 300s)
 */
export async function getJobById(jobId) {
  const cachedFn = unstable_cache(
    async () => {
      try {
        const document = await databases.getDocument(
          DATABASE_ID,
          JOBS_COLLECTION_ID,
          jobId,
        );
        return document;
      } catch (error) {
        console.error("Error fetching job by ID:", error);
        return null;
      }
    },
    [`job-id-${jobId}`],
    { revalidate: 300 },
  );
  return cachedFn();
}

/**
 * Fetch a single job by slug (cached for 300s)
 */
export async function getJobBySlug(slug) {
  const cachedFn = unstable_cache(
    async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          JOBS_COLLECTION_ID,
          [Query.equal("slug", slug), Query.limit(1)],
        );
        return response.documents[0] || null;
      } catch (error) {
        console.error("Error fetching job by slug:", error);
        return null;
      }
    },
    [`job-slug-${slug}`],
    { revalidate: 300 },
  );
  return cachedFn();
}

/**
 * Fetch a single job by slug, with ID fallback
 */
export async function getJobBySlugOrId(slugOrId) {
  const bySlug = await getJobBySlug(slugOrId);
  if (bySlug) return bySlug;
  return await getJobById(slugOrId);
}

/**
 * Search jobs in database by query and location
 * Supports both English and Bangla text searches
 */
export async function searchJobs(query, location = "Remote", limit = 50) {
  try {
    // Normalize query - handle both English and Bangla
    const normalizedQuery = query.normalize("NFC").trim();

    // Split search terms - handle both English (space) and Bangla text
    const searchTerms = normalizedQuery
      .toLowerCase()
      .split(/[\s,।]+/) // Split by space, comma, or Bangla danda
      .filter((t) => t.length > 1); // Allow shorter Bangla words

    const locationLower = location.toLowerCase().normalize("NFC");

    // Fetch jobs and filter client-side for better search results
    const response = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [Query.limit(300), Query.orderDesc("$createdAt")],
    );

    // Filter jobs that match the search query
    let filteredJobs = response.documents.filter((job) => {
      // Normalize all text fields for comparison
      const titleLower = (job.title || "").toLowerCase().normalize("NFC");
      const companyLower = (job.company || "").toLowerCase().normalize("NFC");
      const descLower = (job.description || "").toLowerCase().normalize("NFC");
      const jobLocLower = (job.location || "").toLowerCase().normalize("NFC");

      // Also check enhanced_json for additional searchable content
      let enhancedText = "";
      if (job.enhanced_json) {
        try {
          const enhanced = JSON.parse(job.enhanced_json);
          enhancedText = [
            enhanced?.header?.title,
            enhanced?.header?.company,
            enhanced?.seo?.keywords?.join(" "),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .normalize("NFC");
        } catch {}
      }

      // Check if any search term matches title, company, description, or enhanced content
      const matchesQuery = searchTerms.some(
        (term) =>
          titleLower.includes(term) ||
          companyLower.includes(term) ||
          descLower.includes(term) ||
          enhancedText.includes(term),
      );

      // Check location match (if not remote/worldwide search)
      const isRemoteSearch =
        locationLower === "remote" ||
        locationLower === "worldwide" ||
        locationLower === "" ||
        locationLower.includes("বাংলাদেশ"); // Bangladesh in Bangla

      const matchesLocation =
        isRemoteSearch ||
        jobLocLower.includes("remote") ||
        jobLocLower.includes(locationLower.split(",")[0].trim()) ||
        jobLocLower.includes("bangladesh");

      return matchesQuery && matchesLocation;
    });

    return filteredJobs.slice(0, limit);
  } catch (error) {
    console.error("Error searching jobs:", error);
    return [];
  }
}

/**
 * Generate a URL-friendly slug from job title and company
 */
export function generateJobSlug(title, company, id) {
  const text = `${title}-at-${company}`;
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
  const shortId = id.substring(0, 6);
  return `${slug}-${shortId}`;
}

/**
 * Create a new job document with auto-generated slug
 * Supports new output.json fields: salary, experience, education, deadline
 */
export async function createJob(jobData) {
  try {
    // Validate required fields
    if (!jobData.apply_url || jobData.apply_url.trim() === "") {
      throw new Error("apply_url is required");
    }

    // Generate a temporary ID for slug generation
    const tempId = ID.unique();
    const slug = generateJobSlug(jobData.title, jobData.company, tempId);

    // Ensure source_id is not empty
    const sourceId =
      jobData.source_id ||
      `${jobData.title}-${jobData.company}-${Date.now()}`.substring(0, 100);

    const docData = {
      title: jobData.title || "Untitled Job",
      company: jobData.company || "Unknown Company",
      location: jobData.location || "Not specified",
      apply_url: jobData.apply_url,
      description: jobData.description || "",
      source_id: sourceId,
      slug: slug,
    };

    // Add optional fields from output.json format
    if (jobData.salary) docData.salary = jobData.salary;
    if (jobData.experience) docData.experience = jobData.experience;
    if (jobData.education) docData.education = jobData.education;
    if (jobData.deadline) docData.deadline = jobData.deadline;

    const document = await databases.createDocument(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      tempId,
      docData,
    );
    return document;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

/**
 * Create a job from the output.json scraper format
 */
export async function createJobFromOutput(outputJob) {
  return createJob({
    title: outputJob.job_title,
    company: outputJob.company_name,
    location: outputJob.location,
    apply_url: outputJob.url,
    description: (outputJob.job_description || "").substring(0, 5000),
    source_id: outputJob.url,
    salary: outputJob.salary || "",
    experience: outputJob.experience || "",
    education: outputJob.education || "",
    deadline: outputJob.deadline || "",
  });
}

// ============ PROFILE FUNCTIONS ============

/**
 * Get user profile by userId
 */
export async function getProfile(userId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );
    return response.documents[0] || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

/**
 * Create or update user profile
 */
export async function upsertProfile(userId, profileData) {
  try {
    const existing = await getProfile(userId);

    if (existing) {
      // Update existing profile
      return await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        existing.$id,
        profileData,
      );
    } else {
      // Create new profile
      return await databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        ID.unique(),
        { userId, ...profileData },
      );
    }
  } catch (error) {
    console.error("Error upserting profile:", error);
    throw error;
  }
}

// ============ SAVED JOBS FUNCTIONS ============

/**
 * Get saved jobs for a user
 */
export async function getSavedJobs(userId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_JOBS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return [];
  }
}

/**
 * Save a job for a user
 */
export async function saveJob(userId, jobData) {
  try {
    // Check if already saved
    const existing = await databases.listDocuments(
      DATABASE_ID,
      SAVED_JOBS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("jobId", jobData.jobId)],
    );

    if (existing.total > 0) {
      return { alreadySaved: true };
    }

    return await databases.createDocument(
      DATABASE_ID,
      SAVED_JOBS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        jobId: jobData.jobId,
        jobTitle: jobData.jobTitle,
        company: jobData.company,
        location: jobData.location || "",
        apply_url: jobData.apply_url || "",
      },
    );
  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
}

/**
 * Remove saved job
 */
export async function unsaveJob(userId, jobId) {
  try {
    const existing = await databases.listDocuments(
      DATABASE_ID,
      SAVED_JOBS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("jobId", jobId)],
    );

    if (existing.total > 0) {
      await databases.deleteDocument(
        DATABASE_ID,
        SAVED_JOBS_COLLECTION_ID,
        existing.documents[0].$id,
      );
      return { success: true };
    }
    return { success: false, message: "Job not found in saved list" };
  } catch (error) {
    console.error("Error unsaving job:", error);
    throw error;
  }
}

/**
 * Check if job is saved
 */
export async function isJobSaved(userId, jobId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_JOBS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("jobId", jobId)],
    );
    return response.total > 0;
  } catch (error) {
    console.error("Error checking saved job:", error);
    return false;
  }
}

// ============ APPLICATION FUNCTIONS ============

/**
 * Get user's job applications
 */
export async function getApplications(userId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      APPLICATIONS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("appliedAt")],
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

/**
 * Create job application
 */
export async function createApplication(userId, applicationData) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      APPLICATIONS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        ...applicationData,
        appliedAt: new Date().toISOString(),
        status: "applied",
      },
    );
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
}

/**
 * Update application status
 */
export async function updateApplicationStatus(applicationId, status, notes) {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      APPLICATIONS_COLLECTION_ID,
      applicationId,
      { status, notes },
    );
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
}

// ============ NOTIFICATION FUNCTIONS ============

/**
 * Get user notifications
 */
export async function getNotifications(userId, unreadOnly = false) {
  try {
    const queries = [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
    ];
    if (unreadOnly) {
      queries.push(Query.equal("isRead", false));
    }
    const response = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      queries,
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId) {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      notificationId,
      { isRead: true },
    );
  } catch (error) {
    console.error("Error marking notification read:", error);
    throw error;
  }
}

// ==================== SEARCH USAGE TRACKING ====================

/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get user's search usage for today
 */
export async function getUserSearchUsage(userId) {
  try {
    const today = getTodayDateString();
    const response = await databases.listDocuments(
      DATABASE_ID,
      SEARCH_USAGE_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("date", today)],
    );

    if (response.total > 0) {
      return response.documents[0];
    }
    return null;
  } catch (error) {
    // Collection might not exist yet
    console.error("Error fetching search usage:", error);
    return null;
  }
}

/**
 * Check if user can search (based on their subscription)
 */
export async function canUserSearch(userId, isPremium = false) {
  try {
    const usage = await getUserSearchUsage(userId);
    const limit = isPremium ? PREMIUM_SEARCH_LIMIT : FREE_SEARCH_LIMIT;

    if (!usage) {
      return { canSearch: true, searchesUsed: 0, searchesRemaining: limit };
    }

    const searchesUsed = usage.count || 0;
    const canSearch = searchesUsed < limit;

    return {
      canSearch,
      searchesUsed,
      searchesRemaining: Math.max(0, limit - searchesUsed),
      limit,
    };
  } catch (error) {
    console.error("Error checking search eligibility:", error);
    // Allow search on error to not block users
    return {
      canSearch: true,
      searchesUsed: 0,
      searchesRemaining: FREE_SEARCH_LIMIT,
    };
  }
}

/**
 * Increment user's search count for today
 */
export async function incrementSearchUsage(userId) {
  try {
    const today = getTodayDateString();
    const usage = await getUserSearchUsage(userId);

    if (usage) {
      // Update existing record
      return await databases.updateDocument(
        DATABASE_ID,
        SEARCH_USAGE_COLLECTION_ID,
        usage.$id,
        { count: (usage.count || 0) + 1 },
      );
    } else {
      // Create new record for today
      // Use a deterministic ID based on userId + date to avoid race conditions
      const docId = `${userId}_${today}`.replace(/-/g, "");
      try {
        return await databases.createDocument(
          DATABASE_ID,
          SEARCH_USAGE_COLLECTION_ID,
          docId,
          {
            userId,
            date: today,
            count: 1,
          },
        );
      } catch (createError) {
        // If document already exists (race condition), update it instead
        if (createError.code === 409) {
          const existingUsage = await getUserSearchUsage(userId);
          if (existingUsage) {
            return await databases.updateDocument(
              DATABASE_ID,
              SEARCH_USAGE_COLLECTION_ID,
              existingUsage.$id,
              { count: (existingUsage.count || 0) + 1 },
            );
          }
        }
        throw createError;
      }
    }
  } catch (error) {
    console.error("Error incrementing search usage:", error);
    // Don't throw - allow the search to proceed
  }
}

/**
 * Check if user has premium subscription
 */
export async function isUserPremium(userId) {
  try {
    const profile = await getProfile(userId);
    return profile?.isPremium === true;
  } catch (error) {
    return false;
  }
}
