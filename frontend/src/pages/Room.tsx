// this is the user room page

import Base from '../components/Base';
import { useParams } from 'react-router-dom';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';

function Room() {
    const { roomCode, userId } = useParams();
    const [gameStarted, setGameStarted] = useState(false);
    const [wordMasterId, setWordMasterId] = useState<string | null>(null);
    const [currentRound, setCurrentRound] = useState<number>(0);
    const [isWordMaster, setIsWordMaster] = useState(false);
    const [word, setWord] = useState('');
    const [writingDefinitions, setWritingDefinitions] = useState(false);
    const [currentWord, setCurrentWord] = useState('');

    useEffect(() => {

        socket.on('write-definitions', ({ word }) => {
            console.log('[socket] Start writing definitions for:', word);
            setCurrentWord(word);
            setWritingDefinitions(true);
        });

        socket.on('assign-word-master', ({ wordMasterId, username, round }) => {
            console.log(`[socket] Word master assigned: ${username} (ID: ${wordMasterId})`);

            setWordMasterId(wordMasterId);
            setCurrentRound(round);

            const myId = socket.id; // or from localStorage if needed
            setIsWordMaster(myId === wordMasterId);
        });

        socket.on('game-started', () => {
            setGameStarted(true);
            console.log('[socket] Game has started!');
        });

        const username = localStorage.getItem('username');
        
        const joinRoom = () => {
            if (roomCode && username) {
                socket.emit('join-room', {
                    roomCode,
                    username,
                });
                console.log('[socket] Rejoined room:', roomCode);
            }
        };

        socket.on('connect', () => {
            console.log('[socket] Connected:', socket.id);
            joinRoom();
        });

        socket.on('join-error', ({ message }) => {
            console.error(message);
            alert(message);
            window.location.href = '/';
        });

        return () => {
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            socket.emit('leave-room');
            socket.off('connect');
            socket.off('join-error');
            socket.off('game-started');
            socket.off('assign-word-master');
            socket.off('write-definitions');
        }
    }, [roomCode])

    return (
        <Base>
            {/* bug testing stuff */}
            {/* <h1> Room {roomCode}</h1>
            <p>User ID: {userId}</p> */}
            {/* if the game hasn't started */}
            {!gameStarted ? (
                <div className="flex flex-col items-center justify-center">
                    
                    <div className="mt-5 bg-white border border-gray-300 rounded-2xl shadow-lg p-6 text-center max-w-md relative dark:bg-[#353738] dark:border-[#56585a]">
                        <div className="text-6xl font-extrabold tracking-wide text-blue-500 px-6 py-4 rounded-xl dark:text-blue-600">
                            You're in!
                        </div>
                        <div className="text-md font-bold text-gray-500 px-2 py-2 rounded-xl dark:text-gray-200">
                            Waiting for the host to start the game...
                        </div>
                    </div>
                </div>
            // if the game has started
            ) : (
                 <div className="flex flex-col items-center justify-center mt-6">
                    {/* if the user is the word master */}
                    {isWordMaster ? (
                        // if the word hasn't been submitted
                        !writingDefinitions ? (
                            <div className="bg-white dark:bg-[#353738] p-6 rounded-xl shadow-md border border-gray-300 dark:border-[#56585a]">
                                <h2 className="text-xl text-center font-bold text-green-600 dark:text-green-400 mb-4">
                                    You are the Word Master!
                                </h2>
                                <input
                                    type="text"
                                    value={word}
                                    onChange={(e) => setWord(e.target.value)}
                                    placeholder="Enter your word..."
                                    className="rounded-md p-4 w-full bg-gray-200 dark:bg-[#18191a] dark:text-white"
                                />
                                <button
                                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                                    onClick={() => {
                                        socket.emit('submit-word', { roomCode, word });
                                        console.log('[socket] Word submitted:', word);
                                    }}
                                >
                                    Submit Word
                                </button>
                            </div>
                        // if the word has been submitted
                        ) : (
                            <>
                                <div className="text-md font-bold text-green-700 dark:text-green-400">
                                    Make sure to write the correct definition.
                                </div>
                                <div className="mt-6 bg-white dark:bg-[#353738] rounded-xl p-6 shadow-md w-full max-w-md text-center">
                                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        Write your definition for:
                                    </h2>
                                    <p className="text-2xl font-semibold mb-4 text-black dark:text-white">{currentWord}</p>

                                    <textarea
                                        className="w-full p-3 rounded bg-gray-200 dark:bg-[#18191a] dark:text-white"
                                        placeholder="Enter your definition..."
                                        rows={3}
                                    ></textarea>

                                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                                        Submit Definition
                                    </button>
                                </div>
                            </>
                        )
                    
                    // if the user isn't the word master
                    ) : (
                        // and the word hasn't been submitted
                        !writingDefinitions ? (
                            <div className="text-md font-semibold text-gray-700 dark:text-gray-200">
                                Waiting for the Word Master to submit a word...
                            </div>
                        // if the word has been submitted
                        ): (
                            <div className="mt-6 bg-white dark:bg-[#353738] rounded-xl p-6 shadow-md w-full max-w-md text-center">
                                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    Write your definition for:
                                </h2>
                                <p className="text-2xl font-semibold mb-4 text-black dark:text-white">{currentWord}</p>

                                <textarea
                                    className="w-full p-3 rounded bg-gray-200 dark:bg-[#18191a] dark:text-white"
                                    placeholder="Enter your definition..."
                                    rows={3}
                                ></textarea>

                                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                                    Submit Definition
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}
        </Base>
    );
}

export default Room;
