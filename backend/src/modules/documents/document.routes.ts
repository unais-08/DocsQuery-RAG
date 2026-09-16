import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../middleware/authenticate.js';
import { DocumentError } from './document.errors.js';
import { documentUpload } from './document.storage.js';
import { getById, list, remove, rename, stats, upload } from './document.controller.js';

const documentRouter = Router();

documentRouter.use(authenticate);
documentRouter.post('/', (request, response, next) => {
  documentUpload(request, response, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      next(new DocumentError('Uploaded file is too large', 413, 'FILE_TOO_LARGE'));
      return;
    }
    if (error instanceof multer.MulterError && error.code === 'LIMIT_UNEXPECTED_FILE') {
      next(new DocumentError('Only one file can be uploaded in the file field', 400, 'INVALID_UPLOAD'));
      return;
    }
    next(error);
  });
}, upload);
documentRouter.get('/', list);
documentRouter.get('/stats', stats);
documentRouter.get('/:id', getById);
documentRouter.patch('/:id', rename);
documentRouter.delete('/:id', remove);

export { documentRouter };
