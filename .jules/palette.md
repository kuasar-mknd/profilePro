
## 🎨 Interaction: Focus Harmony (2025-02-18)
**Context:** Interactive elements had rich `hover` transforms (scale, color shifts) but static default focus rings.
**Solution:** Implemented `focus-visible` styles that mirror `hover` effects.
- **Pattern:** `hover:scale-110` → `focus-visible:scale-110`
- **Pattern:** `group-hover:scale-105` → `group-focus-within:scale-105`
**Learnings:**
- `SocialIcon` and `Tag` need direct `focus-visible:scale`
- Complex cards (`Post.astro`) need `group-focus-within` on the container to animate child elements when focused.
- **Verification:** Visual confirmation is essential as `focus` simulation in tests can be tricky.

## 🎨 Visual: Print Optimization (2025-02-18)
**Context:** Default browser print styles often hide headers/footers or clutter the page with navigation.
**Solution:** Used `print:` utilities to selectively show branding while hiding navigation.
- **Pattern:** `print:hidden` on interactive elements (nav, buttons).
- **Pattern:** `body::after` content in `@media print` to add a permanent footer signature/URL.
**Learnings:**
- CSS pseudo-elements are the cleanest way to add print-only text without cluttering the HTML structure.
- Tailwind's `print:` modifier is effective for simple toggles, but `@media print` is needed for global overrides like signatures.
