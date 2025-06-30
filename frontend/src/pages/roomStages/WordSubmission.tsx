type Props = {
  word: string;
  setWord: (word: string) => void;
  onSubmit: () => void;
};

const WordSubmission = ({ word, setWord, onSubmit }: Props) => (
  <div className="p-6 flex items-center justify-center px-4">
    <div className="w-full max-w-md text-center bg-white dark:bg-[#353738] rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 m-4">
        You are the Word Master!
      </h2>
      <h3 className="text-sm mb-4 text-neutral-700 dark:text-neutral-200">
        <strong>Tip:</strong> Pick a word that no one would know. Make sure no one knows the definition before you submit!
      </h3>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter your word..."
        className="w-full p-3 rounded-md bg-gray-200 dark:bg-[#18191a] dark:text-white"
        maxLength={18}
      />
      <button
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
        onClick={onSubmit}
      >
        Submit Word
      </button>
    </div>
  </div>
);

export default WordSubmission;