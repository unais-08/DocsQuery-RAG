import { supabase } from '../storage/supabase.client.js';

export const DEFAULT_TOP_K = 5;

const VECTOR_TABLE = 'document_chunk_embeddings';
const MATCH_FUNCTION = 'match_document_chunks';

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

type SupabaseMatchRow = {
  chunk_id: string;
  document_id: string;
  chunk_index: number;
  page_number: number | null;
  similarity: number;
};

export function createChunkVectorRecord(
  chunkId: string,
  documentId: string,
  userId: string,
  chunkIndex: number,
  embedding: number[],
  pageNumber: number | null = null
): ChunkVector {
  return { id: chunkId, chunkId, userId, documentId, chunkIndex, pageNumber, embedding };
}

export async function upsertChunkVectors(chunks: ChunkVector[]): Promise<void> {
  if (chunks.length === 0) return;

  const { error } = await supabase.from(VECTOR_TABLE).upsert(
    chunks.map((chunk) => ({
      chunk_id: chunk.chunkId,
      user_id: chunk.userId,
      document_id: chunk.documentId,
      chunk_index: chunk.chunkIndex,
      page_number: chunk.pageNumber,
      embedding: chunk.embedding
    })),
    { onConflict: 'chunk_id' }
  );

  if (error) throw error;
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

  const { data, error } = await supabase.rpc(MATCH_FUNCTION, {
    query_embedding: embedding,
    match_user_id: userId,
    match_document_ids: documentIds,
    match_count: limit
  });

  if (error) throw error;

  return (data as SupabaseMatchRow[]).map((row) => {
    if (
      !row ||
      typeof row.chunk_id !== 'string' ||
      typeof row.document_id !== 'string' ||
      typeof row.chunk_index !== 'number' ||
      (row.page_number !== null && typeof row.page_number !== 'number') ||
      typeof row.similarity !== 'number'
    ) {
      throw new Error('Unexpected Supabase vector match result');
    }

    return {
      chunkId: row.chunk_id,
      documentId: row.document_id,
      chunkIndex: row.chunk_index,
      pageNumber: row.page_number,
      score: row.similarity
    };
  });
}

export async function deleteChunkVectorsForDocument(documentId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from(VECTOR_TABLE)
    .delete()
    .eq('document_id', documentId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteChunkVectorsById(chunkIds: string[]): Promise<void> {
  if (chunkIds.length === 0) return;

  const { error } = await supabase.from(VECTOR_TABLE).delete().in('chunk_id', chunkIds);
  if (error) throw error;
}