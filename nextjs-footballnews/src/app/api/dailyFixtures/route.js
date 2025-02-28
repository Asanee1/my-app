export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // รับค่าวันที่จาก query params
  const API_KEY = process.env.API_FOOTBALL_KEY; // ใช้ API Key จาก env

  if (!date) {
    return Response.json({ error: "Missing date parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const data = await response.json();
    if (!data.response) {
      return Response.json({ error: "No data found" }, { status: 404 });
    }

    // 🏆 กรองเฉพาะแมตช์ที่ยังไม่มีสกอร์
    const filteredMatches = data.response.filter(
      (match) => match.goals.home === null && match.goals.away === null
    );

    // 🔍 จัดเรียงแยกตามลีก
    const leaguesMap = {};
    filteredMatches.forEach((match) => {
      const leagueId = match.league.id;
      const leagueName = match.league.name;
      const leagueLogo = match.league.logo;

      if (!leaguesMap[leagueId]) {
        leaguesMap[leagueId] = {
          id: leagueId,
          name: leagueName,
          logo: leagueLogo,
          matches: [],
        };
      }
      leaguesMap[leagueId].matches.push(match);
    });

    const leagues = Object.values(leaguesMap);

    return Response.json(leagues, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
