import { prisma } from '../../config/prisma.js';
import { ConversationError } from './conversation.errors.js';

const conversationSummary = {
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  selectedDocumentIds: true
} as const;

interface ConversationWithMessageCount {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  selectedDocumentIds: string[];
  _count: {
    messages: number;
  };
}

interface CreatedConversation {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  selectedDocumentIds: string[];
}

interface ConversationListItem {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  selectedDocumentIds: string[];
  messageCount: number;
}

const findOwnedConversation = async (userId: string, id: string) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId },
    select: conversationSummary
  });

  if (!conversation) {
    throw new ConversationError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }

  return conversation;
};

export const createConversation = (userId: string) =>
  prisma.conversation.create({
    data: { userId },
    select: conversationSummary
  }).then((conversation: CreatedConversation): { conversation: CreatedConversation } => ({ conversation }));

export const listConversations = async (userId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { ...conversationSummary, _count: { select: { messages: true } } }
  });

  return {
    conversations: conversations.map((conversation: ConversationWithMessageCount): ConversationListItem => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      selectedDocumentIds: conversation.selectedDocumentIds,
      messageCount: conversation._count.messages
    }))
  };
};

export const getConversation = async (userId: string, id: string) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId },
    select: {
      ...conversationSummary,
      messages: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, role: true, content: true, sources: true, createdAt: true }
      }
    }
  });

  if (!conversation) {
    throw new ConversationError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }

  const { messages, ...summary } = conversation;
  return { conversation: summary, messages };
};

export const updateConversation = async (userId: string, id: string, title: string) => {
  const result = await prisma.conversation.updateMany({ where: { id, userId }, data: { title } });
  if (result.count === 0) {
    throw new ConversationError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }
  return { conversation: await findOwnedConversation(userId, id) };
};

export const deleteConversation = async (userId: string, id: string) => {
  const result = await prisma.conversation.deleteMany({ where: { id, userId } });
  if (result.count === 0) {
    throw new ConversationError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }
};

export const assertConversationOwnership = async (userId: string, id: string) => {
  await findOwnedConversation(userId, id);
};
