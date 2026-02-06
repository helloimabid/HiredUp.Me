/**
 * Appwrite Database Setup Script
 *
 * Run this script once to create the database and collections:
 * node scripts/setup-appwrite.js
 *
 * Make sure to set your environment variables first!
 */

const { Client, Databases, ID } = require("node-appwrite");
require("dotenv").config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

async function setup() {
  try {
    console.log("🚀 Starting Appwrite setup...\n");

    // Create Database
    console.log("Creating database...");
    try {
      await databases.create(DATABASE_ID, "HiredUp Database");
      console.log("✅ Database created successfully");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  Database already exists, skipping...");
      } else {
        throw error;
      }
    }

    // Create Jobs Collection
    console.log("\nCreating jobs collection...");
    try {
      await databases.createCollection(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        "Jobs",
        [
          // Allow anyone to read jobs (public job listings)
          'read("any")',
        ],
        false, // documentSecurity
      );
      console.log("✅ Jobs collection created successfully");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  Jobs collection already exists, skipping...");
      } else {
        throw error;
      }
    }

    // Create Attributes
    console.log("\nCreating collection attributes...");

    const attributes = [
      { name: "title", type: "string", size: 255, required: true },
      { name: "company", type: "string", size: 255, required: true },
      { name: "location", type: "string", size: 255, required: true },
      { name: "apply_url", type: "url", required: true },
      { name: "description", type: "string", size: 5000, required: false },
      { name: "source_id", type: "string", size: 255, required: true },
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === "string") {
          await databases.createStringAttribute(
            DATABASE_ID,
            JOBS_COLLECTION_ID,
            attr.name,
            attr.size,
            attr.required,
            attr.default || null,
          );
        } else if (attr.type === "url") {
          await databases.createUrlAttribute(
            DATABASE_ID,
            JOBS_COLLECTION_ID,
            attr.name,
            attr.required,
          );
        }
        console.log(`✅ Attribute '${attr.name}' created`);
      } catch (error) {
        if (error.code === 409) {
          console.log(
            `ℹ️  Attribute '${attr.name}' already exists, skipping...`,
          );
        } else {
          console.error(
            `❌ Error creating attribute '${attr.name}':`,
            error.message,
          );
        }
      }
    }

    // Wait a bit for attributes to be ready
    console.log("\n⏳ Waiting for attributes to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Create Index for source_id (for duplicate checking)
    console.log("\nCreating indexes...");
    try {
      await databases.createIndex(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        "source_id_index",
        "key",
        ["source_id"],
        ["ASC"],
      );
      console.log("✅ Index for source_id created");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  Index already exists, skipping...");
      } else {
        console.error("❌ Error creating index:", error.message);
      }
    }

    const searchIndexes = [
      { key: "title_fulltext_idx", type: "fulltext", attributes: ["title"] },
      {
        key: "company_fulltext_idx",
        type: "fulltext",
        attributes: ["company"],
      },
      {
        key: "description_fulltext_idx",
        type: "fulltext",
        attributes: ["description"],
      },
      { key: "salary_fulltext_idx", type: "fulltext", attributes: ["salary"] },
      {
        key: "experience_fulltext_idx",
        type: "fulltext",
        attributes: ["experience"],
      },
      {
        key: "location_fulltext_idx",
        type: "fulltext",
        attributes: ["location"],
      },
    ];

    for (const index of searchIndexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          JOBS_COLLECTION_ID,
          index.key,
          index.type,
          index.attributes,
        );
        console.log(`✅ Index created: ${index.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Index already exists: ${index.key}`);
        } else {
          console.error(`❌ Error creating index ${index.key}:`, error.message);
        }
      }
    }

    console.log("\n🎉 Appwrite setup complete!");
    console.log("\nYour database is ready. Collection attributes:");
    console.log("  - title (string, 255, required)");
    console.log("  - company (string, 255, required)");
    console.log("  - location (string, 255, required)");
    console.log("  - apply_url (url, required)");
    console.log("  - description (string, 5000, optional)");
    console.log("  - source_id (string, 255, required, indexed)");
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
