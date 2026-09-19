import { env } from '../../config/env.js';
import type { AnswerModel } from './answer-model.js';
import { GeminiAnswerModel } from './models/gemini/gemini-answer-model.js';
import { GroqAnswerModel } from './models/groq/groq-answer-model.js';

export function createAnswerModel(): AnswerModel {
  switch (env.LLM_PROVIDER) {
    case 'gemini':
      return new GeminiAnswerModel();
    case 'groq':
      return new GroqAnswerModel();

    default:
      throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
  }
}

export const answerModel = createAnswerModel();