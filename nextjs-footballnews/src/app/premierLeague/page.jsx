"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Function to fetch match data from API route
async function fetchMatches(season) {
  const response = await fetch(
    `http://localhost:3000/api/premierLeague?season=${season}`
  );
  if (!response.ok) {
    throw new Error("Cannot fetch data");
  }
  const data = await response.json();
  return data.matches.filter(
    (match) =>
      match.score.fullTime.home !== null && match.score.fullTime.away !== null
  ); // Filter out matches without results
}

const DEFAULT_LOGO_URL = "/path/to/default/logo.png";

// Function to calculate the standings
function calculateStandings(matches) {
  const standings = {};
  const recentMatches = {}; // To track the last 5 matches for each team

  matches.forEach((match) => {
    const homeTeamName = match.homeTeam.name.replace(" FC", ""); // Remove "FC"
    const awayTeamName = match.awayTeam.name.replace(" FC", ""); // Remove "FC"
    const homeScore = match.score.fullTime.home;
    const awayScore = match.score.fullTime.away;

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
        logo: match.homeTeam.crest,
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
        logo: match.awayTeam.crest,
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
      date: match.utcDate,
    });
    recentMatches[awayTeamName].unshift({
      opponent: homeTeamName,
      score: `${awayScore}-${homeScore}`,
      result: awayScore > homeScore ? "W" : awayScore < homeScore ? "L" : "D",
      date: match.utcDate,
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

export default function PremierLeague() {
  const [season, setSeason] = useState("2024");
  const [standings, setStandings] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null); // State for selected team info

  useEffect(() => {
    const getMatches = async () => {
      const matches = await fetchMatches(season);
      const standingsData = calculateStandings(matches);
      setStandings(standingsData);
    };

    getMatches();
  }, [season]);

  // Function to handle click on a specific column
  const handleClick = (team, category) => {
    let filteredMatches = [];

    // Filter matches based on the category clicked
    switch (category) {
      case "played":
        filteredMatches = team.recentMatches; // All matches played
        break;
      case "won":
        filteredMatches = team.recentMatches.filter(
          (match) => match.result === "W"
        ); // Matches won
        break;
      case "lost":
        filteredMatches = team.recentMatches.filter(
          (match) => match.result === "L"
        ); // Matches lost
        break;
      case "drawn":
        filteredMatches = team.recentMatches.filter(
          (match) => match.result === "D"
        ); // Matches drawn
        break;
      default:
        break;
    }

    setSelectedInfo({ team, category, filteredMatches });
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-6 mt-10 font-medium">
        <h1 className="text-2xl font-bold mb-4 text-center">
          พรีเมียร์ลีก {season}
        </h1>
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
          <table className="table-auto w-full text-lg ml-0 border-collapse shadow-md">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-3">อันดับ</th>
                <th className="px-4 py-3">ทีม</th>
                <th className="px-4 py-3">เล่น</th>
                <th className="px-4 py-3">ชนะ</th>
                <th className="px-4 py-3">เสมอ</th>
                <th className="px-4 py-3">แพ้</th>
                <th className="px-4 py-3">ได้</th>
                <th className="px-4 py-3">เสีย</th>
                <th className="px-4 py-3">ต่าง</th>
                <th className="px-4 py-3">คะแนน</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr
                  key={team.name}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-purple-100 transition duration-150 ease-in-out`}
                >
                  <td className="px-4 py-2 font-semibold">{index + 1}</td>
                  <td className="px-4 py-2 flex items-center justify-start">
                    <img
                      src={team.logo || DEFAULT_LOGO_URL}
                      alt={`${team.name} logo`}
                      className="w-7 h-7 mr-3"
                    />
                    <span className="font-semibold">{team.name}</span>
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleClick(team, "played")}
                  >
                    {team.played}
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleClick(team, "won")}
                  >
                    {team.won}
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleClick(team, "drawn")}
                  >
                    {team.drawn}
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleClick(team, "lost")}
                  >
                    {team.lost}
                  </td>
                  <td className="px-4 py-2">{team.goalsFor}</td>
                  <td className="px-4 py-2">{team.goalsAgainst}</td>
                  <td className="px-4 py-2">{team.goalDifference}</td>
                  <td className="px-4 py-2 font-bold text-purple-600">
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">
                {selectedInfo.team.name} - {selectedInfo.category}
              </h2>
              <ul>
                {selectedInfo.filteredMatches.map((match, index) => (
                  <li key={index} className="mb-2">
                    วันที่: {new Date(match.date).toLocaleDateString()} -{" "}
                    {match.opponent}: {match.score} ({match.result})
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                onClick={() => setSelectedInfo(null)}
              >
                ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
