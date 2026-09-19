import { qdrantClient } from './qdrant.client.js';
import { QDRANT_COLLECTION } from './qdrant.constants.js';

export const DEFAULT_TOP_K = 5;

export interface SimilarChunkResult {
  chunkId: string;
  documentId: string;
  chunkIndex: number;
  pageNumber: number | null;
  score: number;
}

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
  // Qdrant stores the embedding as the vector and metadata as the payload.

  return {
    id: chunk.id,
    vector: chunk.embedding,
    payload: {
      userId: chunk.userId,
      documentId: chunk.documentId,
      chunkId: chunk.chunkId,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber
    }
  };
}

export function createChunkVectorRecord(chunkId: string, documentId: string, userId: string, chunkIndex: number, embedding: number[], pageNumber: number | null = null): ChunkVector {
  // Keep the same chunk ID in Postgres and Qdrant so the vector can be linked back to its text.

  return { id: chunkId, chunkId, userId, documentId, chunkIndex, pageNumber, embedding };
}

export async function upsertChunkVectors(chunks: ChunkVector[]): Promise<void> {
  if (chunks.length === 0) return;

  // Store embeddings in Qdrant for fast semantic similarity search.
  await qdrantClient.upsert(QDRANT_COLLECTION, {
    wait: true,
    points: chunks.map(buildChunkVectorPoint)
  });
}

export async function searchSimilarChunks(
  embedding: number[],
  userId: string,
  documentIds: string[],
  limit = DEFAULT_TOP_K
): Promise<SimilarChunkResult[]> {
  if (embedding.length === 0 || embedding.some((value) => !Number.isFinite(value))) throw new Error('Invalid query embedding');

  if (!Number.isInteger(limit) || limit <= 0) throw new RangeError('Search limit must be a positive integer');
  if (documentIds.length === 0) throw new RangeError('At least one document is required');

  // Restrict search to the authenticated user's vectors to prevent cross-user data access.
  const response = await qdrantClient.query(QDRANT_COLLECTION, {
    query: embedding,
    limit,
    filter: {
      must: [
        { key: 'userId', match: { value: userId } },
        { key: 'documentId', match: { any: documentIds } }
      ]
    },
    with_payload: true
  });

  return response.points.map((point) => {
    const payload = point.payload;

    // Validate Qdrant data before using it in the application.
    if (!payload || typeof payload !== 'object' || typeof payload.chunkId !== 'string' || typeof payload.documentId !== 'string' || typeof payload.chunkIndex !== 'number' || (payload.pageNumber !== null && typeof payload.pageNumber !== 'number')) throw new Error('Unexpected Qdrant chunk payload');

    return { chunkId: payload.chunkId, documentId: payload.documentId, chunkIndex: payload.chunkIndex, pageNumber: payload.pageNumber, score: point.score };
  });
}

export async function deleteChunkVectorsForDocument(documentId: string, userId: string): Promise<void> {
  // Delete only vectors belonging to this user's document.
  await qdrantClient.delete(QDRANT_COLLECTION, {
    wait: true,
    filter: { must: [{ key: 'documentId', match: { value: documentId } }, { key: 'userId', match: { value: userId } }] }
  });
}

export async function deleteChunkVectorsById(chunkIds: string[]): Promise<void> {
  if (chunkIds.length === 0) return;

  // Used during rollback when only specific newly-created vectors need removal.
  await qdrantClient.delete(QDRANT_COLLECTION, { wait: true, points: chunkIds });
}
