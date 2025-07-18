import { useEffect, useState } from 'react';
import { socket } from '../../components/socket';
import { ArrowRight, Ban } from 'lucide-react';

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
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const [dimIncorrect, setDimIncorrect] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setRevealedIndex(results.correctIndex);
    }, 2500);

    const dimTimer = setTimeout(() => {
      setDimIncorrect(true);
    }, 1500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(dimTimer);
    };
  }, [results.correctIndex]);

  const handleNextRound = () => {
    socket.emit('next-round', { roomCode });
  };

  const handleEndGame = () => {
    socket.emit('leave-room');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Round {round} Results</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.definitions.map((res, index) => {
          const isCorrect = index === results.correctIndex;
          const isRevealed = revealedIndex === index;

          return (
            <div
              key={index}
              className={`
                p-4 rounded-xl border min-h-[120px] flex flex-col justify-between transition-all duration-700 ease-out
                ${isRevealed ? 'border-green-500 bg-green-100 dark:bg-green-900/40 scale-105 shadow-xl' : ''}
                ${
                  dimIncorrect && !isCorrect
                    ? 'opacity-50 grayscale'
                    : !isRevealed
                    ? 'border-gray-300 bg-white dark:bg-gray-800'
                    : ''
                }
              `}
            >
              <div className="text-md font-medium text-gray-800 dark:text-gray-100 break-words whitespace-pre-wrap">
                <span className="font-bold">{index + 1}.</span> {res.definition}
              </div>
              <div className="text-sm text-gray-600 mt-2 dark:text-gray-400">
                by <strong>{res.author}</strong> &mdash; {res.voteCount} vote{res.voteCount !== 1 && 's'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleNextRound}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg transition"
        >
          <ArrowRight />Start Next Round
        </button>
        <button
          onClick={handleEndGame}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 hover:shadow-lg transition"
        >
          <Ban />End Game
        </button>
      </div>
    </div>
  );
}
