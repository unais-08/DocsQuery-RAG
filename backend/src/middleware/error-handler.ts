import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { AuthError } from '../modules/auth/auth.service.js';
import { DocumentError } from '../modules/documents/document.errors.js';

export const notFoundHandler: RequestHandler = (request, response) => {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${request.method} ${request.originalUrl} not found`
    }
  });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    logger.warn('Request validation failed');
    response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.flatten().fieldErrors
      }
    });
    return;
  }

  if (error instanceof AuthError) {
    logger.warn({ code: error.code }, `Authentication failed: ${error.message}`);
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message }
    });
    return;
  }

  if (error instanceof DocumentError) {
    if (error.code === 'FILE_DELETE_FAILED') {
      logger.error({ code: error.code }, `Document delete failed: ${error.message}`);
    } else if (error.statusCode >= 500) {
      logger.error({ code: error.code }, `Document operation failed: ${error.message}`);
    } else if (error.code !== 'DOCUMENT_NOT_FOUND') {
      logger.warn({ code: error.code }, `Document upload failed: ${error.message}`);
    }
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message }
    });
    return;
  }

  logger.error({ err: error }, 'Unhandled request error');

  response.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};