import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { create, getById, list, remove, rename } from './conversation.controller.js';

const conversationRouter = Router();
conversationRouter.use(authenticate);
conversationRouter.post('/', create);
conversationRouter.get('/', list);
conversationRouter.get('/:id', getById);
conversationRouter.patch('/:id', rename);
conversationRouter.delete('/:id', remove);

export { conversationRouter };
