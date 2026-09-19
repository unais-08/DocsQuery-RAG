import { geminiClient } from './gemini.client.js'; 
import type { AnswerModel } from '../../answer-model.js';
import { env } from '../../../../config/env.js';

export class GeminiAnswerModel implements AnswerModel {
  async generate(prompt: string): Promise<string> {
    const response = await geminiClient.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt
    });

    return response.text?.trim() ?? '';
  }
}