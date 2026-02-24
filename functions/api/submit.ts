/// <reference types="@cloudflare/workers-types" />
/* eslint-disable no-console */
/**
 * 🛡️ Sentinel: Server-side proxy for contact form submissions.
 * This function enforces IP-based rate limiting using Cloudflare KV.
 */

interface Env {
  RATE_LIMIT_KV: KVNamespace;
  WEB3FORMS_ACCESS_KEY?: string;
}

interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 🛡️ Sentinel: Identify client by IP for rate limiting
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const kvKey = `rate_limit:${ip}`;

  // 1. Enforce Rate Limit (2 minutes)
  if (env.RATE_LIMIT_KV) {
    try {
      const lastSubmission = await env.RATE_LIMIT_KV.get(kvKey);
      if (lastSubmission) {
        const lastSubmissionTime = parseInt(lastSubmission as string, 10);
        const now = Date.now();
        const diff = now - lastSubmissionTime;

        if (diff < 120000) {
          // 120,000ms = 2 minutes
          return new Response(
            JSON.stringify({
              success: false,
              message:
                "Veuillez attendre quelques minutes avant de renvoyer un message.",
            }),
            {
              status: 429,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }
    } catch (err) {
      console.error("KV Error:", err);
      // Fallback: If KV fails, we still allow the submission but log the error
    }
  }

  // 2. Parse Incoming Data
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // 3. Security Check: Timestamp Trap (Server-side)
  if (data["form-load-timestamp"]) {
    const loadTimestamp = parseInt(data["form-load-timestamp"] as string, 10);
    const now = Date.now();
    if (now - loadTimestamp < 2000) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Le formulaire a été soumis trop rapidement. Veuillez réessayer.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // 4. Inject Server-Side Access Key if configured
  if (env.WEB3FORMS_ACCESS_KEY) {
    data.access_key = env.WEB3FORMS_ACCESS_KEY;
  }

  // 5. Forward to Web3Forms
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as Web3FormsResponse;

    // 6. Update Rate Limit on success
    if (result.success && env.RATE_LIMIT_KV) {
      try {
        await env.RATE_LIMIT_KV.put(kvKey, Date.now().toString(), {
          expirationTtl: 600, // 10 minutes
        });
      } catch (err) {
        console.error("KV Put Error:", err);
      }
    }

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur lors de l'envoi du message.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
