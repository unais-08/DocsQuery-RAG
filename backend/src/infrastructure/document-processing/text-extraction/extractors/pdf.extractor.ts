import fs from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import type { DocumentExtractor, TextPage } from '../document.extractor.js';

export class PdfExtractor implements DocumentExtractor {
	async extract(filePath: string): Promise<TextPage[]> {
		const parser = new PDFParse({ data: await fs.readFile(filePath) });
		try {
			const result = await parser.getText();
			return result.pages.map((page) => ({ pageNumber: page.num, text: page.text }));
		} finally {
			await parser.destroy();
		}
	}
}
