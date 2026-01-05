# Environment Variables Documentation

This project uses environment variables for configuration and API integration. These are loaded from `.env` in development and set in the Cloudflare Pages dashboard for production.

## 🔐 Required Variables

The following variables are **required** for the site to function correctly during build and runtime.

| Variable | Description | Example |
|---|---|---|
| `PUBLIC_SITE_URL` | The canonical URL of the deployed site. Used for SEO and sitemaps. | `https://portfolio.kuasar.xyz` |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Public key for the Web3Forms service (Contact Form). | `YOUR_ACCESS_KEY` |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Token for Cloudflare Web Analytics. | `YOUR_TOKEN` |

## 🛠 Setup

1.  Copy the example file:
    ```bash
    cp .env.example .env
    ```
2.  Edit `.env` and fill in your values.

> **Warning:** Never commit your `.env` file to version control. It is ignored by default in `.gitignore`.

## 🤖 Type Safety

Environment variables are type-checked using Astro's `env.schema` (if configured) or manually validated in `src/config.mjs` or usage points. Ensure values are present before building for production.
