/**
 * 🎨 Palette: Add copy button to code blocks
 * Wraps code blocks and adds a copy button for better developer experience
 */

// 🛡️ Sentinel: Safe DOM construction to prevent innerHTML usage
const createIcon = (isCheck = false) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  if (isCheck) {
    svg.setAttribute("class", "text-green-400");
    const polyline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    polyline.setAttribute("points", "20 6 9 17 4 12");
    svg.appendChild(polyline);
  } else {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "9");
    rect.setAttribute("y", "9");
    rect.setAttribute("width", "13");
    rect.setAttribute("height", "13");
    rect.setAttribute("rx", "2");
    rect.setAttribute("ry", "2");
    svg.appendChild(rect);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
    );
    svg.appendChild(path);
  }
  return svg;
};

function addCopyButtons() {
  // ⚡ Bolt: Use CSS pseudo-class to pre-filter code blocks that already have buttons
  // Prevents redundant DOM querying and JS execution on View Transitions
  const codeBlocks = document.querySelectorAll(
    ".prose pre:not(.code-wrapper pre)",
  );
  // ⚡ Bolt: Optimized forEach loop into a standard for loop to avoid array callback allocation.
  for (let i = 0; i < codeBlocks.length; i++) {
    const node = codeBlocks[i];
    const pre = node as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper relative group mb-6";
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement("button");
    btn.className =
      "copy-code-btn group/btn absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 text-white/70 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pacamara-accent backdrop-blur-sm";
    btn.setAttribute("aria-label", "Copier le code");

    btn.appendChild(createIcon(false));

    const tooltip = document.createElement("span");
    tooltip.className =
      "copy-tooltip absolute top-full right-0 mt-2 text-xs font-medium text-white bg-black/80 backdrop-blur-md px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10";
    tooltip.setAttribute("aria-hidden", "true");
    tooltip.textContent = "Copier le code";
    btn.appendChild(tooltip);

    wrapper.appendChild(btn);
  }
}

// ⚡ Bolt: Event Delegation for copy buttons
// Reduces listener count and main-thread work by using a single document-level listener
const handleCopyClick = async (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const btn = target.closest(".copy-code-btn");
  if (!btn) return;

  const wrapper = btn.closest(".code-wrapper");
  const pre = wrapper?.querySelector("pre");
  if (!pre) return;

  const announcer = document.getElementById("code-copy-announcer");
  const tooltip = btn.querySelector(".copy-tooltip");

  try {
    await navigator.clipboard.writeText(pre.textContent || pre.innerText);

    // Safe replace without destroying the tooltip
    const currentIcon = btn.querySelector("svg");
    if (currentIcon) {
      btn.replaceChild(createIcon(true), currentIcon);
    }
    if (tooltip) tooltip.textContent = "Copié !";

    // 🎨 Palette: Announce success to screen readers
    if (announcer) {
      announcer.textContent = "Code copié dans le presse-papiers";
    }

    setTimeout(() => {
      const currentIcon = btn.querySelector("svg");
      if (currentIcon) {
        btn.replaceChild(createIcon(false), currentIcon);
      }
      if (tooltip) tooltip.textContent = "Copier le code";

      if (announcer) {
        announcer.textContent = "";
      }
    }, 2000);
  } catch {}
};

export function initCopyButtons() {
  // ⚡ Bolt: Singleton Listener Pattern for copy buttons
  if (window.__copyBtnClickHandler) {
    document.removeEventListener("click", window.__copyBtnClickHandler);
  }
  window.__copyBtnClickHandler = handleCopyClick as EventListener;
  document.addEventListener("click", window.__copyBtnClickHandler);

  addCopyButtons();
  // Re-run on navigation
  document.addEventListener("astro:after-swap", addCopyButtons);
}
