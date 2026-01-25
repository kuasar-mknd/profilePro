import type { APIRoute } from "astro";
import { sanitizeInput } from "../../utils/security";

export const POST: APIRoute = async ({ request }) => {
  const WEB3FORMS_ACCESS_KEY = import.meta.env.WEB3FORMS_ACCESS_KEY;

  if (!WEB3FORMS_ACCESS_KEY) {
    return new Response(
      JSON.stringify({
        message: "Web3Forms access key is not configured.",
      }),
      { status: 500 },
    );
  }

  const body = await request.json();
  const data: Record<string, string> = {};
  const allowedFields = new Set([
    "name",
    "email",
    "message",
    "subject",
    "botcheck",
    "form-load-timestamp",
  ]);

  // Server-side validation and sanitization
  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      if (allowedFields.has(key) && typeof body[key] === "string") {
        data[key] = sanitizeInput(body[key]);
      }
    }
  }

  data.access_key = WEB3FORMS_ACCESS_KEY;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      return new Response(
        JSON.stringify({
          message: "Form submitted successfully.",
        }),
        { status: 200 },
      );
    } else {
      return new Response(
        JSON.stringify({
          message: result.message || "Form submission failed.",
        }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(
      JSON.stringify({
        message: "An error occurred during form submission.",
      }),
      { status: 500 },
    );
  }
};
