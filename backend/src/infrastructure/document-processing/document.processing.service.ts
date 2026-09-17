import path from 'node:path';
import { DocumentExtractorFactory } from './text-extraction/document.extractor.factory.js';
import { defaultChunkingOptions, type TextChunk, TextChunker } from './chunking/text-chunker.js';
import { textCleaner } from './cleaning/text-cleaner.js';
import { createChunkEmbeddings } from './embeddings/generate-embeddings.js';

export class DocumentProcessingService {
	constructor(private readonly chunker = new TextChunker(defaultChunkingOptions)) { }

	async extractText(filePath: string) {
		const extension = path.extname(filePath).toLowerCase();
		return DocumentExtractorFactory.getExtractor(extension).extract(filePath);
	}

	async extractAndChunk(filePath: string): Promise<{ characterCount: number; chunks: Array<TextChunk & { embedding: number[] }> }> {
		// Process the document through extraction → cleaning → chunking → embeddings.
		const extractedPages = await this.extractText(filePath);

		const chunks: TextChunk[] = [];
		let characterCount = 0;

		for (const page of extractedPages) {
			const cleanedText = textCleaner.clean(page.text);
			characterCount += cleanedText.length;

			const pageChunks = this.chunker.chunk(cleanedText, page.pageNumber);

			// Re-index across pages so chunk order remains stable for retrieval and storage.
			chunks.push(...pageChunks.map((chunk, pageChunkIndex) => ({ ...chunk, index: chunks.length + pageChunkIndex })));
		}
		return { characterCount, chunks: await createChunkEmbeddings(chunks) };
	}
}

export const documentProcessingService = new DocumentProcessingService();