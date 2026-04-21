import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { onRequestPost } from "../../functions/api/submit.ts";

describe("Submit Cloudflare Function", () => {
  let originalFetch: typeof fetch;

  const securityHeaders = {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  };

  beforeEach(() => {
    originalFetch = global.fetch;
    // Mock the global fetch to avoid real network requests
    global.fetch = mock(async () => {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Form submitted successfully",
        }),
        {
          status: 200,
          headers: securityHeaders,
        },
      );
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const createMockContext = (
    payload: unknown,
    origin: string = "http://localhost:4321",
  ) => {
    return {
      request: new Request("https://api.example.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
        },
        body: payload === undefined ? undefined : JSON.stringify(payload),
      }),
      env: {
        WEB3FORMS_ACCESS_KEY: "test-secret-key",
      },
    };
  };

  it("should process valid payload correctly", async () => {
    const payload = {
      name: "John Doe",
      email: "test@example.com",
      message: "Hello world!",
    };

    const context = createMockContext(payload);
    const response = await onRequestPost(context as unknown);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);

    // Verify fetch was called with sanitized/expected data
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchCall = (global.fetch as unknown).mock.calls[0];
    const fetchBody = JSON.parse(fetchCall[1].body);

    expect(fetchBody.name).toBe("John Doe");
    expect(fetchBody.email).toBe("test@example.com");
    expect(fetchBody.message).toBe("Hello world!");
    expect(fetchBody.access_key).toBe("test-secret-key");
  });

  it("should handle null and invalid payloads gracefully", async () => {
    const nullContext = createMockContext(null);
    const nullResponse = await onRequestPost(nullContext as unknown);
    expect(nullResponse.status).toBe(400);
    expect(nullResponse.headers.get("X-Content-Type-Options")).toBe("nosniff");

    const arrayContext = createMockContext(["not", "an", "object"]);
    const arrayResponse = await onRequestPost(arrayContext as unknown);
    expect(arrayResponse.status).toBe(400);

    const stringContext = createMockContext("just a string");
    const stringResponse = await onRequestPost(stringContext as unknown);
    expect(stringResponse.status).toBe(400);
  });

  it("should enforce strict type checking (Validation Bypass prevention)", async () => {
    const payload = {
      name: ["malicious", "payload"],
      email: { isMalicious: true },
      message: "Hello world!",
    };

    const context = createMockContext(payload);
    const response = await onRequestPost(context as unknown);

    expect(response.status).toBe(400);
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    const data = await response.json();
    expect(data.message).toBe("Bad Request: Invalid type for name");
  });

  it("should strip unallowed fields (mass assignment prevention)", async () => {
    const payload = {
      name: "John Doe",
      email: "test@example.com",
      message: "Hello world!",
      isAdmin: true, // Should be stripped
      role: "admin", // Should be stripped
    };

    const context = createMockContext(payload);
    const response = await onRequestPost(context as unknown);

    expect(response.status).toBe(200);

    const fetchCall = (global.fetch as unknown).mock.calls[0];
    const fetchBody = JSON.parse(fetchCall[1].body);

    expect(fetchBody.isAdmin).toBeUndefined();
    expect(fetchBody.role).toBeUndefined();
  });

  it("should sanitize string inputs (XSS prevention)", async () => {
    const payload = {
      name: "<script>alert('xss')</script>",
      email: "test@example.com",
      message: "Hello <img src=x onerror=alert(1)>",
    };

    const context = createMockContext(payload);
    const response = await onRequestPost(context as unknown);

    expect(response.status).toBe(200);

    const fetchCall = (global.fetch as unknown).mock.calls[0];
    const fetchBody = JSON.parse(fetchCall[1].body);

    expect(fetchBody.name).not.toContain("<script>");
    expect(fetchBody.message).not.toContain("<img");
    expect(fetchBody.name).toBe(
      "&lt;script&gt;alert&#40;&#x27;xss&#x27;&#41;&lt;&#x2F;script&gt;",
    );
  });

  it("should reject invalid email format", async () => {
    const payload = {
      name: "John Doe",
      email: "invalid-email-format",
      message: "Hello world!",
    };

    const context = createMockContext(payload);
    const response = await onRequestPost(context as unknown);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe("Bad Request: Invalid email format");

    // Fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should return 403 for invalid origin", async () => {
    const payload = {
      name: "John Doe",
      email: "test@example.com",
      message: "Hello world!",
    };

    const context = createMockContext(payload, "https://malicious.com");
    const response = await onRequestPost(context as unknown);

    expect(response.status).toBe(403);
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe("Forbidden: Invalid origin");

    // Fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
