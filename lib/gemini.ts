
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('API_KEY environment variable not set.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

// Simple in-memory cache to avoid re-validating the same words
const wordValidationCache = new Map<string, boolean>();

export const isValidWord = async (word: string): Promise<boolean> => {
  if (word.length < 3) return false;
  const upperCaseWord = word.toUpperCase();

  if (wordValidationCache.has(upperCaseWord)) {
    return wordValidationCache.get(upperCaseWord) as boolean;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            role: 'user',
            parts: [{ text: `Is "${upperCaseWord}" a valid English word? Respond with only "yes" or "no".` }]
        },
        config: {
            temperature: 0,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    
    const result = response.text.trim().toLowerCase() === 'yes';
    wordValidationCache.set(upperCaseWord, result);
    return result;
  } catch (error) {
    console.error('Error validating word with Gemini API:', error);
    // Fail gracefully: assume it's not a word if API fails
    wordValidationCache.set(upperCaseWord, false);
    return false;
  }
};
