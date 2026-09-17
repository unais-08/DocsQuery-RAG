import fs from 'node:fs/promises';
import type { DocumentExtractor, TextPage } from '../document.extractor.js';

export class TxtExtractor implements DocumentExtractor {
	async extract(filePath: string): Promise<TextPage[]> {
		return [{ text: await fs.readFile(filePath, 'utf-8') }];
	}
}
