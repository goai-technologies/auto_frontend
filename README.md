# GoAI Workflows – Frontend Control Plane

This is the React frontend for **GoAI Workflows** – a control plane for turning Jira / Linear tickets into production‑ready GitHub pull requests in minutes. It provides a tenant dashboard, integrations setup, project configuration, workflow runs, auto‑polling, and MCP (Cursor) setup screens.

The app currently uses **mock data only**; you can use this UI to design and test flows before wiring it to a real backend.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn‑style UI components
- **State / Data**: Local React state + mock data, React Query scaffolding in place
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
  - `/onboarding` – post‑signup wizard for connecting integrations and creating the first project (mocked).

- **App (behind sidebar layout)**
  - `/` – **Dashboard** showing:
    - Tenant overview.
    - Integration status cards (GitHub, Jira, Linear).
    - Summary stats (projects, successful runs, active runs).
    - Recent runs table with status badges and PR links.
  - `/integrations` – Configure mock GitHub / Jira / Linear connections, with modal forms.
  - `/projects` – List of projects with repo + ticket‑source mappings and actions to view, run workflows, and configure auto‑polling.
  - `/projects/:projectId` – Project detail, repo + issue‑source panels, and recent runs for that project.
  - `/projects/:projectId/run` – One‑off **Run Workflow** screen (paste ticket link/ID, optional branch override, dry‑run toggle).
  - `/projects/:projectId/autopoll` – Auto‑polling rule editor (JQL or Linear filters, interval, active toggle).
  - `/activity` – Global run activity table with filters by project and status.
  - `/runs/:runId` – Run detail with status, metadata, and a scrollable log timeline.
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
- `src/lib/mock-data.ts` – Mock tenant, projects, runs, events, and auto‑poll rules.
- `src/pages/*` – All marketing, auth, and app pages.

## Next Steps / Backend Integration

This frontend is wired to mock data but designed for a real backend API. A good next step is to:

- Implement REST or GraphQL endpoints for:
  - Auth, tenants, integrations, projects, runs, auto‑polling rules, and MCP config.
- Replace `mock-data.ts` and hard‑coded calls with React Query hooks that talk to your backend.
- Secure everything with tenant‑scoped auth (e.g., JWT with `tenant_id`).

Once those pieces are in place, the UI can be switched from mock mode to live data with minimal changes.

