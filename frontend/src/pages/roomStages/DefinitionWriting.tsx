import { useState } from "react";

type Props = {
  currentWord: string;
  onSubmit: (definition: string) => void;
};

const DefinitionWriting = ({ currentWord, onSubmit }: Props) => {
  const [definition, setDefinition] = useState('');

  return (
    <div className="mt-6 bg-white dark:bg-[#353738] rounded-xl p-6 shadow-md w-full max-w-md text-center">
      <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        Write your definition for:
      </h2>
      <p className="text-2xl font-semibold mb-4 text-black dark:text-white">{currentWord}</p>
      <textarea
        className="w-full p-3 rounded bg-gray-200 dark:bg-[#18191a] dark:text-white"
        placeholder="Enter your definition..."
        rows={3}
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
      ></textarea>
      <button
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        onClick={() => onSubmit(definition)}
      >
        Submit Definition
      </button>
    </div>
  );
};

export default DefinitionWriting;