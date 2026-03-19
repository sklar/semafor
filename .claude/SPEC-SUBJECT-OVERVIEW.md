# Subject Overview

## Overview

Add client-side grade filtering and card/table view switching to the 13 subject-level Přehled pages. No auth, no database, no server-side code. Pure progressive enhancement with Solid 1.x and localStorage.

## Stack

- **Framework**: Astro Starlight (fully static, no adapter changes needed)
- **UI framework**: Solid 1.x (client-side islands)
- **State persistence**: localStorage

---

## Target Pages

SubjectOverview renders on exactly 13 pages — subject-level and JaS sub-area listing pages:

- `/cesky-jazyk/`
- `/matematika/`
- `/ja-a-svet/informacni-a-komunikacni-technologie/`
- `/ja-a-svet/vychova-k-obcanstvi/`
- `/ja-a-svet/vychova-ke-zdravi/`
- `/ja-a-svet/dejepis/`
- `/ja-a-svet/fyzika/`
- `/ja-a-svet/chemie/`
- `/ja-a-svet/prirodopis/`
- `/ja-a-svet/zemepis/`
- `/ja-a-svet/clovek-a-svet-prace/`
- `/pohyb-umeni-kultura/`
- `/hry-relaxace-aktivity/`

NOT on the `/ja-a-svet/` hub page.
NOT on individual topic pages (those have Banner, "Co to znamená", roadmap, etc.).

These 13 pages are generated from a single template via `import.meta.glob()` from content collections. SubjectOverview integration is a one-place change in that template.

---

## Client-Side State (localStorage)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `semafor:grade` | `"6" \| "7" \| "8" \| "9" \| "all"` | `"all"` | Grade filter — single-select enum, one value at a time |
| `semafor:view` | `"cards" \| "table"` | `"cards"` | Active view mode |

Both settings are global — changing them on one Přehled page affects all others.

---

## UI Components (Solid 1.x)

Each Solid component lives in its own folder under `src/components/<component>/` (e.g. `grade-filter/`). Files use kebab-case.

### `SubjectOverview.tsx`

Main interactive wrapper. Composes GradeFilter, ViewToggle, CardView, and TableView.

Receives topic data as props (serialized from Astro at build time via `import.meta.glob()`).

```typescript
interface Topic {
  number: number;          // e.g. 1, 2, ... 29
  title: string;           // topic name
  slug: string;            // directory name, e.g. "01-pocetni-operace"
  grades: number[];        // available grades, e.g. [6, 7, 8, 9] or [8, 9] for chemistry
}

interface SubjectOverviewProps {
  subject: string;         // e.g. "matematika"
  topics: Topic[];
}
```

Uses `client:load` hydration directive for immediate interactivity.

### `grade-filter/GradeFilter.tsx`

- Presentational radio group — receives `grade: Accessor<Grade>` + `onGradeChange` props.
- Single-select: `6. ročník | 7. ročník | 8. ročník | 9. ročník | Vše`
- Native `<fieldset>` + `<input type="radio">` + `<label>` for accessibility.
- Does NOT own localStorage — parent (SubjectOverview) handles persistence.
- Shared types/constants in `grade-filter/grade.ts`.

### `ViewToggle.tsx`

- Toggle between Cards and Table view: `Karty | Tabulka`
- Reads/writes `semafor:view` in localStorage.
- Available to all users (no auth required).

### `CardView.tsx`

- Renders topics as a card grid.
- Each card shows: topic number, title, link to topic page.
- Grade filter determines which grade link the card points to:
  - Specific grade selected → card links to `/{subject}/{slug}/{grade}-rocnik`
  - "Vše" selected → card links to `/{subject}/{slug}/` (the overview page)
- No progress indicators in this feature.

### `TableView.tsx`

- Renders topics as a table.
- Columns: `#` | `Téma` | `6. ročník` | `7. ročník` | `8. ročník` | `9. ročník`
- Grade filter **mutes** non-selected grade columns via styles (opacity, color). Columns remain in layout — no hiding, no layout shift. "Vše" shows all four columns unmuted.
- Each grade cell contains a link to the topic-grade page.
- Topic name cell links to the topic overview page.
- Topics with fewer grades (e.g. Chemistry: only 8-9) show "—" in unavailable grade cells.
- No progress indicators or checkboxes in this feature.

---

## Integration with Starlight

The 13 target pages are rendered from a single template that uses `import.meta.glob()`. The SubjectOverview component is added once in that template:

```astro
---
import SubjectOverview from '@/components/subject-overview/subject-overview.tsx';
// topics already collected via import.meta.glob()
---

<!-- existing page content -->

<SubjectOverview
  client:load
  subject={subject}
  topics={topics}
/>
```

Topic list is derived from the file system at build time — no manual maintenance, no drift.

---

## File Structure

```
src/
├── components/
│   ├── Banner.astro              # existing
│   ├── Skill.astro               # existing
│   ├── SkillItem.astro           # existing
│   ├── SiteTitle.astro           # existing
│   ├── grade-filter/
│   │   ├── GradeFilter.tsx
│   │   ├── GradeFilter.module.css
│   │   └── grade.ts
│   ├── subject-overview/
│   │   └── subject-overview.tsx
│   └── view-toggle/
│       └── view-toggle.tsx
tests/
├── unit/
│   └── grade-filter.test.tsx
vitest.config.ts
```

---

## Astro Configuration

```typescript
// astro.config.mjs
import solidJs from '@astrojs/solid-js';

export default defineConfig({
  integrations: [
    starlight({ /* existing config */ }),
    solidJs(),
  ],
});
```

No include filter — no framework mixing. No adapter changes. Site remains fully static.

---

## Accessibility

All interactive elements must be keyboard-navigable and screen-reader friendly. GradeFilter uses native `<fieldset>` + `<input type="radio">` (no ARIA overrides needed). ViewToggle TBD.

---

## Testing

Vitest 4.x with `@vitest/browser-playwright` (Chromium) and `@solidjs/testing-library`. Config in `vitest.config.ts`. CI runs `pnpm test` in the PR workflow after lint and typecheck.

- **Unit tests**: each component in isolation — GradeFilter state changes, ViewToggle persistence, CardView link generation per grade, TableView column muting logic.
- **E2E tests**: full user flows — select a grade → verify card links update, switch view → refresh page → verify view persists, verify all 13 pages render SubjectOverview correctly.

---

## What's Next

- Skeleton loaders for the SubjectOverview mount phase.
- Motion / animation library for micro-interactions and transitions.
- Progress tracking with auth and database (see Progress Tracking spec).
