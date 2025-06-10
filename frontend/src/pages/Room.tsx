import Base from '../components/Base';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import WaitingForGameStart from './roomStages/WaitingForGameStart';
import WordSubmission from './roomStages/WordSubmission';
import DefinitionWriting from './roomStages/DefinitionWriting';
import WaitingForWord from './roomStages/WaitingForWord';

function Room() {
  const { roomCode, userId } = useParams();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [wordMasterId, setWordMasterId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isWordMaster, setIsWordMaster] = useState(false);
  const [word, setWord] = useState('');
  const [writingDefinitions, setWritingDefinitions] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    const joinRoom = () => {
      if (roomCode && username) {
        socket.emit('join-room', { roomCode, username });
        console.log('[socket] Rejoined room:', roomCode);
      }
    };

    socket.on('connect', () => {
      console.log('[socket] Connected:', socket.id);
      joinRoom();
    });

    socket.on('join-error', ({ message }) => {
      alert(message);
      window.location.href = '/';
    });

    socket.on('game-started', () => {
      setGameStarted(true);
    });

    socket.on('assign-word-master', ({ wordMasterId, username, round }) => {
      setWordMasterId(wordMasterId);
      setCurrentRound(round);
      setIsWordMaster(socket.id === wordMasterId);
    });

    socket.on('write-definitions', ({ word }) => {
      setCurrentWord(word);
      setWritingDefinitions(true);
    });

    socket.on('room-closed', () => {
      alert('The host has ended the game.');
      socket.emit('leave-room');
      socket.removeAllListeners();
      socket.disconnect();
      navigate('/');
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
      socket.off('room-closed');
    };
  }, [roomCode, navigate]);

  const handleWordSubmit = () => {
    socket.emit('submit-word', { roomCode, word });
  };

  const handleDefinitionSubmit = (definition: string) => {
    socket.emit('submit-definition', { roomCode, definition });
  };

  let content;

  if (!gameStarted) {
    content = <WaitingForGameStart />;
  } else if (isWordMaster && !writingDefinitions) {
    content = <WordSubmission word={word} setWord={setWord} onSubmit={handleWordSubmit} />;
  } else if (writingDefinitions) {
    content = <DefinitionWriting currentWord={currentWord} onSubmit={handleDefinitionSubmit} />;
  } else {
    content = <WaitingForWord />;
  }

  return <Base>{content}</Base>;
}

export default Room;
