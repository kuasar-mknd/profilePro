# Learnings for DocOps

- Under the Anti-Loop rule, when documentation already exactly mirrors the codebase logic and capabilities (e.g. Astro SSG without Hono/Prisma), do not introduce arbitrary modifications or rewrites solely to generate file changes.
- Always check that `.jules/docops-history.md` explicitly lists files being modified, the exact scope of the update, and the date before submitting a batch of changes under the DocOps persona.
- When creating documentation for tools or package managers (e.g., `pnpm`, `bun`), ensure that the instructions align consistently with the `package.json` package manager (which is `pnpm` in this repository).
