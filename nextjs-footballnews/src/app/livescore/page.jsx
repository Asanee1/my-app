"use client";
import { useEffect, useState } from 'react';
import MatchItem from '../components/MatchItem'; // Adjust path if needed
import Navbar from '../components/Navbar';

export default function LiveScorePage() {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // ตั้งค่า selectedDate ให้เป็นวันปัจจุบัน
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(`Fetching data for date: ${selectedDate}`); // เพิ่มการแสดงวันที่ที่ดึงข้อมูล
        const res = await fetch(`/api/footballprogram?date=${selectedDate}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        console.log("Data received:", data); // ตรวจสอบข้อมูลที่ได้รับ

        const leagueMap = {};
        data.matches.forEach(match => {
          const leagueId = match.competition.id;
          if (!leagueMap[leagueId]) {
            leagueMap[leagueId] = {
              name: match.competition.name,
              logo: match.competition.emblem, // เปลี่ยนจาก logo เป็น emblem
              matches: []
            };
          }
          leagueMap[leagueId].matches.push(match);
        });

        setLeagues(Object.values(leagueMap));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error); // ตรวจสอบข้อผิดพลาด
      }
    }

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  if (error) return <div className='text-red-500 text-center p-4'>Error: {error}</div>;
  if (leagues.length === 0 && selectedDate) return <div className='text-gray-500 text-center p-4'>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className='w-full max-w-4xl mx-auto p-6'>
        <h1 className='text-3xl font-bold text-center mb-6'>Live Scores</h1>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          className='mb-4 p-2 border rounded'
        />
        {leagues.map((league) => (
          <div key={league.name} className='mb-8 p-4 bg-white shadow rounded-lg'>
            <div className='flex items-center mb-4'>
              <img src={league.logo || '/default-league-logo.png'} alt={`${league.name} Logo`} className='w-10 h-10 mr-4 rounded-full border' />
              <h2 className='text-2xl font-semibold'>{league.name}</h2>
            </div>
            <div>
              {league.matches.length > 0 ? (
                league.matches.map((match) => (
                  <MatchItem key={match.id} match={match} />
                ))
              ) : (
                <div className='text-gray-500 text-center'>No matches available</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
