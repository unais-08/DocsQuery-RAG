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

    async extractText(filePath: string): Promise<string> {
        const extension = path.extname(filePath).toLowerCase();

        const extractor =
            DocumentExtractorFactory.getExtractor(extension);

        const text = await extractor.extract(filePath);

        return text;
    }

    async extractAndChunk(filePath: string): Promise<{
        characterCount: number;
        chunks: Array<TextChunk & { embedding: number[] }>;
    }> {
        const extractedText = await this.extractText(filePath);
        const cleanedText = textCleaner.clean(extractedText);
        const chunks = this.chunker.chunk(cleanedText);

        return {
            characterCount: cleanedText.length,
            chunks: await createChunkEmbeddings(chunks)
        };
    }
}

export const documentService = new DocumentService();