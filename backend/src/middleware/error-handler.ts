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
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message }
    });
    return;
  }

  if (error instanceof DocumentError) {
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