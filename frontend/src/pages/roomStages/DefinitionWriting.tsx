import { useEffect, useState } from "react";
import WaitingForDefinitions from './WaitingForDefinitions';

type Props = {
  currentWord: string;
  onSubmit: (definition: string) => void;
  isWordMaster: boolean;
  prefill?: string | null;
};

const DefinitionWriting = ({ currentWord, onSubmit, isWordMaster, prefill }: Props) => {
  const [definition, setDefinition] = useState(prefill || '');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isWordMaster && prefill) {
      setDefinition(prefill);
    }
  }, [isWordMaster, prefill]);

  const handleSubmit = () => {
    if (definition.trim() === '') return;
    onSubmit(definition);
    setSubmitted(true);
  };

  if (submitted) {
    return <WaitingForDefinitions />;
  }

  return (
    <div className="p-6 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {isWordMaster ? (
          <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-4">
            Make sure to write the correct definition!
          </div>
        ) : (
          <div className="text-sm font-semibold text-red-700 dark:text-red-400 mb-4">
            Try to deceive others by making a fake definition!
          </div>
        )}

        <div className="bg-white dark:bg-[#353738] rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Write your definition for:
          </h2>
          <p className="text-4xl font-bold mb-4 text-black dark:text-white break-words break-all">
            '{currentWord}'
          </p>
          <textarea
            className="w-full p-3 rounded bg-gray-200 dark:bg-[#18191a] dark:text-white"
            placeholder="Enter your definition..."
            rows={3}
            maxLength={200}
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          ></textarea>
          <button
            disabled={!definition.trim()}
            className={`w-full mt-2 text-white text-lg font-semibold py-3 rounded-lg shadow-sm transition
              ${!definition.trim()
                ? 'bg-blue-900 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'}
            `}
            onClick={handleSubmit}
          >
            Submit Definition
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefinitionWriting;
