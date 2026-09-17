import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/live', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'querydocs-api',
    checks: {
      api: 'up'
    },
    timestamp: new Date().toISOString()
  });
});

export { healthRouter };