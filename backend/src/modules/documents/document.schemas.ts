import { z } from 'zod';

export const documentIdSchema = z.string().trim().min(1);

export const renameDocumentSchema = z.object({
  name: z.string().trim().min(1, 'Document name cannot be empty').max(200)
});

export const uploadDocumentFieldsSchema = z.object({
  name: z.string().trim().min(1).max(200).optional()
});