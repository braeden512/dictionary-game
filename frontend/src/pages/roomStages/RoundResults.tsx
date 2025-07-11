import { CheckCircle, XCircle } from 'lucide-react';

interface DefinitionResult {
  definition: string;
  author: string;
  voteCount: number;
  isCorrect: boolean;
}

interface RoundResultsProps {
  correctIndex: number;
  playerVoteIndex: number;
  definitions: DefinitionResult[];
  isWordMaster: boolean;
}

export default function RoundResults({
  correctIndex,
  playerVoteIndex,
  definitions,
  isWordMaster,
}: RoundResultsProps) {
  if (isWordMaster) {
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold dark:text-white mb-4">Time for the results!</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">Check the host screen to see how everyone voted.</p>
      </div>
    );
  }

  const isCorrect = playerVoteIndex === correctIndex;

  return (
    <div className="p-8 text-center">
      <div className="flex justify-center m-6">
        {isCorrect ? (
          <CheckCircle size={250} className="text-green-500" />
        ) : (
          <XCircle size={250} className="text-red-500" />
        )}
      </div>

      <h2 className="text-3xl font-semibold mt-6 dark:text-white">
        {isCorrect ? 'You got it right!' : 'Oops! Wrong definition.'}
      </h2>
      <p className="text-md mt-2 text-gray-700 dark:text-gray-400">Check the host screen to see how everyone voted.</p>
    </div>
  );
}
