# Palette's Journal

## 🎨 Palette's Design System Notes

### Accessibility Patterns

- **Focus Rings:**
  - Small/Icon buttons: `focus-visible:ring-2 focus-visible:ring-pacamara-accent focus-visible:ring-offset-2`
  - Large Cards/Surfaces: `focus-visible:ring-4 focus-visible:ring-pacamara-accent focus-visible:ring-offset-2`
  - Inputs: `focus:ring-4 focus:ring-pacamara-accent/10` (border handles the main color)

- **Stretched Link Pattern:**
  - Use a transparent `absolute inset-0 z-10` anchor for the main card action.
  - Nested interactive elements (buttons/tags) must have `z-20` and `relative` to sit above the stretched link.

- **Feedback:**
  - Forms must announce errors via `aria-live="assertive"`.
  - Success messages use `aria-live="polite"`.
  - Buttons should show a loading spinner and disable themselves during async operations.

## 2025-02-18 - Label Highlighting on Focus
**Learning:** Highlighting the label in the accent color when an input is focused (`group-focus-within:text-pacamara-accent`) significantly improves the visual association between the active field and its label, especially in long forms.
**Action:** Apply the `group` class to form containers and `group-focus-within:text-accent` to labels in all future form components.
