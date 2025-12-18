## 2025-12-14 - External Links

**Learning:** Links opening in a new tab (`target="_blank"`) must warn screen reader users.
**Action:** Append "(ouvre un nouvel onglet)" to the `aria-label` and `title` of external links.

## 2024-07-25 - Keep Commits Clean of Verification Artifacts

**Learning:** Code reviews will reject submissions that include temporary tools or dependencies used for verification. Committing test files, new dev dependencies (like Playwright), and lockfile changes related to verification pollutes the git history and misrepresents the project's actual dependencies.
**Action:** Always revert any changes to package.json, lockfiles, and remove all temporary test files or configurations before submitting the final PR. Ensure the commit is focused solely on the intended change.
