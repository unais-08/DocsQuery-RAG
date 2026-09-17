export class AiServiceError extends Error {
    constructor(
        message = 'The AI LLM service is temporarily unavailable. Please try again later.'
    ) {
        super(message);
        this.name = 'AiServiceError';
    }
}