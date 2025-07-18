import colors from '../../data/colors.json';

interface DisplayDefinitionsProps {
  definitions: string[];
  currentWord: string;
  round: number;
  votesReceived: number;
  totalPlayers: number;
}

export default function DisplayDefinitions({ definitions, currentWord, round }: DisplayDefinitionsProps) {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        <span className="inline-block bg-gray-100 dark:bg-[#353738] text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full shadow-sm">
          Round {round}
        </span>
      </div>

      <h2 className="text-2xl font-semibold text-center text-gray-600 dark:text-gray-300 mb-1">
        Definitions for:
      </h2>
      <h1 className="text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
        '{currentWord}'
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {definitions.map((definition, index) => {
          const colorClasses = colors[index % colors.length];

          return (
            <div
              key={index}
              className={`p-4 rounded-xl shadow-md text-base flex flex-col ${colorClasses} min-h-[100px] break-words whitespace-pre-wrap`}
            >
              <span className="font-bold mb-1">{index + 1}.</span>
              <span>{definition}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
