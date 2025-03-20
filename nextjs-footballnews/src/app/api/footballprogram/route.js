import axios from 'axios';

// Cache for football data
const footballCache = {};
const FOOTBALL_CACHE_EXPIRATION = 60 * 60; // 1 hour in seconds

export async function GET(req) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  const cacheKey = date || 'all-matches'; // Cache key based on date

  // Check the cache
  if (footballCache[cacheKey] && footballCache[cacheKey].expires > Date.now()) {
    console.log('Football API Cache hit!');
    return new Response(JSON.stringify({ matches: footballCache[cacheKey].data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': process.env.API_KEY || '', // Replace with your API key
      },
      params: {
        date, // Add date parameter if it exists
      }
    });

    const matches = response.data.matches;
    
    // Process and filter matches that will occur in the future
    let processedMatches = matches.map((match) => {
      // ... your existing match processing logic ...
      const matchDate = new Date(match.utcDate);
            const currentDate = new Date();
            const timeDifference = Math.floor(
              (matchDate - currentDate) / (1000 * 60 * 60 * 24)
            );

            const matchHour = matchDate.getHours();

            let matchDayLabel = "";
            if (timeDifference === 0 && matchHour < 6) {
              matchDayLabel = "พรุ่งนี้";
            } else if (timeDifference === 0) {
              matchDayLabel = "วันนี้";
            } else if (timeDifference === 1) {
              matchDayLabel = "พรุ่งนี้";
            } else {
              matchDayLabel = matchDate.toLocaleDateString("th-TH", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });
            }

            // เพิ่มวันที่แบบเต็มเข้าไป
            const fullMatchDate = matchDate.toLocaleDateString("th-TH", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            // เพิ่มวันที่แบบ วัน/เดือน/ปี
            const shortMatchDate = matchDate.toLocaleDateString("th-TH", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            });

            return {
              ...match,
              homeTeam: {
                ...match.homeTeam,
                name: match.homeTeam.name
                  .split(" ")
                  .slice(0, -1)
                  .join("")
                  .trim(),
              },
              awayTeam: {
                ...match.awayTeam,
                name: match.awayTeam.name
                  .split(" ")
                  .slice(0, -1)
                  .join("")
                  .trim(),
              },
              localTime: matchDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              matchDayLabel,
              fullMatchDate, // เพิ่มตัวแปรนี้เข้าไป
              shortMatchDate, //เพิ่มตัวแปรนี้
              homeTeamCrest: match.homeTeam.crest || "/default-team-logo.png",
              awayTeamCrest: match.awayTeam.crest || "/default-team-logo.png",
              matchDate, // ส่ง matchDate ไปด้วย
            };
    });
    if (!date) {
        processedMatches = processedMatches.filter((match) => match.matchDate > new Date());
    }

    // Cache the result
    footballCache[cacheKey] = {
      data: processedMatches,
      expires: Date.now() + FOOTBALL_CACHE_EXPIRATION * 1000,
    };

    return new Response(JSON.stringify({ matches: processedMatches }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching football data:', error);
    return new Response(JSON.stringify({ message: 'Error fetching football data', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
