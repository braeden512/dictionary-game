import colors from '../../data/colors.json';

interface VotingStageProps {
  definitions: string[];
  onVote: (index: number) => void;
  currentWord: string;
}

export default function VotingStage({ definitions, onVote, currentWord }: VotingStageProps) {
  return (
    <div className="px-4 py-8 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Guess the correct definition
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-300">
          Tap the number that matches the real definition of <strong>{currentWord}</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-md">
        {definitions.map((_, index) => {
          const colorClasses = colors[index % colors.length];
          return (
            <button
              key={index}
              onClick={() => onVote(index)}
              className={`
                aspect-square w-full text-5xl font-bold rounded-3xl 
                shadow-md transition-transform duration-100 
                hover:brightness-90 hover:scale-105
                ${colorClasses}
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}