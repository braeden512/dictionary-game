import colors from '../../data/colors.json';

interface VotingStageProps {
  definitions: string[];
  onVote: (index: number) => void;
  currentWord: string;
}

export default function VotingStage({ definitions, onVote }: VotingStageProps) {
  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-200">
        Guess the correct definition
      </h2>

      <div className="grid grid-cols-3 gap-5 w-full max-w-md">
        {definitions.map((_, index) => {
          const colorClasses = colors[index % colors.length];

          return (
            <button
              key={index}
              onClick={() => onVote(index)}
              className={`aspect-square w-full text-4xl font-bold rounded-3xl shadow-lg active:brightness-90 ${colorClasses}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}