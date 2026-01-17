# API Documentation

The site is statically generated, but it exposes content via standard feed formats.

## Endpoints

### RSS Feed
- **URL**: `/rss.xml`
- **Format**: XML (RSS 2.0)
- **Description**: Contains the latest projects and posts.
- **Generation**: Built at compile time via `src/pages/rss.xml.js`.

### Sitemap
- **URL**: `/sitemap-index.xml`
- **Format**: XML (Sitemap Protocol)
- **Description**: Index of all crawlable pages.
- **Generation**: Built at compile time via `@astrojs/sitemap`.

### Robots.txt
- **URL**: `/robots.txt`
- **Format**: Text
- **Description**: Crawling rules.
- **Generation**: Built at compile time via `src/pages/robots.txt.ts`.

## Client-Side Integrations

### Web3Forms (Contact)
- **Endpoint**: `https://api.web3forms.com/submit`
- **Method**: POST
- **Payload**: JSON
- **Auth**: Requires `PUBLIC_WEB3FORMS_ACCESS_KEY`.
- **Note**: This is an external service used by the `ContactForm` component.

### Cloudflare Web Analytics
- **Endpoint**: `https://static.cloudflareinsights.com/beacon.min.js`
- **Method**: POST (Beacon)
- **Auth**: Requires `PUBLIC_CF_ANALYTICS_TOKEN`.
