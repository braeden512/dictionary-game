type Props = {
  word: string;
  setWord: (word: string) => void;
  onSubmit: () => void;
};

const WordSubmission = ({ word, setWord, onSubmit }: Props) => (
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

      <button
        onClick={onSubmit}
        disabled={!word.trim()}
        className={`w-full mt-5 text-white text-lg font-semibold py-3 rounded-lg shadow-sm transition
          ${!word.trim() 
            ? 'bg-green-900 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'}
        `}
      >
        Submit Word
      </button>

    </div>
  </div>
);


export default WordSubmission;