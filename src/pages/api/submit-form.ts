import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ message: "Invalid content type" }), { status: 400 });
  }

  try {
    const data = await request.json();
    const accessKey = import.meta.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      throw new Error("Web3Forms access key is not configured.");
    }

    // Add the access key to the form data
    data.access_key = accessKey;

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(JSON.stringify({ message: "An internal server error occurred." }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
