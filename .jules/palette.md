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
