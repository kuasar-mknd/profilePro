/**
 * 🎨 Palette: Accessibility Utilities
 * Centralized focus management and interaction helpers.
 */

export interface FocusTrap {
  activate: () => void;
  deactivate: () => void;
}

/**
 * Creates a focus trap for a given container element.
 *
 * @param container The element to trap focus within.
 * @returns An object with activate and deactivate methods.
 */
export function createFocusTrap(container: HTMLElement): FocusTrap {
  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusableElements = container.querySelectorAll(focusableSelectors);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  return {
    activate: () => {
      container.addEventListener("keydown", handleTab);
      // Focus first element (usually a link in the menu)
      const firstFocusable = container.querySelector(focusableSelectors);
      if (firstFocusable instanceof HTMLElement) {
        // ⚡ Bolt: confirmed 100ms delay to ensure visibility/transition state
        setTimeout(() => firstFocusable.focus(), 100);
      }
    },
    deactivate: () => {
      container.removeEventListener("keydown", handleTab);
    },
  };
}

/**
 * Monitors the menu state (via .overflow-hidden on html) and calls the callback.
 *
 * @param callback Function called with the new menu state.
 * @returns The MutationObserver instance.
 */
export function watchMenuState(
  callback: (isOpen: boolean) => void,
): MutationObserver {
  const html = document.documentElement;
  let wasOpen = html.classList.contains("overflow-hidden");

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const isOpen = html.classList.contains("overflow-hidden");
        if (isOpen !== wasOpen) {
          wasOpen = isOpen;
          callback(isOpen);
        }
      }
    });
  });

  observer.observe(html, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return observer;
}
