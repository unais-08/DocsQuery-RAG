import { buildPrompt } from './prompt.js';
import { AiServiceError } from './llm.errors.js';
import { logger } from '../../config/logger.js';
import { answerModel } from './answer-model.factory.js';

export async function generateAnswer(question: string, context: string): Promise<string> {
	try {
		const answer = await answerModel.generate(buildPrompt(question, context));
		if (!answer) throw new AiServiceError();
		return answer;
	} catch (error) {
		if (error instanceof AiServiceError) throw error;
		logger.error({ err: error, operation: 'generate-answer' }, 'AI service request failed');
		throw new AiServiceError();
	}
}
