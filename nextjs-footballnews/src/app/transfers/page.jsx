"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, Search } from "lucide-react";

const premierLeagueTeams = [
  "Arsenal",
  "Aston Villa",
  "Bournemouth",
  "Brentford",
  "Brighton",
  "Burnley",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Liverpool",
  "Luton",
  "Man City",
  "Man United",
  "Newcastle",
  "Nottm Forest",
  "Sheffield United",
  "Tottenham",
  "West Ham",
  "Wolves",
];

function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await fetch("/transfers.json");
        if (!response.ok) {
          throw new Error("Failed to fetch transfers data.");
        }
        const data = await response.json();
        setTransfers(data.transfers);
      } catch (err) {
        setError("Failed to load transfers.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  const filteredTransfers = transfers.filter((transfer) => {
    const toMatch = transfer.to.toLowerCase();
    const fromMatch = transfer.from.toLowerCase();
    const isPremierLeagueTransfer =
      premierLeagueTeams.some((team) =>
        team.toLowerCase().includes(toMatch)
      ) ||
      premierLeagueTeams.some((team) =>
        team.toLowerCase().includes(fromMatch)
      );

    const isSearchTermMatch =
      toMatch.includes(searchTerm.toLowerCase()) ||
      fromMatch.includes(searchTerm.toLowerCase());

    return isPremierLeagueTransfer && isSearchTermMatch;
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return <div className="text-center text-lg py-10">Loading transfers...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
        Premier League Transfers
      </h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={20} className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search by Premier League Team..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredTransfers.length === 0 ? (
        <p className="text-center text-gray-600">
          No transfers found for this team.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr className="text-gray-700 text-left">
                <th className="p-4 font-medium text-sm md:text-base">Player</th>
                <th className="p-4 font-medium text-sm md:text-base">Fee</th>
                <th className="p-4 font-medium text-sm md:text-base">To</th>
                <th className="p-4 font-medium text-sm md:text-base">Position</th>
                <th className="p-4 font-medium text-sm md:text-base">Contract</th>
                <th className="p-4 font-medium text-sm md:text-base">
                  Market Value
                </th>
                <th className="p-4 font-medium text-sm md:text-base">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((transfer, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Player */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={transfer.player_image || "/player-placeholder.jpg"}
                      alt={transfer.player}
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {transfer.player}
                      </p>
                      <div className="flex items-center gap-1 text-green-600">
                        <ArrowRight size={16} />
                        <span className="font-medium text-sm">
                          {transfer.from}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Fee */}
                  <td className="p-4 text-gray-700">
                    {transfer.transfer_fee &&
                    transfer.transfer_fee !== "Transfer"
                      ? transfer.transfer_fee
                      : transfer.transfer_type}
                  </td>

                  {/* To */}
                  <td className="p-4 text-gray-700">{transfer.to}</td>

                  {/* Position */}
                  <td className="p-4 text-gray-700">{transfer.position}</td>

                  {/* Contract */}
                  <td className="p-4 text-gray-700">{transfer.contract}</td>

                  {/* Market Value */}
                  <td className="p-4 text-gray-700">
                    {transfer.market_value}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-700">{transfer.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransfersPage;
