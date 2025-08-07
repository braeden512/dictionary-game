import axios from 'axios';

export async function getDefinition(word: string): Promise<string | null> {
  try {
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const def = res.data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
    return def || null;
  } catch (err) {
    console.warn(`No definition found for "${word}"`);
    return null;
  }
}