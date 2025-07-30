import axios from 'axios';

const apiKey = process.env.WORDNIK_API_KEY;

export async function getWordSuggestions(count = 3): Promise<string[]> {
  try {
    const response = await axios.get('https://api.wordnik.com/v4/words.json/randomWords', {
      params: {
        hasDictionaryDef: true,
        minLength: 8,
        maxLength: 16,
        limit: count,
        api_key: apiKey,
      }
    });

    const words: string[] = response.data.map((entry: any) => entry.word);
    return words;
  } catch (err) {
    console.error('Failed to fetch random words from Wordnik:', err);
    return ['obfuscate', 'quixotic', 'grandiloquent']; // fallback
  }
}