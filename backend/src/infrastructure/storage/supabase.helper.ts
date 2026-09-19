/**
 * Strips dangerous characters while maintaining the true file extension.
 * Correctly catches edge cases where the core filename turns empty.
 */

export const safeFileName = (fileName: string): string => {
    // Normalize string Unicode
    const cleaned = fileName.normalize('NFKC').replace(/[^a-zA-Z0-9._-]/g, '_');

    // Guard against strings that strip down to just dots/underscores (e.g., "___.__")
    const baseline = cleaned.replace(/[._]/g, '');
    if (!baseline) {
        return 'document';
    }

    return cleaned;
};


export const getStoragePath = (userId: string, documentId: string, originalFileName: string): string =>
    `${userId}/${documentId}/${safeFileName(originalFileName)}`;