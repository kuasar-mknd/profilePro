/**
 * 🛠️ Share Utility
 *
 * Centralized logic for sharing content using Web Share API
 * with a fallback to clipboard.
 */

export interface ShareData {
  title?: string;
  url?: string;
}

export type ShareResult = "shared" | "copied" | "failed" | "cancelled";

/**
 * Shares the provided content or defaults to the current page info.
 * Attempts navigator.share first, then falls back to navigator.clipboard.
 *
 * @param data - Title and URL to share
 * @returns Result of the share operation
 */
export async function shareContent(data: ShareData = {}): Promise<ShareResult> {
  const title =
    data.title || (typeof document !== "undefined" ? document.title : "");
  const url =
    data.url || (typeof window !== "undefined" ? window.location.href : "");

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return "cancelled";
      }

      // 🛡️ Sentinel: Dev-only logging
      // @ts-ignore - import.meta.env is provided by Astro/Vite
      if (import.meta.env?.DEV) {
        console.error(
          "Error sharing:",
          err instanceof Error ? err.message : "Unknown error",
        );
      }
      return "failed";
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);

      // 🎨 Palette: Haptic Feedback
      if (navigator.vibrate) navigator.vibrate([50]);

      return "copied";
    } catch (err) {
      // 🛡️ Sentinel: Dev-only logging
      // @ts-ignore - import.meta.env is provided by Astro/Vite
      if (import.meta.env?.DEV) {
        console.error(
          "Failed to copy to clipboard:",
          err instanceof Error ? err.message : "Unknown error",
        );
      }
      return "failed";
    }
  }

  return "failed";
}
