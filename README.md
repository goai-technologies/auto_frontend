# GoAI Workflows – Frontend Control Plane

This is the React frontend for **GoAI Workflows** – a control plane for turning Jira / Linear tickets into production‑ready GitHub pull requests in minutes. It provides a tenant dashboard, integrations setup, project configuration, workflow runs, auto‑polling, and MCP (Cursor) setup screens.

The app now targets a live backend API for auth, dashboard, runs, projects, integrations, and onboarding.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn‑style UI components
- **State / Data**: React Query + typed API client modules
- **Icons**: lucide‑react
- **Notifications**: sonner
- **Testing**: Vitest + React Testing Library

## Key Screens

- **Landing (`/landing`)**
  - Marketing page explaining GoAI, with hero log showing an example ticket → PR workflow and under‑5‑minute timings.
  - Sections for **Features**, **How It Works**, and **Pricing**, plus CTA buttons to login/register.
  - Theme toggle (light/dark) in the navbar.

- **Auth & Onboarding**
  - `/login` – simple email/password login screen.
  - `/register` – registration form capturing name, org, email, password.
  - `/onboarding` – backend-driven setup checklist from `/api/v1/onboarding/status`.

- **App (behind sidebar layout)**
  - `/` – **Dashboard** showing:
    - Tenant overview.
    - Integration status cards (GitHub, Jira, Linear).
    - Summary stats (projects, successful runs, active runs).
    - Recent runs table with status badges and PR links.
  - `/integrations` – Configure GitHub / Jira / Linear with masked secret UX and webhook subscription setup.
  - `/projects` – List of projects with repo + ticket‑source mappings and actions to view, run workflows, and configure auto‑polling.
  - `/projects/:projectId` – Project detail, repo + issue‑source panels, and recent runs for that project.
  - `/projects/:projectId/run` – One‑off **Run Workflow** screen (paste ticket link/ID, optional branch override, dry‑run toggle).
  - `/projects/:projectId/autopoll` – Auto‑polling rule editor (JQL or Linear filters, interval, active toggle).
  - `/activity` – Runs operations table with filtering/search/sorting/pagination (URL-synced).
  - `/runs/:runId` – Run detail with confidence, ticket links, events, step reruns, and artifacts list/detail.
  - `/users` – Admin-only user management (list/create/update).
  - `/mcp` – Instructions and JSON snippet for configuring GoAI as a Cursor MCP server.

All app pages share a responsive sidebar layout with a **GoAI Control Plane** navigation and a **sun/moon theme toggle** in the top header.

## Theming

- Light and dark themes are implemented via a custom `ThemeProvider`:
  - Theme is stored in `localStorage` and synced to the `<html>` element as `light` or `dark`.
  - Tailwind design tokens (`--background`, `--foreground`, etc.) are defined for both modes.
- Dark mode uses a subtle multi‑radial gradient background to give the dashboard a premium, “control‑center” feel.

## Getting Started

From the project root:

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173` or similar) and visit:

- `http://localhost:5173/landing` – marketing/landing page
- `http://localhost:5173/` – dashboard (mock authenticated view)

## Project Structure (high‑level)

- `src/main.tsx` – React entrypoint.
- `src/App.tsx` – Routing and providers (QueryClient, ThemeProvider, Tooltips, Toasters).
- `src/components/ui/*` – Reusable shadcn‑style UI primitives.
- `src/components/AppLayout.tsx` – Sidebar + header shell for authenticated pages.
- `src/components/AppSidebar.tsx` – Navigation sidebar.
- `src/components/ThemeProvider.tsx` – Light/dark theme context.
- `src/lib/api/*` – Domain API clients (auth, runs, projects, integrations, onboarding, users, webhooks, system).
- `src/hooks/api/*` – React Query hooks for backend resources.
- `src/pages/*` – All marketing, auth, and app pages.

## API Configuration

Set the API base URL with:

```bash
VITE_API_BASE_URL=/api/v1
```

If omitted, the frontend defaults to `/api/v1`.

## Backend Hardening Notes

- List endpoints consume `{ data: { items, pagination } }`.
- Integration secrets are never displayed; UI uses `has_credentials` and `masked_credentials_hint`.
- 401 on protected APIs clears session and redirects to login.
- 403 on admin endpoints is surfaced as permission messaging in-page.
- Webhook subscription create requires a `secret`.

