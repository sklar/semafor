# Semafor

[![PR](https://github.com/sklar/semafor/actions/workflows/pr.yml/badge.svg)](https://github.com/sklar/semafor/actions/workflows/pr.yml)

Knowledge base for home-schooling parents (grades 6–9), bridging the gap between
formal Czech curriculum (ŠVP) and everyday home education practice.

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for full project context.

## 🧰 Stack

- [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Biome](https://biomejs.dev/) (lint + format)

## 🗂️ Project Structure

```
/
├── resources/                         # source data (tabulka-pokroku.xlsx)
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   └── docs/
│   │       ├── cesky-jazyk/           # 17 topics
│   │       ├── matematika/            # 29 topics
│   │       ├── ja-a-svet/             # 131 topics
│   │       ├── pohyb-umeni-kultura/   # 16 topics
│   │       └── hry-relaxace-aktivity/ # 9 topics
│   └── styles/
├── astro.config.mjs
└── package.json
```

## 🧑‍🚀 Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build to `./dist/` |
| `pnpm preview` | Preview production build |
| `pnpm lint.check` | Check with Biome |
| `pnpm lint.write` | Fix with Biome |
| `pnpm type.check` | Typecheck with `astro check` |

## 📄 License

[CC BY 4.0](LICENSE) — free to share and adapt with attribution.
