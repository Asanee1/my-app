// scripts/fetchAndStoreMatches.js
require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const Match = require('../models/matchModel').default; // Import the Match model
const { connectMongoDB } = require('../lib/mongodb');

const fetchFootballData = async (date, retryCount = 0) => {
  const maxRetries = 2;
  const retryDelay = [5000, 10000]; // 5 seconds, 10 seconds

  try {
    const res = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
        },
      }
    );

    if (res.status === 429) {
      if (retryCount < maxRetries) {
        console.log(
          `Rate limit hit. Retrying in ${retryDelay[retryCount] / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay[retryCount]));
        return fetchFootballData(date, retryCount + 1);
      } else {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
    }

    if (!res.ok) {
      throw new Error(
        `Request failed with status code ${res.status}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(
      `Error fetching football data for ${date}, attempt ${retryCount + 1}:`,
      error
    );
    if (retryCount < maxRetries) {
      console.log(
        `Retrying in ${retryDelay[retryCount] / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay[retryCount]));
      return fetchFootballData(date, retryCount + 1);
    } else {
      throw error;
    }
  }
};

const fetchMatchesForDateRange = async (startDate, endDate) => {
  const matches = [];
  const currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    const currentDateString = currentDate.toISOString().split("T")[0];
    try {
      const data = await fetchFootballData(currentDateString);
      if (data.matches?.length > 0) {
        matches.push(...data.matches);
      }
    } catch (error) {
      console.error(`Error fetching data for ${currentDateString}:`, error);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return matches;
};

const storeMatchesInMongoDB = async (matches) => {
  try {
    await connectMongoDB(); // Connect to MongoDB

    const operations = matches.map((match) => ({
      updateOne: {
        filter: { matchId: match.id },
        update: {
          $set: {
            matchId: match.id,
            homeTeam: {
              name: match.homeTeam.name,
              crestUrl: match.homeTeam.crest,
            },
            awayTeam: {
              name: match.awayTeam.name,
              crestUrl: match.awayTeam.crest,
            },
            score: {
              fullTime: {
                home: match.score?.fullTime?.home,
                away: match.score?.fullTime?.away,
              },
            },
            date: new Date(match.utcDate),
            competition: {
              id: match.competition?.id,
              name: match.competition?.name,
              emblem: match.competition?.emblem,
            },
          },
        },
        upsert: true,
      },
    }));

    await Match.bulkWrite(operations);
    console.log(`Successfully stored ${matches.length} matches in MongoDB`);
  } catch (error) {
    console.error("Error storing matches in MongoDB:", error);
  } finally {
    await mongoose.disconnect(); // Disconnect from MongoDB
  }
};

const run = async () => {
  console.log('Starting to fetch and store matches...');
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 30); // Fetch for the past 30 days
  const endDate = new Date();
  endDate.setDate(today.getDate() + 30); // Fetch for the next 30 days

  const startDateString = startDate.toISOString().split("T")[0];
  const endDateString = endDate.toISOString().split("T")[0];

  try {
    const matches = await fetchMatchesForDateRange(startDateString, endDateString);
    await storeMatchesInMongoDB(matches);
  } catch (error) {
    console.error("Error fetching and storing matches:", error);
  }
  console.log('Finished fetching and storing matches.');
};

// Schedule the task to run every day at 3:00 AM
cron.schedule('0 3 * * *', () => {
  console.log('Running scheduled task...');
  run();
});

// Run the task immediately when the script starts
run();
