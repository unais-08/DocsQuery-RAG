import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/live', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'querydocs-api',
    timestamp: new Date().toISOString()
  });
});

healthRouter.get('/ready', (_request, response) => {
  response.status(200).json({
    status: 'ready',
    checks: {
      api: 'up'
    },
    timestamp: new Date().toISOString()
  });
});

export { healthRouter };