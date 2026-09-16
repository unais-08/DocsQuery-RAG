import assert from "node:assert/strict";
import test from "node:test";

import { TextCleaner } from "./cleaning/text-cleaner.js";
import { TextChunker } from "./chunking/text-chunker.js";

const cleaner = new TextCleaner();

test("cleans whitespace while preserving paragraph separation", () => {
    const cleaned = cleaner.clean(
        "Hello       world.\n\n\nThis is     another paragraph."
    );

    assert.equal(cleaned, "Hello world.\n\nThis is another paragraph.");
});

test("returns no chunks for empty text", () => {
    assert.deepEqual(new TextChunker({ chunkSize: 10, chunkOverlap: 2 }).chunk(""), []);
});

test("returns one chunk for text smaller than the chunk size", () => {
    const chunks = new TextChunker({ chunkSize: 100, chunkOverlap: 10 }).chunk(
        "Small document"
    );

    assert.deepEqual(chunks, [{ index: 0, text: "Small document" }]);
});

test("returns multiple chunks for large text", () => {
    const text = Array.from({ length: 30 }, (_, index) => `word${index}`).join(" ");
    const chunks = new TextChunker({ chunkSize: 40, chunkOverlap: 8 }).chunk(text);

    assert.ok(chunks.length > 1);
    assert.deepEqual(
        chunks.map((chunk, index) => chunk.index),
        chunks.map((_chunk, index) => index)
    );
});

test("includes overlap text in consecutive chunks", () => {
    const chunks = new TextChunker({ chunkSize: 12, chunkOverlap: 4 }).chunk(
        "one two three four five six seven"
    );

    assert.ok(chunks.length > 1);
    assert.ok(chunks[1]?.text.includes("three"));
});

test("rejects invalid chunking options", () => {
    assert.throws(
        () => new TextChunker({ chunkSize: 0, chunkOverlap: 0 }),
        /chunkSize must be a positive integer/
    );
    assert.throws(
        () => new TextChunker({ chunkSize: 10, chunkOverlap: -1 }),
        /chunkOverlap must be a non-negative integer/
    );
    assert.throws(
        () => new TextChunker({ chunkSize: 10, chunkOverlap: 10 }),
        /chunkOverlap must be less than chunkSize/
    );
});
