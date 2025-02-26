"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

// API functions
async function fetchLeagues() {
  const response = await fetch("/api/leagues");
  if (!response.ok) {
    throw new Error("Failed to fetch leagues");
  }
  return response.json();
}

async function fetchFilteredStandings(leagueId, teamIds) {
  const response = await fetch(
    `/api/standings-by-teams?league=${leagueId}&teams=${teamIds.join(",")}`
  );
  if (!response.ok) throw new Error("Failed to fetch standings");
  return response.json();
}

async function fetchTeams(leagueId) {
  const response = await fetch(`/api/teams?league=${leagueId}`);
  if (!response.ok) {
    console.error("Failed to fetch teams");
    return { teams: [] }; // Fallback if no data
  }
  const data = await response.json();
  return data || { teams: [] }; // Fallback if response is null
}

async function fetchStandings(leagueId) {
  const response = await fetch(`/api/standings?league=${leagueId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch standings");
  }
  const data = await response.json();
  console.log("Standings API Response:", data); // Debugging line
  return data;
}

export default function FootballPrediction() {
  // States
  const [leagues, setLeagues] = useState([]);
  const [league, setLeague] = useState("");
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [standings, setStandings] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  // Fetch leagues on initial render
  useEffect(() => {
    const getLeagues = async () => {
      try {
        const leaguesData = await fetchLeagues();
        setLeagues(leaguesData);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      }
    };
    getLeagues();
  }, []);

  // Fetch teams and standings when league changes
  useEffect(() => {
    if (league) {
      const getTeamsAndStandings = async () => {
        try {
          const teamsData = await fetchTeams(league);
          console.log("Teams fetched:", teamsData); // Debugging line
          setTeams(teamsData.teams || []); // Handle undefined teams
        } catch (error) {
          console.error("Error fetching teams:", error);
          setTeams([]); // Fallback on error
        }
      };
      getTeamsAndStandings();
    } else {
      setTeams([]); // Reset if no league is selected
    }
  }, [league]);

  // Fetch filtered standings when league and teams are selected
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (league && homeTeam && awayTeam) {
          const standingsData = await fetchFilteredStandings(league, [
            homeTeam,
            awayTeam,
          ]);
          setStandings(standingsData); // Filtered data
        }
      } catch (error) {
        console.error("Error fetching filtered standings:", error);
      }
    };

    fetchData();
  }, [league, homeTeam, awayTeam]);

  // Popup drag functionality
  const handleMouseDown = (e) => {
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const togglePopup = () => setShowPopup(!showPopup);
  
  const formatTeamName = (name) => {
    if (!name) return name; // ถ้าชื่อทีมเป็นค่าว่างก็ให้คืนค่ากลับ
    // ลบ "FC" หรือ "CF" ที่อาจมีในชื่อทีม
    return name.replace(/FC$|CF$/, '').trim();
  };

  const getTeamData = (teamId) =>
    standings.find((team) => team.team.id === teamId) || {};

  const getTeamInfo = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    return team ? formatTeamName(team.name || "ชื่อไม่ระบุ") : "ไม่มีข้อมูล";
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          ทำนายผลการแข่งขันฟุตบอล
        </h1>

        {/* เลือกลีก */}
        <div className="mb-4">
          <label htmlFor="league" className="block text-lg font-medium">
            เลือกลีค
          </label>
          <select
            id="league"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">เลือกลีก</option>
            {leagues.map((league) => (
              <option key={league.code} value={league.code}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        {/* เลือกทีม */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Home */}
          <div className="bg-purple-100 p-4 rounded">
            <h2 className="text-lg font-bold">ทีมเหย้า</h2>
            <select
              id="homeTeam"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            >
              <option value="">เลือกทีม</option>
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {getTeamInfo(team.id)} {/* ปรับให้แสดงชื่อทีมที่ format แล้ว */}
                </option>
              ))}
            </select>
          </div>

          {/* Away */}
          <div className="bg-red-100 p-4 rounded">
            <h2 className="text-lg font-bold">ทีมเยือน</h2>
            <select
              id="awayTeam"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            >
              <option value="">เลือกทีม</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {getTeamInfo(team.id)} {/* ปรับให้แสดงชื่อทีมที่ format แล้ว */}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={togglePopup}
          className="bg-purple-600 text-white p-2 rounded mb-4"
        >
          ดูตารางการแข่งขัน
        </button>

        {/* ตารางแบบบับเบิล */}
        {showPopup && (
          <div
            ref={popupRef}
            className="fixed"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onMouseDown={handleMouseDown}
          >
            <div className="bg-gray-200 p-6 rounded-lg shadow-xl w-87 max-w-full overflow-auto relative">
              <button
                onClick={togglePopup}
                className="absolute top-2 right-2 text-xl font-bold text-purple-700 hover:text-red-500"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-black mb-4">
                ตารางการแข่งขัน
              </h2>
              <table className="table-auto border-collapse w-full text-black">
                <thead>
                  <tr className="bg-purple-700">
                    <th className="border-b-2 border-black p-4 text-center text-white">อันดับ</th>
                    <th className="border-b-2 border-black p-4 text-center text-white">ทีม</th>
                    <th className="border-b-2 border-black p-4 text-center text-white">ได้</th>
                    <th className="border-b-2 border-black p-4 text-center text-white">เสีย</th>
                    <th className="border-b-2 border-black p-4 text-center text-white">คะแนน</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-300">
                        ไม่มีข้อมูลสำหรับทีมที่เลือก
                      </td>
                    </tr>
                  ) : (
                    standings.map((team) => (
                      <tr
                        key={team.team.id}
                        className="hover:bg-purple-500 transition-colors duration-400"
                      >
                        <td className="border-b border-black p-4 text-center">
                          {team.position || "-"}
                        </td>
                        <td className="border-b border-black p-4 text-center">
                          {formatTeamName(team.team.name || "-")} {/* ใช้ฟังก์ชัน formatTeamName */}
                        </td>
                        <td className="border-b border-black p-4 text-center">
                          {team.goalsFor || "-"}
                        </td>
                        <td className="border-b border-black p-4 text-center">
                          {team.goalsAgainst || "-"}
                        </td>
                        <td className="border-b border-black p-4 text-center">
                          {team.points || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
