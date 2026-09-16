import 'dotenv/config';
import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']).default('info'),
  PORT: z.coerce.number().int().positive().default(8080),
  HOST: z.string().default('0.0.0.0'),
  API_PREFIX: z.string().startsWith('/').default('/api/v1'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/querydocs?schema=public'),
  JWT_SECRET: z.string().min(32).default('change-this-development-secret-at-least-32-chars'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(10)
});

export const env = environmentSchema.parse(process.env);
