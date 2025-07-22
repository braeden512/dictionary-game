import axios from 'axios';

export async function getWordSuggestions(count = 3): Promise<string[]> {
  try {
    const response = await axios.get('https://api.datamuse.com/words', {
      params: {
        max: 100,          // get up to 30 words to sample from
        sp: '????????*',   // words with at least 7 characters
        topics: 'philosophy,science,esoteric,obscure,linguistics' // optional: make words more academic
      }
    });

    const words: string[] = response.data
      .map((entry: any) => entry.word)
      .filter((word: string) => /^[a-zA-Z]+$/.test(word)); // no symbols/numbers

    // Shuffle and return a few
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (err) {
    console.error('Failed to fetch suggestions from Datamuse:', err);
    return ['obfuscate', 'quixotic', 'grandiloquent']; // fallback
  }
}
