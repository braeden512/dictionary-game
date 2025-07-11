import colors from '../../data/colors.json';

interface DisplayDefinitionsProps {
  definitions: string[];
  currentWord: string;
  round: number;
  votesReceived: number;
  totalPlayers: number;
}

export default function DisplayDefinitions({definitions, currentWord, round}: DisplayDefinitionsProps) {
  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
        <span className="inline-block bg-gray-100 dark:bg-[#353738] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-sm">
          🎯 Round {round}
        </span>
      </div>
      <h2 className="text-3xl font-semibold text-center text-gray-500 dark:text-gray-400">
        Definitions for:
      </h2>
      <h1 className="text-6xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
        '{currentWord}'
      </h1>

      <div className="grid gap-6 w-full max-w-4xl">
        {definitions.map((definition, index) => {
          const colorClasses = colors[index % colors.length];

          return (
            <div
              key={index}
              className={`min-w-[300px] w-full rounded-xl shadow p-6 text-lg flex items-start space-x-3 ${colorClasses}`}
            >
              <span className="font-bold">{index + 1}.</span>
              <span className="break-words">{definition}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
