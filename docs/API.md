# API Documentation

> **Note:** This project is a static site (SSG). It does not have a dynamic REST API backend. However, it exposes static data endpoints generated at build time.

## 📊 Static Endpoints

These files are generated during the `bun run build` process and are served as static assets.

### 1. RSS Feed (`/rss.xml`)

Provides a standard RSS 2.0 feed of the latest blog posts and projects.

- **URL:** `https://portfolio.kuasar.xyz/rss.xml`
- **Format:** XML (RSS 2.0)
- **Usage:** Used by RSS readers and aggregators.

**Example Structure:**
```xml
<rss version="2.0">
  <channel>
    <title>Samuel Dulex | Portfolio</title>
    <description>Portfolio de Samuel Dulex...</description>
    <item>
      <title>Project Title</title>
      <link>https://portfolio.kuasar.xyz/project/project-slug</link>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
      <description>...</description>
    </item>
  </channel>
</rss>
```

### 2. Sitemap Index (`/sitemap-index.xml`)

The entry point for search engine crawlers. It may link to other sitemaps if the site grows, but currently serves as the main index.

- **URL:** `https://portfolio.kuasar.xyz/sitemap-index.xml`
- **Format:** XML (Sitemap Protocol)
- **Usage:** SEO (Google Search Console, Bing Webmaster Tools).

### 3. Robots.txt (`/robots.txt`)

Directs crawlers to the sitemap.

- **URL:** `https://portfolio.kuasar.xyz/robots.txt`
- **Format:** Plain Text

**Content:**
```text
User-agent: *
Allow: /

Sitemap: https://portfolio.kuasar.xyz/sitemap-index.xml
```

---

## 🔐 Authentication

Since all endpoints are public and static, no authentication is required to access them.

## ⚠️ Error Handling

- **404 Not Found:** If an endpoint file is missing, the server (Cloudflare Pages) will serve the custom `404.html` (generated from `src/pages/404.astro`).
