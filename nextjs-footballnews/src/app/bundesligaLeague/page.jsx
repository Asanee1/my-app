"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

// Function to fetch match data from API route
async function fetchMatches(season) {
  const response = await fetch(
    `http://localhost:3000/api/bundesliga?season=${season}`
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

  const cleanTeamName = (name) => {
    return name
      .replace(" FC", "") // Remove " FC"
      .replace("1. ", "") // Remove "1. "
      .replace(" II", "") // Remove " II"
      .trim(); // Remove leading and trailing spaces
  };

  matches.forEach((match) => {
    const homeTeamName = cleanTeamName(match.homeTeam.name);
    const awayTeamName = cleanTeamName(match.awayTeam.name);
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
        homeMatches: [], // New property for home matches
        awayMatches: [], // New property for away matches
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
        homeMatches: [], // New property for home matches
        awayMatches: [], // New property for away matches
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

    // Update recent matches and update home away matches
    if (!recentMatches[homeTeamName]) recentMatches[homeTeamName] = [];
    if (!recentMatches[awayTeamName]) recentMatches[awayTeamName] = [];

    recentMatches[homeTeamName].unshift({
      opponent: awayTeamName,
      score: `${homeScore}-${awayScore}`,
      result: homeScore > awayScore ? "W" : homeScore < awayScore ? "L" : "D",
      date: match.utcDate,
      isHome: true, // Add isHome flag
    });
    recentMatches[awayTeamName].unshift({
      opponent: homeTeamName,
      score: `${awayScore}-${homeScore}`,
      result: awayScore > homeScore ? "W" : awayScore < homeScore ? "L" : "D",
      date: match.utcDate,
      isHome: false, // Add isHome flag
    });

    //update home away matches
    standings[homeTeamName].homeMatches.push({
      opponent: awayTeamName,
      score: `${homeScore}-${awayScore}`,
      result: homeScore > awayScore ? "W" : homeScore < awayScore ? "L" : "D",
      date: match.utcDate,
    });
    standings[awayTeamName].awayMatches.push({
      opponent: homeTeamName,
      score: `${awayScore}-${homeScore}`,
      result: awayScore > homeScore ? "W" : awayScore < homeScore ? "L" : "D",
      date: match.utcDate,
    });
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

export default function bundesligaLeague() {
  const [season, setSeason] = useState("2024");
  const [standings, setStandings] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null); // State for selected team info
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown visibility
  const dropdownRef = useRef(null); // Create a ref for the dropdown

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
        filteredMatches = {
          home: team.homeMatches,
          away: team.awayMatches,
        }; // All matches played
        break;
      case "won":
        filteredMatches = {
          home: team.homeMatches.filter((match) => match.result === "W"),
          away: team.awayMatches.filter((match) => match.result === "W"),
        }; // Matches won
        break;
      case "lost":
        filteredMatches = {
          home: team.homeMatches.filter((match) => match.result === "L"),
          away: team.awayMatches.filter((match) => match.result === "L"),
        }; // Matches won
        break;
      case "drawn":
        filteredMatches = {
          home: team.homeMatches.filter((match) => match.result === "D"),
          away: team.awayMatches.filter((match) => match.result === "D"),
        }; // Matches drawn
        break;
      default:
        break;
    }

    setSelectedInfo({ team, category, filteredMatches });
  };

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSeasonChange = (selectedSeason) => {
    setSeason(selectedSeason);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-2 mt-4 font-medium">
        <div className="mb-4 text-left">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="2023">ฤดูกาล 23/24</option>
            <option value="2024">ฤดูกาล 24/25</option>
          </select>
        </div>
        {/* Custom Header Section */}
        <div className="relative mb-6">
          <div className="flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white h-12 pl-4 pr-2 rounded shadow-md">
            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg mr-3">
              <img
                src="/images/bundes.png"
                alt="บุนเดสลีกา โลโก้"
                className="h-10 w-10"
              />
            </div>

            <span className="text-white text-3xl font-bold">บุนเดสลีกา</span>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full text-sm md:text-lg ml-0 border-collapse shadow-md">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-2 py-2 md:px-4 md:py-3">อันดับ</th>
                <th className="px-2 py-2 md:px-4 md:py-3">ทีม</th>
                <th className="px-2 py-2 md:px-4 md:py-3">เล่น</th>
                <th className="px-2 py-2 md:px-4 md:py-3">ชนะ</th>
                <th className="px-2 py-2 md:px-4 md:py-3">เสมอ</th>
                <th className="px-2 py-2 md:px-4 md:py-3">แพ้</th>
                <th className="px-2 py-2 md:px-4 md:py-3">ได้</th>
                <th className="px-2 py-2 md:px-4 md:py-3">เสีย</th>
                <th className="px-2 py-2 md:px-4 md:py-3">ต่าง</th>
                <th className="px-2 py-2 md:px-4 md:py-3">คะแนน</th>
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
                    className="px-4 py-2 cursor-pointer hover:underline text-purple-600" // เพิ่ม hover:underline
                    onClick={() => handleClick(team, "played")}
                  >
                    {team.played}
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer hover:underline text-purple-600" // เพิ่ม hover:underline
                    onClick={() => handleClick(team, "won")}
                  >
                    {team.won}
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer hover:underline text-purple-600" // เพิ่ม hover:underline
                    onClick={() => handleClick(team, "drawn")}
                  >
                    {team.drawn}
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer hover:underline text-purple-600" // เพิ่ม hover:underline
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 pt-20">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl md:w-11/12 lg:w-3/4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
              <h2 className="text-3xl font-semibold text-center mb-6 text-purple-600">
                {selectedInfo.team.name} - {selectedInfo.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Matches */}
                {selectedInfo.filteredMatches.home.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-center text-purple-600 mb-4">
                      🏠 Home Matches
                    </h3>
                    <ul className="space-y-3">
                      {[...selectedInfo.filteredMatches.home]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((match, index) => (
                          <li
                            key={index}
                            className={`p-4 border-2 rounded-lg shadow-md bg-gray-50 flex justify-between items-center ${
                              match.result === "W"
                                ? "border-green-500 text-green-700"
                                : match.result === "L"
                                ? "border-red-500 text-red-700"
                                : "border-gray-300 text-gray-700"
                            }`}
                          >
                            <span className="text-lg font-medium">
                              {new Date(match.date).toLocaleDateString("th-TH")}
                            </span>
                            <span className="flex items-center gap-2 text-lg font-medium">
                              {match.opponent}: {match.score}{" "}
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${
                                  match.result === "W"
                                    ? "bg-green-500 text-white"
                                    : match.result === "L"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                              >
                                {match.result}
                              </span>
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Away Matches */}
                {selectedInfo.filteredMatches.away.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-center text-purple-600 mb-4">
                      ✈️ Away Matches
                    </h3>
                    <ul className="space-y-3">
                      {[...selectedInfo.filteredMatches.away]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((match, index) => (
                          <li
                            key={index}
                            className={`p-4 border-2 rounded-lg shadow-md bg-gray-50 flex justify-between items-center ${
                              match.result === "W"
                                ? "border-green-500 text-green-700"
                                : match.result === "L"
                                ? "border-red-500 text-red-700"
                                : "border-gray-300 text-gray-700"
                            }`}
                          >
                            <span className="text-lg font-medium">
                              {new Date(match.date).toLocaleDateString("th-TH")}
                            </span>
                            <span className="flex items-center gap-2 text-lg font-medium">
                              {match.opponent}: {match.score}{" "}
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${
                                  match.result === "W"
                                    ? "bg-green-500 text-white"
                                    : match.result === "L"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                              >
                                {match.result}
                              </span>
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* No Matches Message */}
              {selectedInfo.filteredMatches.home.length === 0 &&
                selectedInfo.filteredMatches.away.length === 0 && (
                  <p className="text-center text-gray-500 text-lg">
                    No matches found
                  </p>
                )}

              {/* Close Button */}
              <div className="flex justify-center mt-6">
                <button
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-xl"
                  onClick={() => setSelectedInfo(null)}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
