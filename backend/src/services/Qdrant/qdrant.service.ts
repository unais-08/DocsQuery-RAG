import { qdrantClient } from './qdrantClient.js';
import { QDRANT_COLLECTION } from './qdrant.constant.js';

export interface ChunkVector {
    id: string;
    userId: string;
    documentId: string;
    chunkIndex: number;
    embedding: number[];
}

export async function upsertChunkVectors(
    chunks: ChunkVector[],
): Promise<void> {
    if (chunks.length === 0) {
        return;
    }

    await qdrantClient.upsert(QDRANT_COLLECTION, {
        wait: true,
        points: chunks.map((chunk) => ({
            id: chunk.id,

            vector: {
                embedding: chunk.embedding,
            },

            payload: {
                userId: chunk.userId,
                documentId: chunk.documentId,
                chunkIndex: chunk.chunkIndex,
            },
        })),
    });
}