# Bolt's Journal - Critical Learnings

## 2025-02-27 - [Initial Setup]

**Learning:** Initialized Bolt's journal for performance tracking.
**Action:** Record critical performance learnings here.

## 2025-02-27 - [Stylesheet Inlining Preference]

**Learning:** User explicitly rejected switching `inlineStylesheets` to "auto" in Astro config. They prioritize PageSpeed scores (which favor eliminating render-blocking resources via inlining) over the caching benefits of external stylesheets for this project.
**Action:** Do not propose changing `inlineStylesheets` to "auto" or removing "always" setting in the future for this repo.
