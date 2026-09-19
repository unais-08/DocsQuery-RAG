import { z } from "zod";

export const querySchema = z.object({
    conversationId: z.string().trim().min(1, "Conversation ID is required"),
    question: z
        .string()
        .trim()
        .min(1, "Question is required")
        .max(2000, "Question is too long"),
    documentIds: z.array(z.string().trim().min(1)).min(1, "Select at least one document").max(100).refine(
        (documentIds) => new Set(documentIds).size === documentIds.length,
        "Document IDs must be unique",
    ),
});

export type QueryInput = z.infer<typeof querySchema>;