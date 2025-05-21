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
}

const gameStates: Record<string, GameState> = {};

export function initializeGame(roomCode: string, players: Player[], io: Server) {
    gameStates[roomCode] = {
        roomCode,
        players,
        round: 1,
        currentWordMasterIndex: 0,
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

    console.log(`[Game] Word submitted for room ${roomCode}: ${word}`);

    io.to(roomCode).emit("write-definitions", {
        word: word,
        round: game.round,
    })

}

export function getGameState(roomCode: string): GameState | undefined {
    return gameStates[roomCode];
}

export function removeGame(roomCode: string) {
    delete gameStates[roomCode];
}