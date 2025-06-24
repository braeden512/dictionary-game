interface VotingStageProps {
  definitions: string[]; // We still need this for the count
  onVote: (index: number) => void;
  currentWord: string;
}

export default function VotingStage({ definitions, onVote }: VotingStageProps) {
  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-200">
        Guess the correct definition
      </h2>

      <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
        {definitions.map((_, index) => (
          <button
            key={index}
            onClick={() => onVote(index)}
            className="aspect-square w-full text-4xl font-bold rounded-2xl bg-indigo-500 text-white shadow-lg active:bg-indigo-600"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
