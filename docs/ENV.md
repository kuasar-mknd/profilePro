# Environment Variables

This document lists all environment variables used in the application.

## Setup

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

## Variable Reference

| Variable | Description | Required | Default |
|----------|-------------|:--------:|---------|
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Public key for Web3Forms service (Contact form). | Yes | - |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Token for Cloudflare Web Analytics. | Yes | - |

> **Note**: Variables prefixed with `PUBLIC_` are exposed to the client-side JavaScript bundle in Astro.

## Validation

The application does not currently use a strict schema validation library (like Zod) for env vars at runtime, but they are accessed via `import.meta.env`. Missing keys may cause runtime errors in the contact form or analytics scripts.

## CI/CD

In the GitHub Actions workflow, these secrets must be set in the repository secrets if the build or tests require them. For `pull_request` workflows from forks, mock values should be used or the steps requiring them skipped/mocked.
