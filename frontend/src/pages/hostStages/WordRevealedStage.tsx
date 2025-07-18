interface Props {
  word: string;
  round: number;
}

export default function WordRevealedStage({ word, round }: Props) {
  return (
    <div className="flex flex-col items-center p-3">
      <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-10">
        <span className="inline-block bg-gray-100 dark:bg-[#353738] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-sm">
          Round {round}
        </span>
      </div>
      <div className="text-3xl font-semibold text-center text-gray-500 dark:text-gray-400">
        The word is...
      </div>
      <div className="text-7xl mb-5 text-center font-semibold text-gray-500 px-10 rounded-xl dark:text-gray-400">
        '<span className="font-bold text-gray-800 dark:text-gray-100">{word}</span>'
      </div>
      <div className="text-xl text-gray-400 px-10 tracking-wide rounded-xl dark:text-gray-500 text-center">
        Now write your definition!
      </div>
    </div>
  );
}
