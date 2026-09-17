import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import { DocumentExtractor, TextPage } from '../document-extractor.js';

export class PdfExtractor implements DocumentExtractor {
    async extract(filePath: string): Promise<TextPage[]> {
        const fileBuffer = await fs.readFile(filePath);
        const parser = new PDFParse({ data: fileBuffer });

        try {
            const result = await parser.getText();
            return result.pages.map((page) => ({
                pageNumber: page.num,
                text: page.text
            }));
        } finally {
            await parser.destroy();
        }
    }
}
