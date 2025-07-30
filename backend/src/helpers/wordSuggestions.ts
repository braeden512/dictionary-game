import axios from 'axios';

const apiKey = process.env.WORDNIK_API_KEY;

interface WordnikSearchResult {
  word: string;
}
interface WordnikSearchResponse {
  searchResults: WordnikSearchResult[];
}
function shuffle<T>(array: T[]): T[] {
  return array.sort(() => 0.5 - Math.random());
}

export async function getWordSuggestions(count = 3): Promise<string[]> {
  try {
    const response = await axios.get<WordnikSearchResponse>('https://api.wordnik.com/v4/words.json/search/*', {
      params: {
        minCorpusCount: 1,
        maxCorpusCount: 500,
        hasDictionaryDef: true,
        minLength: 8,
        maxLength: 16,
        caseSensitive: false,
        limit: 100,
        api_key: apiKey,
      },
    });

    const words: string[] = response.data.searchResults.map((result) => result.word);

    return shuffle(words).slice(0, count);
  }
  catch (err) {
      console.error('Failed to fetch obscure words from Wordnik:', err);
      return ['obfuscate', 'quixotic', 'grandiloquent'];
  }
}
