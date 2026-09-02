import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";

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
      // /portfolio-pdf/ est une page technique (source de l'export PDF via
      // `bun run pdf`), déjà noindex : on la tient hors du sitemap.
      filter: (page) => !page.includes("/portfolio-pdf/"),
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
      // La PWA a été retirée : un portfolio statique n'a pas d'usage hors
      // ligne, et son service worker restait figé sur un cache périmé après
      // chaque déploiement. Voir la désinscription dans src/layouts/Base.astro.
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
