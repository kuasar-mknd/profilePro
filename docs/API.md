# API Documentation

> **Note:** This project is a static site (SSG). There is no dynamic backend API.
> However, the build process generates static data endpoints that can be consumed by external services.

## 📡 Static Endpoints

These files are generated at build time and hosted as static assets.

### 1. RSS Feed

Provides a structured XML feed of the latest projects/articles.

- **URL:** `/rss.xml`
- **Format:** RSS 2.0 (XML)
- **Content:** List of projects with title, description, publication date, and link.
- **Example Usage:**
  ```bash
  curl https://portfolio.kuasar.xyz/rss.xml
  ```

### 2. Sitemap

Provides a map of all crawlable pages for search engines.

- **URL:** `/sitemap-index.xml`
- **Format:** Sitemap XML Index
- **Content:** Links to all pages (Home, Projects, About).
- **Example Usage:**
  ```bash
  curl https://portfolio.kuasar.xyz/sitemap-index.xml
  ```

## 🔐 Authentication

Since these are public static files, **no authentication** is required to access them.

## ⚠️ Rate Limiting

Access is limited by the hosting provider's (Cloudflare Pages) standard DDoS protection and rate limiting policies. There are no application-level rate limits.
