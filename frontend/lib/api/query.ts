import { apiRequest } from "@/lib/api/client";

const QUERY_API_PREFIX = "/api/v1/query";

export type QueryInput = {
    conversationId: string;
    question: string;
    documentIds: string[];
};

export type QuerySource = {
    chunkId: string;
    documentId: string;
    documentName: string;
    pageNumber: number | null;
    score: number;
};

export type QueryResponse = {
    question: string;
    answer: string;
    sources: QuerySource[];
    messages: {
        user: { id: string; createdAt: string };
        assistant: { id: string; createdAt: string };
    };
};

export function queryDocuments(input: QueryInput, token: string) {
    return apiRequest<QueryResponse>(
        QUERY_API_PREFIX,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
        token,
    );
}