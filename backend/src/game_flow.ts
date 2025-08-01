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
    shuffledDefinitions?: { userId: string; definition: string; originalIndex: number }[];
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

    // reset for the next round
    game.submittedWord = undefined;
    game.definitions = [];
    game.votes = [];
    // emit new-round so host gets reset
    io.to(roomCode).emit("new-round");

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

    const allSubmitted = game.players.every(p =>
        game.definitions.some(d => d.userId === p.id)
    );

    if (allSubmitted) {
        console.log(`[Game] All definitions submitted for room ${roomCode}`);

        io.to(roomCode).emit("all-definitions-submitted");

        // Fisher-Yates shuffle
        const originalWithIndex = game.definitions.map((def, i) => ({ ...def, originalIndex: i }));
        for (let i = originalWithIndex.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [originalWithIndex[i], originalWithIndex[j]] = [originalWithIndex[j], originalWithIndex[i]];
        }
        const shuffledWithIndex = originalWithIndex;

        game.shuffledDefinitions = shuffledWithIndex;

        io.to(roomCode).emit("reveal-definitions", {
            definitions: shuffledWithIndex.map(d => d.definition),
        });
    }
}

export function submitVote(roomCode: string, voterId: string, voteIndex: number, io: Server) {
    const game = gameStates[roomCode];
    if (!game || !game.shuffledDefinitions) return;

    if (!game.votes) {
        game.votes = [];
    }

    if (game.votes.find(v => v.voterId === voterId)) return;

    const originalIndex = game.shuffledDefinitions[voteIndex]?.originalIndex;
    if (originalIndex === undefined) return;

    game.votes.push({ voterId, voteIndex: originalIndex });

    io.to(roomCode).emit("vote-submitted", { voterId, voteIndex });

    const wordMaster = game.players[game.currentWordMasterIndex];
    const nonMasters = game.players.filter(p => p.id !== wordMaster.id);

    if (game.votes.length >= nonMasters.length) {
        io.to(roomCode).emit("all-votes-submitted");

        const correctOriginalIndex = game.definitions.findIndex(d => d.userId === wordMaster.id);

        const results = game.shuffledDefinitions.map((def, index) => {
            const author = game.players.find(p => p.id === def.userId);
            const voteCount = game.votes!.filter(v => v.voteIndex === def.originalIndex).length;

            return {
                definition: def.definition,
                author: author?.username ?? "Unknown",
                voteCount,
                isCorrect: def.originalIndex === correctOriginalIndex,
            };
        });

        const playerVotes = game.votes.map(vote => {
            const shuffledIndex = game.shuffledDefinitions!.findIndex(
                d => d.originalIndex === vote.voteIndex
            );

            return {
                voterId: vote.voterId,
                voteIndex: shuffledIndex,
                correct: vote.voteIndex === correctOriginalIndex,
            };
        });

        const correctShuffledIndex = game.shuffledDefinitions.findIndex(
            d => d.originalIndex === correctOriginalIndex
        );

        io.to(roomCode).emit("round-results", {
            correctIndex: correctShuffledIndex,
            definitions: results,
            playerVotes,
        });
    }
}

export function getGameState(roomCode: string): GameState | undefined {
    return gameStates[roomCode];
}

export function removeGame(roomCode: string) {
    delete gameStates[roomCode];
}