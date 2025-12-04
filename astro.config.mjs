import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import compress from "astro-compress";
import partytown from "@astrojs/partytown";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "always", // Inline le CSS pour éliminer les requêtes bloquantes
  },
  image: {
    domains: ["kuasar.xyz"],
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    formats: ["avif", "webp"],
  },
  integrations: [
    mdx(),
    sitemap(),
    icon(),
    compress({
      CSS: true,
      HTML: {
        "html-minifier-terser": {
          removeAttributeQuotes: false,
        },
      },
      Image: false, // Sharp handles this
      JavaScript: true,
      SVG: true,
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        // Reduce forced layout recalculations
        resolveUrl: (url) => {
          // Proxy external scripts to avoid CORS issues and reduce reflows
          if (url.hostname === "unpkg.com") {
            return new URL(
              `/cdn-proxy?url=${encodeURIComponent(url.href)}`,
              url.origin,
            );
          }
          return url;
        },
        // Limit main window accessor calls that can cause layout thrashing
        mainWindowAccessors: {
          offsetWidth: false,
          offsetHeight: false,
          clientWidth: false,
          clientHeight: false,
          scrollWidth: false,
          scrollHeight: false,
        },
      },
    }),
  ],
  site: "https://portfolio.kuasar.xyz",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [
      tailwindcss(),
      visualizer({
        filename: "./dist/stats.html",
        open: false,
        gzipSize: true,
      }),
    ],
    build: {
      cssCodeSplit: false, // Réduit les requêtes CSS en les bundlant ensemble
    },
  },
});
