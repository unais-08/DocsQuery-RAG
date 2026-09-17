import assert from "node:assert/strict";
import test from "node:test";
import { buildContext } from "./context-builder.js";
import type { RetrievedChunk } from "./query.service.js";

const createChunk = (
    overrides: Partial<RetrievedChunk> = {}
): RetrievedChunk => ({
    chunkId: "chunk-id",
    documentId: "document-id",
    documentName: "policy.pdf",
    text: "Refunds are available within 30 days.",
    chunkIndex: 0,
    pageNumber: 3,
    score: 0.9,
    ...overrides,
});

test("builds ordered context with document and page metadata", () => {
    const context = buildContext([
        createChunk({ text: "First result", pageNumber: 3 }),
        createChunk({
            documentName: "notes.txt",
            text: "Second result\nwith special characters: <>&",
            pageNumber: null,
        }),
    ]);

    assert.equal(
        context,
        [
            "SOURCE 1",
            "Document: policy.pdf",
            "Page: 3",
            "Content:",
            "First result",
            "",
            "SOURCE 2",
            "Document: notes.txt",
            "Content:",
            "Second result\nwith special characters: <>&",
        ].join("\n")
    );
});

test("returns an empty context when no chunks are retrieved", () => {
    assert.equal(buildContext([]), "");
});

test("preserves long chunk text without changing it", () => {
    const text = "long text ".repeat(1000);

    assert.match(buildContext([createChunk({ text })]), new RegExp(text));
});