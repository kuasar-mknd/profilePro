# API Documentation

> **Note:** This is a static site (SSG). The API consists of generated XML endpoints for content syndication and discovery.

## 📡 Endpoints

### 1. RSS Feed
Provides the latest projects/articles in RSS 2.0 format.

- **URL:** `/rss.xml`
- **Method:** `GET`
- **Content-Type:** `application/xml`

#### Example Request
```bash
curl https://portfolio.kuasar.xyz/rss.xml
```

#### Example Response (Partial)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Samuel Dulex | Portfolio</title>
    <description>L'Art de transformer chaque événement en Histoire</description>
    <link>https://portfolio.kuasar.xyz/</link>
    <item>
      <title>Projet Alpha</title>
      <link>https://portfolio.kuasar.xyz/project/projet-alpha</link>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
      <description>Description du projet...</description>
    </item>
  </channel>
</rss>
```

---

### 2. Sitemap Index
Provides the index of all accessible pages for search engines.

- **URL:** `/sitemap-index.xml`
- **Method:** `GET`
- **Content-Type:** `application/xml`

#### Example Request
```bash
curl https://portfolio.kuasar.xyz/sitemap-index.xml
```

#### Example Response (Partial)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://portfolio.kuasar.xyz/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
```
