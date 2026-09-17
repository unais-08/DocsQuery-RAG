import { geminiClient } from './gemini.client.js';
import { GEMINI_GENERATION_MODEL } from './llm.constants.js';
import { buildPrompt } from './prompt.js';
import { AiServiceError } from './llm.errors.js';
import { logger } from '../../config/logger.js';

export async function generateAnswer(question: string, context: string): Promise<string> {
	try {
		const response = await geminiClient.models.generateContent({
			model: GEMINI_GENERATION_MODEL,
			contents: buildPrompt(question, context)
		});
		const answer = response.text?.trim();
		if (!answer) throw new AiServiceError();
		return answer;
	} catch (error) {
		if (error instanceof AiServiceError) throw error;
		logger.error({ err: error, operation: 'generate-answer' }, 'AI service request failed');
		throw new AiServiceError();
	}
}
