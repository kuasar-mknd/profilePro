/**
 * ⚡ Bolt: Carousel Touch Optimization
 * Added initialization guard and passive listeners to all touch events
 */
export function initCarouselTouch() {
  const carousel = document.getElementById("hero-carousel");
  const track = document.getElementById("carousel-track");

  // ⚡ Early return guards
  if (!carousel || !track) return;
  if (carousel.dataset.touchInitialized === "true") return;
  carousel.dataset.touchInitialized = "true";

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let rafId: number | null = null;
  let lastTouchX = 0;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      track.style.animationPlayState = "paused";
      const computedStyle = getComputedStyle(track);
      const matrix = new DOMMatrix(computedStyle.transform);
      currentTranslate = matrix.m41;
    },
    { passive: true },
  );

  // ⚡ Bolt: Use requestAnimationFrame for smooth 60fps tracking
  carousel.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      lastTouchX = e.touches[0].clientX;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          const diff = lastTouchX - startX;
          track.style.transform = `translateX(${currentTranslate + diff}px)`;
          rafId = null;
        });
      }
    },
    { passive: true },
  );

  // ⚡ Bolt: Added passive: true to touchend for scroll optimization
  carousel.addEventListener(
    "touchend",
    () => {
      isDragging = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      track.style.transform = "";
      track.style.animationPlayState = "running";
    },
    { passive: true },
  );
}

/**
 * ⚡ Bolt: Carousel Visibility Optimization
 * Pauses the infinite scroll animation when the carousel is not in the viewport
 * to save GPU and main thread resources.
 */
export function initCarouselObserver() {
  const carousel = document.getElementById("hero-carousel");
  const track = document.getElementById("carousel-track");

  if (!carousel || !track) return;

  // Guard against duplicate observers
  if (carousel.dataset.observerInitialized === "true") return;
  carousel.dataset.observerInitialized = "true";

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          track.style.animationPlayState = "running";
        } else {
          track.style.animationPlayState = "paused";
        }
      });
    },
    { rootMargin: "200px" },
  ); // Pre-load animation slightly before it enters viewport

  observer.observe(carousel);
}

/**
 * 🎨 Palette: Smart Focus for Contact CTA
 * Smooth scrolls to form and intelligently manages focus:
 * - Desktop: Focuses input for immediate typing
 * - Mobile: Focuses form container to avoid keyboard pop-up while scrolling
 */
export function initHeroCTA() {
  const cta = document.getElementById("hero-cta-secondary");
  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");

  if (!cta || !form) return;

  // Guard against duplicate listeners
  if (cta.dataset.initialized === "true") return;
  cta.dataset.initialized = "true";

  cta.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if device uses coarse pointer (likely touch/mobile)
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    if (isMobile) {
      // Mobile: Scroll to form container and focus it
      // This brings the form into view without triggering the keyboard
      form.setAttribute("tabindex", "-1");
      form.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Desktop: Focus input directly for immediate typing
      if (nameInput) {
        nameInput.focus({ preventScroll: true }); // Set focus without jump
        nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // Fallback if input not found
        form.setAttribute("tabindex", "-1");
        form.focus({ preventScroll: true });
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}
