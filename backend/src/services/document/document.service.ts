import path from "path";

import { DocumentExtractorFactory } from "./document-extractor.factory.js";
import {
    defaultChunkingOptions,
    TextChunk,
    TextChunker
} from "./chunking/text-chunker.js";
import { textCleaner } from "./cleaning/text-cleaner.js";

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
        chunks: TextChunk[];
    }> {
        const extractedText = await this.extractText(filePath);
        const cleanedText = textCleaner.clean(extractedText);

        return {
            characterCount: cleanedText.length,
            chunks: this.chunker.chunk(cleanedText)
        };
    }
}

export const documentService = new DocumentService();