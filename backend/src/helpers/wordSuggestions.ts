import axios from 'axios';

const apiKey = process.env.WORDNIK_API_KEY;

// Utility to shuffle an array
function shuffle<T>(array: T[]): T[] {
  return array.sort(() => 0.5 - Math.random());
}

export async function getWordSuggestions(count = 3): Promise<string[]> {
  try {
    const batchSize = 30; // pull more to filter from
    const response = await axios.get('https://api.wordnik.com/v4/words.json/randomWords', {
      params: {
        hasDictionaryDef: true,
        minCorpusCount: 100,         // lower value = rarer
        maxCorpusCount: 10000,       // upper bound to avoid too obscure
        minLength: 8,
        maxLength: 16,
        limit: batchSize,
        api_key: apiKey,
      }
    });

    let words: string[] = response.data.map((entry: any) => entry.word);

    // Shuffle to remove alphabetical bias
    const shuffled = shuffle(words);

    return shuffled.slice(0, count);
  } catch (err) {
    console.error('Failed to fetch random words from Wordnik:', err);
    return ['obfuscate', 'quixotic', 'grandiloquent']; // fallback
  }
}
