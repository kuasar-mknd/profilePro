# API Documentation

> **Note:** This is a Static Site (SSG). There is no dynamic backend API.
> However, the site generates static XML/JSON endpoints for interoperability.

## 📡 Public Endpoints

These endpoints are generated at build time and served statically.

### 1. RSS Feed
Provides a feed of the latest projects and blog posts.

- **URL:** `/rss.xml`
- **Method:** `GET`
- **Format:** XML (RSS 2.0)
- **Usage:**
  ```bash
  curl https://portfolio.kuasar.xyz/rss.xml
  ```

### 2. Sitemap
Index of all accessible pages for search engines.

- **URL:** `/sitemap-index.xml` (or `/sitemap-0.xml`)
- **Method:** `GET`
- **Format:** XML
- **Usage:**
  ```bash
  curl https://portfolio.kuasar.xyz/sitemap-index.xml
  ```

### 3. Open Graph Images
Auto-generated social preview images for each project.

- **URL:** `/og/[slug].png`
- **Method:** `GET`
- **Format:** PNG
- **Usage:**
  ```bash
  # Example for a project named "event-capture"
  curl https://portfolio.kuasar.xyz/og/event-capture.png --output preview.png
  ```

---

## 🔒 Internal Data Flow

### Contact Form
The contact form submits data directly to **Web3Forms** (external service).

- **Endpoint:** `https://api.web3forms.com/submit`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "access_key": "YOUR_PUBLIC_KEY",
    "name": "User Name",
    "email": "user@example.com",
    "message": "Hello...",
    "subject": "New Contact Message"
  }
  ```
- **Security:**
  - Input is validated client-side (HTML5) and sanitized.
  - The `access_key` is public but scoped to the domain (configured in Web3Forms dashboard).
