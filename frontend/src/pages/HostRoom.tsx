// This is the view of the host once creating a room


import Base from '../components/Base';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LobbyStage from './hostStages/LobbyStage';
import ChoosingWordStage from './hostStages/ChoosingWordStage';
import WordRevealedStage from './hostStages/WordRevealedStage';
import DisplayDefinitions from './hostStages/DisplayDefinitions';
import tips from '../data/tips.json';
import HostRoundResults from './hostStages/HostRoundResults';

interface DefinitionResult {
  definition: string;
  author: string;
  voteCount: number;
  isCorrect: boolean;
}
interface RoundResultsData {
  correctIndex: number;
  definitions: DefinitionResult[];
  playerVotes: {
    voterId: string;
    voteIndex: number;
    correct: boolean;
  }[];
}

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
    const [definitions, setDefinitions] = useState<string[]>([]);
    const [showDefinitions, setShowDefinitions] = useState(false);
    const [votesReceived, setVotesReceived] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [roundResults, setRoundResults] = useState<RoundResultsData | null>(null);

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
            setTotalPlayers(users.length - 1);
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

        socket.on('reveal-definitions', ({ definitions }) => {
            setDefinitions(definitions);
            setShowDefinitions(true);
        });

        socket.on('vote-submitted', () => {
            setVotesReceived((prev) => prev + 1);
        });

        socket.on('round-results', (results) => {
            console.log('[socket] Host received round results:', results);
            setShowDefinitions(false);
            setRoundResults(results);
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
    }, [id, navigate]);

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
            ) : roundResults ? (
                <HostRoundResults
                    results={roundResults}
                />
            ) : showDefinitions ? (
                <DisplayDefinitions
                    definitions={definitions}
                    currentWord={word}
                    votesReceived={votesReceived}
                    totalPlayers={totalPlayers}
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
                    <WordRevealedStage word={word}/>
                )}
                </div>
            )}
            </Base>
    );
}

export default HostRoom;