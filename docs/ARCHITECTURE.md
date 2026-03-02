# Architecture Documentation

> **Note:** This project is a statically generated site (SSG) built with **Astro 5**.

## 🏗 High-Level Architecture

The project follows the "Islands Architecture" (Astro) combined with a component-based structure. It emphasizes **performance**, **accessibility**, and **SEO**.

### 1. Layers (Clean Architecture Concepts)

To maintain a scalable and testable codebase, the project structure maps to Clean Architecture concepts within the context of an Astro SSG:

- **Domain/Content Layer**: Located in `src/content/`. Acts as the core data domain, defining schemas and content collections for projects.
- **Application/Pages Layer**: Located in `src/pages/` and `src/layouts/`. Handles routing and page-level composition (analogous to Use Cases).
- **Infrastructure/Astro-Core**: Located in `src/components/`, `src/utils/`, and config files. Implements the UI components, integrations, and external tools.

**Where to add new endpoints/use-cases:**
To add a new endpoint or use-case, define the routing in the Application/Pages Layer (`src/pages/`) and implement the business logic or data schema in the Domain/Content Layer (`src/content/`).

### 2. Data Flow & State Management

- **Build Time**: Astro fetches data from Content Collections (`src/content/project`) and config files to generate static HTML.
- **Runtime State**:
  - **URL-Driven**: Most state (active page, project details) is derived from the URL.
  - **View Transitions**: The `<ClientRouter />` maintains a persistent SPA-like experience. Global state (like scroll position or theme) is preserved across navigations.
  - **Islands**: Interactive components (VideoPlayer, ContactForm) manage their own local state using standard DOM events or framework-specific hooks (React).

### 3. Key Technologies

- **Astro 5**: Core framework.
- **Tailwind CSS 4**: Styling engine (via Vite plugin).
- **npm**: Package Manager.
- **Node.js**: Runtime.
- **Playwright**: E2E Testing.
- **Plyr**: Video player abstraction.

---

## ⚡ Asset Optimization Pipeline

This project implements a custom, high-performance asset pipeline to ensure top-tier Core Web Vitals.

### Image Optimization (`scripts/optimize-images.js`)

- **Engine**: Uses `sharp` directly (bypassing Astro's default image service for the initial asset generation if needed, though Astro's own `<Image />` is also used).
- **Format**: Converts source images to **AVIF** (Quality 68).
- **Caching**: Implements a "Smart Cache" by comparing `mtime` of source vs. output files. Optimization is skipped if the source hasn't changed, significantly speeding up local dev and CI builds.
- **Sizing**: Resizes images to a `maxWidth` (e.g., 1600px) to prevent serving unnecessarily large files.

### Critical Rendering Path

- **Inline Styles**: CSS is inlined (`inlineStylesheets: "always"`) to eliminate render-blocking network requests.
- **Font Optimization**: Fonts (Inter, Outfit, Space Grotesk) are self-hosted via `@fontsource` to avoid Google Fonts layout shifts.
- **OG Image Generation**: Dynamic Open Graph images are generated at build time for each project using `satori` (HTML-to-SVG) and `resvg` (SVG-to-PNG), ensuring high-quality social previews without runtime overhead.

---

## 🛠 Extension Guide

### Adding a New Page

1.  Create a file in `src/pages/my-page.astro`.
2.  Use the `BaseLayout`:

    ```astro
    ---
    import Base from "../layouts/Base.astro";
    ---

    <Base title="My Page">
      <h1>Content</h1>
    </Base>
    ```

### Adding a New Project

1.  Add a new MDX file in `src/content/project/my-project.mdx`.
2.  Follow the schema defined in `src/content/config.ts`:
    ```yaml
    title: "Project Title"
    publishDate: 2024-01-01
    description: "Short description"
    img: "./image.jpg"
    img_alt: "Description of image"
    tags: ["Video", "Event"]
    ---
    Content goes here...
    ```

### Adding a New UI Component

1.  Create `src/components/ui/MyComponent.astro`.
2.  If it needs interactivity, script logic goes into a `<script>` tag or a framework component (e.g., React).

---

## 🔄 CI/CD Pipeline

Workflows are defined in `.github/workflows/`:

1.  **CI (`ci.yml`)**:
    - Triggers on Push & PR.
    - Sets up Node 20.
    - Installs dependencies (`npm ci --legacy-peer-deps`).
    - Runs `npm run check` (Lint + Types + Format).
    - Runs `npm run test:e2e` (Playwright).
    - Builds the site `npm run build`.

2.  **Security**:
    - **CodeQL**: Scans JS/TS for vulnerabilities.
    - **Dependency Review**: Checks for vulnerable packages in PRs.

3.  **Deploy**:
    - Deploys to Cloudflare Pages (typically handled via Cloudflare's own integration or a separate deploy workflow).

---

## 🧩 Architectural Concepts

- **Islands Architecture**: Keeps the site fast by stripping most JavaScript from the page, only hydrating interactive "islands".
- **View Transitions**: Astro's `<ClientRouter />` enables SPA-like navigation while keeping the multi-page architecture.
- **Content Collections**: Type-safe content management for Markdown/MDX.
