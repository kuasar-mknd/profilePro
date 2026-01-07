# API Documentation

> **Type:** Static Endpoints
> **Format:** XML

Since this project is a statically generated site (SSG), it does not have a traditional REST API backend. However, it exposes public data endpoints generated at build time.

## 📡 Public Endpoints

### 1. RSS Feed
Provides the latest blog posts and projects.

- **Endpoint**: `/rss.xml`
- **Method**: `GET`
- **Format**: RSS 2.0 (XML)
- **Example**:
  ```bash
  curl https://portfolio.kuasar.xyz/rss.xml
  ```

### 2. Sitemap Index
Index of all sitemaps for SEO.

- **Endpoint**: `/sitemap-index.xml`
- **Method**: `GET`
- **Format**: XML
- **Example**:
  ```bash
  curl https://portfolio.kuasar.xyz/sitemap-index.xml
  ```

---

## 🔐 Authentication

All endpoints are public and read-only. No authentication is required.

## ⚠️ Error Handling

- **404 Not Found**: If an endpoint does not exist, the server returns the custom 404 HTML page.
