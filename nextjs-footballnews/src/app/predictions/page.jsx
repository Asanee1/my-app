"use client";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";
import { Progress } from "../components/ui/progress";

const Predictions = () => {
  const [teams, setTeams] = useState([]);
  const [leagueTeams, setLeagueTeams] = useState([]); // Teams filtered by league
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [awayTeams, setAwayTeams] = useState([]); // New state for filtered away teams
  const [eloData, setEloData] = useState(null);
  const [fbrefData, setFbrefData] = useState(null);
  const [homeAwayData, setHomeAwayData] = useState(null);
  const [probability, setProbability] = useState(null);
  const [eloLoading, setEloLoading] = useState(true);
  const [fbrefLoading, setFbrefLoading] = useState(false);
  const [homeAwayLoading, setHomeAwayLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculationDetails, setCalculationDetails] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [availableLeagues, setAvailableLeagues] = useState([]); // New state for available leagues

  // Mapping for club names between fbref and club-elo
  const clubNameMapping = {
    "Manchester City": "Man City",
    "Manchester United": "Man United",
    "Tottenham Hotspur": "Tottenham",
  };

  const mapClubName = (clubName) => {
    return clubNameMapping[clubName] || clubName;
  };

  const calculateWinProbability = (
    homeTeam,
    awayTeam,
    homeStats,
    awayStats
  ) => {
    if (!homeTeam || !awayTeam || !homeStats || !awayStats) return null;

    // Method 1: Home/Away Strength
    const homeStrength = homeStats?.winRateHome ?? 0.5;
    const awayStrength = awayStats?.winRateAway ?? 0.5;    
    // Calculate Tie Rate
    const homeTieRate = homeStats.homeTieRate;
    const awayTieRate = awayStats.awayTieRate;

    const homeStrengthText = `Home/Away Strength: ${homeTeam} home win rate = ${homeStrength.toFixed(
      2
    )}, ${awayTeam} away win rate = ${awayStrength.toFixed(2)}`;
    const tieStrengthText = `Tie Strength: ${homeTeam} home tie rate = ${homeTieRate.toFixed(
      2
    )}, ${awayTeam} away tie rate = ${awayTieRate.toFixed(2)}`;

    // Method 2: Expected Goals (xG)
    // Adjust xG based on home/away advantage/disadvantage
    const homeXG = homeStats.xG * (1 + 0.1); // Increase 10% for home team
    const awayXG = awayStats.xG * (1 - 0.1); // Decrease 10% for away team
    const xGWinProb = homeXG / (homeXG + awayXG);
    const xGAwayProb = 1 - xGWinProb;

    // Calculate Tie Probability based on xG
    const tieProbabilityXG = Math.abs(homeXG - awayXG) / (homeXG + awayXG);

    const xGText = `Expected Goals (xG): ${homeTeam} xG = ${homeXG.toFixed(
      2
    )}, ${awayTeam} xG = ${awayXG.toFixed(2)}`;
    const adjustedXGText = `Adjusted xG Probability: ${homeTeam} Win Prob = ${xGWinProb.toFixed(
      2
    )}, ${awayTeam} Win Prob = ${xGAwayProb.toFixed(
      2
    )}, Tie Prob = ${tieProbabilityXG.toFixed(2)}`;

    // Method 3: Elo Rating Model
    // Ensure homeElo and awayElo are numbers
    let homeElo = Number(homeStats.elo);
    let awayElo = Number(awayStats.elo);

    // If the value is NaN set it to 1500.
    if (isNaN(homeElo)) {
      homeElo = 1500;
    }
    if (isNaN(awayElo)) {
      awayElo = 1500;
    }
    const eloWinProb = 1 / (1 + Math.pow(10, (awayElo - homeElo) / 400));
    const eloAwayProb = 1 - eloWinProb;

    // Calculate Tie Probability based on Elo
    const tieProbabilityElo = 1 / (1 + Math.abs(homeElo - awayElo) / 100);

    const eloText = `Elo Rating: ${homeTeam} Elo = ${homeElo.toFixed(
      2
    )}, ${awayTeam} Elo = ${awayElo.toFixed(2)}`;
    const adjustedEloText = `Adjusted Elo Probability: ${homeTeam} Win Prob = ${eloWinProb.toFixed(
      2
    )}, ${awayTeam} Win Prob = ${eloAwayProb.toFixed(
      2
    )}, Tie Prob = ${tieProbabilityElo.toFixed(2)}`;

    // Average of the three methods
    const finalHomeProb =
      ((homeStrength + xGWinProb + eloWinProb) / 3) * 100;
    const finalAwayProb =
      ((awayStrength + xGAwayProb + eloAwayProb) / 3) * 100;
    const finalTieProb =
      ((tieProbabilityXG + tieProbabilityElo + homeTieRate + awayTieRate) / 4) *
      100;
    const finalCalculation = `Final Calculation: (${homeStrength.toFixed(
      2
    )} + ${xGWinProb.toFixed(2)} + ${eloWinProb.toFixed(
      2
    )}) / 3 = ${(finalHomeProb / 100).toFixed(2)} for ${homeTeam}, (${awayStrength.toFixed(
      2
    )} + ${xGAwayProb.toFixed(2)} + ${eloAwayProb.toFixed(
      2
    )}) / 3 = ${(finalAwayProb / 100).toFixed(2)} for ${awayTeam}, (${tieProbabilityXG.toFixed(
      2
    )} + ${tieProbabilityElo.toFixed(2)} + ${homeTieRate.toFixed(
      2
    )} + ${awayTieRate.toFixed(2)}) / 4 = ${(finalTieProb / 100).toFixed(
      2
    )} for Tie`;

    setCalculationDetails({
      homeStrength: homeStrengthText,
      tieStrength: tieStrengthText,
      xG: xGText,
      adjustedXG: adjustedXGText,
      elo: eloText,
      adjustedElo: adjustedEloText,
      final: finalCalculation,
    });

    return {
      home: finalHomeProb.toFixed(2),
      away: finalAwayProb.toFixed(2),
      tie: finalTieProb.toFixed(2),
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

          const allTeams = [];
          const leagues = Object.keys(data);
          setAvailableLeagues(leagues); // Set available leagues
          for (const league in data) {
            data[league].forEach((team) => {
              allTeams.push({ ...team, league }); // Store the league along with team details
            });
          }
          setTeams(allTeams);
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
    // Filter teams based on selected league
    if (selectedLeague && fbrefData) {
      const filteredTeams = fbrefData[selectedLeague]
        ? fbrefData[selectedLeague].map((team) => team.Squad)
        : [];
      setLeagueTeams(filteredTeams);
    } else {
      setLeagueTeams([]);
    }
    setHomeTeam(null);
    setAwayTeam(null);
  }, [selectedLeague, fbrefData]);

  useEffect(() => {
    // Filter away teams based on home team's league
    if (homeTeam && fbrefData && selectedLeague) {
      const filteredAwayTeams = fbrefData[selectedLeague]
        .map((team) => team.Squad)
        .filter((team) => team !== homeTeam);
      setAwayTeams(filteredAwayTeams);
    } else {
      setAwayTeams([]);
    }
    setAwayTeam(null);
  }, [homeTeam, fbrefData, selectedLeague]);

  useEffect(() => {
    if (homeTeam && awayTeam && eloData && fbrefData && homeAwayData) {
      // Find team data
      const mappedHomeTeam = mapClubName(homeTeam); // Apply mapping to home team
      const mappedAwayTeam = mapClubName(awayTeam); // Apply mapping to away team

      const homeEloData = eloData.find((team) => team.Club === mappedHomeTeam);
      const awayEloData = eloData.find((team) => team.Club === mappedAwayTeam);

      // Find the home and away team data from fbrefData based on the league
      let homeFbrefData = null;
      for (const league in fbrefData) {
        const team = fbrefData[league].find((t) => t.Squad === homeTeam);
        if (team) {
          homeFbrefData = team;
          break;
        }
      }

      let awayFbrefData = null;
      for (const league in fbrefData) {
        const team = fbrefData[league].find((t) => t.Squad === awayTeam);
        if (team) {
          awayFbrefData = team;
          break;
        }
      }

      if (!homeFbrefData) homeFbrefData = { xG: 1.5, xGA: 1.0 };
      if (!awayFbrefData) awayFbrefData = { xG: 1.2, xGA: 0.8 };

      const homeHomeAway = homeAwayData.find((team) => team.team === homeTeam);
      const awayHomeAway = homeAwayData.find((team) => team.team === awayTeam);

      // Prepare stats for calculateWinProbability
      const homeStats = {
        winRateHome: homeHomeAway ? homeHomeAway.homeWinRate : 0.5,
        homeTieRate: homeHomeAway ? homeHomeAway.homeTieRate : 0.5,
        xG: parseFloat(homeFbrefData.xG),
        elo: homeEloData ? homeEloData.Elo : 1500, //set default to 1500
      };

      const awayStats = {
        winRateAway: awayHomeAway ? awayHomeAway.awayWinRate : 0.5,
        awayTieRate: awayHomeAway ? awayHomeAway.awayTieRate : 0.5,
        xG: parseFloat(awayFbrefData.xG),
        elo: awayEloData ? awayEloData.Elo : 1500, //set default to 1500
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
      <div className="p-8 bg-[#F7F7F7] rounded-lg shadow-lg max-w-3xl mx-auto min-h-[600px] border border-gray-300">
        <h1 className="text-3xl font-medium text-[#6B46C1] mb-6">
          Match Predictions
        </h1>
        {fbrefLoading && <div>Loading fbref data...</div>}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <select
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="select select-primary select-bordered w-full text-lg"
            value={selectedLeague || ""}
          >
            <option disabled value="">
              Select League
            </option>
            {availableLeagues.map((league) => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <select
            onChange={(e) => setHomeTeam(e.target.value)}
            className="select select-primary select-bordered w-full text-lg"
            value={homeTeam || ""}
          >
            <option disabled value="">
              Select Home Team
            </option>
            {leagueTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setAwayTeam(e.target.value)}
            className="select select-primary select-bordered w-full text-lg"
            value={awayTeam || ""}
          >
            <option disabled value="">
              Select Away Team
            </option>
            {awayTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {probability && (
          <div className="mt-6">
            <h2 className="text-lg font-medium">Win Probability</h2>
            <div className="flex justify-between text-sm">
              <span>
                {homeTeam} ({probability.home}%)
              </span>
              <span>
                {awayTeam} ({probability.away}%)
              </span>
              <span>
                Tie ({probability.tie}%)
              </span>
            </div>
            <Progress
              value={parseFloat(probability.home)}
              className="mt-2 rounded-full text-white"
            >
              {probability.home}%
            </Progress>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: homeTeam, value: parseFloat(probability.home) },
                    { name: awayTeam, value: parseFloat(probability.away) },
                    { name: "Tie", value: parseFloat(probability.tie) },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell key={homeTeam} fill="purple" />
                  <Cell key={awayTeam} fill="red" />
                  <Cell key={"Tie"} fill="gray" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Calculation Details:</h3>
              {calculationDetails && (
                <div className="mt-2 space-y-2 border p-4">
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Method 1: Home/Away Strength</h4>
                    <p className="text-xs">{calculationDetails.homeStrength}</p>
                    <p className="text-xs">{calculationDetails.tieStrength}</p>
                  </div>
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Method 2: Expected Goals (xG)</h4>
                    <p className="text-xs">{calculationDetails.xG}</p>
                    <p className="text-xs">{calculationDetails.adjustedXG}</p>
                  </div>
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Method 3: Elo Rating Model</h4>
                    <p className="text-xs">{calculationDetails.elo}</p>
                    <p className="text-xs">{calculationDetails.adjustedElo}</p>
                  </div>
                  <p className="text-xs">
                    <b>Summary</b>: {calculationDetails.final}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!probability && !eloLoading && !fbrefLoading && !homeAwayLoading && (
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
