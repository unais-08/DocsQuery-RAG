import { env } from '../../../../config/env.js';
import type { AnswerModel } from '../../answer-model.js';

interface OllamaChatResponse {
    message?: {
        content?: string;
    };
}

export class OllamaAnswerModel implements AnswerModel {
    async generate(prompt: string): Promise<string> {
        // 1. Add a timeout (e.g., 60 seconds) so your app doesn't hang forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        try {
            const response = await fetch(`${env.OLLAMA_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    model: env.OLLAMA_MODEL,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                }),
            });

            // 2. Read text first to handle both valid JSON and string errors safely
            const responseText = await response.text();

            if (!response.ok) {
                // Try to show Ollama's specific error message if available
                throw new Error(`Ollama failed (${response.status}): ${responseText || response.statusText}`);
            }

            const result = JSON.parse(responseText) as OllamaChatResponse;
            return result.message?.content?.trim() ?? '';

        } catch (error) {
            // Handle abort/timeout errors specifically if needed
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Ollama request timed out.');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
