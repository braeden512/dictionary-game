import Base from '../components/Base';

function About() {
  return (
    <Base>
      <div className="flex flex-col items-center mt-8">
        <img src="/logo512.png" alt="Logo" className="w-24 h-24 m-4" />
        <h1 className="text-3xl font-bold text-center dark:text-white">Dictionary Game</h1>
        <p className="text-center text-gray-600 mt-2 dark:text-gray-500">Made by Braeden Treutel</p>
        <p className="text-center text-gray-900 mt-6 dark:text-gray-200">
          Dictionary Game is an easier way to play the game online and without paper,
          allowing users to host and join rooms.
        </p>
      </div>

      {/* Two-column layout for instructions */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-16 mt-20 px-4">
        {/* Host Section */}
        <div className="flex-1 max-w-md">
          <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Host a room:</p>
          <ul className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-200">
            <li>Create a room and share the room code with your friends.</li>
            <li>Stream your screen to a TV or large projector in front of everyone.</li>
            <li>Start the game and play Dictionary with your friends!</li>
          </ul>
        </div>

        {/* Join Section */}
        <div className="flex-1 max-w-md">
          <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Join a room:</p>
          <ul className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-200">
            <li>Enter the room code seen on the host screen.</li>
            <li>Join the lobby and wait for the host to start the game.</li>
            <li>Once the game has begun, enter your words and definitions as instructed.</li>
          </ul>
        </div>
      </div>
    </Base>
  );
}

export default About;