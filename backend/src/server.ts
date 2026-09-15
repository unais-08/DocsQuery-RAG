import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info({ host: env.HOST, port: env.PORT }, 'QueryDocs API started');
});

const shutdown = (signal: string) => {
  logger.info({ signal }, 'Shutting down gracefully');
  server.close(() => {
    void prisma.$disconnect().finally(() => {
      logger.info('QueryDocs API stopped');
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));