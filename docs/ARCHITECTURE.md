# Architecture Documentation

> **Note:** This project is a statically generated site (SSG) built with **Astro 5**.

## 🏗 High-Level Architecture

The project follows the "Islands Architecture" (Astro) combined with a component-based structure. It emphasizes **performance**, **accessibility**, and **SEO**.

### 1. Layers

- **Presentation Layer (Pages)**: Located in `src/pages/`. Files are `.astro` or `.mdx`. They determine routes.
- **Component Layer (UI)**: Located in `src/components/`.
  - `common/`: Global components (Header, Footer).
  - `ui/`: Reusable primitives (Buttons, Cards, Lightbox).
  - `features/`: Complex, domain-specific logic (Projects, VideoPlayer).
- **Content Layer (Data)**: Located in `src/content/`. Uses Astro Content Collections for type-safe Markdown/MDX handling.
- **Core Layer (Config)**: `src/config.mjs`, `src/utils/`, `src/layouts/`.

### 2. Data Flow

1.  **Build Time**: Astro fetches data from Content Collections (`src/content/project`) and config files.
2.  **SSG**: HTML pages are generated static at build time.
3.  **Hydration**: Interactive components (React, Svelte, or vanilla JS scripts) are hydrated only when needed (`client:load`, `client:visible`).

### 3. Key Technologies

- **Astro 5**: Core framework.
- **Tailwind CSS 4**: Styling engine.
- **Bun**: Runtime & Package Manager.
- **Playwright**: E2E Testing.
- **Plyr**: Video player abstraction.

---

## 🛠 Extension Guide

### Adding a New Page
1.  Create a file in `src/pages/my-page.astro`.
2.  Use the `BaseLayout`:
    ```astro
    ---
    import Base from '../layouts/Base.astro';
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
    - Sets up Node 20 & Bun.
    - Installs dependencies.
    - Runs `bun run check` (Lint + Types + Format).
    - Runs `bun run test:e2e` (Playwright).
    - Builds the site `bun run build`.

2.  **Security**:
    - **CodeQL**: Scans JS/TS for vulnerabilities.
    - **Dependency Review**: Checks for vulnerable packages in PRs.

3.  **Deploy**:
    - Deploys to Cloudflare Pages (typically handled via Cloudflare's own integration or a separate deploy workflow).

---

## 🧩 Clean Architecture Mapping

While this is a frontend-heavy SSG project, principles still apply:

- **Domain**: Content Collections (`src/content/`) define the business entities (Projects, Posts).
- **Application**: `src/utils/` and Logic components (`features/`) handle data processing.
- **Infrastructure**: Astro config, Cloudflare adapter, `src/pages/rss.xml.js`.

## 🧪 Testing Strategy

- **E2E Testing**: [Playwright](https://playwright.dev/) is used for end-to-end testing. It verifies critical user flows (Navigation, Lightbox, Contact Form).
- **Static Analysis**: `bun run check` handles TypeScript type checking, ESLint rules, and Prettier formatting.
- **Visual Regression**: Playwright can be extended for visual comparisons if needed (currently verifying critical UI visibility).
