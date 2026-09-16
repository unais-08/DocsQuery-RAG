import type { NextFunction, Request, Response } from 'express';
import { removeStoredFile } from './document.storage.js';
import { createDocument, deleteDocument, getDocument, getDocumentStats, listDocuments, renameDocument } from './document.service.js';
import { documentIdSchema, renameDocumentSchema, uploadDocumentFieldsSchema } from './document.validation.js';
import { DocumentError } from './document.errors.js';

export const upload = async (request: Request, response: Response, next: NextFunction) => {
  let documentCreated = false;
  try {
    if (!request.file) {
      throw new DocumentError('A document file is required', 400, 'FILE_REQUIRED');
    }
    const fields = uploadDocumentFieldsSchema.parse(request.body);
    const result = await createDocument(request.userId, request.file, fields.name);
    documentCreated = true;
    response.status(201).json(result);
  } catch (error) {
    if (request.file && !documentCreated) {
      await removeStoredFile(request.file.path);
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
