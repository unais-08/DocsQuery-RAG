import { env } from "../../config/env.js";
import { GoogleGenAI } from "@google/genai";
import { logger } from "../../config/logger.js";

const apiKey = env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
            outputDimensionality: 768,
        },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
        throw new Error("Failed to generate embedding");
    }
    logger.info(`Embedding generated successfully: ${embedding.slice(0, 10)}...`);
    return embedding;
}