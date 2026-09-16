import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from '../../config/env.js';

// connect to Qdrant Cloud
export const qdrantClient = new QdrantClient({
    url: env.QDRANT_URL,
    apiKey: env.QDRANT_API_KEY,
});