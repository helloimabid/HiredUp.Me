require("dotenv").config({ path: ".env.local" });
const { Client, Databases, Query } = require("node-appwrite");

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

async function deleteSampleJobs() {
  try {
    console.log("Fetching all jobs...");

    // Get all documents
    const response = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [Query.limit(100)],
    );

    console.log(`Found ${response.documents.length} jobs to delete`);

    // Delete each document
    for (const doc of response.documents) {
      await databases.deleteDocument(DATABASE_ID, JOBS_COLLECTION_ID, doc.$id);
      console.log(`Deleted: ${doc.title}`);
    }

    console.log("\n✅ All sample jobs deleted!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

deleteSampleJobs();
