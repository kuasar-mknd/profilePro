# Environment Variables

> **Note:** This project uses Astro's type-safe environment variables defined in `src/env.d.ts`.

## 🌍 Required Variables

The following variables must be set in your `.env` file (locally) or in your CI/Deployment environment.

| Variable                    | Description                             | Required | Example   |
| :-------------------------- | :-------------------------------------- | :------- | :-------- |
| `WEB3FORMS_ACCESS_KEY`      | Public key for Web3Forms (Contact Form) | Yes      | `abc-123` |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Token for Cloudflare Web Analytics      | No       | `abc-123` |

_(Note: No Prisma `DATABASE_URL` or Hono backend environment variables are required as this is a fully static frontend application built on Astro. There is no Hono framework used in this repository. The Cloudflare analytics token is strictly optional)._

## 🔒 Client vs Server Variables (Astro SSG)

In Astro, environment variables must be prefixed with `PUBLIC_` to be accessible on the client-side (browser).

- **Server-side only**: `WEB3FORMS_ACCESS_KEY`
- **Client-side**: `PUBLIC_CF_ANALYTICS_TOKEN`

Variables without the `PUBLIC_` prefix are strictly server-side. Attempting to use them in client-side code will result in `undefined`.

## 🛡 Secrets

**NEVER** commit your `.env` file containing real values. Use `.env.example` as a template.

### `.env.example` Reference:

```bash
# Public Keys (Safe to expose in client bundle, but managed via env for flexibility)
WEB3FORMS_ACCESS_KEY="YOUR_WEB3FORMS_KEY"
PUBLIC_CF_ANALYTICS_TOKEN="YOUR_CF_ANALYTICS_TOKEN"
```

<!-- Verified: DocOps 2026-04-24 -->

## Hono + Prisma Variables (Hypothetical)

If a dynamic backend were added, the following would be required:

- `DATABASE_URL`: Connection string for Prisma.
- `JWT_SECRET`: Secret key for authentication.
