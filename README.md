# Finasto web app

React + TypeScript single-page app for Finasto, a shared household cost-control app. It talks to the [Finasto API](https://github.com/Radpc/finasto-backend).

## Run locally

Requirements: Node 22 and the API running locally (see the backend README).

```bash
cp .env.example .env     # points the app at http://localhost:3000
npm ci
npm run dev              # http://localhost:5173
```

Log in with the backend's demo user (`admin@email.com` / `12345`, created by `npx prisma db seed`). The API allows `http://localhost:5173` through CORS by default.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |

## Configuration

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_PATH` | Base URL of the API |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain, e.g. `finasto-dev.us.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | Client ID of the Finasto single-page app in Auth0 |
| `VITE_AUTH0_AUDIENCE` | Identifier of the Finasto API in Auth0, same as the API's `AUTH0_AUDIENCE` |

Variables prefixed with `VITE_` end up in the public JavaScript bundle. Never put secrets in them.

## Sign-in

With the three `VITE_AUTH0_*` values set, the app signs in through Auth0's hosted login page (authorization code flow with PKCE). Tokens stay in memory and are refreshed by the Auth0 SDK; they are never written to `localStorage`. After a page reload the app passes back through Auth0, which returns straight to the same page while the Auth0 session is alive. Tenant setup: `docs/auth0-setup.md` in finasto-backend.

Without them, the app shows the email and password form, which talks to the API's `POST /login`. This is meant for local development only.

All requests get the `Authorization` header from one interceptor in `src/config/api.ts`.

## Project structure

```
src/
  main.tsx          app entry: Redux store, router, toasts
  router/           routes and login redirects
  config/api.ts     axios instance; a 401 clears the session
  storage/          Redux Toolkit store (session) persisted to localStorage
  services/         one class per API resource
  hooks/            SWR data hooks and UI hooks
  components/       shared UI components
  layout/           auth and dashboard layouts (topbar, sidebar)
  pages/            screens
  utils/            formatting and parsing helpers
```
