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
