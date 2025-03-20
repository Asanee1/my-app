"use client";
import { useEffect, useState, useRef } from "react";

export default function FootballProgramWidget() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    async function fetchMatches() {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const res = await fetch(`/api/footballprogram`);
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setMatches(data.matches || []);
        }
       
      } catch (error) {
        if (isMounted) {
        setError(error.message || "An unknown error occurred");
        }
        console.error("Error fetching matches:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMatches();

    return () => {
        isMounted = false; // Cleanup to prevent state updates on unmount
    }
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
  if (loading)
    return <div className="text-gray-500 text-center p-4">Loading...</div>;

  return (
    <div className="relative w-full py-10 px-4">
      <h2 className="text-center text-lg font-bold text-gray-700 mb-4">
        {matches.length > 0
          ? `โปรแกรมการแข่งขันที่กำลังจะเกิดขึ้น`
          : "ไม่มีแมตช์ในช่วงนี้"}
      </h2>

      {matches.length > 0 ? (
        <>
          <button
            onClick={handleScrollLeft}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow-lg z-10 transition duration-300 ease-in-out"
          >
            ◀
          </button>

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
                    className="relative w-full top-0 text-white bg-gradient-to-r from-purple-600 to-blue-500 px-2 py-1 rounded-lg text-xs font-bold z-10 shadow-md text-center"
                  >
                    {match.matchDayLabel}
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <div className="flex flex-col items-center">
                      <img
                        src={match.homeTeamCrest}
                        alt={match.homeTeam.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                        onError={(e) => { e.target.onerror = null; e.target.src="/default-team-logo.png"; }}
                      />
                      <p className="text-sm font-semibold mt-1 text-gray-800">
                        {match.homeTeam.name}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xl font-bold text-gray-800">
                        {match.localTime}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <img
                        src={match.awayTeamCrest}
                        alt={match.awayTeam.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                        onError={(e) => { e.target.onerror = null; e.target.src="/default-team-logo.png"; }}
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

          <button
            onClick={handleScrollRight}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow-lg z-10 transition duration-300 ease-in-out"
          >
            ▶
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center">ไม่มีการแข่งขันที่กำลังจะเกิดขึ้น</p>
      )}
    </div>
  );
}
