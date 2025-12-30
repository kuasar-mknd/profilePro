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
