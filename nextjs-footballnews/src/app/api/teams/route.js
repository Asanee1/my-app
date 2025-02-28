import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("league");
    const season = searchParams.get("season") || "2024";
    const teamId = searchParams.get("teamId"); // Get teamId from search parameters

    if (!leagueId) {
      return new Response(JSON.stringify({ error: "League ID is required" }), { status: 400 });
    }

    if (teamId) {
      // If teamId is provided, fetch team's matches
      const response = await axios.get(
        `https://api.football-data.org/v4/teams/${teamId}/matches?season=${season}`,
        {
          headers: {
            "X-Auth-Token": process.env.API_KEY || "",
          },
        }
      );
      return new Response(JSON.stringify(response.data), { status: 200 });
    } else {
      // If teamId is not provided, fetch all teams in the league
        const response = await axios.get(
        `https://api.football-data.org/v4/competitions/${leagueId}/teams?season=${season}`,
        {
          headers: {
            "X-Auth-Token": process.env.API_KEY || "",
          },
        }
      );
      return new Response(JSON.stringify(response.data), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
