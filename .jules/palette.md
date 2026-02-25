
## 🎨 Interaction: Focus Harmony (2025-02-18)
**Context:** Interactive elements had rich `hover` transforms (scale, color shifts) but static default focus rings.
**Solution:** Implemented `focus-visible` styles that mirror `hover` effects.
- **Pattern:** `hover:scale-110` → `focus-visible:scale-110`
- **Pattern:** `group-hover:scale-105` → `group-focus-within:scale-105`
**Learnings:**
- `SocialIcon` and `Tag` need direct `focus-visible:scale`
- Complex cards (`Post.astro`) need `group-focus-within` on the container to animate child elements when focused.
- **Verification:** Visual confirmation is essential as `focus` simulation in tests can be tricky.
