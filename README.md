# hiredup.me - Job Board Platform

A modern job board built with Next.js (App Router) and Appwrite, featuring an AI-powered job scraper using ScraperAPI and Google Gemini 1.5 Flash.

## 🚀 Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **AI Job Scraper**: Automated scraping using ScraperAPI + Gemini 1.5 Flash
- **Appwrite Backend**: Secure, scalable database for job listings
- **Vercel Cron Jobs**: Automated daily job scraping
- **Duplicate Detection**: Smart source_id-based deduplication

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── cron/fetch/route.js    # Vercel Cron endpoint
│   │   ├── jobs/route.js          # Jobs API
│   │   └── scrape/route.js        # Manual scrape endpoint
│   ├── globals.css
│   ├── layout.js
│   └── page.js                    # Homepage
├── components/
│   ├── Header.js
│   ├── Footer.js
│   ├── HeroSection.js
│   ├── SearchBar.js
│   ├── WhySection.js
│   ├── JobsSection.js
│   ├── JobCard.js
│   ├── HowItWorks.js
│   ├── Testimonials.js
│   └── CTASection.js
└── lib/
    ├── appwrite.js                # Appwrite client & helpers
    └── scraper.js                 # AI scraper service
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Appwrite endpoint (default: https://cloud.appwrite.io/v1)
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Your Appwrite project ID
- `APPWRITE_API_KEY` - Appwrite API key with databases permissions
- `APPWRITE_DATABASE_ID` - Database ID (default: hiredup)
- `APPWRITE_JOBS_COLLECTION_ID` - Collection ID (default: jobs)
- `SCRAPERAPI_KEY` - Your ScraperAPI key
- `GEMINI_API_KEY` - Your Google Gemini API key
- `CRON_SECRET` - Random secret for cron job authentication

### 2. Set Up Appwrite Database

Run the setup script to create the database and collection:

```bash
node scripts/setup-appwrite.js
```

This creates:
- Database: `hiredup`
- Collection: `jobs` with attributes:
  - `title` (string, 255, required)
  - `company` (string, 255, required)
  - `location` (string, 255, required)
  - `apply_url` (url, required)
  - `description` (string, 5000, optional)
  - `source_id` (string, 255, required, indexed)

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔄 API Endpoints

### GET /api/jobs
Fetch all jobs from the database.

```bash
curl http://localhost:3000/api/jobs?limit=20
```

### POST /api/scrape
Manually trigger a scrape for a specific URL.

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/jobs"}'
```

### GET /api/cron/fetch
Cron endpoint triggered by Vercel every 24 hours.

## ⏰ Vercel Cron Configuration

The `vercel.json` file configures the cron job:

```json
{
  "crons": [{
    "path": "/api/cron/fetch",
    "schedule": "0 0 * * *"
  }]
}
```

This runs daily at midnight UTC. Modify the schedule as needed.

## 🎯 Adding Target URLs for Scraping

Edit `src/lib/scraper.js` and update the `getTargetUrls()` function:

```javascript
export function getTargetUrls() {
  return [
    'https://www.linkedin.com/jobs/search/?keywords=developer&location=Bangladesh',
    'https://www.indeed.com/jobs?q=developer&l=Remote',
    // Add more URLs here
  ];
}
```

## 🔒 Security Notes

1. Never commit `.env.local` to version control
2. The cron endpoint requires the `CRON_SECRET` in production
3. Appwrite API keys should have minimal required permissions
4. ScraperAPI and Gemini keys should be kept confidential

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Appwrite (node-appwrite SDK)
- **AI**: Google Gemini 1.5 Flash (@google/generative-ai)
- **Proxy**: ScraperAPI
- **Deployment**: Vercel (with Cron Jobs)

## 📄 License

MIT
