"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { fetchUpcomingMatches, getPredictions } from "./api";

const PredictionsPage = () => {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const data = await fetchUpcomingMatches();
        setMatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  const handlePredict = async (homeTeam, awayTeam) => {
    const key = `${homeTeam} vs ${awayTeam}`;
    if (predictions[key]) return;

    setLoading(true);
    try {
      const result = await getPredictions(homeTeam, awayTeam);
      setPredictions((prev) => ({ ...prev, [key]: result }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Predictions</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions[`${match.homeTeam} vs ${match.awayTeam}`]}
              onPredict={handlePredict}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;
