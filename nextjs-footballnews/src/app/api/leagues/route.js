import axios from "axios";

export async function GET() {
  try {
    const bigLeagues = ["PL", "PD", "SA", "BL1", "FL1"]; // 5 ลีกใหญ่

    const response = await axios.get("https://api.football-data.org/v4/competitions", {
      headers: {
        "X-Auth-Token": process.env.API_KEY || "",
      },
    });

    const filteredLeagues = response.data.competitions.filter((league) =>
      bigLeagues.includes(league.code)
    );

    return new Response(JSON.stringify(filteredLeagues), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
