type Props = {
  word: string;
  setWord: (word: string) => void;
  onSubmit: () => void;
};

const WordSubmission = ({ word, setWord, onSubmit }: Props) => (
  <div className="bg-white dark:bg-[#353738] p-6 rounded-xl shadow-md border border-gray-300 dark:border-[#56585a]">
    <h2 className="text-xl text-center font-bold text-green-600 dark:text-green-400 mb-4">
      You are the Word Master!
    </h2>
    <input
      type="text"
      value={word}
      onChange={(e) => setWord(e.target.value)}
      placeholder="Enter your word..."
      className="rounded-md p-4 w-full bg-gray-200 dark:bg-[#18191a] dark:text-white"
    />
    <button
      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
      onClick={onSubmit}
    >
      Submit Word
    </button>
  </div>
);

export default WordSubmission;