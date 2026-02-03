# Tactical Report Feed Frontend

> **Multi-signal personalized intelligence feed** — Frontend for the Tactical Report take-home, delivering explainable, user-tailored content.

**Live Demo:** https://tactical-report-frontend.vercel.app/login

---

## Problem Statement

**The Challenge:** Present a personalized intelligence feed that reflects multi-signal ranking, explainability, and fast navigation for different users and categories.

**Requirements Met:**
- Auth-gated access (demo creds) with logout
- Multi-signal explainability (score + signal breakdown)
- Pagination and filtering by user and category
- Smooth UX (prefetch, optimistic/page placeholders, virtualization)
- Production deployment

---

## Solution Overview

A **Next.js App Router** frontend that pairs server prefetch with client hydration and React Query caching:

- **Auth Guarded Flow** — `/login` uses demo creds (`demo` / `tacticalreport`) and `localStorage` session; `/feed` redirects if unauthenticated.
- **SSR Prefetch + Hydration** — `app/feed/page.tsx` prefetches users and the first feed page, then hydrates on the client to reduce FCP.
- **React Query Data Layer** — Client queries with placeholder data, stale times, and neighbor prefetch for fast page switches.
- **Optimistic Pagination + Virtualization** — Keep prior items visible during page transitions and virtualize long lists for smooth scrolling.
- **Explainable Cards** — Each `FeedCard` shows reason, score, tags, and optional signal breakdown.
- **Resilient UX** — Skeletons, loading states, and a shared error banner cover fetch failures.

---

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) (Optional) Point to your API
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"

# 3) Run the dev server
npm run dev
# open http://localhost:3000 and login with demo / tacticalreport

# 4) Production build
npm run build && npm start
```

---

## How It Works

- **Auth & Routing:** `lib/auth.ts` manages `localStorage` session; `LoginForm` redirects authenticated users to `/feed`; logout clears the session.
- **Data Fetching:** `app/feed/page.tsx` prefetches `users` and the first `feed` page on the server, hydrates via `HydrationBoundary`, and the client uses React Query for subsequent requests.
- **Filtering & Pagination:** `FeedFilters` drives user/category selection (resets to page 1). `FeedPagination` updates `page` with optimistic placeholders and neighbor prefetch to limit flicker.
- **Virtualized List:** `@tanstack/react-virtual` powers `FeedClient` virtualization to keep scroll smooth on large result sets.
- **Explainability:** `FeedCard` renders score, category, tags, reason, and optional per-signal chips.
- **Loading/Error States:** `FeedCardSkeleton` and `app/feed/loading.tsx` cover initial/empty states; a shared inline alert appears on user or feed errors.

---

## API Integration

Base URL: `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`)

- `GET /api/users` — populate the user roster; first user becomes the default selection.
- `GET /api/feed?user_id={id}&page={n}&page_size={k}[&category=...]` — returns `items`, `total`, `score`, `reason`, `signals`, and optional `why_it_matters`.

---

## Project Structure

- `app/login/page.tsx` — login surface with demo creds.
- `app/feed/page.tsx` — SSR prefetch + hydration, hands off to `FeedClient`.
- `components/` — UI and state:
  - `FeedClient` (virtualized list, pagination, optimistic placeholders)
  - `FeedCard`, `FeedFilters`, `FeedPagination`, `FeedHeader`, skeletons
  - `QueryProvider` for React Query client
- `lib/` — `api` (typed fetchers), `auth` (session helpers), `constants` (categories, stale times, page size).

---

## Architecture

| Layer      | Technology                  | Purpose                                  |
|------------|-----------------------------|------------------------------------------|
| UI/SSR     | Next.js 16 (App Router)     | Pages, layouts, server prefetch/hydrate  |
| Data       | @tanstack/react-query       | Caching, stale times, prefetch           |
| Virtualize | @tanstack/react-virtual     | Smooth scrolling on large feeds          |
| Styling    | TailwindCSS  | Responsive UI                            |
| Language   | TypeScript + React 19       | Frontend implementation                  |

---

## Manual Test Plan (quick)
- Login with `demo` / `tacticalreport`; bad creds show inline error.
- Reload `/feed` keeps the session; Logout returns to `/login`.
- Change user or category → page resets to 1 and data refreshes.
- Pagination updates totals, prefetches neighbor pages, reuses placeholders, and disables buttons at edges.
- Toggle “Show breakdown” to reveal/hide signal chips.
- Slow network: skeletons appear; errors show the inline red banner.

---

## Future Improvements
- Replace client-only auth with real tokens + refresh.
- Persist filters/page in URL params for shareable, back/forward-safe navigation.
