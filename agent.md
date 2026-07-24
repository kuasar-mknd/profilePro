# Agent Context: ProfilePro

## Project Overview

Portfolio website for Samuel Dulex, focusing on video content creation and photography. Built with performance and aesthetics in mind, deployed on Cloudflare Pages.

## Tech Stack

- **Core Framework**: Astro v7 (static SSG, no UI framework — .astro components only)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript & JavaScript (ESM)
- **Package Manager & Runtime**: Bun (install, scripts, and unit tests all run with Bun)

## Project Structure

- `src/pages/`: Application routes.
- `src/components/`: Reusable UI components.
  - `features/`: Feature-specific components (e.g., `projects/`, `home/`).
  - `common/`: Shared components (Header, Footer).
  - `ui/`: Generic UI elements.
- `src/content/`: Content collections (MDX files for projects).
- `src/layouts/`: Page layouts.
- `src/assets/`: Optimizable assets (images).
- `public/`: Static assets.

## Key Commands

- **Install**: `bun install`
- **Start Dev Server**: `bun run dev`
- **Build**: `bun run build`
- **Lint**: `bun run lint`
- **Check**: `bun run check` (Format + Lint + Typecheck)
- **Unit Tests**: `bun run test` (bun test)
- **E2E Tests**: `bun run test:e2e` (Playwright builds and previews the site itself)
- **Security Audit**: `bun run audit` (`bun audit --audit-level=high`)

## Conventions

- **Components**: PascalCase (e.g., `VideoPlayer.astro`, `SocialIcon.astro`).
- **Pages/Routes**: kebab-case (e.g., `about.astro`).
- **Directories**: kebab-case.
- **Styling**: Utility-first with Tailwind CSS v4.
- **Images**: Located in `src/assets` for optimization when possible.
