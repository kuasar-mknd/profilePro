## 2025-05-18 - Label in Name Mismatch
**Learning:** WCAG 2.5.3 (Label in Name) requires that the accessible name of an interface element includes its visible text. In the footer, the link text "Samuel Dulex" was overridden by `aria-label="Retour à l'accueil"`. This prevents speech recognition users (e.g., "Click Samuel Dulex") from activating the link and can confuse screen reader users who see one thing but hear another.
**Action:** When adding `aria-label` to elements with visible text, always ensure the `aria-label` contains the visible text, preferably at the beginning.
