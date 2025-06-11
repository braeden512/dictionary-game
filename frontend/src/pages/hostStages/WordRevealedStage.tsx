interface Props {
  word: string;
}

export default function WordRevealedStage({ word }: Props) {
  return (
    <div>
      <div className="text-4xl mt-20 font-semibold text-center text-gray-500 px-10 rounded-xl dark:text-gray-400">
        The word is...
      </div>
      <div className="text-7xl mb-10 mt-1 text-center font-semibold text-gray-500 px-10 rounded-xl dark:text-gray-400">
        '<span className="font-bold text-gray-800 dark:text-gray-100">{word}</span>'
      </div>
      <div className="text-xl text-gray-400 px-10 tracking-wide rounded-xl dark:text-gray-500 text-center">
        Now write your definition!
      </div>
    </div>
  );
}
