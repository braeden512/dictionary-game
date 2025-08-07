import fs from 'fs';
import path from 'path';

let wordList: string[] = [];

function loadWords() {
  if (wordList.length === 0) {
    const filePath = path.join(__dirname, '..', 'data', 'words.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    wordList = JSON.parse(data);
  }
}

export function getWordSuggestions(n: number): string[] {
  loadWords();

  const shuffled = [...wordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
