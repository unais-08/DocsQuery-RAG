# QueryDocs Backend

TypeScript and Express API for the QueryDocs retrieval-augmented document QA application.

## Development

```bash
npm install
copy .env.example .env
npm run dev
```

The API listens on `http://localhost:8080` by default.

## Scripts

- `npm run dev` starts the TypeScript server with file watching.
- `npm run build` compiles `src` into `dist`.
- `npm start` runs the compiled server.
- `npm run typecheck` runs the strict TypeScript checker without emitting files.

## Endpoints

- `GET /` returns API metadata.
- `GET /api/v1/health/live` checks that the process is running.
- `GET /api/v1/health/ready` checks that the API can accept traffic.

## Structure

```text
src/
  config/       Environment parsing and application configuration
  middleware/   Shared Express middleware and error handling
  modules/      Feature modules for documents and question answering
  routes/       HTTP route registration
  services/     Shared application services
  types/        Shared TypeScript types
```

Add infrastructure checks to the readiness route as databases, vector stores, and model providers are introduced.
