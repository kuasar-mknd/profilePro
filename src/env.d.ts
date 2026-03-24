/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY: string;
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __globalResizeObserver?: ResizeObserver | null;
  __cleanupBackToTop?: (() => void) | null;
  __themeObserver?: MutationObserver | null;
  __baseInitHandler?: () => void;
  __animationObserver?: IntersectionObserver | null;
  __animInitHandler?: () => void;
  __lightboxInstance?: { destroy: () => void };
  __lightboxListenerAttached?: boolean;
  __contactInitHandler?: () => void;
  __mobileMenuInitHandler?: () => void;
  __carbonBadgeInitHandler?: () => void;
  __menuInitHandler?: () => void;
  __scrollRevealInitHandler?: () => void;
  __tagHapticsInitHandler?: () => void;
  __mouseBlobInitHandler?: () => void;
  __projectFiltersInitHandler?: () => void;
  __tocInitHandler?: () => void;
  __backBtnInitHandler?: () => void;
  __navHapticsInitHandler?: () => void;
  __cvInitHandler?: () => void;
  __cvKeydownHandler?: (e: KeyboardEvent) => void;
  __cvCleanup?: () => void;
  __tiltDelegationInitialized?: boolean;
  __themeToggleInitHandler?: () => void;
  __themeKeydownHandler?: (e: KeyboardEvent) => void;
  __postHapticsInitHandler?: () => void;
  __postHapticsInitialized?: boolean;
  __copyBtnClickHandler?: (e: MouseEvent) => void;
}

// Global variable augmentation for Node/Bun SSG environment
declare var __publishDateFormatter: Intl.DateTimeFormat | undefined;
