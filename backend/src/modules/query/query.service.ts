import { generateEmbedding } from "../../services/document/embeddings/generate-embeddings.js";

export const generateQuestionEmbedding = async (
    question: string,
    _userId: string
) => {
    const questionEmbedding = await generateEmbedding(question);
    console.log("Question embedding generated:", questionEmbedding);
    return {
        question,
        embeddingDimensions: questionEmbedding.length,
    };
};
