import { socket } from '../../components/socket';

interface HostRoundResultsProps {
  results: {
    correctIndex: number;
    definitions: {
      definition: string;
      author: string;
      voteCount: number;
      isCorrect: boolean;
    }[];
    playerVotes: {
      voterId: string;
      voteIndex: number;
      correct: boolean;
    }[];
  };
  roomCode: string;
  round: number;
}


export default function HostRoundResults({ results, roomCode, round }: HostRoundResultsProps) {

  const handleNextRound = () => {
    socket.emit('next-round', {roomCode})
  }
  const handleEndGame = () => {
    socket.emit('leave-room');
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Round {round} Results</h2>

      <div className="space-y-6">
        {results.definitions.map((res, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow border ${
              res.isCorrect ? 'border-green-500 bg-green-200 dark:bg-green-900/60' : 'bg-red-100 border-red-300 dark:bg-red-900/25 dark:border-red-800'
            }`}
          >
            <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
              <strong>{index + 1}.</strong> {res.definition}
            </div>
            <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              by <strong>{res.author}</strong> &mdash; {res.voteCount} vote{res.voteCount !== 1 && 's'}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={handleNextRound}
        >
          Start Next Round
        </button>
        <button
          className="px-6 py-3 bg-neutral-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={handleEndGame}
        >
          End Game
        </button>
      </div>
    </div>
  );
}