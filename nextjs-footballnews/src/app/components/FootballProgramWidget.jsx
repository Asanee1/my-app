"use client";
import { useEffect, useState, useRef } from "react";

export default function FootballProgramWidget() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`/api/footballprogram`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        console.log("Matches Data:", data.matches);

        const processedMatches = data.matches
          .map((match) => {
            const matchDate = new Date(match.utcDate);
            const currentDate = new Date();
            const timeDifference = Math.floor(
              (matchDate - currentDate) / (1000 * 60 * 60 * 24)
            );

            const matchHour = matchDate.getHours();

            let matchDayLabel = "";
            if (timeDifference === 0 && matchHour < 6) {
              matchDayLabel = "พรุ่งนี้";
            } else if (timeDifference === 0) {
              matchDayLabel = "วันนี้";
            } else if (timeDifference === 1) {
              matchDayLabel = "พรุ่งนี้";
            } else {
              matchDayLabel = matchDate.toLocaleDateString("th-TH", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });
            }

            // เพิ่มวันที่แบบเต็มเข้าไป
            const fullMatchDate = matchDate.toLocaleDateString("th-TH", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            // เพิ่มวันที่แบบ วัน/เดือน/ปี
            const shortMatchDate = matchDate.toLocaleDateString("th-TH", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            });

            return {
              ...match,
              homeTeam: {
                ...match.homeTeam,
                name: match.homeTeam.name
                  .split(" ")
                  .slice(0, -1)
                  .join("")
                  .trim(),
              },
              awayTeam: {
                ...match.awayTeam,
                name: match.awayTeam.name
                  .split(" ")
                  .slice(0, -1)
                  .join("")
                  .trim(),
              },
              localTime: matchDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              matchDayLabel,
              fullMatchDate, // เพิ่มตัวแปรนี้เข้าไป
              shortMatchDate, //เพิ่มตัวแปรนี้
              homeTeamCrest: match.homeTeam.crest || "/default-team-logo.png",
              awayTeamCrest: match.awayTeam.crest || "/default-team-logo.png",
              matchDate, // ส่ง matchDate ไปด้วย
            };
          })
          // กรองคู่ที่แข่งจบไปแล้ว
          .filter((match) => match.matchDate > new Date()); // เพิ่ม .filter ตรงนี้

        setMatches(processedMatches || []);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching matches:", error);
      }
    }

    fetchMatches();
  }, []);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (matches.length === 0)
    return <div className="text-gray-500 text-center p-4">Loading...</div>;

  return (
    <div className="relative w-full py-10 px-4">
      {/* ปุ่มเลื่อนซ้าย */}
      <button
        onClick={handleScrollLeft}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white rounded-full shadow-lg z-10 transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* กล่องแสดงผล */}
      <div
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto no-scrollbar pb-4"
      >
        {matches.map((match) => (
          <div
            key={match.id}
            className="p-4 bg-white shadow-xl rounded-2xl min-w-[320px] flex items-center justify-between group relative transition duration-300 ease-in-out hover:scale-105"
          >
            <div className="flex flex-col items-center w-full">
              <div
                className="relative w-full top-0 text-white bg-gradient-to-r from-purple-600 to-blue-500 px-2 py-1 rounded-lg text-xs font-bold z-10 shadow-md transition duration-300 ease-in-out group-hover:scale-110"
                style={{ marginTop: "-1rem", textAlign: "center" }}
              >
                {match.matchDayLabel}
              </div>

              <div className="flex items-center space-x-2 mt-4">
                {/* โลโก้ทีม Home พร้อมชื่อทีม */}
                <div className="flex flex-col items-center">
                  <img
                    src={match.homeTeamCrest}
                    alt={match.homeTeam.name}
                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                  />
                  <p className="text-sm font-semibold mt-1 text-gray-800">
                    {match.homeTeam.name}
                  </p>
                </div>
                {/*เวลา*/}
                <div className="flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-gray-800">{match.localTime}</p>
                  <p className="text-xs text-gray-600 mt-1">{match.shortMatchDate}</p>
                </div>
                {/* โลโก้ทีม Away พร้อมชื่อทีม */}
                <div className="flex flex-col items-center">
                  <img
                    src={match.awayTeamCrest}
                    alt={match.awayTeam.name}
                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                  />
                  <p className="text-sm font-semibold mt-1 text-gray-800">
                    {match.awayTeam.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มเลื่อนขวา */}
      <button
        onClick={handleScrollRight}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white rounded-full shadow-lg z-10 transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
