"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MatchCard from "../components/MatchCard";

export default function PredictionsPage() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("/api/predictions"); // Fetching from /api/predictions now
        if (!res.ok) throw new Error("Failed to fetch matches");

        const data = await res.json();
        setMatches(data.matches); // Update: Access the matches array directly
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    }

    fetchMatches();
  }, []);

  // function for update ELO
  async function handleUpdateElo(matchId){
    try{
        const res = await fetch("/api/updateElo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({matchId}),
          });
          if (!res.ok) throw new Error("Failed to update ELO");
    
          const data = await res.json();
          console.log(data)
          alert('ELO updated successfully');
    }catch(err){
        console.error("ELO error:", err);
        alert('ELO failed to update');
    }
  }

  return (
    <div>
      <Navbar />
      <div className="w-full max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-purple-600">Match Predictions</h1>

        {error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : matches.length === 0 ? (
          <div className="text-gray-500 text-center p-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-800 font-medium">{match.homeTeam}</div>
                  <div className="text-gray-500">vs</div>
                  <div className="text-gray-800 font-medium">{match.awayTeam}</div>
                </div>
                <div className="text-gray-500 mt-1">{match.date}</div>
                {match.probabilities && (
                  <div className="mt-2">
                    <div className="text-sm">
                      <span className="font-semibold">
                        {match.homeTeam} Win:
                      </span>{" "}
                      {match.probabilities.homeWinProbability.toFixed(2)}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">
                        {match.awayTeam} Win:
                      </span>{" "}
                      {match.probabilities.awayWinProbability.toFixed(2)}
                    </div>
                  </div>
                )}
                <button onClick={() => handleUpdateElo(match.id)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update ELO
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
