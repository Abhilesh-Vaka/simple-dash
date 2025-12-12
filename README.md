# Frontend Developer Intern Assignment

React/Next.js frontend with protected dashboard plus Express/MongoDB backend. Implements JWT authentication, profile management, and task CRUD with search/filters. Postman collection included.

## Stack
- Frontend: Next.js (App Router), TailwindCSS, client-side validation
- Backend: Express, MongoDB (with in-memory fallback), JWT, bcrypt, Zod validation

## Quick start
1. **Backend**
   ```bash
   cd backend
   cp env.example .env
   npm install
   npm run dev
   ```
   - Configure `MONGODB_URI` for a real database. If omitted, an in-memory MongoDB will start for local usage.

2. **Frontend**
   ```bash
   cd frontend
   cp env.example .env.local
   npm install
   npm run dev
   ```
   - `NEXT_PUBLIC_API_URL` should point to the backend (default `http://localhost:4000`).

3. Open `http://localhost:3000` → sign up → login → dashboard.

## API overview
- `POST /auth/signup` — register user (hashes password)
- `POST /auth/login` — JWT issuance
- `GET/PUT /profile` — fetch/update profile (auth)
- `GET/POST /tasks` — list/create tasks (search, status, tag filters)
- `GET/PUT/DELETE /tasks/:id` — CRUD task by id
- `GET /health` — service health

Import `api.postman_collection.json` for ready-made requests.

## Security & validation
- Password hashing with bcrypt; JWT-based auth middleware.
- Zod schemas for request validation; descriptive 4xx errors.
- CORS restricted via `CORS_ORIGIN`.
- Secrets via environment variables; tokens stored client-side (localStorage) for the demo.

## Scaling notes
- Swap in managed MongoDB/Postgres and connection pooling.
- Move secrets to a vault; set short-lived JWTs with refresh tokens.
- Add rate limiting, request logging, and centralized error monitoring.
- Split services (auth/tasks) if needed; add background workers for heavy jobs.
- Frontend: use React Query/RTK Query for caching, suspense, and optimistic updates; add E2E and component tests.

## Directory structure
- `frontend/` — Next.js app (`/login`, `/signup`, `/dashboard`)
- `backend/` — Express API with auth/profile/task routes
- `api.postman_collection.json` — Postman collection

