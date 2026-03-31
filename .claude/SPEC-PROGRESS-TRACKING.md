# Progress Tracking

Builds on Subject Overview feature. Adds authentication, database, and per-user progress tracking.

## Overview

Parents can log in with Google and mark topic-grade pairs as completed. Progress is visible on the subject-level Přehled pages in both card and table views. Table view allows managing progress via checkboxes.

## Stack Additions (on top of Subject Overview)

- **Auth**: Better Auth (Google OAuth)
- **ORM**: Drizzle (SQLite dialect)
- **Database**: Cloudflare D1
- **Data fetching**: TanStack Query (`@tanstack/solid-query`)
- **Astro mode**: Server (static by default, server-rendered API routes only)

---

## Database Schema (Drizzle)

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Better Auth manages these tables (auto-generated via CLI):
// - user
// - session
// - account
// - verification

// Our table:
export const userProgress = sqliteTable('user_progress', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  slug: text('slug').notNull(),           // e.g. "matematika/01-pocetni-operace/6-rocnik"
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Unique constraint: one row per user + slug
// CREATE UNIQUE INDEX idx_user_slug ON user_progress(user_id, slug);
```

### Slug convention

Mirrors the content directory path: `{subject}/{topic-dir}/{grade}`

Examples:

```
cesky-jazyk/01-rozlisuje-subjektivni-a-hodnotici-sdeleni/6-rocnik
matematika/15-pythagorova-veta/8-rocnik
ja-a-svet/42-anticke-recko/7-rocnik
```

### Query patterns (plain English)

- **"Get all of Jan's math progress"** — find every row for this user where slug starts with `matematika/`. Powers the Přehled page on load.
- **"Get Jan's math progress for 7th grade only"** — same, but slug must also end with `/7-rocnik`. Used when grade filter is active.
- **"Jan clicked a checkbox"** — insert a new row, or update the existing one if it already exists (upsert). One write per click.

---

## API Routes

All under `src/pages/api/`. These are the only server-rendered endpoints. API route files must NOT export `prerender`.

### `src/pages/api/auth/[...all].ts`

Better Auth catch-all handler. Manages OAuth flow, sessions, callbacks.

```typescript
import { auth } from '@/lib/auth';
import type { APIRoute } from 'astro';

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};
```

### `src/pages/api/progress.ts`

**GET** `?subject=matematika` or `?subject=matematika&grade=7-rocnik`

Returns `{ [slug]: boolean }` map for the authenticated user.

**POST** `{ slug: string, completed: boolean }`

Upserts a single progress entry. Returns the updated row.

Both return `401` if not authenticated.

---

## Auth

### `src/lib/auth.ts` (server)

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  socialProviders: {
    google: {
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
```

### `src/lib/auth-client.ts` (client)

```typescript
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient();
```

---

## Data Fetching (TanStack Query)

`@tanstack/solid-query` handles progress data fetching, caching, and mutations.

### Progress query

```typescript
const progress = createQuery(() => ({
  queryKey: ['progress', subject],
  queryFn: () => fetch(`/api/progress?subject=${subject}`).then(r => r.json()),
  enabled: !!session(),   // only fetch when authenticated
}));
```

Provides built-in loading and error states. Caches results — navigating away and back serves from cache without refetching.

### Toggle mutation

```typescript
const toggle = createMutation(() => ({
  mutationFn: (data: { slug: string; completed: boolean }) =>
    fetch('/api/progress', { method: 'POST', body: JSON.stringify(data) }),
  onMutate: async (data) => {
    // optimistic update: toggle checkbox immediately
  },
  onError: (err, data, context) => {
    // revert on failure, show toast
  },
  onSettled: () => {
    // refetch to ensure consistency
  },
}));
```

Handles optimistic updates, error rollback, and deduplication (prevents panic-clicking from firing duplicate requests).

### Provider setup

`QueryClientProvider` wraps the `SubjectOverview` component:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const queryClient = new QueryClient();

// in SubjectOverview.tsx
<QueryClientProvider client={queryClient}>
  {/* GradeFilter, ViewToggle, CardView, TableView */}
</QueryClientProvider>
```

---

## UI Changes (on top of Subject Overview components)

### `UserMenu.tsx` (new)

- Lives in the Starlight header (via component override).
- Not authenticated: shows "Přihlásit se" — click triggers `authClient.signIn.social({ provider: 'google' })`.
- Authenticated: shows user avatar/name and "Odhlásit" button.
- Mobile layout: will require prototyping — Starlight's mobile header is tight.

### `SubjectOverview.tsx` (updated)

- Wraps children in `QueryClientProvider`.
- On mount: checks auth state via `authClient.useSession()`.
- If authenticated: progress data is fetched via TanStack Query (`createQuery`).
- If not authenticated: renders views without progress data (same as Subject Overview).
- Passes progress data down to CardView and TableView.

### `CardView.tsx` (updated)

- When authenticated and progress data is available, cards show a completion indicator (emoji/checkmark + CSS class).
- Completion logic (binary, no partial indicators):
  - Specific grade selected (e.g. "6") → checkmark if that topic-grade is completed.
  - "Vše" selected → checkmark only if ALL available grades for that topic are completed.
- When not authenticated: no indicators (same as Subject Overview).

### `TableView.tsx` (updated)

- Grade columns remain muted (not hidden) per Subject Overview behavior.
- When authenticated: grade cells show checkboxes instead of plain links. Checked = completed.
- Clicking a checkbox: triggers `createMutation` — optimistic toggle, POST in background, revert on error.
- Error handling: toast/snackbar notification on failure. Toast implementation TBD (library vs custom).
- When not authenticated: cells show links only (same as Subject Overview).

### `Toast.tsx` (new)

- Simple notification component for error states.
- Implementation approach TBD (library vs custom).

---

## Astro Configuration Changes

```typescript
// astro.config.mjs — update for server mode + CF adapter
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',              // static by default, server-rendered API routes only
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    starlight({ /* existing config */ }),
    solidJs(),
  ],
});
```

All content pages remain prerendered (default in server mode). Only `src/pages/api/` routes are server-rendered.

---

## File Structure (New/Changed from Subject Overview)

```
src/
├── db/
│   ├── index.ts                 # Drizzle client (D1 binding)
│   └── schema.ts                # Drizzle schema
├── lib/
│   ├── auth.ts                  # Better Auth server config
│   └── auth-client.ts           # Better Auth client
├── pages/
│   └── api/
│       ├── auth/
│       │   └── [...all].ts      # Better Auth catch-all
│       └── progress.ts          # GET/POST progress
├── components/
│   ├── subject-overview/
│   │   └── SubjectOverview.tsx
│   ├── card-view/
│   │   └── CardView.tsx
│   ├── table-view/
│   │   └── TableView.tsx
│   ├── grade-filter/
│   ├── view-toggle/
│   ├── user-menu/
│   │   └── UserMenu.tsx
│   └── toast/
│       └── Toast.tsx
drizzle/
├── migrations/                   # Generated by drizzle-kit
└── drizzle.config.ts
wrangler.jsonc                    # update with D1 binding
```

---

## Environment Variables

```env
# Better Auth
BETTER_AUTH_SECRET=<random-32-char-string>
BETTER_AUTH_URL=https://semafor.sklar.workers.dev

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

D1 binding is configured in `wrangler.jsonc`, not via env vars.

---

## Accessibility

All interactive elements must be keyboard-navigable and screen-reader friendly. Specific ARIA patterns will be determined during implementation.

---

## Testing

Testing strategy and tooling to be decided during implementation. Tests are a deliverable, not optional.

- **Unit tests**: progress fetch/upsert logic, auth state handling, completion indicator logic (card: all-grades-done check, table: checkbox toggle + optimistic revert).
- **E2E tests**: full login flow (Google OAuth), mark topic as completed → refresh → verify persistence, toggle checkbox → simulate API error → verify revert + toast.
- **API mocking**: MSW (Mock Service Worker) for mocking `/api/progress` and `/api/auth` endpoints in tests without hitting real services.

---

## Edge Cases

- **Topics with fewer grades** (e.g. Chemistry: only 8-9): `grades` array in props controls which columns have checkboxes. Missing grades show "—", no checkbox.
- **No JS**: pages render as static Starlight content. Solid components don't mount. Progress tracking is progressive enhancement.
- **Concurrent edits**: last write wins. At 3-10 users with separate accounts, conflicts are impossible.
- **Session expiry**: if POST returns 401, show a toast and refresh auth state.

---

## What's Next

- Microsoft OAuth (few lines of Better Auth config).
- Dashboard / aggregate progress views across subjects.
- Skeleton loaders for progress data loading.
- Motion / animation library for micro-interactions and transitions.
