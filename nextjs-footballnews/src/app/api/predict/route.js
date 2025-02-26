export async function POST(request) {
  try {
    const body = await request.json();
    const {
      selectedHomeTeam,
      selectedAwayTeam,
      homeRank,
      awayRank,
      homeGoalsScored,
      awayGoalsScored,
      homeGoalsConceded,
      awayGoalsConceded,
    } = body;

    const homeAdvantage = 5;
    const rankDifference = awayRank - homeRank;
    const goalScore =
      parseInt(homeGoalsScored) -
      parseInt(awayGoalsScored) +
      (parseInt(awayGoalsConceded) - parseInt(homeGoalsConceded));

    const finalScore = homeAdvantage + rankDifference + goalScore;

    const prediction = {
      homeWin: Math.max(0, 50 + finalScore),
      draw: 25 - Math.abs(finalScore / 2),
      awayWin: Math.max(0, 50 - finalScore),
    };

    const total = prediction.homeWin + prediction.draw + prediction.awayWin;
    prediction.homeWin = Math.round((prediction.homeWin / total) * 100);
    prediction.draw = Math.round((prediction.draw / total) * 100);
    prediction.awayWin = Math.round((prediction.awayWin / total) * 100);

    return new Response(JSON.stringify(prediction), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
