export type Feedback = "up" | "down" | null;

export type ChatMessage = {
    id: number;
    role: "user" | "assistant";
    content: string;
    sources?: string[];
    sourcesOpen?: boolean;
    feedback?: Feedback;
};

export type DocSource = {
    id: string;
    name: string;
    size: string;
};
