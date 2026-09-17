import mammoth from 'mammoth';
import type { DocumentExtractor, TextPage } from '../document.extractor.js';

export class DocxExtractor implements DocumentExtractor {
	async extract(filePath: string): Promise<TextPage[]> {
		const result = await mammoth.extractRawText({ path: filePath });
		return [{ text: result.value }];
	}
}
