import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import compress from "astro-compress";
import partytown from "@astrojs/partytown";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'always', // Inline le CSS pour éliminer les requêtes bloquantes
  },
  integrations: [
    tailwind(),
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
      },
    }),
  ],
  site: "https://portfolio.kuasar.xyz",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  vite: {
    build: {
      cssCodeSplit: false, // Réduit les requêtes CSS en les bundlant ensemble
      rollupOptions: {
        plugins: [
          visualizer({
            filename: "./dist/stats.html",
            open: false,
            gzipSize: true,
          }),
        ],
      },
    },
  },
});
