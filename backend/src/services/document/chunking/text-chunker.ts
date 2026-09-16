

export interface TextChunk {
    index: number;
    text: string;
}

export interface ChunkingOptions {
    chunkSize: number;
    chunkOverlap: number;
}

export const defaultChunkingOptions: ChunkingOptions = {
    chunkSize: 1_000,
    chunkOverlap: 100
};

// This character-based strategy is an understandable MVP; token-aware chunking
// can replace it later without changing the chunker interface.
export class TextChunker {
    private readonly options: ChunkingOptions;

    constructor(options: ChunkingOptions = defaultChunkingOptions) {
        this.validateOptions(options);
        this.options = options;
    }

    chunk(text: string): TextChunk[] {
        const trimmedText = text.trim();
        if (trimmedText.length === 0) {
            return [];
        }

        const chunks: TextChunk[] = [];
        let start = 0;

        while (start < trimmedText.length) {
            const maximumEnd = Math.min(
                start + this.options.chunkSize,
                trimmedText.length
            );
            const end = this.findChunkEnd(trimmedText, start, maximumEnd);
            const chunkText = trimmedText.slice(start, end).trim();

            if (chunkText.length > 0) {
                chunks.push({ index: chunks.length, text: chunkText });
            }

            if (end >= trimmedText.length) {
                break;
            }

            const nextStart = Math.max(
                end - this.options.chunkOverlap,
                start + 1
            );
            start = this.skipWhitespace(trimmedText, nextStart, end);
        }
        // logger.info(chunks);
        return chunks;
    }

    private findChunkEnd(text: string, start: number, maximumEnd: number): number {
        if (maximumEnd === text.length) {
            return maximumEnd;
        }

        const minimumPreferredEnd = start + Math.floor(this.options.chunkSize / 2);
        const preferredEnd = text.lastIndexOf(" ", maximumEnd);
        const newlineEnd = text.lastIndexOf("\n", maximumEnd);
        const boundary = Math.max(preferredEnd, newlineEnd);

        return boundary >= minimumPreferredEnd ? boundary : maximumEnd;
    }

    private skipWhitespace(text: string, start: number, end: number): number {
        let position = start;
        while (position < end && /\s/.test(text[position] ?? "")) {
            position += 1;
        }
        return position;
    }

    private validateOptions(options: ChunkingOptions): void {
        if (!Number.isInteger(options.chunkSize) || options.chunkSize <= 0) {
            throw new RangeError("chunkSize must be a positive integer");
        }

        if (!Number.isInteger(options.chunkOverlap) || options.chunkOverlap < 0) {
            throw new RangeError("chunkOverlap must be a non-negative integer");
        }

        if (options.chunkOverlap >= options.chunkSize) {
            throw new RangeError("chunkOverlap must be less than chunkSize");
        }
    }
}
