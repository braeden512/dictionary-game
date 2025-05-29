// This is the view of the host once creating a room


import Base from '../components/Base';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';

interface User {
    id: string;
    username: string;
}

function HostRoom() {

    const [roomCode, setRoomCode] = useState("");
    const [userList, setUserList] = useState<User[]>([]);
    const [copied, setCopied] = useState(false);
    const { id } = useParams();
    const [gameStarted, setGameStarted] = useState(false);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [wordMaster, setWordMaster] = useState<User | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [word, setWord] = useState("");

    // used for colored blocks of users
    const colors = [
        'bg-red-200 text-red-800',
        'bg-blue-200 text-blue-800',
        'bg-green-200 text-green-800',
        'bg-yellow-200 text-yellow-800',
        'bg-purple-200 text-purple-800',
        'bg-pink-200 text-pink-800',
        'bg-orange-200 text-orange-800',
        'bg-teal-200 text-teal-800',
    ];
    const tips = [
        "Share your room code with friends to start the game",
        "You can start the game once everyone joins.",
        "Each player will write a fake definition for a word.",
        "Make sure everyone is ready before starting!",
        "Try not to make your definition too easy!",
    ];

    useEffect(() => {

        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);

        }, 10000);

        const fetchRoomCode = async () => {
            const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
            const data = await response.json();
            setRoomCode(data.roomCode);

            socket.emit('join-room', {
                roomCode: data.roomCode,
                username: 'Host',
                isHost: true,
            });
        };
        fetchRoomCode();

        socket.on('join-error', ({ message }) => {
            console.error(message);
            alert(message);
            window.location.href = '/';
        });

        socket.on('game-started', () => {
            setGameStarted(true);
            console.log('[socket] Game has started!');
        });

        socket.on('room-users', (users: User[]) => {
            setUserList(users);
        })

        socket.on('assign-word-master', ({ wordMasterId, username, round }) => {
            console.log(`Round ${round}: ${username} is the word master.`);
            setWordMaster({id:wordMasterId, username})
        })

        socket.on('write-definitions', ({ word }) => {
            console.log(`[socket] Word submitted: ${word}`);
            setSubmitted(true);
            setWord(word);
        });

        return () => {
            socket.emit('leave-room');
            socket.off('join-error');
            socket.off('game-started');
            socket.off('room-users');
            socket.off('assign-word-master');
            socket.off('submit-word');
            clearInterval(interval);
        };
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        // reset after 2 seconds
        setTimeout(() => setCopied(false), 2000);
    };

    const startGame = () => {
        socket.emit('start-game', { roomCode });
        setGameStarted(true);
    };

    return (
        <Base>
            {/* if the game hasn't started */}
            {!gameStarted ? (
                <div className="flex flex-col items-center justify-center">
                
                    <div className="mt-5 bg-white border border-gray-300 rounded-2xl shadow-lg p-8 text-center max-w-md relative dark:bg-[#353738] dark:border-[#56585a]">
                        <p className="text-lg text-gray-600 mb-2 dark:text-white">Share this room code with others:</p>
                        <div className='relative'>
                            <div className="text-5xl font-extrabold tracking-widest text-blue-600 bg-blue-100 px-6 py-4 rounded-xl dark:bg-[#14181e]">
                                {roomCode}
                            </div>
                            <button
                                // call handleCopy function
                                onClick={handleCopy}
                                className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800 transition"
                                aria-label="Copy room code"
                            >
                                {/* when clicked, switch to check mark for 2 seconds, then go back */}
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                        <button
                            onClick={startGame}
                            className="mt-3 w-full bg-green-800 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-700 transition duration-200"
                        >
                            Start Game
                        </button>
                    </div>
                    <p
                        key={currentTipIndex}
                        className="text-lg text-gray-600 m-4 dark:text-white transition-opacity duration-700 ease-in-out opacity-100"
                    >
                        💡 Tip: {tips[currentTipIndex]}
                    </p>
                    {/* Connected Users */}
                    {userList.length > 0 && (
                        <div className="border border-gray-300 bg-white shadow-lg rounded-xl p-6 max-w-3xl w-full dark:bg-[#353738] dark:border-[#56585a]">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center mb-5 dark:text-white">Connected Users</h2>
                            {/* displayed in colored blocks */}
                            <div className="grid grid-cols-5 gap-2">
                                {userList.map((user, index) => {
                                    const color = colors[index % colors.length];
                                    return (
                                        <div key={user.id} className={`rounded-xl px-2 py-6 text-center font-semibold text-sm ${color}`}>
                                        {user.username}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            // if the game has started
            ) : (
                <div className="flex flex-col items-center justify-center">
                    {/* If the word hasn't been submitted yet */}
                    {!submitted ? (
                        <>
                            <p
                                key={currentTipIndex}
                                className="text-lg text-gray-600 m-4 dark:text-white transition-opacity duration-700 ease-in-out opacity-100"
                            >
                                💡 Tip: {tips[currentTipIndex]}
                            </p>
                                {wordMaster && (
                                    <div>
                                        <div className="text-5xl mt-10 font-semibold text-gray-600 px-10 py-10 rounded-xl dark:text-gray-300">
                                            <span className="font-bold">{wordMaster.username}</span> is choosing the word...
                                        </div>
                                        <div className="text-2xl text-gray-500 px-10 tracking-wide rounded-xl dark:text-gray-400 text-center">
                                            Get ready to make up a definition!
                                        </div>  
                                    </div>  
                            )}
                        </>
                    ) : (
                        // When the word is submitted
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
                    )}
                </div>
            )}
        </Base>
    );
}

export default HostRoom;