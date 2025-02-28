export const fetchUpcomingMatches = async () => {
    const res = await fetch("http://localhost:3000/api/matches");
    if (!res.ok) throw new Error("Failed to fetch matches");
    return res.json();
  };
  
  export const getPredictions = async (homeTeam, awayTeam) => {
    const res = await fetch("http://localhost:3000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam }),
    });
    if (!res.ok) throw new Error("Failed to get prediction");
    return res.json();
  };
  