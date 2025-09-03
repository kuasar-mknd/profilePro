import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { compress } from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";

// Configuration pour GitHub Pages - VÉRIFIÉE janvier 2025
export default defineConfig({
  site: "https://kuasar-mknd.github.io",
  base: "/profilePro",
  
  // Intégrations officielles Astro 5.2+
  integrations: [
    mdx(),
    sitemap(),
    compress({
      CSS: true,
      HTML: {
        'remove-attribute-quotes': false,
        'collapse-whitespace': true,
        'remove-comments': true
      },
      Image: false, // Désactivé - géré par astro:assets
      JavaScript: true,
      SVG: true
    })
  ],
  
  // Configuration Vite avec Tailwind 4 (méthode officielle)
  vite: {
    plugins: [
      tailwindcss()
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro']
          }
        }
      },
      assetsInlineLimit: 0,
      cssCodeSplit: true
    },
    ssr: {
      external: ["sharp"]
    }
  },
  
  // Configuration d'optimisation des images native
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    formats: ['webp', 'avif'],
    quality: 80
  },
  
  // Configuration build pour GitHub Pages
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
    splitting: true,
    assetsPrefix: '/profilePro'
  },
  
  output: 'static',
  compressHTML: true,
  
  // PREFETCH INTÉGRÉ (plus besoin d'intégration séparée)
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  
  // Configuration markdown
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  
  // Configuration du serveur de développement
  server: {
    host: true,
    port: 4321,
    open: true
  }
});