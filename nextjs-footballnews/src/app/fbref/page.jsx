"use client";
import { useEffect, useState } from "react";

export default function FbrefPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fbref")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching FBref data:", err));
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  if (!data) return <p className="text-center text-lg">No data available.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">
        xG และ xGA ของ 5 ลีกใหญ่
      </h1>

      {Object.entries(data).map(([league, teams]) => {
        if (typeof teams === "object" && teams.error) {
          return (
            <div key={league} className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {league}
              </h2>
              <p className="text-red-500">Error: {teams.error}</p>
            </div>
          );
        }
        return (
          <div key={league} className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{league}</h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="border p-2 text-left">Squad</th>
                  <th className="border p-2 text-right">xG</th>
                  <th className="border p-2 text-right">xGA</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(teams) &&
                  teams.map((team, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">{team.Squad}</td>
                      <td className="border p-2 text-right">{team.xG}</td>
                      <td className="border p-2 text-right">{team.xGA}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
