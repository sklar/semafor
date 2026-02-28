# Development Workflow

- Pin exact versions when adding dependencies or devDependencies (no `^` or `~` ranges).
- Verify changes with `pnpm build` — should produce 0 errors.

## Changesets

- Run `pnpm changeset` when making notable changes to create a changeset file.
- Changeset file (`.changesets/<type>-<id>.md`) gets committed with the PR.
- On merge to `main`, the release workflow auto-generates changelog + GitHub Release.
- See `scripts/README.md` for details on change types and workflow.
