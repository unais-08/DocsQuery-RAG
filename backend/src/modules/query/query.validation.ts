import { z } from "zod";

export const querySchema = z.object({
    conversationId: z.string().trim().min(1, "Conversation ID is required"),
    question: z
        .string()
        .trim()
        .min(1, "Question is required")
        .max(2000, "Question is too long"),
});

export type QueryInput = z.infer<typeof querySchema>;