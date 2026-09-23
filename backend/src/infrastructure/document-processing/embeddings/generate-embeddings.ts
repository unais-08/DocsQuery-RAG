import { logger } from '../../../config/logger.js';
import type { TextChunk } from '../chunking/text-chunker.js';
import { geminiClient } from '../../llm/models/gemini/gemini.client.js';
import { AiServiceError } from '../../llm/llm.errors.js';

export type EmbeddingGenerator = (text: string) => Promise<number[]>;

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Convert text into a 1536-dimensional vector for semantic search in Supabase pgvector.
    const response = await geminiClient.models.embedContent({ model: 'gemini-embedding-2', contents: text, config: { outputDimensionality: 1536 } });
    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) throw new AiServiceError();

    return embedding;
  } catch (error) {
    if (error instanceof AiServiceError) throw error;
    logger.error({ err: error, operation: 'generate-embedding' }, 'AI service request failed');
    throw new AiServiceError();
  }
}

export async function createChunkEmbeddings<T extends TextChunk>(chunks: T[], embeddingGenerator: EmbeddingGenerator = generateEmbedding): Promise<Array<T & { embedding: number[] }>> {

  logger.debug('Embedding Generation for chunks Started');

  const embeddedChunks: Array<T & { embedding: number[] }> = [];
  for (const chunk of chunks) {
    try {
      // Generate an embedding from the chunk text while preserving its metadata.
      const embeddedChunk = { ...chunk, embedding: await embeddingGenerator(chunk.text) };
      embeddedChunks.push(embeddedChunk);
    } catch (error) {
      logger.error({ err: error, chunkIndex: chunk.index }, 'Failed to generate embedding for chunk');
      if (error instanceof AiServiceError) throw error;
      throw new AiServiceError();
    }
  }
  logger.debug('Embedding Generation for chunks Completed');

  return embeddedChunks;
}
