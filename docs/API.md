# API Documentation

> **Note:** This project is a static site (SSG) and does not have a traditional REST API backend.
> However, it exposes the following data endpoints generated at build time.

## 📡 Public Endpoints

These endpoints are public and read-only.

### 1. RSS Feed
Provides the latest blog posts/projects in XML format.

- **URL**: `/rss.xml`
- **Method**: `GET`
- **Format**: RSS 2.0 XML
- **Use Case**: Subscription readers, content syndication.
- **Example**:
  ```bash
  curl -I https://portfolio.kuasar.xyz/rss.xml
  ```

### 2. Sitemap
Index of all public pages for SEO crawlers.

- **URL**: `/sitemap-index.xml`
- **Method**: `GET`
- **Format**: XML Sitemap
- **Use Case**: Search engine indexing.
- **Example**:
  ```bash
  curl -I https://portfolio.kuasar.xyz/sitemap-index.xml
  ```

## 🔒 Internal/Private API

The project integrates with third-party services. These are not exposed by the site itself but are used by the client.

### Contact Form
Submissions are sent to Web3Forms.

- **Endpoint**: `https://api.web3forms.com/submit`
- **Method**: `POST`
- **Payload**: JSON or FormData
- **Required Fields**: `access_key` (Public), `name`, `email`, `message`, `botcheck` (Honeypot).
