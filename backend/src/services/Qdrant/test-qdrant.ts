import { QDRANT_COLLECTION } from './qdrant.constant.js';
import { qdrantClient } from './qdrantClient.js';

async function main() {
    console.log("Testing Qdrant...");

    // 1. Check collection
    const collections = await qdrantClient.getCollections();

    const collectionExists = collections.collections.some(
        (collection) => collection.name === QDRANT_COLLECTION,
    );

    if (!collectionExists) {
        throw new Error(
            `Collection "${QDRANT_COLLECTION}" does not exist`,
        );
    }

    console.log("✅ Collection exists:", QDRANT_COLLECTION);

    // 2. Create a test 1536-dimensional embedding
    const testEmbedding = Array(1536).fill(0.1);

    console.log(
        "Embedding dimensions:",
        testEmbedding.length,
    );

    // Define a consistent test ID (Must be a valid UUID string or an integer)
    const testId = "550e8400-e29b-41d4-a716-446655440000";

    // 3. Insert test point
    await qdrantClient.upsert(QDRANT_COLLECTION, {
        wait: true,
        points: [
            {
                id: testId,
                // ✅ FIX: Passed the raw array directly for unnamed vector setup
                vector: testEmbedding,
                payload: {
                    userId: "test-user-1",
                    documentId: "test-document-1",
                    chunkIndex: 0,
                },
            },
        ],
    });

    console.log("✅ Test vector inserted");

    // 4. Retrieve the point
    const result = await qdrantClient.retrieve(
        QDRANT_COLLECTION,
        {
            // ✅ FIX: Using the same UUID variable here so the retrieval works
            ids: [testId],
            with_payload: true,
            with_vector: true,
        },
    );

    console.log("Retrieved point:");
    console.dir(result, { depth: 2 });

    console.log("✅ Qdrant test successful!");
}

main().catch((error) => {
    console.error("❌ Qdrant test failed:");
    console.error(error);
    process.exit(1);
});
