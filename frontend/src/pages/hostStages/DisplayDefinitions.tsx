import colors from '../../data/colors.json';

interface DisplayDefinitionsProps {
  definitions: string[];
  currentWord: string;
  votesReceived: number;
  totalPlayers: number;
}

export default function DisplayDefinitions({
  definitions,
  currentWord,
}: DisplayDefinitionsProps) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-center text-gray-500 dark:text-gray-400">
        Definitions for:
      </h2>
      <h1 className="text-6xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
        '{currentWord}'
      </h1>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {definitions.map((definition, index) => {
          const colorClasses = colors[index % colors.length];

          return (
            <div
              key={index}
              className={`rounded-xl shadow p-6 text-lg space-x-4 ${colorClasses}`}
            >
              <span className="font-bold">{index + 1}.</span>
              <span>{definition}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
