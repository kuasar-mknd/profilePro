## 🎨 Interaction: Positive Validation Feedback (2025-02-18)

**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels

**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition _to_, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2025-02-20 - Skip Link Transitions

**Learning:** Screen reader and keyboard users benefit from skip links that transition smoothly into view rather than abruptly popping into existence via `sr-only` removal. The abrupt layout/visual change can be disorienting.
**Action:** Use CSS transforms (`-translate-y-[150%] focus-visible:translate-y-0`) instead of `sr-only focus:not-sr-only` for skip links to provide spatial context and a smoother experience.

## 2025-10-24 - Accessible Skip-to-Content Links

**Learning:** Using `sr-only` classes that abruptly toggle visibility on focus can cause jarring layout shifts or visual pops for keyboard users.
**Action:** Use CSS transforms (like `absolute -translate-y-[250%] focus-visible:translate-y-0 transition-transform`) to slide skip links smoothly into view when focused, providing a much smoother and intentional UX for keyboard navigation.

## 2025-05-20 - Category Item Counts
**Learning:** Providing immediate feedback on category volume (e.g., "Clip Musical (6)") helps users understand content density before navigating, reducing uncertainty and improving the "scent of information".
**Action:** When implementing filters or categories, include item counts and ensure they are reflected in accessibility attributes (aria-label, title) with proper pluralization (e.g., "1 projet" vs "2 projets" in French).

## 2025-03-01 - Custom Tooltips for Icon-only Buttons
**Learning:** Native browser `title` attributes on icon-only buttons often suffer from unpredictable delay, lack of styling, and inconsistency across OS/browsers, leading to a subpar UX for sighted keyboard and mouse users.
**Action:** Replace `title` attributes with custom CSS-based tooltips (using opacity and transform transitions on hover/focus) for icon-only buttons. Ensure `title` is removed to prevent double tooltips, while maintaining full accessibility via `aria-label` and `sr-only` text.
## 2024-05-24 - Consistent Button Interaction Cues
**Learning:** Default CSS resets in frameworks like Tailwind strip the `cursor: pointer` style from `<button>` elements. While touch interfaces don't require this, desktop users heavily rely on pointer changes to identify interactive elements that lack other strong visual affordances.
**Action:** Ensure all clickable elements, especially `<button>` tags (like `theme-toggle-btn`, `menu_toggle`, `submit-btn`, etc.), explicitly include the `cursor-pointer` utility class to guarantee consistent visual feedback across the interface.

## 2026-05-20 - Mobile Navigation Touch Targets

**Learning:** In full-screen mobile menus, standard desktop-sized navigation links (e.g., 14px) are too small and cramped for optimal touch interaction. Increasing font size and vertical spacing significantly improves the user's ability to navigate accurately and comfortably.
**Action:** For mobile-specific full-screen menus, use larger font sizes (e.g., `text-2xl`) and increased vertical spacing (e.g., `gap-8`) to provide generous tap targets.

## 2025-05-21 - Accessible & Stable Pagination
**Learning:** Pagination requires both semantic structure and visual stability. Hiding "Previous/Next" links when inactive causes layout shifts, while generic labels lack context for screen readers.
**Action:** Wrap pagination in a `<nav>` with an `aria-label`, include a "Page X of Y" status indicator for orientation, and use styled "disabled" states (e.g., `opacity-50 pointer-events-none`) for inactive links to maintain UI layout consistency.

## 2025-03-03 - Form Submit Button Accessibility During Async Loading
**Learning:** Native `disabled` attributes on submit buttons during async loading states remove the button from the tab order and can cause screen readers to lose focus context, potentially missing `aria-live` announcements.
**Action:** Use `aria-disabled="true"` and `aria-busy="true"` managed via JavaScript (along with visual styling classes like `aria-disabled:opacity-70 aria-disabled:cursor-not-allowed`) instead of `disabled`. This prevents the element from losing keyboard focus during submission states.

## 2025-03-03 - Visualizing Keyboard Shortcuts

**Learning:** Keyboard accessibility involves not just behavior but also visual discovery. Keyboard-only users (who aren't using screen readers) might not know a shortcut exists if it's hidden in ARIA attributes.
**Action:** Expose keyboard shortcuts visually (e.g., using `<kbd>` tags) in tooltips or expanding labels so sighted keyboard users can discover and learn them easily.

## 2025-03-03 - Scoped Staggered Animations
**Learning:** When implementing staggered entrance animations across components in Astro, use the `:global()` selector in the parent stylesheet to target child component classes. Ensure initial hidden states (`opacity: 0`) are strictly scoped to the mobile-only parent state to prevent regressions where navigation becomes invisible on desktop.
**Action:** Use `:global(.item)` in parent components and scope defaults to specific parent classes (e.g., `.parent-open :global(.item)`).

## 2025-03-03 - Perceptible Haptic Feedback
**Learning:** Mobile haptic feedback via `navigator.vibrate()` requires a minimum duration to be physically registered by most hardware. While 10ms might seem sufficient in code, it is often imperceptible. A 50ms pulse provides a reliable and satisfying tactile confirmation for toggles and buttons.
**Action:** Use `navigator.vibrate(50)` for consistent haptic feedback on interactive elements.

## 2025-03-04 - Desktop Interaction Expectations for Carousels
**Learning:** Infinite scroll or touch carousels that only support touch-drag events (`touchstart`, `touchmove`) frustrate desktop users who instinctively try to click-and-drag horizontally. Providing visual cues (`cursor: grab`) without supporting mouse drag events creates a broken affordance.
**Action:** Ensure all draggable carousels universally support both touch and mouse drag events (`mousedown`, `mousemove`, `mouseup`, `mouseleave`) and remove `@media (pointer: coarse)` constraints on grab cursors.
## 2026-03-04 - Add missing cursor-pointer to clickable elements
**Learning:** Missing cursor cues are common on custom buttons like <button id="share-btn"> or custom Lightbox control buttons where standard styling isn't applied automatically. These require explicit cursor-pointer classes for better UX.
**Action:** Added cursor-pointer to 5 distinct <button> tags missing the visual cue.

## 2026-03-06 - Enhanced Focus Contrast in Dark Mode
**Learning:** Default focus outlines using brand colors (like Indigo) often lack sufficient contrast (WCAG 2.1) when rendered against dark backgrounds. Using the primary accent color (e.g., Rose/Red) specifically for dark mode focus states significantly improves accessibility for keyboard users without compromising the light mode aesthetic.
**Action:** Explicitly override `:focus-visible` ring colors in dark mode using `.dark :focus-visible { outline-color: var(--color-pacamara-accent); }`.
