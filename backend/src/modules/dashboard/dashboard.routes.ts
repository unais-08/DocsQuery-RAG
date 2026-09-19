import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { stats } from './dashboard.controller.js';

const dashboardRouter = Router();

dashboardRouter.use(authenticate);
dashboardRouter.get('/stats', stats);

export { dashboardRouter };