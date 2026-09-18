import { apiRequest } from "@/lib/api/client";
import type { QuerySource } from "@/lib/api/query";

const CONVERSATIONS_API_PREFIX = "/api/v1/conversations";

export type ConversationSummary = {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
};

export type ConversationListItem = ConversationSummary & { messageCount: number };

export type PersistedChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources: QuerySource[] | null;
    createdAt: string;
};

export type ConversationDetail = {
    conversation: ConversationSummary;
    messages: PersistedChatMessage[];
};

export function createConversation(token: string) {
    return apiRequest<{ conversation: ConversationSummary }>(
        CONVERSATIONS_API_PREFIX,
        { method: "POST" },
        token,
    );
}

export function getConversations(token: string) {
    return apiRequest<{ conversations: ConversationListItem[] }>(
        CONVERSATIONS_API_PREFIX,
        {},
        token,
    );
}

export function getConversation(id: string, token: string) {
    return apiRequest<ConversationDetail>(`${CONVERSATIONS_API_PREFIX}/${id}`, {}, token);
}

export function updateConversation(id: string, title: string, token: string) {
    return apiRequest<{ conversation: ConversationSummary }>(
        `${CONVERSATIONS_API_PREFIX}/${id}`,
        { method: "PATCH", body: JSON.stringify({ title }) },
        token,
    );
}

export function deleteConversation(id: string, token: string) {
    return apiRequest<null>(`${CONVERSATIONS_API_PREFIX}/${id}`, { method: "DELETE" }, token);
}
