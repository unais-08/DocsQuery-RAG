import Groq from "groq-sdk";

import { env } from '../../../../config/env.js';
import type { AnswerModel } from '../../answer-model.js';



export class GroqAnswerModel implements AnswerModel {
  private readonly client: Groq ;

  constructor() {
    if (!env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required when LLM_PROVIDER=groq');
    }

    this.client = new Groq({
      apiKey: env.GROQ_API_KEY,
      baseURL: env.GROQ_BASE_URL
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