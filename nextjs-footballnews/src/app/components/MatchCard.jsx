export default function MatchCard({ match, prediction, onPredict }) {
    return (
      <div className="p-4 border rounded-lg shadow-md bg-white mb-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">{match.teamA.name}</div>
          <div className="text-gray-500">vs</div>
          <div className="text-lg font-semibold">{match.teamB.name}</div>
        </div>
  
        <button
          onClick={onPredict}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          Predict Outcome
        </button>
  
        {prediction && (
          <div className="mt-3 text-sm text-gray-700">
            <p>Win {match.teamA.name}: {(prediction.winA * 100).toFixed(2)}%</p>
            <p>Draw: {(prediction.draw * 100).toFixed(2)}%</p>
            <p>Win {match.teamB.name}: {(prediction.winB * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    );
  }
  