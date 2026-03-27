# Tests

## 🧰 Stack

- [Vitest](https://vitest.dev/) (unit tests, browser mode)
- [Playwright](https://playwright.dev/) (e2e tests + Vitest browser provider)
- [@solidjs/testing-library](https://github.com/solidjs/solid-testing-library) (component tests)

## 🧑‍🚀 Commands

```bash
pnpm test              # vitest single run
pnpm test.e2e          # playwright
pnpm test.e2e.ui       # playwright interactive UI
VITEST_HEADED=1 pnpm test  # vitest with visible browser
```

## 🗂️ Structure

```
tests/
├── unit/
│   ├── topics.test.ts            # parseTopics, formatTopicNumber, topicLabel
│   ├── href.test.ts              # topicHref link generation
│   ├── sidebar.test.ts           # findGroupBySlug, getSubAreaSlugs
│   ├── card-view.test.tsx        # topic card grid + completion indicators
│   ├── table-view.test.tsx       # topic table with grade columns + checkboxes
│   ├── grade-filter.test.tsx     # grade radio group
│   ├── view-toggle.test.tsx      # cards/table toggle
│   ├── subject-overview.test.tsx # integration: composition, localStorage, progress
│   ├── progress.test.ts          # progress API (GET/POST), progressSlug, isTopicCompleted
│   ├── toast.test.tsx            # toast notifications
│   └── user-menu.test.tsx        # sign-in/sign-out UI
└── e2e/
    ├── subject-overview.spec.ts  # hydration, persistence, navigation
    └── progress.spec.ts          # auth, checkboxes, error toasts
```

## 🧪 Unit Test Notes

- Vitest runs in **browser mode** (Chromium via `@vitest/browser-playwright`) — no jsdom
- Solid components rendered with `@solidjs/testing-library`
- Reactivity tested via signal changes → DOM assertions
- localStorage interactions verified with `vi.spyOn`

## ⚗️ E2E Notes

- Playwright auto-starts preview server (`pnpm preview`)
- Tests run against `http://localhost:4321`
- Chromium only
- CI: 2 retries + GitHub reporter
