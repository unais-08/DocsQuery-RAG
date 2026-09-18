import { env } from '../../config/env.js';
import type { AnswerModel } from './answer-model.js';
import { GeminiAnswerModel } from './models/gemini/gemini-answer-model.js';
import { OllamaAnswerModel } from './models/ollama/ollama-answer-model.js';
import { OpenAiAnswerModel } from './models/openai/openai-answer-model.js';

export function createAnswerModel(): AnswerModel {
  switch (env.LLM_PROVIDER) {
    case 'gemini':
      return new GeminiAnswerModel();
    case 'openai':
      return new OpenAiAnswerModel();
    case 'ollama':
      return new OllamaAnswerModel();
    default:
      throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
  }
}

export const answerModel = createAnswerModel();