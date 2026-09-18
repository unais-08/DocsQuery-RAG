import { z } from 'zod';

export const conversationIdSchema = z.string().trim().min(1, 'Conversation ID is required');

export const updateConversationSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long')
});

