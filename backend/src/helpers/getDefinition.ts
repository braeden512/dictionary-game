import axios from 'axios';

const apiKey = process.env.WORDNIK_API_KEY;

export async function getDefinition(word: string): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://api.wordnik.com/v4/word.json/${word}/definitions`,
      {
        params: {
          limit: 1,
          includeRelated: false,
          useCanonical: false,
          includeTags: false,
          api_key: apiKey,
        },
      }
    );

    const definition = response.data?.[0]?.text || null;
    return definition;
  } catch (err) {
    console.warn(`No definition found for "${word}":`, err);
    return null;
  }
}