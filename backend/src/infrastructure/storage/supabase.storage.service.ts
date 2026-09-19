import { readFile } from 'node:fs/promises';
import { bucketName, supabase } from './supabase.client.js';
import { getStoragePath } from './supabase.helper.js';
import { DocumentError } from '../../modules/documents/document.errors.js';




export const uploadDocument = async (
  filePath: string,
  userId: string,
  documentId: string,
  originalFileName: string,
  contentType: string
): Promise<string> => {
  const storagePath = getStoragePath(userId, documentId, originalFileName);

  try {
    const fileBuffer = await readFile(filePath);

    // Cross-version SDK Safety: Convert Buffer to a standard Blob payload
    const fileBlob = new Blob([fileBuffer], { type: contentType });

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBlob, {
        contentType,
        upsert: false
      });

    if (error) {
      // Log the concrete Supabase internal issue for backend monitoring
      console.error('Supabase upload internal exception:', error);
      throw error;
    }

    return storagePath;
  } catch (error) {
    throw new DocumentError('Document storage upload failed', 502, 'STORAGE_UPLOAD_FAILED');
  }
};

export const deleteDocument = async (storagePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([storagePath]);

    if (error) {
      console.error('Supabase removal internal exception:', error);
      throw error;
    }
  } catch (error) {
    throw new DocumentError('Document storage cleanup failed', 502, 'STORAGE_DELETE_FAILED');
  }
};
