const WaitingForGameStart = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="mt-5 bg-white border border-gray-300 rounded-2xl shadow-lg p-6 text-center max-w-md relative dark:bg-[#353738] dark:border-[#56585a]">
      <div
        className="text-5xl font-extrabold text-blue-500 px-6 py-4 rounded-xl dark:text-blue-600"
        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
      >
        You're in!
      </div>
      <div 
        className="text-sm font-bold text-gray-500 px-2 py-2 rounded-xl dark:text-gray-200"
        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
      >
        Waiting for the host to start the game...
      </div>
    </div>
  </div>
);
export default WaitingForGameStart;