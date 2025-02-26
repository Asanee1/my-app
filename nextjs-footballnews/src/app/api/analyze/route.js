export async function POST(request) {
    try {
      const body = await request.json();
      const {
        selectedHomeTeam,
        selectedAwayTeam,
        homeRank,
        awayRank,
        homeForm,
        awayForm,
        homeGoalsScored,
        awayGoalsScored,
        homeGoalsConceded,
        awayGoalsConceded,
        injuries,
        suspensions,
      } = body;
  
      // Example: Basic Scoring Logic
      const homeAdvantage = 5;
      const rankDifference = awayRank - homeRank;
      const formScore = parseInt(homeForm) - parseInt(awayForm);
      const goalScore =
        parseInt(homeGoalsScored) -
        parseInt(awayGoalsScored) +
        (parseInt(awayGoalsConceded) - parseInt(homeGoalsConceded));
  
      const finalScore = homeAdvantage + rankDifference + formScore + goalScore;
  
      const prediction = {
        homeWin: Math.max(0, 50 + finalScore),
        draw: 25 - Math.abs(finalScore / 2),
        awayWin: Math.max(0, 50 - finalScore),
      };
  
      // Normalize percentages
      const total = prediction.homeWin + prediction.draw + prediction.awayWin;
      prediction.homeWin = Math.round((prediction.homeWin / total) * 100);
      prediction.draw = Math.round((prediction.draw / total) * 100);
      prediction.awayWin = Math.round((prediction.awayWin / total) * 100);
  
      return new Response(JSON.stringify(prediction), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  