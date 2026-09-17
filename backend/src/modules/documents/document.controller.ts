import type { NextFunction, Request, Response } from 'express';
import { removeStoredFile } from './document.storage.js';
import {
  createDocument,
  createDocumentChunks,
  deleteDocument,
  deleteDocumentChunks,
  getDocument,
  getDocumentStats,
  listDocuments,
  renameDocument,
} from './document.service.js';
import { documentIdSchema, renameDocumentSchema, uploadDocumentFieldsSchema } from './document.validation.js';
import { DocumentError } from './document.errors.js';
import { documentService } from '../../infrastructure/document-processing/document.service.js';
import { logger } from '../../config/logger.js';
import {
  deleteChunkVectorsById,
  deleteChunkVectorsForDocument,
  upsertChunkVectors,
} from '../../infrastructure/vector-store/qdrant.service.js';
import { prisma } from '../../config/prisma.js';


export const upload = async (request: Request, response: Response, next: NextFunction) => {
  let documentCreated = false;
  let createdDocumentId: string | null = null;
  let createdChunkIds: string[] = [];

  try {
    if (!request.file) {
      throw new DocumentError('A document file is required', 400, 'FILE_REQUIRED');
    }

    const fields = uploadDocumentFieldsSchema.parse(request.body);
    const result = await createDocument(request.userId, request.file, fields.name);
    const documentId = result.document.id;
    createdDocumentId = documentId;
    documentCreated = true;

    const filePath = request.file.path;
    const processedDocument = await documentService.extractAndChunk(filePath);
    const storedChunks = await createDocumentChunks(documentId, request.userId, processedDocument.chunks);
    createdChunkIds = storedChunks.map((chunk) => chunk.id);

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

    await upsertChunkVectors(chunkVectors);

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
    if (createdDocumentId) {
      await deleteChunkVectorsById(createdChunkIds).catch(() => undefined);
      await deleteChunkVectorsForDocument(createdDocumentId, request.userId).catch(() => undefined);
      await deleteDocumentChunks(createdDocumentId).catch(() => undefined);
      await prisma.document.delete({ where: { id: createdDocumentId } }).catch(() => undefined);
    }

    if (request.file && !documentCreated) {
      await removeStoredFile(request.file.path).catch(() => undefined);
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
    await deleteDocument(request.userId, documentIdSchema.parse(request.params.id));
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
