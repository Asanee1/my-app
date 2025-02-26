import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("league");
    const teamIds = searchParams.get("teams")?.split(","); // Get specific team IDs
    const season = "2024"; // Current season

    if (!leagueId || !teamIds) {
      return new Response(
        JSON.stringify({ error: "League ID and team IDs are required" }),
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueId}/standings?season=${season}`,
      {
        headers: {
          "X-Auth-Token": process.env.API_KEY || "",
        },
      }
    );

    const standings = response.data.standings[0]?.table || [];

    // Filter standings by selected teams
    const filteredTeams = standings.filter((team) =>
      teamIds.includes(team.team.id.toString())
    );

    return new Response(JSON.stringify(filteredTeams), { status: 200 });
  } catch (error) {
    console.error("API Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
