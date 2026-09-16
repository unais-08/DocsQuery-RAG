import crypto from 'node:crypto';
import { mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import { env } from '../../config/env.js';
import { DocumentError } from './document.errors.js';

const allowedTypes = new Map([
  ['application/pdf', '.pdf'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx']
]);

const uploadDirectory = path.resolve(env.UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: async (_request, _file, callback) => {
    try {
      await mkdir(uploadDirectory, { recursive: true });
      callback(null, uploadDirectory);
    } catch (error) {
      callback(error as Error, uploadDirectory);
    }
  },
  filename: (_request, file, callback) => {
    const extension = allowedTypes.get(file.mimetype);
    callback(null, `${crypto.randomUUID()}${extension ?? path.extname(file.originalname).toLowerCase()}`);
  }
});

export const documentUpload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const expectedExtension = allowedTypes.get(file.mimetype);

    if (!expectedExtension || extension !== expectedExtension) {
      callback(new DocumentError('Only PDF and DOCX files are supported', 415, 'UNSUPPORTED_FILE_TYPE'));
      return;
    }

    callback(null, true);
  }
}).single('file');

export const removeStoredFile = async (filePath: string): Promise<void> => {
  try {
    await unlink(filePath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      throw error;
    }
  }
};
