import { generateEmbedding } from "./generate-embeddings.js";

async function main() {
    const text =
        "PostgreSQL is an open-source relational database management system.";

    const embedding = await generateEmbedding(text);

    console.log("Embedding generated!");
    console.log("Dimensions:", embedding.length);
    console.log("Embedding first 10 values:", embedding.slice(0, 10));
}

main().catch(console.error);