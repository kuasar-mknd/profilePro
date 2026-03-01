# API Documentation

> **Note:** As a static site (SSG), this project does not expose a dynamic REST API. However, it generates static feed endpoints at build time.

## 📡 Public Endpoints

These endpoints are generated during the build process and are available publicly.

### 1. RSS Feed

Provides the latest projects/posts in XML format.

- **URL:** `/rss.xml`
- **Method:** `GET`
- **Format:** RSS 2.0 (XML)
- **Usage:** Used by RSS readers and content aggregators.
- **Content:** Title, Description, Link, PubDate for each project.

**Example Response:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Samuel Dulex | Connecter, Communiquer, Captiver</title>
    <description>Créateur de contenu visuel...</description>
    <link>https://portfolio.kuasar.xyz/</link>
    <item>
      <title>Project Title</title>
      <link>https://portfolio.kuasar.xyz/project/project-slug/</link>
      <description>Project description...</description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
```

### 2. Sitemap Index

Standard sitemap index for search engines.

- **URL:** `/sitemap-index.xml`
- **Method:** `GET`
- **Format:** XML
- **Usage:** SEO / Search Engine Crawlers.

### 3. Robots.txt

Directives for search engine crawlers.

- **URL:** `/robots.txt`
- **Method:** `GET`
- **Format:** Plain Text
- **Usage:** SEO / Crawling Control.

## 🔐 Authentication

**No authentication is required.**

Since this is a fully static portfolio generated at build time (SSG), there are no dynamic APIs, databases, or user sessions exposed to the client. All endpoints are public and read-only.

## ❌ Error Format

As this is a static site, API errors are primarily HTTP-level responses served by the hosting provider (Cloudflare Pages).

- **404 Not Found**: Returns the standard HTML page defined in `src/pages/404.astro`.
- **500 Server Error**: (Rare) Returns a generic Cloudflare error page if the CDN fails to serve the static asset.

There are no custom JSON error payloads since there are no dynamic JSON endpoints.
