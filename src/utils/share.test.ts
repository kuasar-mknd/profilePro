import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { shareContent } from "./share";

describe("shareContent", () => {
  // Store original globals
  const originalNavigator = global.navigator;
  const originalDocument = global.document;
  const originalWindow = global.window;

  beforeEach(() => {
    // @ts-ignore
    global.navigator = {
      share: undefined,
      clipboard: undefined,
      vibrate: undefined,
    };
    // @ts-ignore
    global.document = { title: "Test Page" };
    // @ts-ignore
    global.window = { location: { href: "https://example.com" } };
  });

  afterEach(() => {
    // @ts-ignore
    global.navigator = originalNavigator;
    // @ts-ignore
    global.document = originalDocument;
    // @ts-ignore
    global.window = originalWindow;
  });

  it("should use navigator.share if available", async () => {
    const shareMock = mock(() => Promise.resolve());
    // @ts-ignore
    global.navigator.share = shareMock;

    const result = await shareContent({
      title: "My Title",
      url: "https://my.url",
    });

    expect(result).toBe("shared");
    expect(shareMock).toHaveBeenCalledWith({
      title: "My Title",
      url: "https://my.url",
    });
  });

  it("should fallback to clipboard if navigator.share is not available", async () => {
    // @ts-ignore
    global.navigator.share = undefined;
    const writeTextMock = mock(() => Promise.resolve());
    // @ts-ignore
    global.navigator.clipboard = { writeText: writeTextMock };

    const result = await shareContent({ url: "https://my.url" });

    expect(result).toBe("copied");
    expect(writeTextMock).toHaveBeenCalledWith("https://my.url");
  });

  it("should return cancelled if navigator.share is aborted", async () => {
    const abortError = new Error("User cancelled");
    abortError.name = "AbortError";
    // @ts-ignore
    global.navigator.share = mock(() => Promise.reject(abortError));

    const result = await shareContent();

    expect(result).toBe("cancelled");
  });

  it("should use default title and url if not provided", async () => {
    const shareMock = mock(() => Promise.resolve());
    // @ts-ignore
    global.navigator.share = shareMock;

    const result = await shareContent();

    expect(result).toBe("shared");
    expect(shareMock).toHaveBeenCalledWith({
      title: "Test Page",
      url: "https://example.com",
    });
  });

  it("should return failed if both share and clipboard fail", async () => {
    // @ts-ignore
    global.navigator.share = undefined;
    // @ts-ignore
    global.navigator.clipboard = {
      writeText: mock(() => Promise.reject(new Error("Clipboard failed"))),
    };

    const result = await shareContent();

    expect(result).toBe("failed");
  });
});
