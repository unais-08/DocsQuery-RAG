# QueryDocs Backend

TypeScript and Express API for the QueryDocs document Q&A platform. The backend handles authentication, document uploads, local file storage, and Prisma-backed persistence for user and document records.

## Requirements

- Node.js 20+ (22 LTS recommended)
- PostgreSQL running locally or in Docker
- Docker Compose for the local database container

## Quick start

```bash
npm install
copy .env.example .env

# Edit .env and set GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET_NAME.
npm run db:generate
npm run db:push
# Run prisma/supabase-vector.sql in the Supabase SQL Editor.
npm run dev
```

On macOS or Linux, use `cp .env.example .env` instead of `copy .env.example .env`.

The API listens on `http://localhost:8080` by default, unless `PORT` is changed in the environment configuration.

The server validates the environment on startup. `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET_NAME` must be set before starting the API. Supabase provides both PostgreSQL and pgvector; Docker Compose only starts PostgreSQL.

## Environment configuration

The available variables are documented in `.env.example`. Common settings include:

- `API_PREFIX` sets the API base path (default `/api/v1`).
- `CLIENT_ORIGIN` sets the allowed browser origin (default `http://localhost:3000`).
- `UPLOAD_DIR` sets the local upload directory (default `./uploads`).
- `MAX_FILE_SIZE_MB` limits uploaded files (default `10`).
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` configure the private `documents` Storage bucket. The service-role key is backend-only and must not be exposed to the frontend.
- `JWT_SECRET` must be at least 32 characters and should be replaced in production.
- `LLM_PROVIDER` selects the answer-generation provider: `gemini`, `groq`, `openai`, or `ollama`.
- `GEMINI_API_KEY`, `GROQ_API_KEY`, `GROQ_MODEL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OLLAMA_BASE_URL`, and `OLLAMA_MODEL` configure answer generation. Groq uses its OpenAI-compatible API; its default model is `llama-3.3-70b-versatile`. Ollama is the free local option and requires Ollama to be installed with the selected model pulled.
- Supabase pgvector stores and searches the 1536-dimensional Gemini embeddings. After `npm run db:push`, run [`prisma/supabase-vector.sql`](prisma/supabase-vector.sql) once in the Supabase SQL Editor to create the vector table, RPC function, and HNSW index.


## PostgreSQL and Prisma

Start the local database:

```bash
docker compose up -d postgres
```

Create a fresh database schema:

```bash
npm run db:generate
npm run db:push
```

Then run `prisma/supabase-vector.sql` in the Supabase SQL Editor. This project does not use Prisma migration history for a fresh database setup.

For future schema changes on this fresh database, use:

```bash
npm run db:push
```

## Logging

The backend uses Pino for structured request and app logging. Set `LOG_LEVEL` to `trace`, `debug`, `info`, `warn`, `error`, `fatal`, or `silent`.

Application code should use the logger from `src/config/logger.ts`:

- `logger.info`
- `logger.warn`
- `logger.error`
- `logger.debug`

Request logs stay intentionally minimal and should never include request bodies, passwords, tokens, or other sensitive data.

## Scripts

- `npm run dev` starts the Express server with file watching via `tsx watch`.
- `npm run build` compiles the TypeScript source into `dist`.
- `npm start` runs the compiled server from `dist/server.js`.
- `npm run typecheck` runs strict TypeScript validation without emitting files.
- `npm test` runs the project test suite using Node's built-in test runner with `tsx`.
- `npm run db:generate` generates the Prisma client.
- `npm run db:push` synchronizes the Prisma schema directly to a fresh database.
- `npm run db:studio` opens Prisma Studio.

## API endpoints

### Health

- `GET /` returns API metadata.
- `GET /api/v1/health/live` checks that the HTTP server is running.

### Authentication

All auth routes are mounted under `/api/v1/auth`.

- `POST /api/v1/auth/register` creates a user account.
  Request body:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secure-password"
  }
  ```
- `POST /api/v1/auth/login` authenticates a user.
  Request body:
  ```json
  {
    "email": "jane@example.com",
    "password": "secure-password"
  }
  ```
- `GET /api/v1/auth/me` returns the current authenticated user. Requires `Authorization: Bearer <token>`.

### Documents

All document routes require a valid bearer token.

- `POST /api/v1/documents` uploads a file as multipart form data.
  - Form field is `file`.
  - Optional form field is `name`.
  - Supported file types are `.txt`, `.pdf`, and `.docx`.
  - The maximum file size is controlled by `MAX_FILE_SIZE_MB`.
- `GET /api/v1/documents` lists the authenticated user's documents and count.
- `GET /api/v1/documents/stats` returns the authenticated user's document count.
- `GET /api/v1/documents/:id` fetches one document owned by the user.
- `PATCH /api/v1/documents/:id` renames a document.
  Request body:
  ```json
  {
    "name": "New document name"
  }
  ```
- `DELETE /api/v1/documents/:id` deletes the document record and removes the stored file.

Uploaded files are temporarily stored in `UPLOAD_DIR` (default `./uploads`) while extraction, chunking, and embedding complete. The original file is then uploaded to the private Supabase `documents` bucket under `userId/documentId/originalFileName`; only that Storage key is persisted for new documents.

### Queries

All query routes require a valid bearer token.

- `POST /api/v1/query` asks a question against the authenticated user's document chunks.
  Request body:
  ```json
  {
    "question": "What does this document say?"
  }
  ```

If Gemini or the embedding service is unavailable, the API returns `503 Service Unavailable` with the error code `AI_SERVICE_UNAVAILABLE`. Clients can retry the request later; provider details are logged on the server and are not returned to clients.

## Project structure

```text
src/
  config/       Environment parsing, Prisma setup, and logging
  middleware/   Express middleware, auth checks, and error handling
  modules/      Feature modules with routes, controllers, validation, and services
  infrastructure/
                Document processing, embeddings, provider-neutral answer generation,
                Gemini, OpenAI, and Ollama adapters, and Supabase pgvector integration
  types/        Shared TypeScript types
prisma/
  schema.prisma
  migrations/
```

## Notes

- The live endpoint only confirms that the HTTP server is running.
- The application does not expose secret values in logs or responses.
- Production deployments should use a strong, unique `JWT_SECRET` and a secure PostgreSQL connection string.
