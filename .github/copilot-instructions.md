## Purpose
Provide concise, actionable guidance so an AI coding assistant can be immediately productive in this repository (frontend + backend mini Instagram).

## Big picture
- Frontend: Create React App located at the repo root (`src/` folder). Key UI components live under `src/Component/` (e.g., `middleSide.js`, `middlePost.js`). The app expects a JSON API at `http://127.0.0.1:4000/api`.
- Backend: Minimal Express server in `server/` with `server/index.js` (routes under `/api/*`) and `server/db.js` using `lowdb` (persisted to `server/db.json`). JWT auth uses `JWT_SECRET` (default `change_this_secret`).
- Data flow: frontend stores JWT in `localStorage` under key `token`; `src/api.js` attaches `Authorization: Bearer <token>` to API calls. Posts may use `imageUrl` (JSON) or multipart uploads via `multer`.

## How to run (developer workflows)
- Install frontend deps (repo root):
  ```bash
  npm install
  npm start
  ```
- Install and run backend (inside `server/`):
  ```bash
  cd server
  npm install
  node index.js
  ```
- Common debugging notes:
  - If port 4000 is in use, identify and stop process on Windows with `Get-NetTCPConnection -LocalPort 4000` then `Stop-Process -Id <pid>`.
  - Browser console blocks pasting into DevTools by default — type `allow pasting` in the Console before pasting `localStorage.setItem('token', '<jwt>')`.

## Project-specific conventions & patterns
- API surface: all endpoints live under `/api/*` in `server/index.js`. Follow the existing request/response shapes when editing endpoints.
- Persistence: `lowdb` with `server/db.json` — changes persist immediately via `db.read()` / `db.write()` calls. Do not manually edit `db.json` while server runs.
- Auth: JWT tokens are signed with `JWT_SECRET`. Tokens payloads contain `{ id }`. Server `auth` middleware expects `Authorization: Bearer <token>` header and sets `req.user`.
- Uploads: `multer` stores files in `server/uploads` and endpoints return `url` like `/uploads/<filename>`.

## Integration points & examples
- Frontend -> Backend: `src/api.js` calls `http://127.0.0.1:4000/api/*`. Example: `getFeed()` calls `/api/feed` and expects either an array of posts or an object `{ value, Count }` — components normalize both shapes.
- Creating a post (JSON example): `POST /api/posts` body `{ caption: 'x', imageUrl: 'https://...' }` with `Authorization` header.

## Files to read first
- `server/index.js` — all API routes and auth middleware.
- `server/db.js` and `server/db.json` — data model (users, posts, follows, comments).
- `src/api.js` — client API helper showing how headers/requests are formed.
- `src/Component/middleSide.js` and `src/Component/middlePost.js` — how feed and posts are rendered and the expected post shape.

## Troubleshooting quick wins
- Empty image `src` warnings: components guard against empty `src` and use `process.env.PUBLIC_URL` fallbacks.
- ENOSPC when installing: remove `node_modules`, clear npm cache, and reinstall.
- 401 from `/api/*`: verify token in browser `localStorage` under key `token` and that server was started with same `JWT_SECRET` used to sign the token.

## Safety and dev conveniences
- Dev-only helpers: it's acceptable to temporarily inject a known token into `src/index.js` for development testing, but mark it with `// DEV ONLY` and remove before committing.
- When adding routes, use the `auth` middleware for protected endpoints.

## Example snippets
- Header helper in `src/api.js`:
  ```js
  function authHeader(){
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  ```

## If unsure, ask the repo owner
- Which JWT token to use for local testing.
- Permission to reset `server/db.json` for test data.

---
If you want me to expand this with example curl/PowerShell snippets, a small signup/login UI, or automated dev-only token injection, tell me which and I'll add it.
## Purpose
Provide concise, actionable guidance so an AI coding assistant can be immediately productive in this repository (frontend + backend mini Instagram).

## Big picture
- Frontend: Create React App located at the repo root (`src/` folder). Key UI components live under `src/Component/` (e.g., `middleSide.js`, `middlePost.js`). The app expects a JSON API at `http://127.0.0.1:4000/api`.
- Backend: Minimal Express server in `server/` with `server/index.js` (routes under `/api/*`) and `server/db.js` using `lowdb` (persisted to `server/db.json`). JWT auth uses `JWT_SECRET` (default `change_this_secret`).
- Data flow: frontend stores JWT in `localStorage` under key `token`; `src/api.js` attaches `Authorization: Bearer <token>` to API calls. Posts may use `imageUrl` (JSON) or multipart uploads via `multer`.

## Developer workflows / commands
- Install deps (root): `npm install` (frontend). Server dependencies are in `server/package.json`; run `npm install` inside `server/` or use `node server/index.js` if modules are already installed.
- Start backend: `cd server && node index.js` (listens on port 4000).
- Start frontend: from repo root `npm start` (CRA dev server on port 3000).
- Common debug tasks:
  - Kill a process using a port (Windows PowerShell):
    ```powershell
    $pid=(Get-NetTCPConnection -LocalPort 4000).OwningProcess; Stop-Process -Id $pid -Force
    ```
  - Test API from PowerShell (replace $token):
    ```powershell
    $h=@{ Authorization = "Bearer $token" }
    Invoke-RestMethod -Uri http://127.0.0.1:4000/api/feed -Headers $h
    ```
  - DevTools paste-protection: in the browser Console type `allow pasting` then paste the localStorage command if needed.

## Project-specific conventions & patterns
- API surface is under `/api/*` (see `server/index.js`). Use `src/api.js` helpers to call endpoints (examples: `getFeed`, `likePost`, `createPostJson`).
- Persistence: `lowdb` with a single `db.json` file in `server/`. Mutations are synchronous-ish via `db.read()`/`db.write()` calls in endpoints — prefer making changes through existing endpoint patterns.
- Auth: JWT token payload only contains `{ id }`. The server verifies tokens with `jwt.verify(token, SECRET)` and expects the `Authorization` header with `Bearer` prefix.
- Uploads: `multer` writes uploaded files to `server/uploads` and endpoints may return `url` like `/uploads/<filename>`.

## Integration points & examples
- Frontend -> Backend: `src/api.js` calls `http://127.0.0.1:4000/api/*`. Example: `getFeed()` calls `/api/feed` and expects an array of posts or an object `{ value, Count }` — `src/Component/middleSide.js` normalizes both shapes.
- Creating a post (example JSON): `POST /api/posts` with body `{ caption: 'x', imageUrl: 'https://...' }` and JWT header.

## Debugging notes discovered in repo
- The code contains dev-only logging points you can use:
  - `src/api.js` has a development log in `authHeader()` (prints token presence and length).
  - `server/index.js` logs JWT verify errors in development (look for `auth verify error:`).
- CORS / caching: backend was configured to allow cross-origin requests and may disable ETag during development to avoid `304 Not Modified` caching.

## Files to read first (entry points)
- `server/index.js` — all API routes, auth middleware, multer handling.
- `server/db.js` and `server/db.json` — data model shape (users, posts, follows, comments).
- `src/api.js` — client API helper: how headers/requests are formed.
- `src/Component/middleSide.js` and `src/Component/middlePost.js` — how feed and posts are rendered and the expected post shape.
- `public/` — static images referenced by components via `process.env.PUBLIC_URL`.

## How to make safe edits
- Preserve existing endpoint routes and payload shapes when changing server behavior (front-end expects `authorProfile` to include `id` and `username`).
- When adding routes, register them under `/api/*` and follow the `auth` middleware pattern to protect endpoints that require auth.

## When unsure, ask the user for:
- Which token to use for local testing (or grant permission to add a temporary dev-only token in `src/index.js`).
- Whether it's acceptable to reset `server/db.json` data for testing.

---
If you want changes or additional examples (curl/PowerShell snippets, UI integration tasks, or automated dev aids), tell me what to add or clarify.
