import { prisma } from '../../config/prisma.js';

export const getDashboardStats = async (userId: string) => {
  const [documentStats, questionCount] = await prisma.$transaction([
    prisma.document.aggregate({
      where: { userId },
      _count: { _all: true },
      _sum: { fileSize: true }
    }),
    prisma.chatMessage.count({
      where: {
        role: 'user',
        conversation: { userId }
      }
    })
  ]);

  return {
    documents: documentStats._count._all,
    questions: questionCount,
    storageBytes: documentStats._sum.fileSize ?? 0
  };
};