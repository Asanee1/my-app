// src/app/api/homeAway/route.js
import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || "2023";

    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/PL/matches?season=${season}`,
      {
        headers: {
          "X-Auth-Token": process.env.API_KEY || "",
        },
      }
    );
    const data = response.data.matches.filter(
      (match) =>
        match.score.fullTime.home !== null && match.score.fullTime.away !== null
    );
    console.log("data", data);

    const homeAwayWinRate = calculateHomeAwayWinRate(data);
    console.log("homeAwayWinRate", homeAwayWinRate); // Log the final result

    return new Response(JSON.stringify(homeAwayWinRate), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

function calculateHomeAwayWinRate(matches) {
  const homeAwayData = {};
  const minMatches = 0; // Minimum number of matches required for a team

  const clubNameMapping = {
    "Brighton & Hove Albion": "Brighton",
    "Brentford FC": "Brentford",
    "Manchester United FC": "Manchester United",
    "Manchester City FC": "Manchester City",
    "Tottenham Hotspur FC": "Tottenham Hotspur",
    "Arsenal FC": "Arsenal",
    "Liverpool FC": "Liverpool",
    "Chelsea FC": "Chelsea",
    "Wolverhampton Wanderers FC": "Wolverhampton Wanderers",
    "Aston Villa FC": "Aston Villa",
    "Newcastle United FC": "Newcastle United",
    "Fulham FC": "Fulham",
    "Crystal Palace FC": "Crystal Palace",
    "West Ham United FC": "West Ham United",
    "Nottingham Forest FC": "Nottingham Forest",
    "Bournemouth FC": "Bournemouth",
    "Everton FC": "Everton",
    "Burnley FC": "Burnley",
    "Luton Town FC": "Luton Town",
    "Sheffield United FC": "Sheffield United",
  };

  const mapClubName = (clubName) => {
    return clubNameMapping[clubName] || clubName;
  };

  matches.forEach((match) => {
    const homeTeam = mapClubName(match.homeTeam.name);
    const awayTeam = mapClubName(match.awayTeam.name);
    const homeScore = match.score.fullTime.home;
    const awayScore = match.score.fullTime.away;
    console.log("match", match);
    console.log("homeTeam", homeTeam);
    console.log("awayTeam", awayTeam);

    if (!homeAwayData[homeTeam]) {
      homeAwayData[homeTeam] = { homeWins: 0, homeMatches: 0, homeTies: 0 };
    }
    if (!homeAwayData[awayTeam]) {
      homeAwayData[awayTeam] = { awayWins: 0, awayMatches: 0, awayTies: 0 };
    }

    // Home team data
    homeAwayData[homeTeam].homeMatches++;
    if (homeScore > awayScore) {
      homeAwayData[homeTeam].homeWins++;
    } else if (homeScore === awayScore) {
      homeAwayData[homeTeam].homeTies++;
    }

    // Away team data
    homeAwayData[awayTeam].awayMatches++;
    if (awayScore > homeScore) {
      homeAwayData[awayTeam].awayWins++;
    } else if (homeScore === awayScore) {
      homeAwayData[awayTeam].awayTies++;
    }
  });
  console.log("homeAwayData", homeAwayData);

  // Calculate win rates and format data
  const formattedData = Object.keys(homeAwayData)
    .filter(
      (team) =>
        homeAwayData[team].homeMatches >= minMatches &&
        homeAwayData[team].awayMatches >= minMatches
    )
    .map((team) => {
      const {
        homeWins,
        homeMatches,
        homeTies,
        awayWins,
        awayMatches,
        awayTies,
      } = homeAwayData[team];
      const homeWinRate = homeMatches > 0 ? homeWins / homeMatches : 0.0;
      const awayWinRate = awayMatches > 0 ? awayWins / awayMatches : 0.0;
      const homeTieRate = homeMatches > 0 ? homeTies / homeMatches : 0.0;
      const awayTieRate = awayMatches > 0 ? awayTies / awayMatches : 0.0;
      return {
        team,
        homeWinRate: parseFloat(homeWinRate.toFixed(2)),
        awayWinRate: parseFloat(awayWinRate.toFixed(2)),
        homeTieRate: parseFloat(homeTieRate.toFixed(2)),
        awayTieRate: parseFloat(awayTieRate.toFixed(2)),
        homeMatches,
        awayMatches,
      };
    });
  return formattedData;
}
