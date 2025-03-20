// src/app/api/club-elo/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get the current date and format it as YYYY-MM-DD
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    // Construct the API URL with the current date
    const apiUrl = `http://api.clubelo.com/${formattedDate}`;

    // Add a timeout to the fetch request (e.g., 10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

    const response = await fetch(apiUrl, { signal: controller.signal });

    clearTimeout(timeoutId); // Clear the timeout if the request completes

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      console.error(`ClubElo API request failed with status ${response.status}:`, errorText);
      throw new Error(`ClubElo API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.text(); // The API returns plain text

    // Check for empty data
    if (!data || data.trim().length === 0) {
      console.warn('ClubElo API returned empty data.');
      return NextResponse.json([]); // Return an empty array
    }

    // Convert the plain text data to JSON
    const jsonData = convertClubEloDataToJson(data);

    // Add CORS headers
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    headers.append('Access-Control-Allow-Methods', 'GET'); // Allow only GET requests
    headers.append('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

    return new NextResponse(JSON.stringify(jsonData), {
      status: 200,
      headers: headers,
    });
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
  try {
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
              if(headers[j] === 'Elo'){
                  obj[headers[j]] = parseFloat(values[j]) // convert the Elo to number
              } else {
                  obj[headers[j]] = values[j];
              }
          }
      }
      result.push(obj);
    }

    return result;
  } catch (error) {
    console.error('Error converting ClubElo data to JSON:', error);
    return []; // Return an empty array on error
  }
}

// Helper function to format the date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
