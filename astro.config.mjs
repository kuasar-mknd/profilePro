import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import compress from "astro-compress";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

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
    formats: ["avif"],
  },
  integrations: [
    mdx({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener", "noreferrer"],
            content: {
              type: "text",
              value: " (ouvre un nouvel onglet)",
            },
            contentProperties: {
              "aria-hidden": "true",
              class: "sr-only", // Screen reader only text to avoid visual clutter but keep accessibility
            },
          },
        ],
      ],
    }),
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
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Samuel Dulex | Portfolio",
          short_name: "Samuel Dulex",
          description:
            "Portfolio de Samuel Dulex - Créateur visuel & Développeur",
          theme_color: "#0f172a",
          background_color: "#0f172a",
          display: "standalone",
          icons: [
            {
              src: "/favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{html,js,css,png,svg,avif,webp,woff2}"],
          navigateFallback: "/404",
        },
      }),
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
