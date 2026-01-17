# Architecture Documentation

## Overview

**ProfilePro** is a high-performance portfolio website built with **Astro**. It is a static site generated (SSG) project that focuses on speed, accessibility, and visual storytelling.

The project follows the "Island Architecture" pattern where interactive components are hydrated only when needed, keeping the initial JavaScript bundle minimal.

## Tech Stack

- **Framework**: Astro 5 (Static Site Generation)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Runtime**: Bun (for development and build scripts)
- **Deployment**: Cloudflare Pages (via GitHub Actions)
- **Testing**: Playwright (E2E)

## Project Structure

```text
src/
├── assets/          # Optimized images and media
├── components/      # UI components
│   ├── common/      # Reusable components (Header, Footer, SEO)
│   ├── features/    # Domain-specific components (Projects, Video)
│   └── ui/          # Basic UI elements (Lightbox, Buttons)
├── content/         # MDX content collections
│   └── project/     # Portfolio projects
├── layouts/         # Page templates (Base.astro)
├── pages/           # Route definitions
│   ├── [slug].astro # Dynamic page generation
│   ├── rss.xml.js   # RSS feed generation
│   └── robots.txt.ts # Robots.txt generation
└── utils/           # Helper functions (Security, Formatting)
```

## Key Concepts

### Content Collections
Projects are stored as MDX files in `src/content/project/`. Astro's Content Collections API is used to validate the frontmatter schema (defined in `src/content/config.ts` if present, or inferred).

### Optimization Pipeline
1. **Images**: `scripts/optimize-images.js` processes raw images using `sharp` before the build to generate AVIF/WebP variants.
2. **CSP**: `scripts/generate-csp.mjs` generates strict Content Security Policy headers after the build, hashing inline scripts.
3. **Fonts**: Critical fonts are preloaded in `Base.astro`.

### Routing
- `src/pages/index.astro`: Homepage.
- `src/pages/project/[slug].astro`: Individual project pages generated statically at build time.
- `src/pages/rss.xml.js`: Generates the RSS feed.

## Extending the Project

### Adding a New Page
Create a new `.astro` file in `src/pages/`. For example, `src/pages/contact.astro` will be accessible at `/contact`.

### Adding a New Project
Create a new `.mdx` file in `src/content/project/` with the required frontmatter:
```yaml
---
title: "Project Name"
pubDate: 2024-01-01
intro: "Short description"
image: "../../assets/project-image.jpg"
tags: ["Video", "Web"]
---
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration:
1. **CI Workflow**: Runs on every push/PR.
   - Installs dependencies (Bun).
   - Runs linting (ESLint, Stylelint).
   - Checks formatting (Prettier).
   - Runs Typecheck (Astro check).
   - Builds the site.
   - Runs E2E tests (Playwright).
2. **Security**:
   - CodeQL analysis.
   - Dependency review.
