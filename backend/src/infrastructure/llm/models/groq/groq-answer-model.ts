import OpenAI from 'openai';

import { env } from '../../../../config/env.js';
import type { AnswerModel } from '../../answer-model.js';
import { GROQ_BASE_URL } from '../../llm.constants.js';


export class GroqAnswerModel implements AnswerModel {
  private readonly client: OpenAI;

  constructor() {
    if (!env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required when LLM_PROVIDER=groq');
    }

    this.client = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: GROQ_BASE_URL
    });
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.choices[0]?.message.content;
    return typeof content === 'string' ? content.trim() : '';
  }
}