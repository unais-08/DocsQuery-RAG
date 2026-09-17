import { geminiClient } from "./gemini.client.js";
import { GEMINI_GENERATION_MODEL } from "./llm.constant.js";
import { buildPrompt } from "./prompt.js";

export async function generateAnswer(
    question: string,
    context: string
): Promise<string> {

    const prompt = buildPrompt(question, context);

    const response = await geminiClient.models.generateContent({
        model: GEMINI_GENERATION_MODEL,
        contents: prompt,
    });

    const answer = response.text?.trim();

    if (!answer) {
        throw new Error("LLM returned an empty response");
    }

    return answer;
}