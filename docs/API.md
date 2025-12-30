# API Documentation

> **Note:** This project is a **Static Site (SSG)**. It does not provide a traditional REST API for external consumers. However, it exposes static data feeds and integrates with third-party APIs.

## 📡 Static Feeds

These endpoints are generated at build time and served as static files.

### 1. RSS Feed
- **URL**: `/rss.xml`
- **Format**: XML (RSS 2.0)
- **Content**: Latest projects and updates.
- **Source**: `src/pages/rss.xml.js`

### 2. Sitemap
- **URL**: `/sitemap-index.xml`
- **Format**: XML
- **Content**: Index of all crawlable pages.
- **Source**: `@astrojs/sitemap` integration.

---

## 🔗 External Integrations

### 1. Contact Form (Web3Forms)
- **Endpoint**: `https://api.web3forms.com/submit`
- **Method**: `POST`
- **Payload**:
  - `access_key`: (Hidden input)
  - `name`: User name
  - `email`: User email
  - `message`: User message
  - `botcheck`: Honeypot field (must be empty)
- **Security**: handled by Web3Forms backend.

### 2. Cloudflare Web Analytics
- **Script**: Injected automatically via `src/layouts/Base.astro` (or Cloudflare settings).
- **Privacy**: No cookie tracking.

---

## 🛠 Internal Data Structure

The "API" for internal components is the Content Collections API (`astro:content`).

```typescript
import { getCollection } from 'astro:content';

// Fetch all projects
const projects = await getCollection('project');
```

See `src/content/config.ts` for schemas.
