# QueryDocs Backend

TypeScript and Express API for the QueryDocs retrieval-augmented document QA application.

## Development

```bash
npm install
copy .env.example .env
npm run db:generate
npm run db:deploy
npm run dev
```

The API listens on `http://localhost:8080` by default.

## Logging

The backend uses Pino with concise request logs. Set `LOG_LEVEL` to control the
minimum level (`debug`, `info`, `warn`, or `error`); it defaults to `info`.
Application code should use `logger.info`, `logger.warn`, `logger.error`, and
`logger.debug` from `src/config/logger.ts`. Request logs include only the HTTP
method, route, status, and response time. Do not include request bodies,
passwords, tokens, or other sensitive data in log fields.

## PostgreSQL and Prisma

Start the local PostgreSQL database with Docker:

```bash
docker compose up -d postgres
```

The default `.env.example` connection points to this database. For a new local
database, apply the checked-in migrations with `npm run db:deploy`. During
schema development, use `npm run db:migrate -- --name describe-change`.

Never use the development JWT secret in production. Set `DATABASE_URL` and a
random `JWT_SECRET` of at least 32 characters in the production environment.

## Scripts

- `npm run dev` starts the TypeScript server with file watching.
- `npm run build` compiles `src` into `dist`.
- `npm start` runs the compiled server.
- `npm run typecheck` runs the strict TypeScript checker without emitting files.

## Endpoints

- `GET /` returns API metadata.
- `GET /api/v1/health/live` checks that the process is running.
- `GET /api/v1/health/ready` checks that the API can accept traffic.
- `POST /api/v1/auth/register` creates an account. Body: `{ "name", "email", "password" }`.
- `POST /api/v1/auth/login` authenticates an account. Body: `{ "email", "password" }`.
- `GET /api/v1/auth/me` returns the current account with `Authorization: Bearer <token>`.

## Structure

```text
src/
  config/       Environment parsing and application configuration
  middleware/   Shared Express middleware and error handling
  modules/      Feature modules for documents and question answering
  routes/       HTTP route registration
  services/     Shared application services
  types/        Shared TypeScript types
prisma/
  schema.prisma
  migrations/
```

Add infrastructure checks to the readiness route as databases, vector stores, and model providers are introduced.

Document endpoints require the same bearer token as the authentication
endpoints:

- `POST /api/v1/documents` uploads one PDF or DOCX file as multipart form data
  (`file` is required and `name` is optional).
- `GET /api/v1/documents` lists the authenticated user's documents and count.
- `GET /api/v1/documents/stats` returns the authenticated user's document count.
- `GET /api/v1/documents/:id` gets one of the authenticated user's documents.
- `PATCH /api/v1/documents/:id` renames a document with `{ "name": "..." }`.
- `DELETE /api/v1/documents/:id` deletes the database record and stored file.

Uploaded files are stored locally in `UPLOAD_DIR` (default `./uploads`) with
generated names. The storage adapter is isolated in
`src/modules/documents/document.storage.ts` so it can later be replaced with
cloud storage without changing the document API.
