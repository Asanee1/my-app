import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("league");
    const season = "2024"; // ฤดูกาลล่าสุด

    if (!leagueId) {
      return new Response(JSON.stringify({ error: "League ID is required" }), { status: 400 });
    }

    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueId}/standings?season=${season}`,
      {
        headers: {
          "X-Auth-Token": process.env.API_KEY || "",
        },
      }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
