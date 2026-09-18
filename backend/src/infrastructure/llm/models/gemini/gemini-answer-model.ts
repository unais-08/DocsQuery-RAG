import { GEMINI_GENERATION_MODEL } from '../../llm.constants.js';
import { geminiClient } from './gemini.client.js'; 
import type { AnswerModel } from '../../answer-model.js';

export class GeminiAnswerModel implements AnswerModel {
  async generate(prompt: string): Promise<string> {
    const response = await geminiClient.models.generateContent({
      model: GEMINI_GENERATION_MODEL,
      contents: prompt
    });

    return response.text?.trim() ?? '';
  }
}