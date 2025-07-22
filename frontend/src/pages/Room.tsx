import Base from '../components/Base';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import WaitingForGameStart from './roomStages/WaitingForGameStart';
import WordSubmission from './roomStages/WordSubmission';
import DefinitionWriting from './roomStages/DefinitionWriting';
import WaitingForWord from './roomStages/WaitingForWord';
import VotingStage from './roomStages/VotingStage';
import WaitingForVotes from './roomStages/WaitingForVotes';
import RoundResults from './roomStages/RoundResults';

interface DefinitionResult {
  definition: string;
  author: string;
  voteCount: number;
  isCorrect: boolean;
}
interface RoundResultsProps {
  correctIndex: number;
  playerVoteIndex: number;
  definitions: DefinitionResult[];
  isWordMaster: boolean;
}

function Room() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [isWordMaster, setIsWordMaster] = useState(false);
  const [word, setWord] = useState('');
  const [writingDefinitions, setWritingDefinitions] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [isVotingStage, setIsVotingStage] = useState(false);
  const [definitions, setDefinitions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const [roundResults, setRoundResults] = useState<RoundResultsProps | null>(null);
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const [suggestedDefinitions, setSuggestedDefinitions] = useState<Record<string, string>>({});
  const [prefilledDefinition, setPrefilledDefinition] = useState<string | null>(null);



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

    // when the user force disconnects
    const handleBeforeUnload = () => {
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      socket.off('connect');
      socket.off('join-error');
      socket.off('game-started');
      socket.off('assign-word-master');
      socket.off('write-definitions');
      socket.off('room-closed');
      socket.off('all-definitions-submitted');
      socket.off('reveal-definitions');
      socket.off('round-results');
      socket.off('definition-result');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    socket.on('game-started', () => {
      setGameStarted(true);
    });

    socket.on('assign-word-master', ({ wordMasterId, username, round }) => {
      setIsWordMaster(socket.id === wordMasterId);

      setWord('');
      setWordSubmitted(false);
      setDefinitions([]);
      setHasVoted(false);
      setWritingDefinitions(false);
      setIsVotingStage(false);
      setRoundResults(null);
    });

    socket.on('word-suggestions', ({ words, definitions }) => {
      setSuggestedWords(words);
      setSuggestedDefinitions(definitions);
    });

    if (isWordMaster) {
      socket.emit('request-word-suggestions', { roomCode });
    }

    socket.on('definition-result', ({ word, definition }) => {
      if (word === currentWord && isWordMaster && definition) {
        setPrefilledDefinition(definition);
      }
    });

    socket.on('write-definitions', ({ word }) => {
      setCurrentWord(word);
      setWritingDefinitions(true);
      setPrefilledDefinition(null); // reset while waiting
      if (isWordMaster) {
        // only the word master gets the real definition
        socket.emit('request-definition', { word });
      }
    });

    socket.on('reveal-definitions', ({ definitions }) => {
      setDefinitions(definitions); // this is a list of strings
      setIsVotingStage(true);
      setWritingDefinitions(false); // just in case
    });

    socket.on('round-results', (results) => {
      const { correctIndex, definitions, playerVotes } = results;

      const currentPlayerVote = playerVotes.find((v: any) => v.voterId === socket.id);
      const playerVoteIndex = currentPlayerVote ? currentPlayerVote.voteIndex : -1;

      setRoundResults({
        correctIndex,
        playerVoteIndex,
        definitions,
        isWordMaster
      });
      setIsVotingStage(false);
    });

    socket.on('room-closed', () => {
      alert('The game has ended.');
      socket.emit('leave-room');
      socket.removeAllListeners();
      socket.disconnect();
      navigate('/');
    });

    return () => {};
  }, [roomCode, navigate, isWordMaster, currentWord]);

  const handleWordSubmit = () => {
    socket.emit('submit-word', { roomCode, word });
    setWordSubmitted(true);
  };

  const handleDefinitionSubmit = (definition: string) => {
    socket.emit('submit-definition', { roomCode, definition });
  };

  const handleVote = (index: number) => {
    socket.emit('submit-vote', { roomCode, voteIndex: index });
    setHasVoted(true);
  };

  let content;

  if (!gameStarted) {
    content = <WaitingForGameStart />;
  } 
  else if (roundResults) {
    content = (
      <RoundResults 
        correctIndex={roundResults.correctIndex} 
        playerVoteIndex={roundResults.playerVoteIndex} 
        definitions={roundResults.definitions} 
        isWordMaster={isWordMaster}
      />
    );
  } 
  else if (isWordMaster && !wordSubmitted) {
    content = <WordSubmission 
      word={word} 
      setWord={setWord} 
      onSubmit={handleWordSubmit}
      suggestions={suggestedWords}
      suggestionDefinitions={suggestedDefinitions}
     />;
  } 
  else if (isWordMaster && isVotingStage) {
    content = <WaitingForVotes />;
  } 
  else if (writingDefinitions) {
    content = <DefinitionWriting
      currentWord={currentWord}
      onSubmit={handleDefinitionSubmit}
      isWordMaster={isWordMaster}
      prefill={prefilledDefinition}
    />;
  } 
  else if (isVotingStage) {
    content = hasVoted
      ? <WaitingForVotes />
      : <VotingStage definitions={definitions} onVote={handleVote} currentWord={currentWord} />;
  } 
  else {
    content = <WaitingForWord />;
  }

  return <Base>{content}</Base>;
}

export default Room;
