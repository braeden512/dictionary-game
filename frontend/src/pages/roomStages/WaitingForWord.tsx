export default function WaitingForWord() {
  return (
    <div className="flex items-center justify-center px-4 m-5">
      <div className="bg-white dark:bg-[#2e2f31] rounded-2xl shadow-lg p-10 max-w-xl w-full text-center border border-gray-200 dark:border-[#444]">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Word Master is choosing a word...
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-8">
          Look at the host screen while you wait.
        </p>

        <div className="flex justify-center space-x-3">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}