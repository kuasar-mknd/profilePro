/**
 * 🛡️ Sentinel: Server-side proxy for Web3Forms submission.
 * This prevents the Web3Forms Access Key from being exposed in the client-side bundle.
 * The key is injected from the environment variable 'WEB3FORMS_ACCESS_KEY'.
 */
export async function onRequestPost(context) {
  try {
    const accessKey = context.env.WEB3FORMS_ACCESS_KEY;

    // 🛡️ Sentinel: Fail securely if configuration is missing
    if (!accessKey) {
      console.error("WEB3FORMS_ACCESS_KEY is not set in environment variables.");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Server configuration error. Please contact the administrator.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const requestBody = await context.request.json();

    // 🛡️ Sentinel: Inject access_key on the server side
    requestBody.access_key = accessKey;

    // Forward the request to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Relay the response
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // 🛡️ Sentinel: Do not leak stack trace
    console.error("Error in submit-form proxy:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
