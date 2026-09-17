import { logger } from "../../../config/logger.js";
import type { TextChunk } from "../chunking/text-chunker.js";
import { geminiClient as ai } from "../../llm/gemini.client.js";


export type EmbeddingGenerator = (text: string) => Promise<number[]>;

export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
            outputDimensionality: 1536,
        },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
        throw new Error("Failed to generate embedding");
    }
    logger.info(`Embedding generated successfully for text of length ${text.length}`);
    return embedding;
}

export async function createChunkEmbeddings<T extends TextChunk>(
    chunks: T[],
    embeddingGenerator: EmbeddingGenerator = generateEmbedding
): Promise<Array<T & { embedding: number[] }>> {
    const embeddedChunks: Array<T & { embedding: number[] }> = [];

    for (const chunk of chunks) {
        const embedding = await embeddingGenerator(chunk.text);
        const embeddedChunk = { ...chunk, embedding };
        embeddedChunks.push(embeddedChunk);

        logger.debug(
            {
                chunkIndex: embeddedChunk.index,
                textPreview: embeddedChunk.text.slice(0, 200),
                textLength: embeddedChunk.text.length,
                embeddingLength: embeddedChunk.embedding.length,
                embeddingSample: embeddedChunk.embedding.slice(0, 5),
            },
            "Generated embedding for chunk"
        );
    }

    logger.debug(
        {
            chunkCount: embeddedChunks.length,
            chunks: embeddedChunks.map((chunk) => ({
                index: chunk.index,
                textPreview: chunk.text.slice(0, 180),
                embeddingLength: chunk.embedding.length,
                embeddingSample: chunk.embedding.slice(0, 5),
            })),
            nextStep: "Persist each chunk as { documentId, chunkIndex, text, embedding } in a vector database for similarity search.",
        },
        "Prepared embedded chunks for vector storage"
    );

    return embeddedChunks;
}