export type Feedback = "up" | "down" | null;

export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt?: string;
    sources?: {
        chunkId: string;
        documentId: string;
        documentName: string;
        pageNumber: number | null;
        score: number;
    }[];
    sourcesOpen?: boolean;
    feedback?: Feedback;
};

export type DocSource = {
    id: string;
    name: string;
    size: string;
};
