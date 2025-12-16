import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import compress from "astro-compress";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "auto", // Use "auto" to allow external CSS files for better caching
  },
  image: {
    domains: ["kuasar.xyz"],
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    formats: ["avif"],
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
