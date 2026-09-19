import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';

import { requestLogger } from './middleware/request-logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

import { authRouter } from './modules/auth/auth.routes.js';
import { documentRouter } from './modules/documents/document.routes.js';
import { queryRouter } from './modules/query/query.routes.js';
import { healthRouter } from './modules/health/health.routes.js'; 
import { conversationRouter } from './modules/conversations/conversation.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';

const app = express();

const corsConfig = {
  origin: env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.disable('x-powered-by');
app.use(requestLogger);
app.use(helmet());
app.use(cors(corsConfig));
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
app.use(`${env.API_PREFIX}/auth`, authRouter);
app.use(`${env.API_PREFIX}/documents`, documentRouter);
app.use(`${env.API_PREFIX}/query`, queryRouter);
app.use(`${env.API_PREFIX}/conversations`, conversationRouter);
app.use(`${env.API_PREFIX}/dashboard`, dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };