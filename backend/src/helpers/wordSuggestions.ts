import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';

interface WordEntry {
  word: string;
}

const WORD_LIST_PATH = path.join(__dirname, 'data', 'words.json');

function getRandomWords(count: number): string[] {
  const raw = fs.readFileSync(WORD_LIST_PATH, 'utf-8');
  const allWords: WordEntry[] = JSON.parse(raw);
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((entry) => entry.word);
}

export function setupWordSuggestions(io: Server) {
  io.on('connection', (socket) => {
    socket.on('request-word-suggestions', async ({ roomCode }) => {
      const words = getRandomWords(3);

      socket.emit('word-suggestions', {
        words
      });
    });
  });
}
