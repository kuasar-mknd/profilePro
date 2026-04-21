import { sanitizeInput, isValidEmail } from "../../src/utils/security.ts";

// 🛡️ Sentinel: Centralized security headers to prevent MIME sniffing, clickjacking, and enforce HSTS
const securityHeaders = {
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

export async function onRequestPost(context: {
  request: Request;
  env: { WEB3FORMS_ACCESS_KEY: string };
}) {
  try {
    const origin = context.request.headers.get("Origin") || "";
    const allowedOrigins = ["https://kuasar.xyz", "https://www.kuasar.xyz"];

    // 🛡️ Sentinel: Enforce strict validation of localhost origins to prevent bypasses
    // using maliciously crafted domains like "http://localhost:8080.evil.com"
    if (
      !allowedOrigins.includes(origin) &&
      !/^http:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Forbidden: Invalid origin",
        }),
        {
          status: 403,
          headers: securityHeaders,
        },
      );
    }

    let rawData: unknown;
    try {
      rawData = await context.request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid JSON" }),
        {
          status: 400,
          headers: securityHeaders,
        },
      );
    }

    // 🛡️ Sentinel: Prevent TypeErrors on null arrays/objects
    if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid payload format" }),
        {
          status: 400,
          headers: securityHeaders,
        },
      );
    }

    const data: Record<string, unknown> = {};

    // Define exact expected types
    const schema: Record<string, string> = {
      name: "string",
      email: "string",
      message: "string",
      access_key: "string",
      subject: "string",
      botcheck: "boolean",
      "form-load-timestamp": "string",
    };

    // 🛡️ Sentinel: Strict schema validation
    for (const [key, value] of Object.entries(rawData)) {
      const expectedType = schema[key];
      if (expectedType) {
        if (typeof value === expectedType) {
          if (key === "email") {
            if (!isValidEmail(value as string)) {
              return new Response(
                JSON.stringify({
                  success: false,
                  message: "Bad Request: Invalid email format",
                }),
                {
                  status: 400,
                  headers: securityHeaders,
                },
              );
            }
            data[key] = value;
          } else if (expectedType === "string") {
            data[key] = sanitizeInput(value as string);
          } else {
            data[key] = value;
          }
        } else {
          // Type mismatch, reject with 400
          return new Response(
            JSON.stringify({
              success: false,
              message: `Bad Request: Invalid type for ${key}`,
            }),
            {
              status: 400,
              headers: securityHeaders,
            },
          );
        }
      }
    }

    data.access_key = context.env.WEB3FORMS_ACCESS_KEY;

    // 🛡️ Sentinel: Implement timeout to prevent hanging connections (DoS mitigation)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: securityHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: securityHeaders,
      },
    );
  }
}
