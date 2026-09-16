import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';

let server: ReturnType<typeof app.listen> | undefined;

const start = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');
    server = app.listen(env.PORT, env.HOST, () => {
      logger.info(`Server started on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Server startup failed');
    process.exitCode = 1;
  }
};

void start();

const shutdown = (signal: string) => {
  logger.info({ signal }, 'Shutting down gracefully');
  server?.close(() => {
    void prisma.$disconnect().finally(() => {
      logger.info('QueryDocs API stopped');
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));