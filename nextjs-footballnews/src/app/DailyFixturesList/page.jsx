"use client";
import { useEffect, useState } from "react";

export default function DailyFixturesList() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFixtures = async () => {
      const date = new Date().toISOString().split("T")[0]; // วันที่ปัจจุบัน YYYY-MM-DD
      const res = await fetch(`/api/dailyFixtures?date=${date}`);
      const data = await res.json();
      setLeagues(data);
      setLoading(false);
    };

    fetchFixtures();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {leagues.map((league) => (
        <div key={league.id} className="mb-8">
          {/* แสดงชื่อและโลโก้ของลีก */}
          <div className="flex items-center space-x-2 mb-4">
            <img
              src={league.logo || "/default-league.png"} // 🏆 ถ้าไม่มีโลโก้ให้ใช้ default
              alt={league.name}
              className="w-8 h-8"
            />
            <h2 className="text-xl font-bold">{league.name}</h2>
          </div>

          {/* ตารางแสดงข้อมูลแมตช์ */}
          <div className="bg-white shadow-md rounded-lg p-4">
            {league.matches.map((match) => (
              <div key={match.fixture.id} className="p-4 border-b flex justify-between items-center">
                {/* ทีมเหย้า */}
                <div className="flex items-center w-1/3 justify-end">
                  <span className="text-right font-semibold">{match.teams.home.name}</span>
                  <img
                    src={match.teams.home.logo || "/default-team.png"} // ⚽ ถ้าไม่มีโลโก้ให้ใช้ default
                    className="w-8 h-8 ml-2"
                  />
                </div>

                {/* เวลาแข่งขัน */}
                <div className="text-center w-1/3 text-gray-700 text-lg font-semibold">
                  {new Date(match.fixture.date).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* ทีมเยือน */}
                <div className="flex items-center w-1/3 justify-start">
                  <img
                    src={match.teams.away.logo || "/default-team.png"} // ⚽ ถ้าไม่มีโลโก้ให้ใช้ default
                    className="w-8 h-8 mr-2"
                  />
                  <span className="text-left font-semibold">{match.teams.away.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

