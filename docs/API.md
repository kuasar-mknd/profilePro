# API Documentation

> **Note:** This is a static site (SSG). The "API" consists of generated static files providing structured data.

## 📡 Public Endpoints

These endpoints are generated at build time and served statically.

### 1. RSS Feed
Provides the latest updates/posts from the portfolio.

- **URL:** `/rss.xml`
- **Method:** `GET`
- **Format:** XML (RSS 2.0)
- **Auth:** None

**Example:**
```bash
curl https://portfolio.kuasar.xyz/rss.xml
```

### 2. Sitemap Index
Standard sitemap index pointing to sub-sitemaps (e.g., sitemap-0.xml).

- **URL:** `/sitemap-index.xml`
- **Method:** `GET`
- **Format:** XML
- **Auth:** None

**Example:**
```bash
curl https://portfolio.kuasar.xyz/sitemap-index.xml
```

---

## 🔒 Authentication

No authentication is required for these public endpoints.

## ⚠️ Error Handling

Since these are static files:
- **404 Not Found:** If the file does not exist (e.g., build failure).
- **200 OK:** Successful retrieval.
