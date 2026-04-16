import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  if (!import.meta.env.DEV) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(
    JSON.stringify({ key: import.meta.env.WEB3FORMS_ACCESS_KEY || "" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
