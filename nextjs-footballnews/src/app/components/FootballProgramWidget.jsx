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
            const matchHour = matchDate.getHours();
            const timeDifference = matchDate.getDate() - currentDate.getDate();

            let matchDayLabel = "";

            if (matchHour < 6 && timeDifference === 0) {
              matchDayLabel = "พรุ่งนี้";
            } else if (timeDifference === 0) {
              matchDayLabel = "วันนี้";
            } else if (timeDifference === 1 || matchDate.getDate() === currentDate.getDate() + 1) {
              matchDayLabel = "พรุ่งนี้";
            }

            return {
              ...match,
              homeTeam: {
                ...match.homeTeam,
                name: match.homeTeam.name.replace(/ FC| CF/g, "").trim(),
              },
              awayTeam: {
                ...match.awayTeam,
                name: match.awayTeam.name.replace(/ FC| CF/g, "").trim(),
              },
              localTime: matchDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              matchDayLabel,
            };
          });

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
    <div className="relative w-full">
      {/* ปุ่มเลื่อนซ้าย */}
      <button
        onClick={handleScrollLeft}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4 bg-purple-400 bg-opacity-100 hover:bg-opacity-75 text-white rounded-full shadow-md z-10"
      >
        ❮
      </button>

      {/* กล่องแสดงผล */}
      <div ref={containerRef} className="flex space-x-8 p-4 overflow-x-auto no-scrollbar">
        {matches.map((match) => (
          <div
            key={match.id}
            className="p-6 bg-white shadow-md rounded-lg min-w-[400px] flex items-center space-x-8"
          >
            {/* แถวในตาราง */}
            <div className="flex items-center w-full justify-between">
              {/* โลโก้ทีม Home พร้อมชื่อทีม */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src={match.homeTeam.crest || "/default-team-logo.png"}
                  alt={match.homeTeam.name}
                  className="w-16 h-16"
                />
                <p className="text-sm font-semibold mt-2">{match.homeTeam.name}</p>
              </div>

              {/* คำว่า วันนี้ หรือ พรุ่งนี้ และเวลา */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-gray-700">{match.matchDayLabel}</p>
                <p className="text-xl font-bold text-gray-700">{match.localTime}</p>
              </div>

              {/* โลโก้ทีม Away พร้อมชื่อทีม */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src={match.awayTeam.crest || "/default-team-logo.png"}
                  alt={match.awayTeam.name}
                  className="w-16 h-16"
                />
                <p className="text-sm font-semibold mt-2">{match.awayTeam.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มเลื่อนขวา */}
      <button
        onClick={handleScrollRight}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4 bg-purple-400 bg-opacity-100 hover:bg-opacity-75 text-white rounded-full shadow-md z-10"
      >
        ❯
      </button>
    </div>
  );
}
