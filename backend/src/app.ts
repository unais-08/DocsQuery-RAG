import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger } from './middleware/request-logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { healthRouter } from './routes/health.routes.js';

const app = express();

app.disable('x-powered-by');
app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_request, response) => {
  response.json({
    name: 'QueryDocs API',
    version: '1.0.0',
    docs: `${env.API_PREFIX}/health/live`
  });
});

app.use(`${env.API_PREFIX}/health`, healthRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };