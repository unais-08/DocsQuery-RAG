import type { RetrievedChunk } from "./query.service.js";

export const buildContext = (chunks: RetrievedChunk[]): string => {
    return chunks
        .map((chunk, index) => {
            const page = chunk.pageNumber === null
                ? ""
                : `\nPage: ${chunk.pageNumber}`;

            return [
                `SOURCE ${index + 1}`,
                `Document: ${chunk.documentName}${page}`,
                "Content:",
                chunk.text,
            ].join("\n");
        })
        .join("\n\n");
};