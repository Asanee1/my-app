"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";
import { Progress } from "../components/ui/progress";

const Predictions = () => {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [eloData, setEloData] = useState(null);
  const [fbrefData, setFbrefData] = useState(null);
  const [homeAwayData, setHomeAwayData] = useState(null); // Added homeAwayData state
  const [probability, setProbability] = useState(null);
  const [eloLoading, setEloLoading] = useState(true);
  const [fbrefLoading, setFbrefLoading] = useState(false);
  const [homeAwayLoading, setHomeAwayLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null);
  const [calculationDetails, setCalculationDetails] = useState(null);

  const calculateWinProbability = (
    homeTeam,
    awayTeam,
    homeStats,
    awayStats
  ) => {
    if (!homeTeam || !awayTeam || !homeStats || !awayStats) return null;

    // Method 1: Home/Away Strength
    const homeStrength = homeStats.winRateHome;
    const awayStrength = awayStats.winRateAway;
    const homeStrengthText = `Home/Away Strength: ${homeTeam} home win rate = ${homeStrength.toFixed(
      2
    )}, ${awayTeam} away win rate = ${awayStrength.toFixed(2)}`;

    // Method 2: Expected Goals (xG)
    // Adjust xG based on home/away advantage/disadvantage
    const homeXG = homeStats.xG * (1 + 0.1); // Increase 10% for home team
    const awayXG = awayStats.xG * (1 - 0.1); // Decrease 10% for away team
    const xGWinProb = homeXG / (homeXG + awayXG);
    const xGAwayProb = 1 - xGWinProb;
    const xGText = `Expected Goals (xG): ${homeTeam} xG = ${homeXG.toFixed(
      2
    )}, ${awayTeam} xG = ${awayXG.toFixed(2)}, Win Prob = ${xGWinProb.toFixed(
      2
    )}, Away Prob = ${xGAwayProb.toFixed(2)}`;

    // Method 3: Elo Rating Model
    const homeElo = homeStats.elo;
    const awayElo = awayStats.elo;
    const eloWinProb = 1 / (1 + Math.pow(10, (awayElo - homeElo) / 400));
    const eloAwayProb = 1 - eloWinProb;
    const eloText = `Elo Rating: ${homeTeam} Elo = ${homeElo}, ${awayTeam} Elo = ${awayElo}, Win Prob = ${eloWinProb.toFixed(
      2
    )}, Away Prob = ${eloAwayProb.toFixed(2)}`;

    // Average of the three methods
    const finalHomeProb = ((homeStrength + xGWinProb + eloWinProb) / 3) * 100;
    const finalAwayProb =
      ((awayStrength + xGAwayProb + eloAwayProb) / 3) * 100;

    const finalCalculation = `Final Calculation: (${homeStrength.toFixed(
      2
    )} + ${xGWinProb.toFixed(2)} + ${eloWinProb.toFixed(
      2
    )}) / 3 = ${(finalHomeProb / 100).toFixed(2)} for ${homeTeam}, (${awayStrength.toFixed(
      2
    )} + ${xGAwayProb.toFixed(2)} + ${eloAwayProb.toFixed(
      2
    )}) / 3 = ${(finalAwayProb / 100).toFixed(2)} for ${awayTeam}`;

    setCalculationDetails({
      homeStrength: homeStrengthText,
      xG: xGText,
      elo: eloText,
      final: finalCalculation,
    });

    return {
      home: finalHomeProb.toFixed(2),
      away: finalAwayProb.toFixed(2),
    };
  };

  useEffect(() => {
    const fetchEloData = async () => {
      try {
        const eloRes = await fetch("/api/club-elo");
        if (!eloRes.ok) {
          throw new Error("Failed to fetch Club Elo data");
        }
        const data = await eloRes.json();
        setEloData(data);
        setTeams(data.map((team) => team.Club));
      } catch (err) {
        setError(err.message || "An error occurred fetching Club Elo data");
      } finally {
        setEloLoading(false);
      }
    };
    fetchEloData();
  }, []);

  useEffect(() => {
    const fetchHomeAwayData = async () => {
      setHomeAwayLoading(true);
      try {
        const response = await fetch(`/api/homeAway?season=2023`); // Adjust season as needed
        if (!response.ok) {
          throw new Error("Failed to fetch home/away win rate data");
        }
        const data = await response.json();
        setHomeAwayData(data);
      } catch (err) {
        setError(err.message || "Failed to load home/away win rate data");
      } finally {
        setHomeAwayLoading(false);
      }
    };
    fetchHomeAwayData();
  }, []);

  useEffect(() => {
    if (eloData) {
      const fetchFbrefData = async () => {
        setFbrefLoading(true);
        try {
          const fbrefRes = await fetch("/api/fbref");
          if (!fbrefRes.ok) {
            throw new Error("Failed to fetch fbref data");
          }
          const data = await fbrefRes.json();
          setFbrefData(data);
        } catch (err) {
          setError(err.message || "An error occurred fetching fbref data");
        } finally {
          setFbrefLoading(false);
        }
      };
      fetchFbrefData();
    }
  }, [eloData]);

  useEffect(() => {
    if (homeTeam && awayTeam && eloData && fbrefData && homeAwayData) {
      // Find team data
      const homeEloData = eloData.find((team) => team.Club === homeTeam);
      const awayEloData = eloData.find((team) => team.Club === awayTeam);

      const homeFbrefData = Object.values(fbrefData)
        .flatMap((league) => league.find((team) => team.Squad === homeTeam))
        .filter(Boolean)[0] || { xG: 1.5 };
      const awayFbrefData = Object.values(fbrefData)
        .flatMap((league) => league.find((team) => team.Squad === awayTeam))
        .filter(Boolean)[0] || { xG: 1.2 };

      const homeHomeAway = homeAwayData.find((team) => team.team === homeTeam);
      const awayHomeAway = homeAwayData.find((team) => team.team === awayTeam);

      // Prepare stats for calculateWinProbability
      const homeStats = {
        winRateHome: homeHomeAway ? homeHomeAway.homeWinRate : 0.5,
        xG: parseFloat(homeFbrefData.xG),
        elo: homeEloData ? homeEloData.Elo : 1500,
      };

      const awayStats = {
        winRateAway: awayHomeAway ? awayHomeAway.awayWinRate : 0.5,
        xG: parseFloat(awayFbrefData.xG),
        elo: awayEloData ? awayEloData.Elo : 1500,
      };

      const result = calculateWinProbability(
        homeTeam,
        awayTeam,
        homeStats,
        awayStats
      );
      setProbability(result);
    } else {
      setProbability(null);
      setCalculationDetails(null);
    }
  }, [homeTeam, awayTeam, eloData, fbrefData, homeAwayData]);

  if (eloLoading || homeAwayLoading) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-700">
          กำลังโหลดข้อมูล Elo and Home Away...
        </div>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-red-600">
          ข้อผิดพลาด: {error}
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <div className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto min-h-[600px]">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Match Predictions
        </h1>
        {fbrefLoading && <div>Loading fbref data...</div>}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            onChange={(e) => setHomeTeam(e.target.value)}
            className="select select-bordered w-full"
            value={homeTeam || ""}
          >
            <option disabled value="">
              Select Home Team
            </option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setAwayTeam(e.target.value)}
            className="select select-bordered w-full"
            value={awayTeam || ""}
          >
            <option disabled value="">
              Select Away Team
            </option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {probability && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Win Probability</h2>
            <div className="flex justify-between">
              <span>
                {homeTeam} ({probability.home}%)
              </span>
              <span>
                {awayTeam} ({probability.away}%)
              </span>
            </div>
            <Progress value={parseFloat(probability.home)} className="mt-2" />
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: homeTeam, value: parseFloat(probability.home) },
                    { name: awayTeam, value: parseFloat(probability.away) },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  <Cell key={homeTeam} fill="purple" />
                  <Cell key={awayTeam} fill="red" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6">
              <h3 className="text-md font-semibold">Calculation Details:</h3>
              {calculationDetails && (
                <div className="mt-2 space-y-2">
                  <p>{calculationDetails.homeStrength}</p>
                  <p>{calculationDetails.xG}</p>
                  <p>{calculationDetails.elo}</p>
                  <p>
                    <b>สรุป</b>: {calculationDetails.final}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!probability && !eloLoading && !fbrefLoading && !homeAwayLoading &&(
          <div className="mt-4">
            <p className="text-gray-500">
              Please select both home and away teams to view predictions.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </Container>
  );
};

export default Predictions;
