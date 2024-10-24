"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Function to fetch match data from API route
async function fetchMatches(season) {
  const response = await fetch(`http://localhost:3000/api/bundesliga?season=${season}`);
  if (!response.ok) {
    throw new Error("Cannot fetch data");
  }
  const data = await response.json();
  return data.matches.filter(match => match.score.fullTime.home !== null && match.score.fullTime.away !== null); // Filter out matches without results
}

const DEFAULT_LOGO_URL = "/path/to/default/logo.png";

// Function to calculate the standings
function calculateStandings(matches) {
  const standings = {};
  const recentMatches = {}; // To track the last 5 matches for each team

  matches.forEach((match) => {
    const { homeTeam, awayTeam, score } = match;
    const homeTeamName = homeTeam.name;
    const awayTeamName = awayTeam.name;
    const homeScore = score.fullTime.home;
    const awayScore = score.fullTime.away;

    if (!standings[homeTeamName]) {
      standings[homeTeamName] = {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        recentMatches: [],
        logo: homeTeam.crest,
      };
    }
    if (!standings[awayTeamName]) {
      standings[awayTeamName] = {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        recentMatches: [],
        logo: awayTeam.crest,
      };
    }

    standings[homeTeamName].played++;
    standings[awayTeamName].played++;
    standings[homeTeamName].goalsFor += homeScore;
    standings[homeTeamName].goalsAgainst += awayScore;
    standings[awayTeamName].goalsFor += awayScore;
    standings[awayTeamName].goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      standings[homeTeamName].won++;
      standings[homeTeamName].points += 3;
      standings[awayTeamName].lost++;
    } else if (homeScore < awayScore) {
      standings[awayTeamName].won++;
      standings[awayTeamName].points += 3;
      standings[homeTeamName].lost++;
    } else {
      standings[homeTeamName].drawn++;
      standings[awayTeamName].drawn++;
      standings[homeTeamName].points++;
      standings[awayTeamName].points++;
    }

    standings[homeTeamName].goalDifference =
      standings[homeTeamName].goalsFor - standings[homeTeamName].goalsAgainst;
    standings[awayTeamName].goalDifference =
      standings[awayTeamName].goalsFor - standings[awayTeamName].goalsAgainst;

    // Update recent matches
    if (!recentMatches[homeTeamName]) recentMatches[homeTeamName] = [];
    if (!recentMatches[awayTeamName]) recentMatches[awayTeamName] = [];

    recentMatches[homeTeamName].unshift({
      opponent: awayTeamName,
      score: `${homeScore}-${awayScore}`,
      result: homeScore > awayScore ? "W" : homeScore < awayScore ? "L" : "D",
    });
    recentMatches[awayTeamName].unshift({
      opponent: homeTeamName,
      score: `${awayScore}-${homeScore}`,
      result: awayScore > homeScore ? "W" : awayScore < homeScore ? "L" : "D",
    });

    // Limit to last 5 matches
    if (recentMatches[homeTeamName].length > 5)
      recentMatches[homeTeamName].pop();
    if (recentMatches[awayTeamName].length > 5)
      recentMatches[awayTeamName].pop();
  });

  // Convert standings to an array and sort by points, then by goal difference
  return Object.keys(standings)
    .map((team) => ({
      name: team,
      ...standings[team],
      recentMatches: recentMatches[team] || [],
    }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
}

export default function BundesligaLeaguePage() {
  const [season, setSeason] = useState("2024");
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const getMatches = async () => {
      const matches = await fetchMatches(season);
      const standingsData = calculateStandings(matches);
      setStandings(standingsData);
    };

    getMatches();
  }, [season]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-6 mt-10 font-medium">
        <h1 className="text-2xl font-bold mb-4 text-center">บุนเดสลีกา {season}</h1>
        <div className="mb-4 text-center">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="2023">ฤดูกาล 23/24</option>
            <option value="2024">ฤดูกาล 24/25</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-1/2 text-lg mx-auto border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">อันดับ</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">ทีม</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">เล่น</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">ชนะ</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">เสมอ</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">แพ้</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">ได้</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">เสีย</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">ต่าง</th>
                <th className="px-2 py-1 bg-gray-100 border-b border-gray-200">คะแนน</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={team.name}>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{index + 1}</td>
                  <td className="border-b border-gray-200 px-2 py-1 flex items-center">
                    <img
                      src={team.logo || DEFAULT_LOGO_URL}
                      alt={`${team.name} logo`}
                      className="w-7 h-7 mr-3"
                    />
                    <span>{team.name}</span>
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{team.played}</td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{team.won}</td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{team.drawn}</td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{team.lost}</td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{team.goalsFor}</td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{team.goalsAgainst}</td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center">{team.goalDifference}</td>
                  <td className="border-b border-gray-200 px-2 py-1 text-center font-bold">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
