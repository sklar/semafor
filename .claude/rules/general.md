# Semafor

Knowledge base built with Astro Starlight.

## Tech Stack

- **Package manager**: pnpm
- **Language**: TypeScript (strict mode)
- **Framework**: Astro 5 + Starlight
- **Linting/Formatting**: Ultracite (Biome)
- **Locale**: Czech (`cs`) — root locale, no multilingual setup

## Technical Conventions

### Directory Structure

```
src/content/docs/
  cesky-jazyk/
    01-rozlisuje-subjektivni-a-hodnotici-sdeleni.md
    02-principy-respektujici-komunikace.md
    ...
  matematika/
    01-pocetni-operace.md
    ...
```

### File Names

- kebab-case
- No diacritics or special characters
- Prefix 01-, 02-, ... 09-, 10-, 11-, ...
- File name = URL slug

### Frontmatter

- camelCase for custom variables (Starlight convention)
- Only `title` (required) for now

```yaml
---
title: "Human-readable topic name"
---
```
