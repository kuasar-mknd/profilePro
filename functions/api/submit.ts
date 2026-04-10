export async function onRequestPost(context: {
  request: Request;
  env: { WEB3FORMS_ACCESS_KEY: string };
}) {
  try {
    const origin = context.request.headers.get("Origin") || "";
    const allowedOrigins = ["https://kuasar.xyz", "https://www.kuasar.xyz"];

    if (
      !allowedOrigins.includes(origin) &&
      !origin.startsWith("http://localhost:")
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Forbidden: Invalid origin",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const data = await context.request.json();
    data.access_key = context.env.WEB3FORMS_ACCESS_KEY;

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
