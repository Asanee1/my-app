export default function MatchItem({ match }) {
  const matchTime = new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ตรวจสอบสถานะของการแข่งขัน
  const isOngoing = match.status === 'IN_PLAY' || match.status === 'PAUSED' || match.status === 'LIVE';

  // ปรับการเข้าถึงสกอร์
  const homeScore = match.score?.fullTime?.home ?? 'N/A';
  const awayScore = match.score?.fullTime?.away ?? 'N/A';

  return (
    <div className={`w-full p-2 bg-white shadow-md rounded-lg mb-4 ${match.status === 'FINISHED' ? 'bg-gray-100' : ''}`}>
      <table className="w-full">
        <tbody>
          <tr className="w-full">
            <td className="w-1/6 text-lg font-bold text-gray-800">{matchTime}</td>
            <td className="text-right w-2/6 text-base font-semibold">
              {match.homeTeam.name}
              <img src={match.homeTeam.crest} alt={`${match.homeTeam.name} Logo`} className="inline-block w-10 h-10 ml-2" />
            </td>
            <td className="text-center w-1/6 text-xl font-bold text-gray-800">
              {isOngoing || match.status === 'FINISHED' ? `${homeScore} - ${awayScore}` : 'VS'}
            </td>
            <td className="text-left w-2/6 text-base font-semibold">
              <img src={match.awayTeam.crest} alt={`${match.awayTeam.name} Logo`} className="inline-block w-10 h-10 mr-2" />
              {match.awayTeam.name}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
