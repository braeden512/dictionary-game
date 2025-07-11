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
    const [round, setRound] = useState<number>(1);

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

        // force disconnect
        const handleBeforeUnload = () => {
            socket.emit('leave-room');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

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
            setWordMaster({id:wordMasterId, username});
            setRound(round);
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

        socket.on('new-round', () => {
            setRoundResults(null);
            setSubmitted(false);
            setShowDefinitions(false);
            setVotesReceived(0);
            setDefinitions([]);
            setWord("");
        });

        return () => {
            socket.off('join-error');
            socket.off('game-started');
            socket.off('room-users');
            socket.off('assign-word-master');
            socket.off('submit-word');
            socket.off('not-enough-players');
            socket.off('write-definitions');
            socket.off('reveal-definitions');
            socket.off('vote-submitted');
            socket.off('round-results');
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
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

    // rendering
    let content;

    if (!gameStarted) {
    content = (
        <LobbyStage
        roomCode={roomCode}
        userList={userList}
        copied={copied}
        handleCopy={handleCopy}
        startGame={startGame}
        currentTip={tips[currentTipIndex]}
        />
    );
    } else if (roundResults) {
        content = (
            <HostRoundResults
            results={roundResults}
            roomCode={roomCode}
            round={round}
            />
    );
    } else if (showDefinitions) {
        content = (
            <DisplayDefinitions
            definitions={definitions}
            currentWord={word}
            votesReceived={votesReceived}
            totalPlayers={totalPlayers}
            round={round}
            />
    );
    } else if (!submitted && wordMaster) {
        content = (
            <ChoosingWordStage
            wordMaster={wordMaster}
            currentTip={tips[currentTipIndex]}
            round={round}
            />
    );
    } else {
        content = (
            <WordRevealedStage 
            word={word}
            round={round}
            />
        );
    }

    return <Base>{content}</Base>;
}

export default HostRoom;