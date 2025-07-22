import axios from 'axios';

export async function getDefinitionSuggestions(words: string[]): Promise<Record<string, string>> {
  const definitions: Record<string, string> = {};

  for (const word of words) {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      const definition = response.data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
      definitions[word] = definition || 'No definition found.';
    } catch (err) {
      console.error(`Failed to fetch definition for ${word}:`, err);
      definitions[word] = 'Definition unavailable.';
    }
  }

  return definitions;
}