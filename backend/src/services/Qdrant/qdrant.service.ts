import { qdrantClient } from './qdrantClient.js';
import { QDRANT_COLLECTION } from './qdrant.constant.js';

export interface ChunkVector {
    id: string;

    chunkId: string;
    userId: string;
    documentId: string;
    chunkIndex: number;
    pageNumber: number | null;
    embedding: number[];
}

export interface ChunkVectorPoint {
    id: string;
    vector: number[];
    payload: {
        userId: string;
        documentId: string;
        chunkId: string;
        chunkIndex: number;
        pageNumber: number | null;
    };
}

export function buildChunkVectorPoint(chunk: ChunkVector): ChunkVectorPoint {
    return {
        id: chunk.id,
        vector: chunk.embedding,

        payload: {
            userId: chunk.userId,
            documentId: chunk.documentId,
            chunkId: chunk.chunkId,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
        },
    };
}

export function createChunkVectorRecord(
    chunkId: string,
    documentId: string,
    userId: string,
    chunkIndex: number,
    embedding: number[],
    pageNumber: number | null = null,
): ChunkVector {
    return {
        id: chunkId,
        chunkId,
        userId,
        documentId,
        chunkIndex,
        pageNumber,
        embedding,
    };
}

export async function upsertChunkVectors(
    chunks: ChunkVector[],
): Promise<void> {
    if (chunks.length === 0) {
        return;
    }

    await qdrantClient.upsert(QDRANT_COLLECTION, {
        wait: true,
        points: chunks.map(buildChunkVectorPoint),
    });
}

export async function deleteChunkVectorsForDocument(
    documentId: string,
    userId: string,
): Promise<void> {
    await qdrantClient.delete(QDRANT_COLLECTION, {
        wait: true,
        filter: {
            must: [
                { key: 'documentId', match: { value: documentId } },
                { key: 'userId', match: { value: userId } },
            ],
        },
    });
}

export async function deleteChunkVectorsById(chunkIds: string[]): Promise<void> {
    if (chunkIds.length === 0) {
        return;
    }

    await qdrantClient.delete(QDRANT_COLLECTION, {
        wait: true,
        points: chunkIds,
    });
}