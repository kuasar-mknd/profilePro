<div align="center">

# 🎬 Samuel Dulex Portfolio

**L'Art de transformer chaque événement en Histoire**

<!-- Status & Build -->

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fportfolio.kuasar.xyz&label=portfolio.kuasar.xyz)](https://portfolio.kuasar.xyz)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)

<!-- Tech Stack -->

[![Built with Astro](https://img.shields.io/badge/Astro-5.15-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MDX](https://img.shields.io/badge/MDX-Enabled-1B1F24?style=flat&logo=mdx&logoColor=white)](https://mdxjs.com/)

<!-- Code Quality -->

[![ESLint](https://img.shields.io/badge/ESLint-Enabled-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-Enabled-F7B93E?style=flat&logo=prettier&logoColor=black)](https://prettier.io/)
[![Lighthouse CI](https://img.shields.io/badge/Lighthouse-CI-F44B21?style=flat&logo=lighthouse&logoColor=white)](https://github.com/GoogleChrome/lighthouse-ci)

<!-- Lighthouse Scores -->

![Lighthouse Performance](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/refs/heads/badges/performance.json)
![Lighthouse Accessibility](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/refs/heads/badges/accessibility.json)
![Lighthouse Best Practices](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/refs/heads/badges/best-practices.json)
![Lighthouse SEO](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/refs/heads/badges/seo.json)

<!-- Stats -->

![GitHub repo size](https://img.shields.io/github/repo-size/kuasar-mknd/profilePro?label=size)
![GitHub last commit](https://img.shields.io/github/last-commit/kuasar-mknd/profilePro)
![Maintenance](https://img.shields.io/maintenance/yes/2025)

[🌐 Site Web](https://kuasar.xyz) • [📸 Instagram](https://www.instagram.com/kuasar.mknd) • [🎥 YouTube](https://www.youtube.com/channel/UCLPJkiQD8VAJSV3k3gSml4w)

</div>

---

## 📖 À propos

Portfolio professionnel de **Samuel Dulex**, spécialisé dans la création de contenu vidéo et la captation d'événements. Ce site présente mes projets de manière dynamique et immersive, avec un focus sur l'expérience utilisateur et la performance.

**Mission**: _Connecter, Communiquer, Captiver_ — transformer chaque événement en une histoire mémorable.

## ✨ Fonctionnalités

### 🎨 Design & Expérience

- **Mode sombre/clair** avec transition fluide
- **Architecture responsive** optimisée (Mobile First)
- **Animations modernes** avec View Transition API & ScrollReveal
- **Cartes Projets 3D** avec effet Tilt et glare subtil
- **Carousel d'accueil** intelligent (chargement aléatoire + scroll infini)
- **Background animé** interactif et subtil
- **Lecteur vidéo intégré** avec streaming optimisé

### 🚀 Performance & SEO

- **SEO optimisé** avec metadata complète
- **RSS Feed** pour les dernières publications
- **Images optimisées** via Sharp et compression automatique
- **Type-safe** avec TypeScript et validation de schéma
- **Lighthouse score** de 100% en Performance et Accessibilité
- **Compression automatique** HTML, CSS, JS, SVG
- **Prefetch intelligent** pour navigation instantanée
- **Scripts tiers optimisés** via Partytown (Web Workers)

### 📁 Gestion de contenu

- **3 types de projets**: vidéo, photo, et général
- **Collections Astro** pour les projets et pages
- **MDX support** pour un contenu riche et interactif
- **Fil d'Ariane** pour une navigation intuitive

## 🛠️ Stack technique

### Core

- **Framework**: [Astro 5.x](https://astro.build) - Static Site Generation
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com) avec configuration CSS-first
- **Content**: MDX pour le contenu enrichi
- **Icons**: Astro Icon avec Iconify

### Performance

- **Image Optimization**: Sharp
- **Compression**: astro-compress
- **Scripts Optimization**: Partytown
- **Bundle Analysis**: rollup-plugin-visualizer

### Code Quality

- **Linting**: ESLint + Stylelint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Performance Audits**: Lighthouse CI

## 🚀 Quick Start

### Prérequis

- Node.js 18.x ou supérieur
- npm ou pnpm

### Installation

```bash
# Cloner le repository
git clone https://github.com/kuasar-mknd/profilePro.git
cd profilePro

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:4321`

### Scripts disponibles

#### Développement

```bash
npm run dev       # Lancer le serveur de développement
npm run build     # Générer le build de production
npm run preview   # Prévisualiser le build de production
```

#### Qualité du Code

```bash
npm run format           # Formater tout le code
npm run lint             # Linter (ESLint + Stylelint)
npm run lint:eslint:fix  # Corriger erreurs ESLint
npm run lint:stylelint:fix # Corriger erreurs CSS
npm run check            # Vérifier formatage + lint
```

#### Performance & Analyse

```bash
npm run lighthouse  # Audit Lighthouse complet
npm run analyze     # Analyser la taille des bundles
```

## 📂 Structure du projet

```
/
├── public/              # Assets statiques (images, fonts, etc.)
├── src/
│   ├── components/      # Composants Astro réutilisables
│   │   ├── features/    # Composants de fonctionnalités
│   │   ├── layout/      # Éléments de mise en page
│   │   └── ui/          # Composants UI de base
│   ├── content/         # Collections de contenu
│   │   └── project/     # Fichiers MDX des projets
│   ├── layouts/         # Templates de pages
│   ├── pages/           # Pages du site
│   └── config.mjs       # Configuration du site
├── astro.config.mjs     # Configuration Astro
├── src/css/style.css  # Configuration Tailwind (CSS-first)
└── package.json
```

## ⚙️ Configuration

### Site Configuration

Personnaliser le site via `src/config.mjs`:

- Titre et description
- Réseaux sociaux
- Nombre de posts par page
- URL du site

### Tailwind Configuration

Modifier les couleurs, fonts et breakpoints directement dans `src/css/style.css` via la directive `@theme`.

### Ajouter un projet

Créer un fichier `.mdx` dans `src/content/project/` avec le frontmatter suivant:

```yaml
---
title: "Nom du projet"
description: "Description du projet"
pubDate: 2025-11-20
tag: "clip musical" # clip musical | court-métrage | photo | événementiel | production
author: samuel
image: ../../assets/image.jpg
type: "video" # video | photo | general
videoUrl: "https://youtube.com/..." # Pour les projets vidéo
---
```

## 🔧 Outils de Développement

### Linting Automatique

Le projet utilise **Husky** et **lint-staged** pour linter automatiquement votre code avant chaque commit :

- ✅ ESLint corrige JavaScript/TypeScript/Astro
- ✅ Stylelint corrige le CSS
- ✅ Prettier formate tout le code

### Performance Monitoring

**Lighthouse CI** est configuré pour auditer automatiquement les performances :

```bash
npm run lighthouse
```

Seuils configurés : Performance ≥90%, Accessibilité ≥90%, SEO ≥90%

### Bundle Analysis

Après chaque build, visualisez la taille de vos bundles :

```bash
npm run analyze  # Ouvre dist/stats.html
```

## 🌐 Déploiement

Ce site est actuellement déployé sur **Cloudflare Pages**.

### Configuration Cloudflare Pages

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18.x ou supérieur
- **Branch de production**: `master`

### Déploiement automatique

Cloudflare Pages construit et déploie automatiquement à chaque push sur la branche `master`. Aucune configuration GitHub Actions n'est nécessaire.

### Autres plateformes supportées

Ce site peut également être déployé sur :

- **Vercel**
- **Netlify**
- **GitHub Pages**

```bash
# Build pour la production
npm run build

# Le dossier dist/ contient les fichiers prêts pour le déploiement
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/kuasar-mknd/profilePro/issues). You can also take a look at the [contributing guide](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md).

## 🛡️ Security

Please review our [Security Policy](SECURITY.md) for information on reporting security vulnerabilities.

## 📄 License

Copyright © 2025 [Samuel Dulex](https://github.com/kuasar-mknd).
This project is [MIT](LICENSE) licensed.

---

<div align="center">

**Construit avec ❤️ par Samuel Dulex**

_Connecter, Communiquer, Captiver_

</div>
