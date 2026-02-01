// Script to add sample jobs to test the display
require("dotenv").config({ path: ".env.local" });
const { Client, Databases, ID, Query } = require("node-appwrite");

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

const sampleJobs = [
  {
    title: "Senior React Developer",
    company: "TechCorp Bangladesh",
    location: "Dhaka, Bangladesh",
    description:
      "We are looking for an experienced React developer to join our team. You will be working on cutting-edge web applications using React, Next.js, and TypeScript.",
    apply_url: "https://example.com/apply/1",
    source_id: "sample_job_1",
  },
  {
    title: "Full Stack Developer (Remote)",
    company: "Global Tech Solutions",
    location: "Remote",
    description:
      "Join our fully remote team as a Full Stack Developer. Work with Node.js, React, and PostgreSQL to build scalable applications.",
    apply_url: "https://example.com/apply/2",
    source_id: "sample_job_2",
  },
  {
    title: "Python Backend Engineer",
    company: "DataFlow Inc",
    location: "Chittagong, Bangladesh",
    description:
      "Looking for a Python backend engineer with experience in Django/FastAPI, databases, and cloud services (AWS/GCP).",
    apply_url: "https://example.com/apply/3",
    source_id: "sample_job_3",
  },
  {
    title: "UI/UX Designer",
    company: "Creative Studio BD",
    location: "Dhaka, Bangladesh",
    description:
      "We need a talented UI/UX designer to create beautiful and intuitive user interfaces for web and mobile applications.",
    apply_url: "https://example.com/apply/4",
    source_id: "sample_job_4",
  },
  {
    title: "DevOps Engineer",
    company: "CloudFirst",
    location: "Remote (Worldwide)",
    description:
      "Seeking a DevOps engineer with expertise in CI/CD, Docker, Kubernetes, and cloud infrastructure management.",
    apply_url: "https://example.com/apply/5",
    source_id: "sample_job_5",
  },
  {
    title: "Mobile App Developer (Flutter)",
    company: "AppWorks Bangladesh",
    location: "Dhaka, Bangladesh",
    description:
      "Build cross-platform mobile applications using Flutter and Dart. Experience with Firebase and REST APIs required.",
    apply_url: "https://example.com/apply/6",
    source_id: "sample_job_6",
  },
];

async function addSampleJobs() {
  console.log("Adding sample jobs to database...\n");

  let added = 0;
  let skipped = 0;

  for (const job of sampleJobs) {
    try {
      // Check if job already exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        [Query.equal("source_id", job.source_id)],
      );

      if (existing.total > 0) {
        console.log(`⏭️  Skipped (already exists): ${job.title}`);
        skipped++;
        continue;
      }

      await databases.createDocument(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        ID.unique(),
        job,
      );
      console.log(`✅ Added: ${job.title} at ${job.company}`);
      added++;
    } catch (error) {
      console.error(`❌ Error adding ${job.title}:`, error.message);
    }
  }

  console.log(`\n📊 Summary: ${added} added, ${skipped} skipped`);
}

addSampleJobs().catch(console.error);
