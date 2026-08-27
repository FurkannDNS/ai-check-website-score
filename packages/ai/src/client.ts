import { GoogleGenAI } from '@google/genai';

export interface GeminiConfig {
  apiKey?: string;
  model?: string;
}

export function createGeminiClient(config: GeminiConfig = {}): {
  client: GoogleGenAI;
  modelName: string;
} {
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Please provide it in your environment or pass apiKey in options.'
    );
  }

  const modelName =
    config.model ||
    process.env.GEMINI_MODEL ||
    'gemini-flash-latest';

  const client = new GoogleGenAI({ apiKey });

  return {
    client,
    modelName,
  };
}
