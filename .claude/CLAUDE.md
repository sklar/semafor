# Semafor

Knowledge base built with Astro Starlight. Full spec in [SPEC.md](SPEC.md).

## Tech Stack

- **Package manager**: pnpm
- **Language**: TypeScript (strict mode)
- **Framework**: Astro 5 + Starlight
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

- `src/components/Banner.astro` — displays original ŠVP outcome text
- `src/components/Skill.astro` + `SkillItem.astro` — traffic-light indicator (levels: `none`/`novice`/`adept`/`master`)
- `src/components/SiteTitle.astro` — logo + site name in header

## MDX — Known Issues

- `<->` and similar `<` patterns in text break JSX parser → use Unicode arrows (`↔`, `→`, `←`)
- Czech curly quotes (`„"`) must not appear inside JSX attributes (e.g. `text="…"`)

## Navigation

Sidebar config in `src/sidebar.config.ts` — hybrid: manual groups with `autogenerate` for individual directories.
