import axios from "axios";

const PREMIER_LEAGUE_CACHE = {};
const PREMIER_LEAGUE_CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour
const RETRY_DELAY = 5 * 1000; // 5 seconds
const MAX_RETRIES = 3;

async function fetchPremierLeagueData(season, retryCount = 0) {
    try {
      console.log(
        `Fetching Premier League data for season ${season}, attempt ${retryCount + 1}`
      );
      const response = await axios.get(
        "https://api.football-data.org/v4/competitions/PL/matches", // Hypothetical endpoint
        {
          headers: { "X-Auth-Token": process.env.API_KEY || "" },
          params: { season: season },
        }
      );
      return response.data.matches || [];
    } catch (error) {
        console.error(
          `Error fetching Premier League data for season ${season}, attempt ${
            retryCount + 1
          }:`,
          error.response?.status,
          error.message
        );

        if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
          console.warn(
            `Rate limit hit. Retrying in ${RETRY_DELAY / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return fetchPremierLeagueData(season, retryCount + 1); // Retry
        }
        // Re-throw if it's not a 429 or we've exceeded retries
        throw error;
      }
  }

export async function GET(req) {
  const url = new URL(req.url);
  const season = url.searchParams.get("season");

  if (!season) {
    return new Response(JSON.stringify({ error: "Missing 'season' parameter" }), {
      status: 400, // Bad Request
      headers: { "Content-Type": "application/json" },
    });
  }
  const cacheKey = `premier-league-${season}`
  try {
    if (
      PREMIER_LEAGUE_CACHE[cacheKey] &&
      PREMIER_LEAGUE_CACHE[cacheKey].expires > Date.now()
    ) {
        console.log(`Cache hit for season: ${season}`);
      return new Response(
        JSON.stringify({ matches: PREMIER_LEAGUE_CACHE[cacheKey].data, season }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log(`Cache miss for season: ${season}, fetching from API`);
    
    const matches = await fetchPremierLeagueData(season);

    // Process matches
    const processedMatches = matches.map((match) => {
        if (!match.utcDate || !match.homeTeam || !match.awayTeam)
          return null; // Skip if required fields are missing
        
        return {
            ...match,
            homeTeam: {
              ...match.homeTeam,
              name:
                match.homeTeam.name?.replace(/ FC| CF/g, "").trim() ||
                match.homeTeam.name,
            },
            awayTeam: {
              ...match.awayTeam,
              name:
                match.awayTeam.name?.replace(/ FC| CF/g, "").trim() ||
                match.awayTeam.name,
            },
        }
    }).filter(match => match !== null);
    
    // Save processed matches to cache
    PREMIER_LEAGUE_CACHE[cacheKey] = {
        data: processedMatches,
        expires: Date.now() + PREMIER_LEAGUE_CACHE_EXPIRATION,
    };
    return new Response(JSON.stringify({ matches: processedMatches, season }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
