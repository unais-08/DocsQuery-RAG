import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';

if (!env.GEMINI_API_KEY) {
	throw new Error('GEMINI_API_KEY is not configured');
}

export const geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
