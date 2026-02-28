# CalVer + Changesets

Lightweight versioning for content sites. Uses [CalVer](https://calver.org/) (`YYYY.MM.DD`) with an interactive changeset CLI powered by [Clack](https://github.com/bombshell-dev/clack).

## Workflow

### 1. When making changes

```bash
pnpm changeset
```

Interactive prompt: pick change type (optional), scope (optional), and summary. Creates a `.changesets/<type>-<id>.md` file to commit with your PR.

### 2. On merge to `main`

The GitHub Action (`.github/workflows/release.yml`) automatically:

- Detects changeset files
- Generates a CalVer tag (`2026.02.25`, or `2026.02.25.1` for multiple daily releases)
- Groups changes by type into a changelog entry
- Links each entry to its PR and commit
- Prepends to `CHANGELOG.md`
- Cleans up changeset files
- Creates a git tag + GitHub Release

### Example changeset file

```markdown
---
type: content
scope: blog
date: 2026-02-25T14:30:00.000Z
---

Add new article about CalVer versioning strategies
```

### Change types

Both type and scope are optional. Untyped entries appear ungrouped at the end of the changelog.

| Type | Use for |
|------|---------|
| `chore` | clean-ups, minor tweaks, not visible to user |
| `ci` | build, deploy, dependencies, workflows |
| `content` | new or updated articles, pages, copy |
| `doc` | documentation (README, guides) |
| `feature` | new functionality or integration |
| `fix` | bug fix, broken link, typo |
| `test` | test additions or changes |
