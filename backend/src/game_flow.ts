import { Server } from "socket.io";

interface Player {
    id: string;
    username: string;
}

interface GameState {
    roomCode: string;
    players: Player[];
    round: number;
    currentWordMasterIndex: number;
    submittedWord?: string;
    definitions: { userId: string; definition: string }[];
    votes?: { voterId: string; voteIndex: number }[];
}

const gameStates: Record<string, GameState> = {};

export function initializeGame(roomCode: string, players: Player[], io: Server) {
    gameStates[roomCode] = {
        roomCode,
        players,
        round: 1,
        currentWordMasterIndex: 0,
        definitions: [],
    };

    assignWordMaster(roomCode, io);
}

export function assignWordMaster(roomCode: string, io: Server) {
    const game = gameStates[roomCode];
    if (!game) return;

    const master = game.players[game.currentWordMasterIndex];

    io.to(roomCode).emit("assign-word-master", {
        wordMasterId: master.id,
        username: master.username,
        round: game.round,
    });

    console.log(`[Game] Round ${game.round}: ${master.username} is the word master.`);
}

export function nextRound(roomCode: string, io: Server) {
    const game = gameStates[roomCode];
    if (!game) return;

    game.round += 1;
    game.currentWordMasterIndex =
        (game.currentWordMasterIndex + 1) % game.players.length;

    assignWordMaster(roomCode, io);
}

export function acceptWord(roomCode: string, word: string, io: Server) {
    const game = gameStates[roomCode];
    if (!game) return;

    game.submittedWord = word;
    game.definitions = [];

    console.log(`[Game] Word submitted for room ${roomCode}: ${word}`);

    io.to(roomCode).emit("write-definitions", {
        word: word,
        round: game.round,
    })

}

export function submitDefinition(roomCode: string, userId: string, definition: string, io: Server) {
    const game = gameStates[roomCode];
    if (!game) return;

    // Avoid duplicates
    if (game.definitions.find(d => d.userId === userId)) return;

    game.definitions.push({ userId, definition });

    const wordMaster = game.players[game.currentWordMasterIndex];
    const nonMasters = game.players.filter(p => p.id !== wordMaster.id);

    const allSubmitted = nonMasters.every(p =>
        game.definitions.some(d => d.userId === p.id)
    );

    if (allSubmitted) {
        console.log(`[Game] All definitions submitted for room ${roomCode}`);

        io.to(roomCode).emit("all-definitions-submitted");

        // Shuffle before sending to ensure randomness
        const shuffled = [...game.definitions].sort(() => Math.random() - 0.5);

        io.to(roomCode).emit("reveal-definitions", {
            definitions: shuffled.map(d => d.definition),
        });
    }
}

export function submitVote(roomCode: string, voterId: string, voteIndex: number, io: Server) {
  const game = gameStates[roomCode];
  if (!game) return;

  if (!game.votes) {
    game.votes = [];
  }

  // Prevent duplicate votes
  if (game.votes.find(v => v.voterId === voterId)) return;

  game.votes!.push({ voterId, voteIndex });

  io.to(roomCode).emit("vote-submitted", { voterId, voteIndex });

  const nonMasters = game.players.filter(p => p.id !== game.players[game.currentWordMasterIndex].id);
  if (game.votes!.length >= nonMasters.length) {
    io.to(roomCode).emit("all-votes-submitted");
  }
}

export function getGameState(roomCode: string): GameState | undefined {
    return gameStates[roomCode];
}

export function removeGame(roomCode: string) {
    delete gameStates[roomCode];
}