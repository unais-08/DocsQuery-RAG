import { logger } from "../../config/logger.js";
import { prisma } from "../../config/prisma.js";
import { generateEmbedding } from "../../services/document/embeddings/generate-embeddings.js";
import { generateAnswer } from "../../services/llm/generate-answer.js";
import {
    searchSimilarChunks,
    SimilarChunkResult,
} from "../../services/Qdrant/qdrant.service.js";
import { buildContext } from "./context-builder.js";

export interface RetrievedChunk {
    chunkId: string;
    documentId: string;
    documentName: string;
    text: string;
    chunkIndex: number;
    pageNumber: number | null;
    score: number;
}

export const getChunksForQueryResults = async (
    results: SimilarChunkResult[],
    userId: string
): Promise<RetrievedChunk[]> => {
    if (results.length === 0) {
        return [];
    }

    const chunks = await prisma.documentChunk.findMany({
        where: {
            id: { in: results.map((result) => result.chunkId) },
            document: { userId },
        },
        select: {
            id: true,
            documentId: true,
            text: true,
            chunkIndex: true,
            pageNumber: true,
            document: {
                select: {
                    name: true,
                },
            },
        },
    });

    const chunksById = new Map(chunks.map((chunk) => [chunk.id, chunk]));

    return results.flatMap((result) => {
        const chunk = chunksById.get(result.chunkId);

        if (!chunk) {
            return [];
        }

        return [{
            chunkId: chunk.id,
            documentId: chunk.documentId,
            documentName: chunk.document.name,
            text: chunk.text,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            score: result.score,
        }];
    });
};

export const queryDocuments = async (
    question: string,
    userId: string
) => {
    const questionEmbedding = await generateEmbedding(question);

    logger.debug(`now goes to searchSimilarChunks with embedding of length ${questionEmbedding.length} for userId: ${userId}`);
    const results = await searchSimilarChunks(questionEmbedding, userId);
    const retrievedChunks = await getChunksForQueryResults(results, userId);
    const context = buildContext(retrievedChunks);
    const answer = await generateAnswer(question, context);

    return {
        question,
        answer,
        // context,
        sources: retrievedChunks.map(({ chunkId, documentId, documentName, pageNumber, score }) => ({
            chunkId,
            documentId,
            documentName,
            pageNumber,
            score,
        })),
        // results: retrievedChunks,
    };
};
