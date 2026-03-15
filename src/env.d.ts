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

  __cleanupBackToTop?: (() => void) | null;
  __videoPlayerClickHandler?: (e: Event) => void;
  __videoPlayerLoadHandler?: () => void;
  __animationObserver?: IntersectionObserver | null;
  __animInitHandler?: () => void;
  __videoPrefetchDelegationInitialized?: boolean;
  _plyrPrefetched?: boolean;
  __tagHapticsInitialized?: boolean;
  __galleryInitHandler?: () => void;
  __themeObserver?: MutationObserver | null;
  __baseInitHandler?: () => void;
  __tiltDelegationInitialized?: boolean;
  __heroInitHandler?: () => void;
  __lightboxInitHandler?: () => void;
  __handleThemeChange?: (e: Event) => void;
}

// Global variable augmentation for Node/Bun SSG environment
declare var __publishDateFormatter: Intl.DateTimeFormat | undefined;
