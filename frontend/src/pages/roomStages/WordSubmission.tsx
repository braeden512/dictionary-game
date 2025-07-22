import React from 'react';

type Props = {
  word: string;
  setWord: (w: string) => void;
  onSubmit: () => void;
  suggestions: string[];
  suggestionDefinitions: Record<string, string>;
};

const WordSubmission = ({word, setWord, onSubmit, suggestions, suggestionDefinitions}: Props) => (
  <div className="p-6 flex items-center justify-center px-4">
    <div className="w-full max-w-md text-center bg-white dark:bg-[#353738] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-[#56585a]">
      <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
        You are the Word Master!
      </h2>
      <p className="text-base text-gray-600 dark:text-gray-300 mb-3">
        Pick a word that nobody is likely to know.
      </p>

      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter your word..."
        className="w-full p-3 rounded-lg bg-gray-200 dark:bg-[#1e1f21] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        maxLength={18}
      />

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="mt-6 text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggestions:
          </p>
          <ul className="space-y-3">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => setWord(suggestion)}
                className="cursor-pointer bg-gray-100 dark:bg-[#2a2b2d] hover:bg-green-100 dark:hover:bg-green-700 p-3 rounded-lg transition"
              >
                <p className="font-semibold text-green-800 dark:text-green-300">{suggestion}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suggestionDefinitions[suggestion] || 'No definition found.'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!word.trim()}
        className={`w-full mt-6 text-white text-lg font-semibold py-3 rounded-lg shadow-sm transition
          ${
            !word.trim()
              ? 'bg-green-900 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }
        `}
      >
        Submit Word
      </button>
    </div>
  </div>
);

export default WordSubmission;