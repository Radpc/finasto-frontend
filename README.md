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

Variables prefixed with `VITE_` end up in the public JavaScript bundle. Never put secrets in them.

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
