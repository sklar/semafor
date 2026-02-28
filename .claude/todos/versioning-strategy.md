# Versioning Plan: CalVer + Clack Changesets

## Context

Content-based website. Semver doesn't fit — no meaningful major/minor/patch for content changes. Custom changeset workflow: interactive prompt → commit file → auto-generate changelog on merge. CalVer versioning.

## Decisions

- **Versioning**: CalVer `YYYY.MM.DD` with daily collision counter (`2026.02.25`, `2026.02.25.1`)
- **No `@changesets/cli`** — custom script, full control
- **CLI**: `@clack/prompts` (devDependency, pinned exact)
- **Single project**, not monorepo
- **Changelog**: `CHANGELOG.md` at repo root, prepended on each release
- **Releases**: GitHub Releases with grouped notes, PR + commit links
- **No emojis** in changelog or release notes
- **Directory**: `.changesets/` (plural)
- **Testing**: `workflow_dispatch` preview mode before merging to main

## Architecture

```
scripts/changeset.mjs             ← interactive CLI, creates .changesets/*.md
.changesets/*.md                   ← pending changes, committed with PRs
.github/workflows/release.yml     ← runs on push to main, consumes changesets
CHANGELOG.md                       ← auto-generated, prepended per release
```

## Change Types

| Type | Use for |
|------|---------|
| `chore` | clean-ups, minor tweaks, not visible to user |
| `ci` | build, deploy, dependencies, workflows |
| `content` | new/updated articles, pages, copy |
| `doc` | documentation (README, guides) |
| `feature` | new functionality or integration |
| `fix` | bug fix, broken link, typo |
| `test` | test additions or changes |

## Changeset File Format

```markdown
---
type: content
scope: blog
date: 2026-02-25T14:30:00.000Z
---

Add new article about CalVer versioning strategies
```

Files named `<type>-<random-hex>.md` inside `.changesets/`.

## CLI Flow (`pnpm changeset`)

1. Select change type (single select)
2. Enter scope / affected area (text, optional)
3. Enter short summary (text, required)
4. Enter longer description (text, optional, supports markdown)
5. Writes `.changesets/<type>-<id>.md`

## GitHub Action Flow (on push to `main`)

1. Check if any `.changesets/*.md` files exist → skip if none
2. Generate CalVer tag, checking existing git tags for daily collisions
3. Parse all changeset files, group entries by type
4. For each file: derive PR number + commit hash via `git log` + `gh pr list`
5. Build changelog entry with grouped sections, each line: `- #<pr> <short-sha> <summary>`
6. Prepend entry to `CHANGELOG.md`
7. Update `package.json` `calver` field (keep `version` as `0.0.0` for npm compat)
8. Delete consumed `.changesets/*.md` files
9. Commit, tag, push
10. Create GitHub Release with notes

## TODO

- [ ] Update `scripts/changeset.mjs` — new types, no emojis, `.changesets/` dir
- [ ] Update `.github/workflows/release.yml` — new types, no emojis, `.changesets/` dir, PR+commit linking
- [ ] Install `@clack/prompts` as exact devDependency
- [ ] Add `changeset` script to `package.json`
- [ ] Add `calver` field to `package.json`
- [ ] Create `.changesets/.gitkeep`
- [ ] Update `scripts/README.md` — new types, no emojis, `.changesets/` dir
- [ ] Update `.claude/rules/workflow.md` — add changeset instructions
- [ ] Add `workflow_dispatch` preview mode to release workflow for E2E testing
- [ ] Test E2E: push branch → trigger manually → review artifacts → remove dispatch trigger
- [ ] Validate with branch protection / CI setup

## Files to Modify

- `scripts/changeset.mjs`
- `.github/workflows/release.yml`
- `package.json`
- `scripts/README.md`
- `.claude/rules/workflow.md`
- `.changesets/.gitkeep` (new)
