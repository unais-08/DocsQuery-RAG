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

docker compose up -d postgres
npm run db:generate
npm run db:deploy
npm run dev
```

On macOS or Linux, use `cp .env.example .env` instead of `copy .env.example .env`.

The API listens on `http://localhost:8080` by default, unless `PORT` is changed in the environment configuration.


## PostgreSQL and Prisma

Start the local database:

```bash
docker compose up -d postgres
```

Create or update the database schema:

```bash
npm run db:generate
npm run db:deploy
```

During schema changes, use:

```bash
npm run db:migrate -- --name describe-change
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
- `npm run db:migrate` creates a new Prisma migration.
- `npm run db:deploy` applies checked-in migrations to the database.
- `npm run db:studio` opens Prisma Studio.

## API endpoints

### Health

- `GET /` returns API metadata.
- `GET /api/v1/health/live` checks that the HTTP server is running.
- `GET /api/v1/health/ready` checks the readiness status for traffic.

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
  - Supported file types are handled by the document extraction pipeline.
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

Uploaded files are stored locally in `UPLOAD_DIR` (default `./uploads`) with generated filenames. The storage layer is isolated in `src/modules/documents/document.storage.ts` so it can later be replaced with cloud storage without changing the document API.

## Project structure

```text
src/
  config/       Environment parsing, Prisma setup, and logging
  middleware/   Express middleware, auth checks, and error handling
  modules/      Auth and document feature modules
  routes/       Route registration for top-level endpoints
  services/     Shared application services
  types/        Shared TypeScript types
prisma/
  schema.prisma
  migrations/
```

## Notes

- The ready endpoint is intentionally lightweight and can be extended with database, vector store, and model-provider checks as those services are introduced.
- The application does not expose secret values in logs or responses.
- Production deployments should use a strong, unique `JWT_SECRET` and a secure PostgreSQL connection string.
