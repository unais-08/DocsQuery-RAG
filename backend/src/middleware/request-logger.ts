import { pinoHttp } from 'pino-http';
import { logger } from '../config/logger.js';

export const requestLogger = pinoHttp({
  logger,
  serializers: {
    req: () => undefined,
    res: () => undefined
  },
  customLogLevel: (_request, response, error) => {
    if (error || response.statusCode >= 500) return 'error';
    if (response.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (request, response, responseTime) =>
    `${request.method} ${request.url} -> ${response.statusCode} (${Math.round(responseTime)}ms)`,
  customErrorMessage: (request, response) =>
    `${request.method} ${request.url} -> ${response.statusCode}`
});