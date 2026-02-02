# Environment Variables

> **Note:** This project uses Astro's type-safe environment variables defined in `src/env.d.ts`.

## 🌍 Required Variables

The following variables must be set in your `.env` file (locally) or in your CI/Deployment environment.

| Variable                      | Description                             | Required | Example   |
| ----------------------------- | --------------------------------------- | -------- | --------- |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Public key for Web3Forms (Contact Form) | Yes      | `abc-123` |
| `PUBLIC_CF_ANALYTICS_TOKEN`   | Token for Cloudflare Web Analytics      | No       | `abc-123` |

## 🛡 Secrets

**NEVER** commit your `.env` file. Use `.env.example` as a template.
Ensure `.env` is added to your `.gitignore` to prevent accidental leaks.

### `.env.example` content:

```bash
# Public Keys (Safe to expose in client bundle, but managed via env for flexibility)
PUBLIC_WEB3FORMS_ACCESS_KEY="YOUR_WEB3FORMS_KEY"
PUBLIC_CF_ANALYTICS_TOKEN="YOUR_CF_ANALYTICS_TOKEN"
```
