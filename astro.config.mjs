import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Date de génération du site, utilisée comme `lastmod` dans le sitemap.
// Le portfolio est régénéré à chaque déploiement : la date de build reflète
// donc fidèlement la dernière mise à jour et fournit à Google un signal de
// fraîcheur pour recrawler les pages.
const BUILD_DATE = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
  trailingSlash: "always",
  build: {
    format: "directory",
    inlineStylesheets: "always", // ⚡ Bolt: Always inline CSS for critical path optimization (FCP/LCP)
    concurrency: 1, // ⚡ Bolt: Limit concurrency to prevent OOM on Render
  },
  image: {
    domains: ["kuasar.xyz"],
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    formats: ["webp"],
  },
  // Astro 7 : le pipeline remark/rehype passe désormais par un processeur
  // `unified()` de @astrojs/markdown-remark, dont l'intégration MDX hérite.
  markdown: {
    processor: unified({
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
  },
  integrations: [
    mdx(),
    sitemap({
      // `lastmod` sur chaque URL : signal de fraîcheur pour les moteurs.
      serialize(item) {
        item.lastmod = BUILD_DATE;
        return item;
      },
    }),
    icon(),
  ],
  site: "https://portfolio.kuasar.xyz",
  // Prefetch géré par Astro : tous les liens internes sont préchargés au
  // survol. Couplé à `clientPrerender`, ils sont prérendus via la Speculation
  // Rules API (navigateurs compatibles), sinon repli sur un prefetch classique.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  experimental: {
    clientPrerender: true,
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
            "Portfolio de Samuel Dulex — Création de contenu, développement web & communication",
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
      process.env.ANALYZE === "true" &&
        visualizer({
          filename: "./dist/stats.html",
          open: false,
          gzipSize: true,
        }),
    ].filter(Boolean),
    build: {
      cssCodeSplit: false, // Réduit les requêtes CSS en les bundlant ensemble
    },
  },
});
