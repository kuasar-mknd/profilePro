/**
 * 🎨 Palette: Navigation Utilities
 *
 * This file contains helpers for client-side navigation logic.
 */

/**
 * Initializes a back button that uses window.history.back().
 * The button is hidden if there is no history to go back to (e.g., direct entry).
 *
 * 🛡️ Sentinel: CSP Compliance
 * This avoids inline 'onclick' handlers to support 'script-src-attr none'.
 *
 * @param buttonId - The ID of the button element to initialize
 */
export function initBackButton(buttonId: string = "go-back-btn") {
  const btn = document.getElementById(buttonId);

  // Guard: Check if button exists and hasn't been initialized yet
  // Note: View Transitions might replace the body, so we always re-bind if found.
  // But to be safe against double-binding on the same element instance:
  if (!btn || btn.dataset.initialized === "true") return;

  // 🎨 Palette: Hide button if no history exists to prevent dead clicks
  // history.length includes the current page, so length 1 means no previous page.
  if (window.history.length <= 1) {
    btn.classList.add("hidden");
    return;
  }

  btn.dataset.initialized = "true";
  btn.addEventListener("click", () => {
    window.history.back();
  });
}
