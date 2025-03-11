// src/app/api/homeAway/route.js
import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season') || '2023';

    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/2021/matches?season=${season}`,
      {
        headers: {
          'X-Auth-Token': process.env.API_KEY || ''
        }
      }
    );
    const data = response.data.matches.filter(
      (match) =>
        match.score.fullTime.home !== null && match.score.fullTime.away !== null
    );

    const homeAwayWinRate = calculateHomeAwayWinRate(data)

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
  
    matches.forEach((match) => {
      const homeTeam = match.homeTeam.name.replace(" FC", "");
      const awayTeam = match.awayTeam.name.replace(" FC", "");
      const homeScore = match.score.fullTime.home;
      const awayScore = match.score.fullTime.away;
  
      if (!homeAwayData[homeTeam]) {
        homeAwayData[homeTeam] = { homeWins: 0, homeMatches: 0 };
      }
      if (!homeAwayData[awayTeam]) {
        homeAwayData[awayTeam] = { awayWins: 0, awayMatches: 0 };
      }
  
      // Home team data
      homeAwayData[homeTeam].homeMatches++;
      if (homeScore > awayScore) {
        homeAwayData[homeTeam].homeWins++;
      }
  
      // Away team data
      homeAwayData[awayTeam].awayMatches++;
      if (awayScore > homeScore) {
        homeAwayData[awayTeam].awayWins++;
      }
    });
  
    // Calculate win rates and format data
    const formattedData = Object.keys(homeAwayData).map((team) => {
        const { homeWins, homeMatches, awayWins, awayMatches } = homeAwayData[team];
        const homeWinRate = homeMatches > 0 ? homeWins / homeMatches : 0.0;
        const awayWinRate = awayMatches > 0 ? awayWins / awayMatches : 0.0;
        return {
          team,
          homeWinRate: parseFloat(homeWinRate.toFixed(2)),
          awayWinRate: parseFloat(awayWinRate.toFixed(2)),
        };
      });
      return formattedData;
  }
