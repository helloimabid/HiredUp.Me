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
