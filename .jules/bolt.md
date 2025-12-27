## 2024-02-14 - Resource Hint Strategy
**Learning:** `preconnect` is expensive (TLS/TCP handshake) and should be reserved for critical resources. Using it for lazy-loaded third-party domains (like video players) in the global `<head>` wastes connection slots and bandwidth on pages where they aren't used.
**Action:** Use `dns-prefetch` for lazy-loaded third-party resources. It's much cheaper and still provides a latency benefit when the user eventually interacts with the component.
