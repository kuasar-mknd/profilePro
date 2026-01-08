## 2024-05-22 - [SecureLinks Accessibility Pattern]
**Learning:** When automating `target="_blank"` security in a global script, relying on `title` updates is insufficient for accessibility.
**Action:** The robust pattern is to check for an existing `aria-label` and append the warning there. If no `aria-label` exists, inject a `<span class="sr-only"> (warning)</span>` inside the anchor tag. This preserves the browser's native accessible name calculation (text content + alt text) while ensuring the warning is part of the name.

## 2024-05-22 - [Accessible Character Counters]
**Learning:** A simple `aria-live` region on a character counter can be too noisy if it announces every keystroke.
**Action:** Implement a "threshold-based" announcer. Keep the visual counter visible (remove `aria-hidden`), but use a separate `sr-only` `aria-live="polite"` element that only populates messages when the user approaches the limit (e.g., >90% usage) or hits the limit. Using a modulo (e.g., every 20 chars) prevents constant chatter.
