import OpenAI from 'openai';

import { env } from '../../../../config/env.js';
import type { AnswerModel } from '../../answer-model.js';

export class OpenAiAnswerModel implements AnswerModel {
  private readonly client: OpenAI;

  constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required when LLM_PROVIDER=openai');
    }

    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.choices[0]?.message.content;
    return typeof content === 'string' ? content.trim() : '';
  }
}
