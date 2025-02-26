"use client";
import { useEffect, useState } from "react";
import MatchItem from "../components/MatchItem"; // Adjust path if needed
import Navbar from "../components/Navbar";

export default function LiveScorePage() {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // ตั้งค่า selectedDate ให้เป็นวันปัจจุบัน
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/footballprogram?date=${selectedDate}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();

        const leagueMap = {};
        data.matches.forEach((match) => {
          const leagueId = match.competition.id;
          if (!leagueMap[leagueId]) {
            leagueMap[leagueId] = {
              name: match.competition.name,
              logo: match.competition.emblem,
              matches: [],
            };
          }

          // ลบคำว่า FC และ CF ออกจากชื่อทีม
          match.homeTeam.name = match.homeTeam.name
            .replace(/ FC| CF/g, "")
            .trim();
          match.awayTeam.name = match.awayTeam.name
            .replace(/ FC| CF/g, "")
            .trim();

          leagueMap[leagueId].matches.push(match);
        });

        setLeagues(Object.values(leagueMap));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    }

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (leagues.length === 0 && selectedDate)
    return <div className="text-gray-500 text-center p-4">Loading...</div>;

  return (
    <div>
      <Navbar />
      
      <div className="w-full max-w-4xl mx-auto p-6">
      <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <div className="flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white h-12 pl-4 pr-2 rounded shadow-md mb-6">
          <h1 className="text-xl font-bold">Live Scores</h1>
        </div>
        
        {leagues.map((league) => (
          <div
            key={league.name}
            className="mb-8 p-4 bg-white shadow rounded-lg"
          >
            <div className="flex items-center mb-4">
              <img
                src={league.logo || "/default-league-logo.png"}
                alt={`${league.name} Logo`}
                className="w-10 h-10 mr-4 rounded-full border"
              />
              <h2 className="text-2xl font-semibold">{league.name}</h2>
            </div>
            <div>
              {league.matches.length > 0 ? (
                league.matches.map((match) => (
                  <MatchItem key={match.id} match={match} />
                ))
              ) : (
                <div className="text-gray-500 text-center">
                  No matches available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
