# Tactical Report Feed (Frontend)

Frontend implementation for the Tactical Report take‑home. It renders a personalized, explainable intelligence feed driven by a multi‑signal ranking API. Built with the Next.js App Router, React Query for data fetching/caching, and Tailwind for styling.

**Live demo:** https://tactical-report-frontend.vercel.app/login

## Core Features
- Credentialed access (`demo` / `tacticalreport`) persisted in `localStorage` with logout support.
- Server-prefetched data and client hydration (`app/feed/page.tsx`) to reduce first contentful load.
- User-scoped, paginated feed (`DEFAULT_PAGE_SIZE` = 10) with category filter and placeholder caching to avoid UI flicker.
- Toggleable signal breakdown chips per item to expose the multi-signal scoring inputs.
- Loading skeletons and guarded error states for both user roster and feed queries.
- Clean, responsive layout with Tailwind; reusable UI pieces (`FeedCard`, `FeedFilters`, `FeedPagination`, skeletons).

## Tech Stack & Architecture
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
- **Data layer:** `@tanstack/react-query` with server-side prefetch + `HydrationBoundary` for initial users/feed, client queries for subsequent interactions.
- **Styling:** TailwindCSS.
- **Auth:** Lightweight client-side gate in `lib/auth.ts` using `localStorage`; redirects to `/login` when unauthenticated and clears state on logout.
- **API contract:** Configurable `API_BASE` via `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`). Endpoints used:
  - `GET /api/users` → roster used to seed the default selected user.
  - `GET /api/feed?user_id={id}&page={n}&page_size={k}[&category=...]` → ranked feed items containing `score`, `signals`, `reason`, and optional `why_it_matters`.

## How Requirements Are Reflected in the Code
- **Personalization by user & category:** `FeedFilters` selects a user (fallback to first returned) and optional category, resetting pagination on change.
- **Pagination with smooth UX:** `FeedPagination` drives `page` state; React Query uses `placeholderData` to prevent flicker while fetching new pages.
- **Multi-signal explainability:** `FeedCard` renders tags, reason text, and a toggle to reveal signal weights (`signals` map) for transparency.
- **Prefetch & fast first paint:** `app/feed/page.tsx` prefetches users and the first feed page server-side, then hydrates on the client.
- **Loading & error handling:** Skeletons (`FeedCardSkeleton`, `app/feed/loading.tsx`) cover initial/empty states; consolidated error banner for user/feed failures.
- **Auth gating:** `LoginForm` checks existing session on mount and redirects; feed page guards and provides logout.

## Project Structure
- `app/login/page.tsx` — login surface using `LoginForm`.
- `app/feed/page.tsx` — SSR prefetch + hydration, then delegates to `FeedClient`.
- `components/` — feed UI (card, filters, pagination, header, skeletons) and React Query provider.
- `lib/api.ts` — typed API client and response contracts.
- `lib/auth.ts` — demo auth, session storage helpers.
- `lib/constants.ts` — categories, stale times, defaults.

## Running Locally
1) Install deps  
```bash
npm install
```

2) Set API base (optional if using default `http://localhost:8000`)  
```bash
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

3) Start dev server  
```bash
npm run dev
```
Visit `http://localhost:3000`, log in with `demo` / `tacticalreport`, and open `/feed`.

4) Production build  
```bash
npm run build && npm start
```

## Manual Test Plan (quick)
- Login succeeds with `demo` / `tacticalreport`; bad creds show inline error.
- Reload on `/feed` keeps the session; logout returns to `/login`.
- Switching user or category reloads feed and resets to page 1.
- Pagination updates totals and disables buttons at edges.
- “Show breakdown” reveals signal chips per item; hides when toggled off.
- API errors show the red inline banner; skeletons appear during initial/slow loads.

## Future Improvements
- Replace client-only auth with real backend tokens + refresh flow.
- Persist filter state in the URL (search params) for shareable views and back/forward navigation.
- Add virtualization for large result sets and optimistic UI for rapid page switches.
