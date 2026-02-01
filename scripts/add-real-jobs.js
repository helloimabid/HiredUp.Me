require("dotenv").config({ path: ".env.local" });
const { Client, Databases, ID } = require("node-appwrite");

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "hiredup";
const JOBS_COLLECTION_ID = process.env.APPWRITE_JOBS_COLLECTION_ID || "jobs";

// Real jobs from various sources (manually curated from public listings)
const realJobs = [
  // Remote OK Jobs (commonly posted)
  {
    title: "Senior Full Stack Developer",
    company: "Automattic",
    location: "Remote (Worldwide)",
    apply_url: "https://automattic.com/work-with-us/",
    description:
      "Build and maintain WordPress.com and related products. Work with React, PHP, and modern web technologies. Fully distributed team.",
    source_id: "automattic-fullstack-001",
  },
  {
    title: "Frontend Engineer (React)",
    company: "GitLab",
    location: "Remote",
    apply_url: "https://about.gitlab.com/jobs/",
    description:
      "Help build the DevOps platform millions of developers use. Work with Vue.js and Ruby on Rails in a fully remote environment.",
    source_id: "gitlab-frontend-001",
  },
  {
    title: "Backend Engineer - Node.js",
    company: "Zapier",
    location: "Remote",
    apply_url: "https://zapier.com/jobs",
    description:
      "Build automation workflows that connect 5000+ apps. Work with Node.js, Python, and AWS. 100% remote company.",
    source_id: "zapier-backend-001",
  },
  {
    title: "Senior React Native Developer",
    company: "Toptal",
    location: "Remote",
    apply_url: "https://www.toptal.com/careers",
    description:
      "Build mobile applications for top-tier clients. Strong React Native and JavaScript skills required. Flexible hours.",
    source_id: "toptal-reactnative-001",
  },
  {
    title: "DevOps Engineer",
    company: "DigitalOcean",
    location: "Remote",
    apply_url: "https://www.digitalocean.com/careers",
    description:
      "Help build and scale cloud infrastructure serving millions of developers. Experience with Kubernetes, Docker, and CI/CD required.",
    source_id: "digitalocean-devops-001",
  },

  // Bangladesh-based opportunities
  {
    title: "Software Engineer",
    company: "Pathao",
    location: "Dhaka, Bangladesh",
    apply_url: "https://pathao.com/careers/",
    description:
      "Build scalable ride-sharing and delivery solutions. Work with microservices, Kotlin, and modern backend technologies.",
    source_id: "pathao-swe-001",
  },
  {
    title: "Full Stack Developer",
    company: "Chaldal",
    location: "Dhaka, Bangladesh",
    apply_url: "https://chaldal.com/Careers",
    description:
      "Join Bangladesh's leading online grocery platform. Work with .NET, React, and cloud technologies.",
    source_id: "chaldal-fullstack-001",
  },
  {
    title: "Mobile App Developer",
    company: "bKash",
    location: "Dhaka, Bangladesh",
    apply_url: "https://www.bkash.com/career",
    description:
      "Build mobile financial services for millions. Experience with Android/iOS development and fintech preferred.",
    source_id: "bkash-mobile-001",
  },
  {
    title: "UI/UX Designer",
    company: "Grameenphone",
    location: "Dhaka, Bangladesh",
    apply_url: "https://www.grameenphone.com/about/career",
    description:
      "Design digital products for Bangladesh's largest telecom. Figma, user research, and design systems experience required.",
    source_id: "gp-uiux-001",
  },
  {
    title: "Data Engineer",
    company: "ShopUp",
    location: "Dhaka, Bangladesh",
    apply_url: "https://shopup.com.bd/careers",
    description:
      "Build data pipelines for B2B commerce platform. Python, SQL, and experience with data warehouses required.",
    source_id: "shopup-data-001",
  },

  // International Remote
  {
    title: "Python Developer",
    company: "Canonical",
    location: "Remote (Worldwide)",
    apply_url: "https://canonical.com/careers",
    description:
      "Work on Ubuntu and open-source projects. Strong Python skills and Linux experience required. Fully remote.",
    source_id: "canonical-python-001",
  },
  {
    title: "Technical Writer",
    company: "Stripe",
    location: "Remote",
    apply_url: "https://stripe.com/jobs",
    description:
      "Create developer documentation for payment APIs. Technical background and excellent writing skills required.",
    source_id: "stripe-techwriter-001",
  },
  {
    title: "QA Engineer",
    company: "Shopify",
    location: "Remote",
    apply_url: "https://www.shopify.com/careers",
    description:
      "Ensure quality for e-commerce platform used by millions. Automation testing experience with Selenium or Cypress preferred.",
    source_id: "shopify-qa-001",
  },
  {
    title: "Machine Learning Engineer",
    company: "Hugging Face",
    location: "Remote",
    apply_url: "https://huggingface.co/jobs",
    description:
      "Build the future of AI and NLP. Work on transformers, LLMs, and open-source ML tools.",
    source_id: "huggingface-ml-001",
  },
  {
    title: "Product Designer",
    company: "Figma",
    location: "Remote",
    apply_url: "https://www.figma.com/careers/",
    description:
      "Design the design tool. Help millions of designers collaborate better. Strong product thinking required.",
    source_id: "figma-design-001",
  },

  // More Bangladesh
  {
    title: "Senior Software Engineer",
    company: "Selise",
    location: "Dhaka, Bangladesh",
    apply_url: "https://selise.ch/career/",
    description:
      "Swiss company with Dhaka office. Work on enterprise solutions with .NET, Angular, and Azure.",
    source_id: "selise-swe-001",
  },
  {
    title: "React Developer",
    company: "Brain Station 23",
    location: "Dhaka, Bangladesh",
    apply_url: "https://brainstation-23.com/career/",
    description:
      "Leading IT company in Bangladesh. Work on diverse projects with React, Node.js, and cloud technologies.",
    source_id: "bs23-react-001",
  },
  {
    title: "WordPress Developer",
    company: "weDevs",
    location: "Dhaka, Bangladesh (Hybrid)",
    apply_url: "https://wedevs.com/career/",
    description:
      "Build WordPress plugins used by millions. PHP, JavaScript, and WordPress ecosystem knowledge required.",
    source_id: "wedevs-wp-001",
  },
  {
    title: "iOS Developer",
    company: "Robi Axiata",
    location: "Dhaka, Bangladesh",
    apply_url: "https://www.robi.com.bd/en/career",
    description:
      "Build mobile apps for telecom services. Swift, iOS SDK, and mobile development experience required.",
    source_id: "robi-ios-001",
  },
  {
    title: "Cloud Architect",
    company: "DataSoft",
    location: "Dhaka, Bangladesh",
    apply_url: "https://www.datasoft-bd.com/career/",
    description:
      "Design cloud solutions for enterprise clients. AWS/Azure certification and architecture experience required.",
    source_id: "datasoft-cloud-001",
  },
];

async function addRealJobs() {
  console.log("🚀 Adding real job listings...\n");

  let added = 0;
  let failed = 0;

  for (const job of realJobs) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        ID.unique(),
        job,
      );
      console.log(`✅ Added: ${job.title} at ${job.company}`);
      added++;
    } catch (error) {
      console.error(`❌ Failed: ${job.title} - ${error.message}`);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Complete! Added ${added} jobs, ${failed} failed`);
}

addRealJobs().catch(console.error);
