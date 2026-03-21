# Semafor

Knowledge base built with Astro Starlight. Full spec in [SPEC.md](SPEC.md).

## Tech Stack

- **Package manager**: pnpm
- **Language**: TypeScript (strict mode)
- **Framework**: Astro 5 + Starlight + Solid.js 1.x
- **Linting/Formatting**: Ultracite (Biome)
- **Locale**: Czech (`cs`) — root locale, no multilingual setup

## File Names

- kebab-case, no diacritics
- Prefix 01-, 02-, ... 09-, 10-, 11-, ...
- File name = URL slug
- Frontmatter: camelCase for custom variables (Starlight convention)

## Terminology

- **dítě** (never „žák" or „student")
- **rodič** or **vzdělavatel** (never „učitel")
- name tip sections **Poznámky** (not „Poznámky pro učitele")
- tone: friendly, practical, encouraging — parent speaking to parent

## Custom Components

Astro components live directly in `src/components/`. Solid (interactive) components use a component-folder pattern: `src/components/<name>/`, each with `*.module.css` using Starlight design tokens.

**Astro:**
- `Banner.astro` — displays original ŠVP outcome text
- `Skill.astro` + `SkillItem.astro` — traffic-light indicator (levels: `none`/`novice`/`adept`/`master`)
- `SiteTitle.astro` — logo + site name in header
- `TopicCards.astro` — progressive enhancement wrapper for SubjectOverview
- Starlight overrides: `Footer`, `Hero`, `PageTitle`, `Sidebar`, `SidebarSublist`, `SidebarRestorePoint`, `Copyright`

**Solid:**
- `subject-overview/` — main interactive wrapper composing all below
- `card-view/` — topic card grid
- `table-view/` — topic table with grade columns
- `grade-filter/` — single-select grade radio group + `grade.ts` types
- `view-toggle/` — cards/table radio toggle + `view.ts` types

## Lib Utilities

- `src/lib/topics.ts` — `Topic` interface, `parseTopics()`
- `src/lib/href.ts` — `topicHref()` link generation
- `src/lib/sidebar.ts` — `getSubAreaSlugs()` for JaS sub-area filtering

## Testing

Vitest + `@vitest/browser-playwright` + `@solidjs/testing-library`.

- Unit: `tests/unit/` → `pnpm test`
- E2E: `tests/e2e/` → `pnpm test.e2e`

## MDX — Known Issues

- `<->` and similar `<` patterns in text break JSX parser → use Unicode arrows (`↔`, `→`, `←`)
- Czech curly quotes (`„"`) must not appear inside JSX attributes (e.g. `text="…"`)

## Navigation

Sidebar config in `src/sidebar.config.ts` — hybrid: manual groups with `autogenerate` for individual directories.
