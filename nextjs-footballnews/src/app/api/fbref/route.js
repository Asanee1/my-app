// src/app/api/fbref/route.js
import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Fbref from "../../../../models/fbrefModel";

// Cache variables
let fbrefCache = null;
let fbrefCacheTimestamp = null;
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  try {
    // Check cache first
    if (fbrefCache && Date.now() - fbrefCacheTimestamp < CACHE_EXPIRATION_TIME) {
      console.log("Fetching Fbref data from cache.");
      return NextResponse.json(fbrefCache);
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Check MongoDB for recent data
    const latestData = await Fbref.find()
      .sort({ dateFetched: -1 })
      .lean()
      .exec();
    
    if (latestData && latestData.length > 0 && Date.now() - latestData[0].dateFetched < CACHE_EXPIRATION_TIME) {
      console.log("Fetching Fbref data from MongoDB.");
      // Update cache with the latest data from MongoDB
      fbrefCache = {};
      latestData.forEach(item => {
        if (!fbrefCache[item.league]) {
          fbrefCache[item.league] = [];
        }
        fbrefCache[item.league] = item.data
      });
      
      fbrefCacheTimestamp = latestData[0].dateFetched;
      return NextResponse.json(fbrefCache);
    }

    console.log("Fetching new Fbref data from the website.");

    // Scrape new data
    const scrapedData = await scrapeFbrefData();
    console.log("scraped data", scrapedData);

    // Save new data to MongoDB
    await saveToMongoDB(scrapedData);

    // Update cache
    fbrefCache = scrapedData;
    fbrefCacheTimestamp = Date.now();

    return NextResponse.json(scrapedData);
  } catch (error) {
    console.error("Error in /api/fbref:", error);
    return NextResponse.json(
      { error: "Failed to fetch Fbref data", details: error.message },
      { status: 500 }
    );
  }
}

async function scrapeFbrefData() {
  const LEAGUE_URLS = {
    "Premier League": "https://fbref.com/en/comps/9/Premier-League-Stats",
    "La Liga": "https://fbref.com/en/comps/12/La-Liga-Stats",
    "Bundesliga": "https://fbref.com/en/comps/20/Bundesliga-Stats",
    "Serie A": "https://fbref.com/en/comps/11/Serie-A-Stats",
    "Ligue 1": "https://fbref.com/en/comps/13/Ligue-1-Stats",
  };

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  const results = {};

  for (const [league, url] of Object.entries(LEAGUE_URLS)) {
    console.log(`Fetching data for: ${league}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    try {
      await page.waitForSelector("table.stats_table", { timeout: 30000 });
    } catch (error) {
      console.error(`❌ ${league} - Table not found.`);
      results[league] = { error: "Table not found" };
      continue;
    }

    const teams = await page.evaluate(() => {
      const table = document.querySelector("table.stats_table");
      if (!table) return [];

      return Array.from(table.querySelectorAll("tbody tr")).map((row) => {
        const rankCell = row.querySelector("th[data-stat='rank']");
        const rank = rankCell ? rankCell.textContent.trim() : "Unknown";
        const teamCell = row.querySelector("td[data-stat='team']");
        const teamAnchor = teamCell?.querySelector("a");
        const team =
          teamAnchor
            ? teamAnchor.textContent.trim()
            : teamCell?.textContent.trim() || "Unknown";

        const xGCell = row.querySelector("td[data-stat='xg_for']");
        const xG = parseFloat(xGCell?.textContent.trim() || "0");

        const xGACell = row.querySelector("td[data-stat='xg_against']");
        const xGA = parseFloat(xGACell?.textContent.trim() || "0");

        return {
          Squad: team,
          xG: xG,
          xGA: xGA,
        };
      });
    });

    results[league] = teams.length > 0 ? teams : { error: "No data found" };
  }

  await browser.close();
  return results;
}

async function saveToMongoDB(data) {
    console.log("Saving Fbref data to MongoDB.");
    try {
      for (const [league, leagueData] of Object.entries(data)) {
        if (Array.isArray(leagueData)) {
          // Check if a document for this league already exists
          const existingData = await Fbref.findOne({ league: league });
  
          if (existingData) {
              //if data exist delete and create new
              await Fbref.deleteOne({league: league})
          }
          // Create a new document for this league
          await Fbref.create({ league: league, data: leagueData });
        } else {
          console.warn(
            `Skipping saving data for ${league} due to an error:`,
            leagueData.error
          );
        }
      }
      console.log("Fbref data saved to MongoDB successfully.");
    } catch (error) {
      console.error("Error saving Fbref data to MongoDB:", error);
    }
  }
