import { z } from "zod";

export const querySchema = z.object({
    question: z
        .string()
        .trim()
        .min(1, "Question is required")
        .max(2000, "Question is too long"),
});

export type QueryInput = z.infer<typeof querySchema>;