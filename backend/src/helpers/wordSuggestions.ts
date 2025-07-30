import axios from 'axios';

const apiKey = process.env.WORDNIK_API_KEY;

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => 0.5 - Math.random());
}

function isValidWord(word: string, blacklist: Set<string>, disallowedInitials: Set<string>): boolean {
  const lower = word.toLowerCase();
  return (
    /^[a-zA-Z]+$/.test(word) &&
    !blacklist.has(lower) &&
    !disallowedInitials.has(lower[0])
  );
}

export async function getWordSuggestions(count = 3): Promise<string[]> {
  const blacklist = new Set(['anticipation', 'apparition', 'education', 'reaction']);
  const usedInitials = new Set<string>();
  const suggestions: Set<string> = new Set();

  let attempts = 0;
  const maxAttempts = 50;

  while (suggestions.size < count && attempts < maxAttempts) {
    attempts++;

    try {
      const res = await axios.get('https://api.wordnik.com/v4/words.json/randomWord', {
        params: {
          hasDictionaryDef: true,
          minCorpusCount: 1,
          maxCorpusCount: 300,
          minLength: 8,
          maxLength: 16,
          api_key: apiKey,
        },
      });

      const word: string = res.data.word;

      if (
        isValidWord(word, blacklist, usedInitials)
      ) {
        suggestions.add(word);
        usedInitials.add(word[0].toLowerCase());
      }
    } catch (err) {
      console.warn('Failed to fetch a word:', err);
    }
  }

  return Array.from(suggestions);
}
