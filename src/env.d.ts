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
  __lightboxInstance?: { destroy: () => void } | null;
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
  __baseInitHandler?: () => void;
  __animInitHandler?: () => void;
  __animationObserver?: IntersectionObserver | null;
  __cleanupBackToTop?: (() => void) | null;
  __themeObserver?: MutationObserver | null;
  __heroInitHandler?: () => void;
  __videoPlayerClickHandler?: (e: MouseEvent) => void;
  __videoPlayerLoadHandler?: () => void;
  __videoPrefetchDelegationInitialized?: boolean;
  __galleryInitHandler?: () => void;
  __lightboxInitHandler?: () => void;
  __handleThemeChange?: (e: Event) => void;
  __tagHapticsInitialized?: boolean;
  __tiltDelegationInitialized?: boolean;
  __video?: unknown;
  _plyrPrefetched?: boolean;
}

// Global variable augmentation for Node/Bun SSG environment
declare var __publishDateFormatter: Intl.DateTimeFormat | undefined;
