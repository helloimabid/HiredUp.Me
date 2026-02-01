import { createJob, jobExists } from "@/lib/appwrite";
import crypto from "crypto";

// Note: puppeteer is dynamically imported to avoid SSR issues in Next.js

/**
 * Check if location is "Remote"
 */
function isRemoteSearch(location) {
  if (!location) return true;
  const loc = location.toLowerCase().trim();
  return (
    loc === "remote" || loc === "worldwide" || loc === "anywhere" || loc === ""
  );
}

/**
 * Check if job location matches search location
 */
function locationMatches(jobLocation, searchLocation) {
  if (!jobLocation || !searchLocation) return true;
  if (isRemoteSearch(searchLocation)) return true;

  const jobLoc = jobLocation.toLowerCase();
  const searchLoc = searchLocation.toLowerCase();

  if (jobLoc.includes("remote") || jobLoc.includes("anywhere")) return true;

  const searchTerms = searchLoc.split(/[,\s]+/).filter((t) => t.length > 2);
  for (const term of searchTerms) {
    if (jobLoc.includes(term)) return true;
  }

  // Bangladesh
  if (searchLoc.includes("bangladesh") || searchLoc.includes("dhaka")) {
    if (
      jobLoc.includes("dhaka") ||
      jobLoc.includes("bangladesh") ||
      jobLoc.includes("bd") ||
      jobLoc.includes("chittagong") ||
      jobLoc.includes("sylhet")
    ) {
      return true;
    }
  }

  // India
  if (searchLoc.includes("india")) {
    if (
      jobLoc.includes("india") ||
      jobLoc.includes("mumbai") ||
      jobLoc.includes("bangalore") ||
      jobLoc.includes("delhi") ||
      jobLoc.includes("hyderabad")
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Generate unique source ID
 */
function generateSourceId(title, company, source) {
  const data = `${title}-${company}-${source}`.toLowerCase().substring(0, 100);
  return crypto.createHash("md5").update(data).digest("hex").substring(0, 16);
}

/**
 * Clean text
 */
function cleanText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Launch browser with optimized settings
 */
async function launchBrowser() {
  // Dynamic import to avoid issues in Next.js server environment
  const puppeteer = await import("puppeteer");

  return await puppeteer.default.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
    defaultViewport: { width: 1920, height: 1080 },
  });
}

/**
 * SCRAPE: LinkedIn Jobs (public job listings)
 */
async function scrapeLinkedIn(browser, query, location) {
  const jobs = [];
  const page = await browser.newPage();

  try {
    console.log("Scraping LinkedIn Jobs...");

    // Use public LinkedIn jobs URL (no login required)
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);
    const url = `https://www.linkedin.com/jobs/search?keywords=${encodedQuery}&location=${encodedLocation}&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`;

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page
      .waitForSelector(".jobs-search__results-list", { timeout: 10000 })
      .catch(() => null);

    // Scroll to load more jobs
    await autoScroll(page);

    const jobCards = await page.$$eval(
      ".jobs-search__results-list li",
      (cards) => {
        return cards.slice(0, 15).map((card) => {
          const titleEl = card.querySelector(".base-search-card__title");
          const companyEl = card.querySelector(".base-search-card__subtitle");
          const locationEl = card.querySelector(".job-search-card__location");
          const linkEl = card.querySelector("a.base-card__full-link");
          const timeEl = card.querySelector("time");

          return {
            title: titleEl?.innerText?.trim() || "",
            company: companyEl?.innerText?.trim() || "",
            location: locationEl?.innerText?.trim() || "",
            apply_url: linkEl?.href || "",
            posted: timeEl?.getAttribute("datetime") || "",
          };
        });
      },
    );

    for (const job of jobCards) {
      if (job.title && job.company && job.apply_url) {
        jobs.push({
          title: cleanText(job.title),
          company: cleanText(job.company),
          location: cleanText(job.location) || location,
          apply_url: job.apply_url,
          description: `Posted ${job.posted || "recently"}. Click to view full job details and apply.`,
          source_id: generateSourceId(job.title, job.company, "linkedin"),
          source: "LinkedIn",
        });
      }
    }

    console.log(`LinkedIn: Found ${jobs.length} jobs`);
  } catch (error) {
    console.error("LinkedIn scraping failed:", error.message);
  } finally {
    await page.close();
  }

  return jobs;
}

/**
 * SCRAPE: Indeed Jobs
 */
async function scrapeIndeed(browser, query, location) {
  const jobs = [];
  const page = await browser.newPage();

  try {
    console.log("Scraping Indeed Jobs...");

    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);

    // Determine Indeed domain based on location
    let domain = "www.indeed.com";
    if (location.toLowerCase().includes("bangladesh")) {
      domain = "indeed.com";
    } else if (location.toLowerCase().includes("india")) {
      domain = "indeed.com";
    } else if (
      location.toLowerCase().includes("uk") ||
      location.toLowerCase().includes("united kingdom")
    ) {
      domain = "indeed.com";
    }

    const url = `https://${domain}/jobs?q=${encodedQuery}&l=${encodedLocation}`;

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page
      .waitForSelector(".job_seen_beacon, .jobsearch-ResultsList", {
        timeout: 10000,
      })
      .catch(() => null);

    const jobCards = await page.$$eval(
      ".job_seen_beacon, .jobsearch-SerpJobCard",
      (cards) => {
        return cards.slice(0, 15).map((card) => {
          const titleEl = card.querySelector(
            "h2.jobTitle a, .jobTitle a, a[data-jk]",
          );
          const companyEl = card.querySelector(
            "[data-testid='company-name'], .companyName, .company",
          );
          const locationEl = card.querySelector(
            "[data-testid='text-location'], .companyLocation, .location",
          );
          const snippetEl = card.querySelector(".job-snippet, .summary");

          let applyUrl = titleEl?.href || "";
          const jobKey =
            titleEl?.getAttribute("data-jk") || card.getAttribute("data-jk");
          if (jobKey && !applyUrl.includes("indeed.com")) {
            applyUrl = `https://www.indeed.com/viewjob?jk=${jobKey}`;
          }

          return {
            title: titleEl?.innerText?.trim() || "",
            company: companyEl?.innerText?.trim() || "",
            location: locationEl?.innerText?.trim() || "",
            apply_url: applyUrl,
            description: snippetEl?.innerText?.trim() || "",
          };
        });
      },
    );

    for (const job of jobCards) {
      if (job.title && job.apply_url) {
        jobs.push({
          title: cleanText(job.title),
          company: cleanText(job.company) || "Company on Indeed",
          location: cleanText(job.location) || location,
          apply_url: job.apply_url,
          description:
            cleanText(job.description).substring(0, 500) ||
            "View full job details on Indeed.",
          source_id: generateSourceId(
            job.title,
            job.company || "indeed",
            "indeed",
          ),
          source: "Indeed",
        });
      }
    }

    console.log(`Indeed: Found ${jobs.length} jobs`);
  } catch (error) {
    console.error("Indeed scraping failed:", error.message);
  } finally {
    await page.close();
  }

  return jobs;
}

/**
 * SCRAPE: RemoteOK (simple HTML scraping)
 */
async function scrapeRemoteOK(browser, query) {
  const jobs = [];
  const page = await browser.newPage();

  try {
    console.log("Scraping RemoteOK...");

    const tag = query.toLowerCase().replace(/\s+/g, "-");
    const url = `https://remoteok.com/remote-${tag}-jobs`;

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector(".job", { timeout: 10000 }).catch(() => null);

    const jobCards = await page.$$eval("tr.job", (rows) => {
      return rows.slice(0, 15).map((row) => {
        const titleEl = row.querySelector("h2[itemprop='title']");
        const companyEl = row.querySelector("h3[itemprop='name']");
        const locationEl = row.querySelector(".location");
        const linkEl = row.querySelector("a.preventLink");

        return {
          title: titleEl?.innerText?.trim() || "",
          company: companyEl?.innerText?.trim() || "",
          location: locationEl?.innerText?.trim() || "Remote",
          apply_url: linkEl?.href || "",
        };
      });
    });

    for (const job of jobCards) {
      if (job.title && job.company) {
        jobs.push({
          title: cleanText(job.title),
          company: cleanText(job.company),
          location: cleanText(job.location) || "Remote",
          apply_url: job.apply_url || `https://remoteok.com/remote-${tag}-jobs`,
          description: `Remote ${query} position at ${job.company}. Click to view details.`,
          source_id: generateSourceId(job.title, job.company, "remoteok"),
          source: "RemoteOK",
        });
      }
    }

    console.log(`RemoteOK: Found ${jobs.length} jobs`);
  } catch (error) {
    console.error("RemoteOK scraping failed:", error.message);
  } finally {
    await page.close();
  }

  return jobs;
}

/**
 * SCRAPE: We Work Remotely
 */
async function scrapeWeWorkRemotely(browser, query) {
  const jobs = [];
  const page = await browser.newPage();

  try {
    console.log("Scraping We Work Remotely...");

    const url = `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(query)}`;

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page
      .waitForSelector(".jobs article", { timeout: 10000 })
      .catch(() => null);

    const jobCards = await page.$$eval(".jobs article li", (items) => {
      return items.slice(0, 15).map((item) => {
        const linkEl = item.querySelector("a");
        const titleEl = item.querySelector(".title");
        const companyEl = item.querySelector(".company");
        const regionEl = item.querySelector(".region");

        return {
          title: titleEl?.innerText?.trim() || "",
          company: companyEl?.innerText?.trim() || "",
          location: regionEl?.innerText?.trim() || "Remote",
          apply_url: linkEl?.href
            ? `https://weworkremotely.com${linkEl.href}`
            : "",
        };
      });
    });

    for (const job of jobCards) {
      if (job.title && job.company) {
        jobs.push({
          title: cleanText(job.title),
          company: cleanText(job.company),
          location: cleanText(job.location) || "Remote",
          apply_url: job.apply_url,
          description: `Remote position at ${job.company}. Apply on We Work Remotely.`,
          source_id: generateSourceId(job.title, job.company, "wwr"),
          source: "We Work Remotely",
        });
      }
    }

    console.log(`WWR: Found ${jobs.length} jobs`);
  } catch (error) {
    console.error("WWR scraping failed:", error.message);
  } finally {
    await page.close();
  }

  return jobs;
}

/**
 * SCRAPE: bdjobs.com (for Bangladesh)
 */
async function scrapeBDJobs(browser, query) {
  const jobs = [];
  const page = await browser.newPage();

  try {
    console.log("Scraping bdjobs.com...");

    const url = `https://jobs.bdjobs.com/jobsearch.asp?txt=${encodeURIComponent(query)}`;

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page
      .waitForSelector(".job-list-item, .job-list", { timeout: 10000 })
      .catch(() => null);

    const jobCards = await page.$$eval(
      ".job-list-item, .norm-jobs-list tbody tr",
      (items) => {
        return items.slice(0, 15).map((item) => {
          const titleEl = item.querySelector(
            "a.job-title-text, .job-title a, td:first-child a",
          );
          const companyEl = item.querySelector(
            ".comp-name, .company-name, td:nth-child(2)",
          );
          const locationEl = item.querySelector(".location, td:nth-child(3)");

          return {
            title: titleEl?.innerText?.trim() || "",
            company: companyEl?.innerText?.trim() || "",
            location: locationEl?.innerText?.trim() || "Bangladesh",
            apply_url: titleEl?.href || "",
          };
        });
      },
    );

    for (const job of jobCards) {
      if (job.title) {
        jobs.push({
          title: cleanText(job.title),
          company: cleanText(job.company) || "Company in Bangladesh",
          location: cleanText(job.location) || "Bangladesh",
          apply_url:
            job.apply_url ||
            `https://jobs.bdjobs.com/jobsearch.asp?txt=${encodeURIComponent(query)}`,
          description: `Job opportunity in Bangladesh. Apply on bdjobs.com.`,
          source_id: generateSourceId(
            job.title,
            job.company || "bdjobs",
            "bdjobs",
          ),
          source: "bdjobs.com",
        });
      }
    }

    console.log(`bdjobs: Found ${jobs.length} jobs`);
  } catch (error) {
    console.error("bdjobs scraping failed:", error.message);
  } finally {
    await page.close();
  }

  return jobs;
}

/**
 * SCRAPE: Glassdoor Jobs
 */
async function scrapeGlassdoor(browser, query, location) {
  const jobs = [];
  const page = await browser.newPage();

  try {
    console.log("Scraping Glassdoor...");

    const url = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(query)}&locT=N&locId=0`;

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page
      .waitForSelector("[data-test='jobListing']", { timeout: 10000 })
      .catch(() => null);

    const jobCards = await page.$$eval(
      "[data-test='jobListing'], .react-job-listing",
      (cards) => {
        return cards.slice(0, 15).map((card) => {
          const titleEl = card.querySelector(
            "[data-test='job-title'], .job-title",
          );
          const companyEl = card.querySelector(
            "[data-test='employer-short-name'], .employer-name",
          );
          const locationEl = card.querySelector(
            "[data-test='emp-location'], .location",
          );
          const linkEl = card.querySelector("a");

          return {
            title: titleEl?.innerText?.trim() || "",
            company: companyEl?.innerText?.trim() || "",
            location: locationEl?.innerText?.trim() || "",
            apply_url: linkEl?.href || "",
          };
        });
      },
    );

    for (const job of jobCards) {
      if (job.title && job.company) {
        jobs.push({
          title: cleanText(job.title),
          company: cleanText(job.company),
          location: cleanText(job.location) || location,
          apply_url: job.apply_url.startsWith("http")
            ? job.apply_url
            : `https://www.glassdoor.com${job.apply_url}`,
          description: `Job at ${job.company}. View company reviews and apply on Glassdoor.`,
          source_id: generateSourceId(job.title, job.company, "glassdoor"),
          source: "Glassdoor",
        });
      }
    }

    console.log(`Glassdoor: Found ${jobs.length} jobs`);
  } catch (error) {
    console.error("Glassdoor scraping failed:", error.message);
  } finally {
    await page.close();
  }

  return jobs;
}

/**
 * Auto scroll to load more content
 */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= 3000) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

/**
 * Free Job APIs (fallback - no browser needed)
 */
async function fetchFromFreeAPIs(query, location) {
  const jobs = [];

  // RemoteOK API
  try {
    console.log("Fetching from RemoteOK API...");
    const response = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "HiredUp/1.0" },
    });
    if (response.ok) {
      const data = await response.json();
      const queryLower = query.toLowerCase();
      const apiJobs = data
        .slice(1, 50)
        .filter((job) => {
          if (!job.position) return false;
          const pos = job.position.toLowerCase();
          return (
            pos.includes(queryLower) ||
            queryLower.split(" ").some((t) => pos.includes(t))
          );
        })
        .slice(0, 10)
        .map((job) => ({
          title: job.position,
          company: job.company || "Remote Company",
          location: job.location || "Remote",
          apply_url: job.url || `https://remoteok.com/l/${job.id}`,
          description: (job.description || "")
            .replace(/<[^>]*>/g, " ")
            .substring(0, 500),
          source_id: generateSourceId(
            job.position,
            job.company,
            "remoteok-api",
          ),
          source: "RemoteOK API",
        }));
      jobs.push(...apiJobs);
      console.log(`RemoteOK API: ${apiJobs.length} jobs`);
    }
  } catch (err) {
    console.error("RemoteOK API failed:", err.message);
  }

  // Arbeitnow API
  try {
    console.log("Fetching from Arbeitnow API...");
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
    if (response.ok) {
      const data = await response.json();
      const queryLower = query.toLowerCase();
      const apiJobs = (data.data || [])
        .filter((job) => {
          if (!job.title) return false;
          const title = job.title.toLowerCase();
          return (
            title.includes(queryLower) ||
            queryLower.split(" ").some((t) => title.includes(t))
          );
        })
        .slice(0, 10)
        .map((job) => ({
          title: job.title,
          company: job.company_name || "Company",
          location: job.remote ? "Remote" : job.location || "Unknown",
          apply_url: job.url || "#",
          description: (job.description || "")
            .replace(/<[^>]*>/g, " ")
            .substring(0, 500),
          source_id: generateSourceId(job.title, job.company_name, "arbeitnow"),
          source: "Arbeitnow",
        }));
      jobs.push(...apiJobs);
      console.log(`Arbeitnow: ${apiJobs.length} jobs`);
    }
  } catch (err) {
    console.error("Arbeitnow failed:", err.message);
  }

  // Jobicy API
  try {
    console.log("Fetching from Jobicy API...");
    const response = await fetch(
      "https://jobicy.com/api/v2/remote-jobs?count=50",
    );
    if (response.ok) {
      const data = await response.json();
      const queryLower = query.toLowerCase();
      const apiJobs = (data.jobs || [])
        .filter((job) => {
          if (!job.jobTitle) return false;
          const title = job.jobTitle.toLowerCase();
          return (
            title.includes(queryLower) ||
            queryLower.split(" ").some((t) => title.includes(t))
          );
        })
        .slice(0, 10)
        .map((job) => ({
          title: job.jobTitle,
          company: job.companyName || "Company",
          location: job.jobGeo || "Remote",
          apply_url: job.url || "#",
          description: (job.jobExcerpt || "").substring(0, 500),
          source_id: generateSourceId(job.jobTitle, job.companyName, "jobicy"),
          source: "Jobicy",
        }));
      jobs.push(...apiJobs);
      console.log(`Jobicy: ${apiJobs.length} jobs`);
    }
  } catch (err) {
    console.error("Jobicy failed:", err.message);
  }

  return jobs;
}

/**
 * FALLBACK: Job board search links
 */
function generateFallbackJobs(query, location) {
  const encodedQuery = encodeURIComponent(query);
  const encodedLocation = encodeURIComponent(location);
  const isBangladesh =
    location.toLowerCase().includes("bangladesh") ||
    location.toLowerCase().includes("dhaka");
  const isRemote = isRemoteSearch(location);

  let boards = [];

  if (isBangladesh) {
    boards = [
      {
        name: "bdjobs.com",
        url: `https://jobs.bdjobs.com/jobsearch.asp?txt=${encodedQuery}`,
      },
      {
        name: "LinkedIn BD",
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=Bangladesh`,
      },
      {
        name: "Indeed BD",
        url: `https://indeed.com/jobs?q=${encodedQuery}`,
      },
      {
        name: "Chakri.com",
        url: `https://www.chakri.com/search-jobs?keyword=${encodedQuery}`,
      },
    ];
  } else if (isRemote) {
    boards = [
      {
        name: "RemoteOK",
        url: `https://remoteok.com/remote-${query.toLowerCase().replace(/\s+/g, "-")}-jobs`,
      },
      {
        name: "We Work Remotely",
        url: `https://weworkremotely.com/remote-jobs/search?term=${encodedQuery}`,
      },
      {
        name: "LinkedIn Remote",
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&f_WT=2`,
      },
      {
        name: "FlexJobs",
        url: `https://www.flexjobs.com/search?search=${encodedQuery}`,
      },
    ];
  } else {
    boards = [
      {
        name: "LinkedIn",
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=${encodedLocation}`,
      },
      {
        name: "Indeed",
        url: `https://www.indeed.com/jobs?q=${encodedQuery}&l=${encodedLocation}`,
      },
      {
        name: "Glassdoor",
        url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodedQuery}`,
      },
    ];
  }

  return boards.map((b) => ({
    title: `${query} Jobs on ${b.name}`,
    company: b.name,
    location: isBangladesh ? "Bangladesh" : isRemote ? "Remote" : location,
    apply_url: b.url,
    description: `Search ${query} jobs on ${b.name}. Click to view listings.`,
    source_id: generateSourceId(query, b.name, "fallback"),
    source: "Job Board Link",
  }));
}

/**
 * MAIN FUNCTION: Scrape jobs using Puppeteer
 */
export async function scrapeJobsByQuery(
  query,
  location = "Remote",
  saveToDb = true,
) {
  console.log(`\n========================================`);
  console.log(`🔍 Scraping: "${query}" in "${location}"`);
  console.log(`========================================\n`);

  let jobs = [];
  let browser = null;
  const isRemote = isRemoteSearch(location);
  const isBangladesh =
    location.toLowerCase().includes("bangladesh") ||
    location.toLowerCase().includes("dhaka");

  try {
    // Step 1: Try free APIs first (faster, no browser needed)
    console.log("[Step 1] Fetching from free Job APIs...");
    const apiJobs = await fetchFromFreeAPIs(query, location);

    // Filter by location
    const filteredApiJobs = isRemote
      ? apiJobs
      : apiJobs.filter((j) => locationMatches(j.location, location));
    jobs.push(...filteredApiJobs);
    console.log(`APIs returned ${filteredApiJobs.length} matching jobs\n`);

    // Step 2: If not enough jobs, use Puppeteer to scrape
    if (jobs.length < 10) {
      console.log("[Step 2] Launching Puppeteer for web scraping...\n");
      browser = await launchBrowser();

      // Scrape multiple sites in parallel (but limit concurrency)
      const scrapePromises = [];

      // Always scrape LinkedIn
      scrapePromises.push(scrapeLinkedIn(browser, query, location));

      // Always scrape Indeed
      scrapePromises.push(scrapeIndeed(browser, query, location));

      // For Bangladesh, scrape bdjobs
      if (isBangladesh) {
        scrapePromises.push(scrapeBDJobs(browser, query));
      }

      // For remote jobs, scrape remote-focused sites
      if (isRemote) {
        scrapePromises.push(scrapeRemoteOK(browser, query));
        scrapePromises.push(scrapeWeWorkRemotely(browser, query));
      }

      // Scrape Glassdoor
      scrapePromises.push(scrapeGlassdoor(browser, query, location));

      // Wait for all scrapers
      const results = await Promise.allSettled(scrapePromises);

      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          jobs.push(...result.value);
        }
      }
    }
  } catch (error) {
    console.error("Scraping error:", error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log("\nBrowser closed.");
    }
  }

  // Step 3: Fallback to job board links
  if (jobs.length === 0) {
    console.log("\n[Step 3] Using fallback job board links...");
    jobs = generateFallbackJobs(query, location);
  }

  // Deduplicate jobs
  const seen = new Set();
  jobs = jobs
    .filter((job) => {
      const key = `${job.title}-${job.company}`
        .toLowerCase()
        .replace(/\s+/g, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 30);

  console.log(`\n✅ Total unique jobs: ${jobs.length}`);

  // Return without saving if requested
  if (!saveToDb) {
    return {
      success: true,
      message: `Found ${jobs.length} jobs for "${query}" in "${location}"`,
      method: "puppeteer-scraping",
      totalExtracted: jobs.length,
      savedCount: 0,
      skippedCount: 0,
      jobs,
    };
  }

  // Save to database
  let savedCount = 0;
  let skippedCount = 0;
  const savedJobs = [];

  for (const job of jobs) {
    try {
      const exists = await jobExists(job.source_id);
      if (exists) {
        skippedCount++;
        continue;
      }

      const { source, ...jobData } = job;
      const saved = await createJob(jobData);
      savedCount++;
      savedJobs.push({ ...saved, source });
      console.log(`✓ Saved: ${job.title} at ${job.company}`);
    } catch (error) {
      console.error(`✗ Failed: ${job.title}`, error.message);
    }
  }

  console.log(`\n📊 Saved: ${savedCount}, Skipped: ${skippedCount}`);

  return {
    success: true,
    message: `Found ${jobs.length} jobs. Saved ${savedCount} new, skipped ${skippedCount} duplicates.`,
    method: "puppeteer-scraping",
    totalExtracted: jobs.length,
    savedCount,
    skippedCount,
    jobs: savedJobs.length > 0 ? savedJobs : jobs,
  };
}

/**
 * Legacy function
 */
export async function scrapeAndSaveJobs(targetUrl) {
  return scrapeJobsByQuery("developer", "Remote", true);
}

/**
 * Get target URLs for cron
 */
export function getTargetUrls() {
  return [
    "https://remoteok.com",
    "https://weworkremotely.com",
    "https://www.linkedin.com/jobs",
  ];
}
