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

All Solid components live in `src/components/solid/` with `.tsx` extension.

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

### `GradeFilter.tsx`

- Rendered at top of SubjectOverview.
- Single-select control: `6. ročník | 7. ročník | 8. ročník | 9. ročník | Vše`
- Only one value active at a time (enum, not multi-select).
- Reads/writes `semafor:grade` in localStorage.
- Available to all users (no auth required).

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
import SubjectOverview from '@/components/solid/SubjectOverview.tsx';
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

## File Structure (New)

```
src/
├── components/
│   ├── Banner.astro              # existing
│   ├── Skill.astro               # existing
│   ├── SkillItem.astro           # existing
│   ├── SiteTitle.astro           # existing
│   └── solid/
│       ├── SubjectOverview.tsx
│       ├── GradeFilter.tsx
│       ├── ViewToggle.tsx
│       ├── CardView.tsx
│       └── TableView.tsx
```

---

## Astro Configuration Changes

```typescript
// astro.config.mjs — add Solid integration
import solidJs from '@astrojs/solid-js';

export default defineConfig({
  integrations: [
    starlight({ /* existing config */ }),
    solidJs({ include: ['**/solid/*'] }),
  ],
});
```

No adapter changes. No output mode changes. Site remains fully static.

---

## Accessibility

All interactive elements must be keyboard-navigable and screen-reader friendly. Specific ARIA patterns (button group vs radio group, etc.) will be determined during implementation.

---

## Testing

Testing strategy and tooling (Vitest, Playwright, etc.) to be decided during implementation. Tests are a deliverable, not optional.

- **Unit tests**: each component in isolation — GradeFilter state changes, ViewToggle persistence, CardView link generation per grade, TableView column muting logic.
- **E2E tests**: full user flows — select a grade → verify card links update, switch view → refresh page → verify view persists, verify all 13 pages render SubjectOverview correctly.

---

## What's Next

- Skeleton loaders for the SubjectOverview mount phase.
- Motion / animation library for micro-interactions and transitions.
- Progress tracking with auth and database (see Progress Tracking spec).
