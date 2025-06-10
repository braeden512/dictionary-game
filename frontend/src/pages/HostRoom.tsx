// This is the view of the host once creating a room


import Base from '../components/Base';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LobbyStage from '../components/hostRoom/LobbyStage';
import ChoosingWordStage from '../components/hostRoom/ChoosingWordStage';
import WordRevealedStage from '../components/hostRoom/WordRevealedStage';

interface User {
    id: string;
    username: string;
}

function HostRoom() {
    const navigate = useNavigate();

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
        "You must have three or more players to start the game.",
    ];

    useEffect(() => {

        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);

        }, 10000);

        const fetchRoomCode = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
                // throw an error if the response isn't recieved
                if (!response.ok) {
                    throw new Error(`Room not found. Status: ${response.status}`);
                }
                const data = await response.json();
                setRoomCode(data.roomCode);

                socket.emit('join-room', {
                    roomCode: data.roomCode,
                    username: 'Host',
                    isHost: true,
                });
            }
            catch (err) {
                console.error('Could not fetch room code, returning to home.', err);
                navigate(`/`);
            }
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

        socket.on('not-enough-players', ({message}) => {
            alert(message);
            setGameStarted(false);
        })

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
            socket.off('not-enough-players');
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
    };

    return (
        <Base>
            {!gameStarted ? (
            <LobbyStage
                roomCode={roomCode}
                userList={userList}
                copied={copied}
                handleCopy={handleCopy}
                startGame={startGame}
                currentTip={tips[currentTipIndex]}
            />
            ) : (
            <div className="flex flex-col items-center justify-center">
                {!submitted ? (
                wordMaster && (
                    <ChoosingWordStage
                    wordMaster={wordMaster}
                    currentTip={tips[currentTipIndex]}
                    />
                )
                ) : (
                <WordRevealedStage word={word} />
                )}
            </div>
            )}
        </Base>
    );
}

export default HostRoom;