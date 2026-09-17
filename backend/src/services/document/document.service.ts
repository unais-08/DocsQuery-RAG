import path from "path";

import { DocumentExtractorFactory } from "./document-extractor.factory.js";
import {
    defaultChunkingOptions,
    TextChunk,
    TextChunker
} from "./chunking/text-chunker.js";
import { textCleaner } from "./cleaning/text-cleaner.js";
import { createChunkEmbeddings } from "./embeddings/generate-embeddings.js";

export class DocumentService {
    constructor(
        private readonly chunker = new TextChunker(defaultChunkingOptions)
    ) {}

    async extractText(filePath: string) {
        const extension = path.extname(filePath).toLowerCase();

        const extractor =
            DocumentExtractorFactory.getExtractor(extension);

        return extractor.extract(filePath);
    }

    async extractAndChunk(filePath: string): Promise<{
        characterCount: number;
        chunks: Array<TextChunk & { embedding: number[] }>;
    }> {
        const extractedPages = await this.extractText(filePath);
        const chunks: TextChunk[] = [];
        let characterCount = 0;

        for (const page of extractedPages) {
            const cleanedText = textCleaner.clean(page.text);
            characterCount += cleanedText.length;

            const pageChunks = this.chunker.chunk(cleanedText, page.pageNumber);
            chunks.push(
                ...pageChunks.map((chunk, pageChunkIndex) => ({
                    ...chunk,
                    index: chunks.length + pageChunkIndex
                }))
            );
        }

        return {
            characterCount,
            chunks: await createChunkEmbeddings(chunks)
        };
    }
}

export const documentService = new DocumentService();