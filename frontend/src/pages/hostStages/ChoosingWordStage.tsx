interface Props {
  wordMaster: { id: string; username: string };
  currentTip: string;
  round: number;
}

export default function ChoosingWordStage({ wordMaster, currentTip, round }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
        <span className="inline-block bg-gray-100 dark:bg-[#353738] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-sm">
          🎯 Round {round}
        </span>
      </div>

      <p
        key={currentTip}
        className="text-lg sm:text-xl text-gray-600 dark:text-white transition-opacity duration-700 ease-in-out opacity-100 max-w-xl"
      >
        💡 Tip: <span className="italic">{currentTip}</span>
      </p>

      <div className="text-3xl sm:text-4xl font-semibold text-gray-700 dark:text-gray-200 px-6 py-6 rounded-xl bg-white dark:bg-[#353738] shadow-lg max-w-2xl">
        <span className="font-bold">{wordMaster.username}</span> is choosing the word...
      </div>

      <div className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 px-4 max-w-xl">
        Get ready to make up a definition!
      </div>
    </div>
  );
}
