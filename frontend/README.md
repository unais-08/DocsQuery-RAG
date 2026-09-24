# QueryDocs Frontend

The QueryDocs frontend is a Next.js application for uploading documents, asking questions about them, and managing conversations. It provides the public landing page, authentication screens, and an authenticated dashboard backed by the QueryDocs API.

## Requirements

- Node.js 20 or later
- The QueryDocs backend running locally or at a reachable deployment URL
- A modern browser with JavaScript enabled

## Setup

1. Install dependencies:

	 ```bash
	 npm install
	 ```

2. Create `.env` in this directory and configure the backend URL:

	 ```env
	 NEXT_PUBLIC_API_URL=http://localhost:8080
	 ```

	 If `NEXT_PUBLIC_API_URL` is omitted, the frontend uses `http://localhost:8080`.

3. Start the development server:

	 ```bash
	 npm run dev
	 ```

Open [http://localhost:3000](http://localhost:3000) in a browser. The backend must allow the frontend origin through its `CLIENT_ORIGIN` setting. The default backend CORS origin is `http://localhost:3000`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Creates a production build |
| `npm start` | Starts the production server after a successful build |
| `npm run lint` | Runs ESLint |

## Application routes

| Route | Description | Authentication |
| --- | --- | --- |
| `/` | Public QueryDocs landing page | No |
| `/login` | User login | No |
| `/register` | User registration | No |
| `/dashboard` | Dashboard overview and account statistics | Required |
| `/dashboard/chat` | Ask questions about selected documents | Required |
| `/dashboard/documents` | Upload, list, rename, and delete documents | Required |
| `/dashboard/history` | Review saved conversations | Required |
| `/dashboard/profile` | View profile information | Required |
| `/dashboard/settings` | Application settings | Required |

Authenticated dashboard routes are protected by the frontend auth guard. Unauthenticated users are redirected to the login page.

## Backend integration

The frontend uses the Fetch API through the shared client in [`lib/api/client.ts`](lib/api/client.ts). Requests are sent to `NEXT_PUBLIC_API_URL` and use the backend API prefix `/api/v1`.

The client integrates with these backend resources:

- Authentication: registration, login, and current-user lookup
- Documents: upload, list, rename, and delete
- Conversations: create, list, retrieve, rename, and delete
- Queries: submit a question with a conversation ID and selected document IDs
- Dashboard: retrieve document, question, and storage statistics

Protected requests include the JWT as an `Authorization: Bearer <token>` header. After login or registration, the token is stored in local storage under `querydocs-auth-token`. Logging out removes the stored token; the backend does not currently expose a logout endpoint.

## Document uploads

The document screen sends one file in the `file` multipart field. The frontend accepts PDF, DOCX, and plain-text files up to 10 MB, matching the backend upload limit. Document processing, text extraction, embeddings, and storage are handled by the backend.

## Project structure

```text
app/
	(auth)/                  Login and registration routes
	dashboard/               Protected dashboard routes
	globals.css              Global styles and theme variables
	layout.tsx               Root layout and application providers
	page.tsx                 Public landing page
components/
	auth/                    Authentication UI and route guards
	dashboard/               Navigation, dashboard UI, and chat components
	landing/                 Public landing page sections
context/
	auth-context.tsx         Authentication state and session handling
	theme-context.tsx        Theme state
lib/api/
	client.ts                Shared HTTP client and API error handling
	auth.ts                  Authentication requests and types
	documents.ts             Document requests and types
	conversations.ts         Conversation requests and types
	query.ts                 Question and answer requests and types
	dashboard.ts             Dashboard statistics requests and types
```

## Production

Build and start the application with:

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_API_URL` to the deployed backend URL before building. Because this is a public Next.js environment variable, do not place secrets in it. Backend credentials, Supabase keys, model keys, and other private values belong in the backend environment only.
