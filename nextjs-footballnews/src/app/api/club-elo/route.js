// src/app/api/club-elo/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get the current date and format it as YYYY-MM-DD
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    // Construct the API URL with the current date
    const apiUrl = `http://api.clubelo.com/${formattedDate}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`ClubElo API request failed with status ${response.status}`);
    }

    const data = await response.text(); // The API returns plain text

    // Convert the plain text data to JSON
    const jsonData = convertClubEloDataToJson(data);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error fetching ClubElo data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ClubElo data', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to convert the ClubElo text data to a more usable JSON format
function convertClubEloDataToJson(textData) {
  const lines = textData.trim().split('\n');
    // Handle empty data
  if (lines.length <= 1) {
    return []; // Return empty array if no data
  }
  const headers = lines[0].split(','); // First line is the header
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length == 0) continue;
    const values = line.split(',');
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
        // Fix: Add a check for missing header
        if (headers[j]) {
            obj[headers[j]] = values[j];
        }
    }
    result.push(obj);
  }

  return result;
}

// Helper function to format the date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
