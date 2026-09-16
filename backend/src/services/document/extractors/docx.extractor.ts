import mammoth from 'mammoth';
import { DocumentExtractor } from '../document-extractor.js';

export class DocxExtractor implements DocumentExtractor {
    async extract(filePath: string): Promise<string> {
        // Mammoth can extract text directly from a file path
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }
}
