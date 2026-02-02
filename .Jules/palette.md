# Palette's Journal

## Accessibility Patterns

### Dark Mode Contrast in Tags
The default `Tag` component variant uses `text-pacamara-secondary` which has insufficient contrast against the dark mode background.
**Pattern:** Always include `dark:text-white` (or `dark:text-pacamara-accent`) and `dark:border-white/30` when using `text-pacamara-secondary` in components that must adapt to dark mode.

### Accessible Toggle Buttons
For toggle buttons like `ModeSwitch`, use `role="switch"` with `aria-checked` instead of `role="button"` with dynamic `aria-label`.
**Pattern:**
```html
<button role="switch" aria-checked="false" aria-label="Mode sombre">
  <!-- Visuals -->
</button>
```

### Localized Date Labels
Visual dates (e.g., "dd-mm-yyyy") are often ambiguous or hard to read for screen readers.
**Pattern:** Use `Intl.DateTimeFormat` to generate a long, localized string (e.g., "25 juillet 2025") and apply it via `aria-label` to the `<time>` element.

## Interaction Patterns

### Mouse Follower Continuity
When using mouse-following animations that pause when idle, ensure the position state (`blobX`, `blobY`) is preserved between animation frames.
**Anti-Pattern:** Resetting `blobX = mouseX` on every `mousemove` event causes jumping artifacts when the animation restarts.
**Fix:** Initialize position only on the very first interaction.

### Mobile Menu Escape Handling
Avoid duplicate `Escape` listeners in parent (`Header`) and child (`HamburgerButton`) components.
**Pattern:** Consolidate closure logic in the component that manages the state (`HamburgerButton`).
