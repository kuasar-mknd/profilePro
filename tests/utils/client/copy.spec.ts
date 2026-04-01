import { expect, test, describe, beforeEach, afterEach, mock } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

import { initCopyButtons } from "../../../src/utils/client/copy";

describe("Client Utils > copy", () => {
  let clipboardText = "";
  let originalSetTimeout: typeof setTimeout;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = "";

    // Mock navigator.clipboard safely
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mock(async (text: string) => {
          clipboardText = text;
        }),
      },
      writable: true,
      configurable: true
    });

    // Reset window state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.__copyBtnClickHandler = undefined as any;

    originalSetTimeout = global.setTimeout;
  });

  afterEach(() => {
    mock.restore();
    clipboardText = "";
    global.setTimeout = originalSetTimeout;
  });

  test("should wrap un-wrapped code blocks and add copy buttons", () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>console.log('test')</code></pre>
      </div>
    `;

    initCopyButtons();

    const wrapper = document.querySelector(".code-wrapper");
    expect(wrapper).not.toBeNull();

    const pre = wrapper?.querySelector("pre");
    expect(pre).not.toBeNull();

    const btn = wrapper?.querySelector(".copy-code-btn");
    expect(btn).not.toBeNull();

    const tooltip = btn?.querySelector(".copy-tooltip");
    expect(tooltip?.textContent).toBe("Copier le code");
  });

  test("should ignore clicks outside copy buttons", () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>let x = 1;</code></pre>
      </div>
      <button class="other-btn">Other</button>
    `;

    initCopyButtons();

    const otherBtn = document.querySelector(".other-btn") as HTMLButtonElement;
    otherBtn.click();

    // Should do nothing, clipboard should be empty
    expect(clipboardText).toBe("");
  });

  test("should ignore copy buttons without pre element", () => {
    document.body.innerHTML = `
      <div class="code-wrapper">
        <button class="copy-code-btn"></button>
      </div>
    `;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;
    btn.click();

    // Should do nothing, clipboard should be empty
    expect(clipboardText).toBe("");
  });

  test("should copy text when button is clicked", async () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>const a = 1;</code></pre>
      </div>
      <div id="code-copy-announcer"></div>
    `;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;
    expect(btn).not.toBeNull();

    // Trigger click on button
    btn.click();

    // The copy logic uses await navigator.clipboard.writeText
    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    expect(clipboardText).toBe("const a = 1;");

    const tooltip = btn.querySelector(".copy-tooltip");
    expect(tooltip?.textContent).toBe("Copié !");

    const announcer = document.getElementById("code-copy-announcer");
    expect(announcer?.textContent).toBe("Code copié dans le presse-papiers");
  });

  test("should handle copy when svg is missing before copy", async () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>let y = 1;</code></pre>
      </div>
    `;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;

    // Remove svg before click to hit `if (currentIcon)` falsy branch
    const svg = btn.querySelector("svg");
    if (svg) svg.remove();

    btn.click();

    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    expect(clipboardText).toBe("let y = 1;");
  });

  test("should handle copy without announcer or tooltip", async () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>const a = 1;</code></pre>
      </div>
    `;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;
    expect(btn).not.toBeNull();

    // Remove tooltip to test missing tooltip branch
    const tooltip = btn.querySelector(".copy-tooltip");
    if (tooltip) tooltip.remove();

    // Trigger click on button
    btn.click();

    // The copy logic uses await navigator.clipboard.writeText
    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    expect(clipboardText).toBe("const a = 1;");
  });

  test("should copy innerText if textContent is null", async () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre></pre>
      </div>
    `;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;

    // Force textContent to null and set innerText
    const pre = document.querySelector("pre");
    if (pre) {
      Object.defineProperty(pre, 'textContent', { get: () => null });
      Object.defineProperty(pre, 'innerText', { get: () => 'fallback text' });
    }

    btn.click();

    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    expect(clipboardText).toBe("fallback text");
  });

  test("should restore original text after timeout", async () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>let b = 2;</code></pre>
      </div>
      <div id="code-copy-announcer"></div>
    `;

    // Mock setTimeout to execute callback immediately for test
    const setTimeoutMock = mock((callback: Function, _ms?: number) => {
      callback();
      return 1 as unknown as Timer;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.setTimeout = setTimeoutMock as any;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;
    btn.click();

    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    const tooltip = btn.querySelector(".copy-tooltip");

    // Since setTimeout executes immediately in this test, it should be restored
    expect(tooltip?.textContent).toBe("Copier le code");

    const announcer = document.getElementById("code-copy-announcer");
    expect(announcer?.textContent).toBe("");
  });

  test("should handle timeout without announcer or tooltip", async () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>let b = 2;</code></pre>
      </div>
    `;

    // Mock setTimeout to execute callback immediately for test
    const setTimeoutMock = mock((callback: Function, _ms?: number) => {
      callback();
      return 1 as unknown as Timer;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.setTimeout = setTimeoutMock as any;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;

    // Remove tooltip to test missing tooltip branch
    const tooltip = btn.querySelector(".copy-tooltip");
    if (tooltip) tooltip.remove();

    btn.click();

    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    // Shouldn't crash
  });

  test("should handle timeout when svg is missing", async () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>let c = 3;</code></pre>
      </div>
    `;

    // Mock setTimeout to intercept the callback and modify DOM before it runs
    let capturedCallback: Function | null = null;
    const setTimeoutMock = mock((callback: Function, _ms?: number) => {
      capturedCallback = callback;
      return 1 as unknown as Timer;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.setTimeout = setTimeoutMock as any;

    initCopyButtons();

    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;

    // Click to start process
    btn.click();

    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    // Remove svg before timeout runs
    const svg = btn.querySelector("svg");
    if (svg) svg.remove();

    // Now run the timeout callback manually
    if (capturedCallback) {
        (capturedCallback as Function)();
    }

    // Shouldn't crash and tooltip should be restored
    const tooltip = btn.querySelector(".copy-tooltip");
    expect(tooltip?.textContent).toBe("Copier le code");
  });

  test("should not throw if clipboard fails", async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mock(async () => {
          throw new Error("Clipboard error");
        }),
      },
      writable: true,
      configurable: true
    });

    document.body.innerHTML = `
      <div class="prose">
        <pre><code>error test</code></pre>
      </div>
    `;

    initCopyButtons();
    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;
    btn.click();

    await new Promise((resolve) => originalSetTimeout(resolve, 0));

    // The button shouldn't show Copié if it failed
    const tooltip = btn.querySelector(".copy-tooltip");
    expect(tooltip?.textContent).toBe("Copier le code");
  });

  test("singleton listener works correctly on view transitions", () => {
    document.body.innerHTML = `
      <div class="prose">
        <pre><code>test 1</code></pre>
      </div>
    `;

    initCopyButtons();

    document.body.innerHTML = `
      <div class="prose">
        <pre><code>test 2</code></pre>
      </div>
    `;

    // Dispatch astro:after-swap
    document.dispatchEvent(new Event("astro:after-swap"));

    const wrappers = document.querySelectorAll(".code-wrapper");
    expect(wrappers.length).toBe(1);

    // And clicking works
    const btn = document.querySelector(".copy-code-btn") as HTMLButtonElement;
    btn.click();

    expect(window.__copyBtnClickHandler).toBeDefined();
  });
});
