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
  cesky-jazyk/          # 17 témat (01–17)
    01-rozlisuje-subjektivni-a-hodnotici-sdeleni/
      index.mdx
      6-rocnik.mdx
      7-rocnik.mdx
      8-rocnik.mdx
      9-rocnik.mdx
    02-principy-respektujici-komunikace/
      index.mdx
      ...
  matematika/           # 29 témat (01–29)
    01-pocetni-operace/
      ...
  ja-a-svet/            # 131 témat (01–131), 10 sub-oblastí
    01-verohodnost-informaci/
      ...
  pohyb-umeni-kultura/  # 16 témat (01–16)
    01-komplexni-dilo/
      ...
  hry-relaxace-aktivity/ # 9 témat (01–09)
    01-empatie-sam-sobe/
      ...
```

### File Names

- kebab-case
- No diacritics or special characters
- Prefix 01-, 02-, ... 09-, 10-, 11-, ...
- File name = URL slug

### Frontmatter

- camelCase for custom variables (Starlight convention)

```yaml
---
title: "Human-readable topic name"
sidebar:
  order: 0
  label: "Přehled"
---
```
