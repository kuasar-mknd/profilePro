# Palette's Journal

## 2025-12-12 - Mode Switch Accessibility

**Learning:** Toggle buttons need `aria-pressed` state, not just labels.
**Action:** Pair `aria-label` with `aria-pressed`.

## 2025-12-12 - Form Status Feedback

**Learning:** Screen readers need `aria-live` for status changes (loading/success).
**Action:** Add `aria-live="polite"` to status containers.

## 2025-12-12 - Semantic Buttons

**Learning:** Divs with click handlers are keyboard traps.
**Action:** Use `<button>` elements.

## 2025-12-12 - Breadcrumb Separators

**Learning:** Decorative separators create noise for screen readers.
**Action:** Apply `aria-hidden="true"`.

## 2025-12-12 - Reduced Motion

**Learning:** Scroll animations can trigger motion sickness.
**Action:** Check `prefers-reduced-motion` and disable complex animations.

## 2025-12-12 - Image Gallery Keyboard Support

**Learning:** Clickable images need keyboard focus and activation.
**Action:** Add `tabindex="0"`, `role="button"`, and `keydown` listener.

## 2025-12-12 - Skip to Content

**Learning:** Keyboard users need to bypass repetitive navigation.
**Action:** Add a "Skip to content" link as the first focusable element.

## 2025-12-12 - Focus Management

**Learning:** Modals/Lightboxes must capture focus on open and return it on close.
**Action:** Use `element.focus()` in open/close handlers to restore context.

## 2025-12-12 - Decorative Details

**Learning:** Text animations (split characters) can be unreadable to screen readers.
**Action:** Use `aria-label` on the parent word and hide individual animated letters with `aria-hidden="true"`.

## 2025-12-12 - Navigation State

**Learning:** Users need to know which page is active in navigation.
**Action:** Add `aria-current="page"` to the active link.

## 2025-12-13 - Lightbox Context

**Learning:** Lightboxes often lose the context (alt text) of the image they display.
**Action:** Capture and preserve `alt` attributes when opening images in a modal.
