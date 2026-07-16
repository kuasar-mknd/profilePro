# Agent Context: ProfilePro

## Project Overview

Portfolio website for Samuel Dulex, focusing on video content creation and photography. Built with performance and aesthetics in mind, deployed on Cloudflare Pages.

## Tech Stack

- **Core Framework**: Astro v6 (static SSG, no UI framework — .astro components only)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript & JavaScript (ESM)
- **Package Manager**: pnpm (unit tests run with `bun test`)

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

- **Start Dev Server**: `pnpm run dev`
- **Build**: `pnpm run build`
- **Lint**: `pnpm run lint`
- **Check**: `pnpm run check` (Format + Lint + Typecheck)
- **Unit Tests**: `pnpm run test` (bun test)
- **E2E Tests**: `pnpm run test:e2e` (Playwright, dev server must be running)

## Conventions

- **Components**: PascalCase (e.g., `VideoPlayer.astro`, `SocialIcon.astro`).
- **Pages/Routes**: kebab-case (e.g., `about.astro`).
- **Directories**: kebab-case.
- **Styling**: Utility-first with Tailwind CSS v4.
- **Images**: Located in `src/assets` for optimization when possible.
