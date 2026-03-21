# Subject Overview

## Overview

Add client-side grade filtering and card/table view switching to the 13 subject-level Přehled pages. No auth, no database, no server-side code. Progressive enhancement with Solid 1.x and localStorage — static LinkCards for no-JS, Solid island for interactive features.

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

---

## Progressive Enhancement

Two-layer rendering on each overview page:

1. **No-JS baseline**: `TopicCards.astro` renders static `<CardGrid>` + `<LinkCard>` from topic data. Fully functional without JavaScript.
2. **JS enhancement**: Solid island hydrates and replaces static cards with interactive SubjectOverview (grade filtering, view switching, grade-aware links).

The swap uses `data-static-cards` attribute — Solid island hides the static content `onMount`.

---

## Client-Side State (localStorage)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `semafor:grade` | `"6" \| "7" \| "8" \| "9" \| "all"` | `"all"` | Grade filter — single-select enum, one value at a time |
| `semafor:view` | `"cards" \| "table"` | `"cards"` | Active view mode |

Both settings are global — changing them on one Přehled page affects all others.

---

## Data Model

### Topic interface (`src/lib/topics.ts`)

```typescript
interface Topic {
  number: number;          // from frontmatter `number` field, e.g. 1, 2, ... 131
  title: string;           // from frontmatter `title` field, e.g. "Početní operace s celými a racionálními čísly"
  description?: string;    // from frontmatter, ŠVP outcome text (same as Banner text)
  slug: string;            // directory name, e.g. "01-pocetni-operace"
  grades: number[];        // available grades, e.g. [6, 7, 8, 9] or [8, 9] for chemistry
}
```

Topics are extracted at build time via `parseTopics(import.meta.glob(...))`. Description is the single source of truth — used by Banner (`{frontmatter.description}`), LinkCard, and CardView.

### Link generation (`src/lib/href.ts`)

```typescript
topicHref(subject, slug, grade):
  grade === 'all' → /{subject}/{slug}/
  else            → /{subject}/{slug}/{grade}-rocnik
```

Reused by CardView and TableView.

---

## UI Components (Solid 1.x)

Each Solid component lives in its own folder under `src/components/<component>/`. Files use kebab-case.

### `grade-filter/GradeFilter.tsx`

- Presentational radio group — receives `grade: Accessor<Grade>` + `onGradeChange` props.
- Single-select: `6. ročník | 7. ročník | 8. ročník | 9. ročník | Vše`
- Native `<fieldset>` + `<input type="radio">` + `<label>` for accessibility.
- Does NOT own localStorage — parent (SubjectOverview) handles persistence.
- Shared types/constants in `grade-filter/grade.ts`.

### `view-toggle/ViewToggle.tsx`

- Presentational radio group — receives `view: Accessor<View>` + `onViewChange` props.
- Toggle between Cards and Table view: `Karty | Tabulka`
- Native `<fieldset>` + `<input type="radio">` + `<label>` for accessibility.
- Does NOT own localStorage — parent (SubjectOverview) handles persistence.
- Shared types/constants in `view-toggle/view.ts`.

### `card-view/CardView.tsx`

- Renders topics as a card grid matching Starlight's LinkCard/CardGrid styling.
- Each card shows: title, optional description, link to topic page.
- Grade filter determines which grade link the card points to (via `topicHref()`).
- CSS module (`CardView.module.css`) with Starlight tokens.
- Currently wrapped by temporary `CardViewIsland.tsx` (grade='all').

### `table-view/TableView.tsx`

- Renders topics as a table.
- Columns: `#` | `Téma` | `6. ročník` | `7. ročník` | `8. ročník` | `9. ročník`
- Grade filter **mutes** non-selected grade columns via styles (opacity, color). Columns remain in layout — no hiding, no layout shift. "Vše" shows all four columns unmuted.
- Each grade cell contains a link to the topic-grade page (via `topicHref()`).
- Topic name cell links to the topic overview page.
- Topics with fewer grades (e.g. Chemistry: only 8-9) show "—" in unavailable grade cells.
- No progress indicators or checkboxes in this feature.

### `subject-overview/SubjectOverview.tsx`

Main interactive wrapper. Composes GradeFilter, ViewToggle, CardView, and TableView.

- Receives `topics: Topic[]` and `subject: string` props (serialized from Astro at build time).
- Manages localStorage for grade + view state.
- Replaces temporary `CardViewIsland.tsx` inside `TopicCards.astro`.

---

## Integration with Starlight

### `TopicCards.astro`

Astro wrapper providing progressive enhancement. Each overview MDX page uses:

```mdx
import TopicCards from '@/components/TopicCards.astro'
import { parseTopics } from '@/lib/topics'

export const topics = parseTopics(import.meta.glob('./*/*.mdx', { eager: true }))

<TopicCards topics={topics} subject="cesky-jazyk" />
```

For ja-a-svet sub-areas, topics are filtered via `getSubAreaSlugs()` from `src/lib/sidebar.ts`:

```mdx
import { getSubAreaSlugs } from '@/lib/sidebar'

export const slugs = getSubAreaSlugs('ja-a-svet/chemie')
export const topics = parseTopics(import.meta.glob('./*/*.mdx', { eager: true })).filter(t => slugs.includes(t.slug))
```

Topic list is derived from the file system at build time — no manual maintenance, no drift.

---

## File Structure

```
src/
├── components/
│   ├── Banner.astro                    # uses {frontmatter.description}
│   ├── TopicCards.astro                # progressive enhancement wrapper
│   ├── card-view/
│   │   ├── CardView.tsx
│   │   ├── CardView.module.css
│   │   └── CardViewIsland.tsx          # temporary, replaced by SubjectOverview
│   ├── grade-filter/
│   │   ├── GradeFilter.tsx
│   │   ├── GradeFilter.module.css
│   │   └── grade.ts
│   ├── subject-overview/
│   │   └── SubjectOverview.tsx
│   ├── table-view/
│   │   ├── TableView.tsx
│   │   └── TableView.module.css
│   └── view-toggle/
│       ├── ViewToggle.tsx
│       ├── ViewToggle.module.css
│       └── view.ts
├── lib/
│   ├── href.ts                         # topicHref()
│   ├── sidebar.ts                      # getSubAreaSlugs()
│   └── topics.ts                       # Topic, parseTopics()
tests/
├── unit/
│   ├── card-view.test.tsx
│   ├── grade-filter.test.tsx
│   ├── topics.test.ts
│   └── view-toggle.test.tsx
vitest.config.ts
```

---

## Accessibility

All interactive elements must be keyboard-navigable and screen-reader friendly. GradeFilter and ViewToggle both use native `<fieldset>` + `<input type="radio">` + `<label>` (no ARIA overrides needed).

---

## Testing

Vitest 4.x with `@vitest/browser-playwright` (Chromium) and `@solidjs/testing-library`. Config in `vitest.config.ts`. CI runs `pnpm test` in the PR workflow after lint and typecheck.

- **Unit tests**: each component in isolation — GradeFilter state changes, ViewToggle persistence, CardView link generation per grade, TableView column muting logic, topicHref, parseTopics.
- **Integration tests**: SubjectOverview composed behavior — grade filter affects both views, view toggle switches card/table, localStorage persistence.

---

## What's Next

- Skeleton loaders for the SubjectOverview mount phase.
- Motion / animation library for micro-interactions and transitions.
- Progress tracking with auth and database (see Progress Tracking spec).
