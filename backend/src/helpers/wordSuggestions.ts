import axios from 'axios';

const apiKey = process.env.WORDNIK_API_KEY;

interface WordnikSearchResult {
  word: string;
}

interface WordnikDefinition {
  text: string;
}

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => 0.5 - Math.random());
}

function isSingleWordAlpha(word: string): boolean {
  return /^[a-zA-Z]+$/.test(word) && !word.includes('-');
}

function hasUniqueInitial(word: string, initials: Set<string>): boolean {
  const firstLetter = word[0].toLowerCase();
  return !initials.has(firstLetter);
}

async function fetchObscureCandidates(): Promise<string[]> {
  const res = await axios.get('https://api.wordnik.com/v4/words.json/search/*', {
    params: {
      caseSensitive: false,
      minCorpusCount: 1,
      maxCorpusCount: 500,
      minLength: 8,
      maxLength: 20,
      skip: 0,
      limit: 100,
      api_key: apiKey,
    },
  });

  const results = res.data.searchResults as { word: string }[];
  return results.map((r) => r.word).filter(isSingleWordAlpha);
}

async function hasDefinition(word: string): Promise<boolean> {
  try {
    const res = await axios.get(
      `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/definitions`,
      {
        params: {
          limit: 1,
          includeRelated: false,
          sourceDictionaries: 'all',
          useCanonical: false,
          api_key: apiKey,
        },
      }
    );

    return Array.isArray(res.data) && res.data.length > 0;
  } catch {
    return false;
  }
}

export async function getObscureWords(count = 3): Promise<string[]> {
  const candidates = await fetchObscureCandidates();
  const shuffled = shuffle(candidates);

  const result: string[] = [];
  const usedInitials = new Set<string>();

  for (const word of shuffled) {
    if (result.length >= count) break;

    if (!hasUniqueInitial(word, usedInitials)) continue;

    const hasDef = await hasDefinition(word);
    if (!hasDef) continue;

    usedInitials.add(word[0].toLowerCase());
    result.push(word);
  }

  return result;
}