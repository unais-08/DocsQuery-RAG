import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { handleDocumentUpload } from '../../middleware/document-upload.js';
import { getById, list, remove, rename, stats, upload } from './document.controller.js';

const documentRouter = Router();

documentRouter.use(authenticate);

documentRouter.post('/', handleDocumentUpload, upload);

documentRouter.get('/', list);
documentRouter.get('/stats', stats);
documentRouter.get('/:id', getById);
documentRouter.patch('/:id', rename);
documentRouter.delete('/:id', remove);

export { documentRouter };
