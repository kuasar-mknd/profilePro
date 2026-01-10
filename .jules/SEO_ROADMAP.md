# Strategic SEO & Content Roadmap

This document outlines the strategic plan for improving technical SEO, accessibility, and content quality.

## Executive Summary

I have audited the codebase and identified critical technical issues (broken components, missing titles) and content quality opportunities (thin content).

| ID      | Priority | Type          | Location                                              | Issue Description                                                           | Suggested Fix                                                                                      | Status       |
| ------- | -------- | ------------- | ----------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------ |
| SEO-001 | 🔴 P0    | Technical     | `src/pages/404.astro`                                 | Missing specific Page Title (duplicates Home title)                         | Define specific `title` prop in `Base` or `SeoHead` (e.g. "Page non trouvée")                      | ✅ Done      |
| SEO-002 | 🔴 P0    | Technical     | `src/components/features/projects/PhotoGallery.astro` | Component is empty (0 bytes) but imported in `project/[slug].astro`         | Implement component or switch import to `src/components/ui/ImageGallery.astro`                     | ✅ Done      |
| SEO-003 | 🟠 P1    | Content       | `src/content/project/xxcent-sourire.mdx`              | Thin Content (< 150 words)                                                  | Expand content to describe the project, technical challenges, and impact.                          | Todo         |
| SEO-004 | 🟠 P1    | Content       | `src/content/project/48h-geneve-2024.mdx`             | Thin Content (~250 words)                                                   | Enrich with more behind-the-scenes details or technical specs.                                     | Todo         |
| SEO-005 | 🟠 P1    | Technical     | `src/components/features/home/ServicesPreview.astro`  | Generic Link Text "En savoir plus sur mon parcours"                         | Change to more descriptive text like "Découvrir mon parcours complet"                              | ✅ Done      |
| SEO-006 | 🟢 P2    | Architecture  | `src/components`                                      | Redundant Gallery Components (`ui/ImageGallery` vs `features/PhotoGallery`) | Consolidate usage to `ui/ImageGallery.astro` and delete `PhotoGallery.astro`                       | ✅ Done      |
| SEO-007 | 🟢 P2    | Accessibility | `src/components/features/projects/VideoPlayer.astro`  | Video Poster is a background image (hidden from screen readers)             | Add `aria-label` or `role="img"` to the poster div with descriptive text                           | ✅ Done      |
| SEO-008 | ⚪ P3    | Accessibility | `src/components/common/Header.astro`                  | Logo `alt` is empty (decorative)                                            | Acceptable as text is adjacent, but could be "Logo Samuel Dulex" for clarity if strictly standard. | Low Priority |
| SEO-009 | ⚪ P3    | Content       | Global                                                | `config.mjs` default title/description used on 404                          | Customize metadata for non-content pages.                                                          | ✅ Done      |

## Strategic Recommendations

### 1. Fix Technical Blockers First

Immediate priority is to resolve the **Broken Gallery Component (SEO-002)** as it likely impacts user experience on project pages. Simultaneously, fix the **404 Page Title (SEO-001)** to avoid duplicate title issues in Google Search Console.

### 2. Consolidate Architecture

Cleanup the code by removing the empty `PhotoGallery.astro` and unifying usage around `ImageGallery.astro`. This reduces confusion and maintenance debt.

### 3. Content Expansion Campaign

Launch a content initiative to expand "Thin" project pages. Aim for **300-500 words** per project, focusing on:

- The Client/Problem
- The Solution/Approach
- Technical Details (Gear, Stack, Setup)
- The Result/Impact

### 4. Accessibility Polish

Once major issues are resolved, do a pass on `aria-labels`, especially for custom interactive elements like the Video Player and specific navigation links.
