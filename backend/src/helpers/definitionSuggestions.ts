import { getDefinition } from './getDefinition';

export async function getDefinitionSuggestions(words: string[]): Promise<Record<string, string>> {
  const definitions: Record<string, string> = {};

  for (const word of words) {
    try {
      const definition = await getDefinition(word);
      definitions[word] = definition || 'No definition found.';
    } catch (err) {
      console.error(`Failed to fetch definition for ${word}:`, err);
      definitions[word] = 'Definition unavailable.';
    }
  }

  return definitions;
}
