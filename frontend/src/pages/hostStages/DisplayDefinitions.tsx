interface DisplayDefinitionsProps {
  definitions: string[];
  currentWord: string;
  votesReceived: number;
  totalPlayers: number;
}

export default function DisplayDefinitions({ definitions, currentWord, votesReceived, totalPlayers }: DisplayDefinitionsProps) {
    const progressPercent = Math.min((votesReceived / totalPlayers) * 100, 100);

    return (
        <div className="p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-4">
            Definitions for:
        </h2>
        <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
            {currentWord}
        </h1>

        <div className="grid gap-6 max-w-3xl mx-auto">
            {definitions.map((definition, index) => (
            <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-lg flex items-start space-x-4"
            >
                <span className="font-bold text-indigo-500">{index + 1}.</span>
                <span className="text-gray-800 dark:text-gray-100">{definition}</span>
            </div>
            ))}
        </div>

        {/* Voting progress bar */}
        <div className="w-full max-w-xl mx-auto mt-8 px-4">
            <div className="text-center text-gray-600 dark:text-gray-300 mb-2">
            Votes: {votesReceived} / {totalPlayers}
            </div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
                className="h-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
            ></div>
            </div>
        </div>
        </div>
    );
}
