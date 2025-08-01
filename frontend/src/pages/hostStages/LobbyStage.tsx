// components/hostRoom/LobbyStage.tsx

import { Copy, Check, Lightbulb } from 'lucide-react';
import colors from '../../data/colors.json';

interface User {
  id: string;
  username: string;
}

interface Props {
  roomCode: string;
  userList: User[];
  copied: boolean;
  handleCopy: () => void;
  startGame: () => void;
  currentTip: string;
}

export default function LobbyStage({
  roomCode,
  userList,
  copied,
  handleCopy,
  startGame,
  currentTip
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-5 bg-white border border-gray-300 rounded-2xl shadow-lg p-8 text-center max-w-md relative dark:bg-[#353738] dark:border-[#56585a]">
        <p className="text-lg text-gray-600 mb-2 dark:text-white">
          Share this room code with others:
        </p>
        <div className="relative">
          <div 
            className="text-5xl font-extrabold tracking-widest text-blue-600 bg-blue-100 px-6 py-4 rounded-xl dark:bg-[#14181e]"
            style={{ textShadow: '2px 2px 2px rgba(0, 61, 182, 0.5)' }}
          >
            {roomCode}
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800 transition"
            aria-label="Copy room code"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
        <button
          onClick={startGame}
          disabled={userList.length < 3}
          className={`mt-3 w-full text-white text-lg font-semibold px-6 py-3 rounded-xl shadow transition duration-200 ${
            userList.length < 3
              ? 'bg-neutral-400 dark:bg-neutral-800 cursor-not-allowed'
              : 'bg-green-800 hover:bg-green-700'
          }`}
        >
          {userList.length < 3
            ? `Need ${3 - userList.length} more player${
                3 - userList.length === 1 ? '' : 's'
              }`
            : 'Start Game'}
        </button>
      </div>

      <p
        key={currentTip}
        className="flex items-center gap-1 text-lg text-gray-600 m-4 dark:text-white transition-opacity duration-700 ease-in-out opacity-100"
      >
        <Lightbulb color="#ffc800"/>Tip: {currentTip}
      </p>

      {userList.length > 0 && (
        <div className="border border-gray-300 bg-white shadow-lg rounded-xl p-6 max-w-3xl w-full dark:bg-[#353738] dark:border-[#56585a]">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center mb-5 dark:text-white">
            Connected Users
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {userList.map((user, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={user.id}
                  className={`rounded-xl px-2 py-6 text-center font-semibold text-sm ${color}`}
                >
                  {user.username}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
