import type { NextFunction, Request, Response } from 'express';
import {
  createDocument,
  createDocumentChunks,
  deleteDocument,
  deleteDocumentChunks,
  getDocument,
  getDocumentStats,
  listDocuments,
  renameDocument,
  setDocumentStoragePath,
} from './document.service.js';
import { documentIdSchema, renameDocumentSchema, uploadDocumentFieldsSchema } from './document.schemas.js';
import { DocumentError } from './document.errors.js';
import { documentProcessingService } from '../../infrastructure/document-processing/document.processing.service.js';
import { logger } from '../../config/logger.js';
import {
  deleteChunkVectorsById,
  deleteChunkVectorsForDocument,
  upsertChunkVectors,
} from '../../infrastructure/vector-store/qdrant.service.js';
import { prisma } from '../../config/prisma.js';
import { deleteDocument as deleteSupabaseDocument, uploadDocument } from '../../infrastructure/storage/supabase.storage.service.js';
import { removeStoredFile } from './file.localdisk.storage.js';


export const upload = async (request: Request, response: Response, next: NextFunction) => {
  let createdDocumentId: string | null = null;
  let createdChunkIds: string[] = [];
  let storagePath: string | null = null;

  try {
    if (!request.file) {
      throw new DocumentError('A document file is required', 400, 'FILE_REQUIRED');
    }

    const fields = uploadDocumentFieldsSchema.parse(request.body);
    const result = await createDocument(request.userId, request.file, fields.name);
    const documentId = result.document.id;
    createdDocumentId = documentId;

    // Extract, clean, chunk, and generate embeddings for the uploaded document.
    const filePath = request.file.path;
    const processedDocument = await documentProcessingService.extractAndChunk(filePath);

    // Store chunk text in PostgreSQL; vectors are stored separately in Qdrant.
    const storedChunks = await createDocumentChunks(documentId, request.userId, processedDocument.chunks);
    createdChunkIds = storedChunks.map((chunk) => chunk.id);

    // Link each generated embedding to its corresponding database chunk.
    const chunkVectors = processedDocument.chunks.map((chunk) => {
      const storedChunk = storedChunks.find((stored) => stored.chunkIndex === chunk.index);

      if (!storedChunk) {
        throw new Error(`Missing stored chunk for index ${chunk.index}`);
      }

      return {
        id: storedChunk.id,
        chunkId: storedChunk.id,
        userId: request.userId,
        documentId,
        chunkIndex: chunk.index,
        pageNumber: chunk.pageNumber ?? null,
        embedding: chunk.embedding,
      };
    });

    // Store embeddings in Qdrant for semantic similarity search.
    await upsertChunkVectors(chunkVectors);

    storagePath = await uploadDocument(
      request.file.path,
      request.userId,
      documentId,
      request.file.originalname,
      request.file.mimetype
    );
    await setDocumentStoragePath(documentId, storagePath);
    await removeStoredFile(request.file.path);

    logger.info(
      {
        documentId: createdDocumentId,
        characterCount: processedDocument.characterCount,
        chunkCount: processedDocument.chunks.length,
        storedChunkCount: storedChunks.length,
      },
      'Document extracted, chunked, stored, and vectorized'
    );

    response.status(201).json(result);
  } catch (error) {
    // Roll back PostgreSQL, Qdrant, and file data if ingestion fails midway.
    if (createdDocumentId) {
      await deleteChunkVectorsById(createdChunkIds).catch(() => undefined);
      await deleteChunkVectorsForDocument(createdDocumentId, request.userId).catch(() => undefined);
      await deleteDocumentChunks(createdDocumentId).catch(() => undefined);
      await prisma.document.delete({ where: { id: createdDocumentId } }).catch(() => undefined);
    }

    if (storagePath) {
      await deleteSupabaseDocument(storagePath).catch(() => undefined);
    }

    next(error);
  }
};


export const list = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.status(200).json(await listDocuments(request.userId));
  } catch (error) {
    next(error);
  }
};

export const getById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.status(200).json(await getDocument(request.userId, documentIdSchema.parse(request.params.id)));
  } catch (error) {
    next(error);
  }
};

export const rename = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = documentIdSchema.parse(request.params.id);
    const { name } = renameDocumentSchema.parse(request.body);
    response.status(200).json(await renameDocument(request.userId, id, name));
  } catch (error) {
    next(error);
  }
};

export const remove = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const documentId = documentIdSchema.parse(request.params.id);

    // Remove the document's embeddings before deleting its database record.
    // This keeps Qdrant from retaining vectors that no longer have source text.
    await deleteChunkVectorsForDocument(documentId, request.userId);
    await deleteDocument(request.userId, documentId);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const stats = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.status(200).json(await getDocumentStats(request.userId));
  } catch (error) {
    next(error);
  }
};
