interface Props {
  wordMaster: { id: string; username: string };
  currentTip: string;
}

export default function ChoosingWordStage({ wordMaster, currentTip }: Props) {
  return (
    <>
      <p
        key={currentTip}
        className="text-lg text-gray-600 m-4 dark:text-white transition-opacity duration-700 ease-in-out opacity-100"
      >
        💡 Tip: {currentTip}
      </p>
      <div>
        <div className="text-5xl mt-10 font-semibold text-gray-600 px-10 py-10 rounded-xl dark:text-gray-300 text-center">
          <span className="font-bold">{wordMaster.username}</span> is choosing the word...
        </div>
        <div className="text-2xl text-gray-500 px-10 tracking-wide rounded-xl dark:text-gray-400 text-center">
          Get ready to make up a definition!
        </div>
      </div>
    </>
  );
}
