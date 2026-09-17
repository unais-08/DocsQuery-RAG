export interface TextChunk {
  index: number;
  text: string;
  pageNumber?: number;
  embedding?: number[];
}

export interface ChunkingOptions {
  chunkSize: number;
  chunkOverlap: number;
}

// Default MVP strategy: 1000-character chunks with 100-character overlap.
export const defaultChunkingOptions: ChunkingOptions = {
  chunkSize: 1_000,
  chunkOverlap: 100
};

export class TextChunker {
  private readonly options: ChunkingOptions;

  constructor(options: ChunkingOptions = defaultChunkingOptions) {
    this.validateOptions(options);
    this.options = options;
  }

  chunk(text: string, pageNumber?: number): TextChunk[] {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return [];

    const chunks: TextChunk[] = [];
    let start = 0;

    while (start < trimmedText.length) {
      const maximumEnd = Math.min(
        start + this.options.chunkSize,
        trimmedText.length
      );

      // Prefer splitting at a word/newline boundary instead of cutting text mid-word.
      const end = this.findChunkEnd(trimmedText, start, maximumEnd);
      const chunkText = trimmedText.slice(start, end).trim();

      if (chunkText.length > 0) {
        chunks.push({
          index: chunks.length,
          text: chunkText,
          ...(pageNumber === undefined ? {} : { pageNumber })
        });
      }

      if (end >= trimmedText.length) break;

      // Reuse the end of the previous chunk so context is preserved between chunks.
      const nextStart = Math.max(
        end - this.options.chunkOverlap,
        start + 1
      );

      start = this.skipWhitespace(trimmedText, nextStart, end);
    }

    return chunks;
  }

  private findChunkEnd(
    text: string,
    start: number,
    maximumEnd: number
  ): number {
    if (maximumEnd === text.length) return maximumEnd;

    const minimumPreferredEnd =
      start + Math.floor(this.options.chunkSize / 2);

    const boundary = Math.max(
      text.lastIndexOf(' ', maximumEnd),
      text.lastIndexOf('\n', maximumEnd)
    );

    // Only move the boundary back if doing so does not make the chunk too small.
    return boundary >= minimumPreferredEnd ? boundary : maximumEnd;
  }

  private skipWhitespace(
    text: string,
    start: number,
    end: number
  ): number {
    let position = start;

    while (position < end && /\s/.test(text[position] ?? '')) {
      position += 1;
    }

    return position;
  }

  private validateOptions(options: ChunkingOptions): void {
    if (
      !Number.isInteger(options.chunkSize) ||
      options.chunkSize <= 0
    ) {
      throw new RangeError(
        'chunkSize must be a positive integer'
      );
    }

    if (
      !Number.isInteger(options.chunkOverlap) ||
      options.chunkOverlap < 0
    ) {
      throw new RangeError(
        'chunkOverlap must be a non-negative integer'
      );
    }

    // Overlap cannot be equal to or larger than the chunk itself.
    if (options.chunkOverlap >= options.chunkSize) {
      throw new RangeError(
        'chunkOverlap must be less than chunkSize'
      );
    }
  }
}