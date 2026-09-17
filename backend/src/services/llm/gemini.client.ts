import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";

const apiKey = env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
}

export const geminiClient = new GoogleGenAI({
    apiKey,
});