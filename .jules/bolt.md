# Bolt's Journal ⚡

## 2025-02-19 - Critical External Resource Preconnects
**Learning:** External services like `api.web3forms.com` (Contact Form) and `i.ytimg.com` (YouTube Thumbnails) significantly impact interactivity and visual completeness but were missing `preconnect` headers. This causes unnecessary latency during critical user interactions (form submit) or initial page load (thumbnails).
**Action:** Always audit network requests for 3rd party services and add `preconnect` (for interaction) or `dns-prefetch` (for speculative) in `Base.astro`, ensuring correct `crossorigin` attributes.
