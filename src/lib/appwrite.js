import { Client, Databases, ID, Query } from "node-appwrite";

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

/**
 * Fetch all jobs from Appwrite
 */
export async function getJobs(limit = 20) {
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
}

/**
 * Check if a job already exists by source_id
 */
export async function jobExists(sourceId) {
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
 * Create a new job document
 */
export async function createJob(jobData) {
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      ID.unique(),
      {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        apply_url: jobData.apply_url,
        description: jobData.description || "",
        source_id: jobData.source_id,
      },
    );
    return document;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
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
