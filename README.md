# 🎬 Samuel Dulex Portfolio

> **L'Art de transformer chaque événement en Histoire**

<!-- Status & Build -->

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fportfolio.kuasar.xyz&label=portfolio.kuasar.xyz)](https://portfolio.kuasar.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/kuasar-mknd/profilePro/actions/workflows/pipeline.yml/badge.svg)](https://github.com/kuasar-mknd/profilePro/actions/workflows/pipeline.yml)

<!-- Tech Stack -->

[![Built with Astro](https://img.shields.io/badge/Astro-7.1-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3%2B-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![MDX](https://img.shields.io/badge/MDX-Enabled-1B1F24?style=flat&logo=mdx&logoColor=white)](https://mdxjs.com/)

<!-- Code Quality -->

[![ESLint](https://img.shields.io/badge/ESLint-Enabled-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-Enabled-F7B93E?style=flat&logo=prettier&logoColor=black)](https://prettier.io/)
[![Lighthouse CI](https://img.shields.io/badge/Lighthouse-CI-F44B21?style=flat&logo=lighthouse&logoColor=white)](https://github.com/GoogleChrome/lighthouse-ci)

<!-- Lighthouse Scores -->

![Lighthouse Performance](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/badges/performance.json)
![Lighthouse Accessibility](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/badges/accessibility.json)
![Lighthouse Best Practices](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/badges/best-practices.json)
![Lighthouse SEO](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/kuasar-mknd/profilePro/badges/seo.json)

[🌐 Site Web](https://kuasar.xyz) • [📸 Instagram](https://www.instagram.com/kuasar.mknd) • [🎥 YouTube](https://www.youtube.com/channel/UCLPJkiQD8VAJSV3k3gSml4w)

---

## ❓ Troubleshooting

Si vous rencontrez des problèmes lors de l'installation ou du lancement :

1.  **Erreur `sharp` ou optimisation d'images** :
    - Assurez-vous d'utiliser **Node.js 22+** (requis pour `sharp` précompilé, cf. `engines` du `package.json`).
    - Si l'erreur persiste :
      ```bash
      rm -rf node_modules
      bun install
      ```
2.  **Erreur `bun` introuvable** :
    - Installez Bun : `curl -fsSL https://bun.sh/install | bash` (voir [bun.sh](https://bun.sh)).
3.  **Problèmes d'environnement** :
    - Vérifiez que `.env` existe (copié depuis `.env.example`).
    - Les variables `WEB3FORMS_ACCESS_KEY` et `PUBLIC_CF_ANALYTICS_TOKEN` sont nécessaires (peuvent être "mock" pour le dev).
4.  **Tests Playwright** :
    - Si `bun run test:e2e` échoue, lancez `bunx playwright install --with-deps` pour installer les navigateurs.
    - Les tests E2E construisent et servent le site automatiquement (`bun run build && bun run preview`) ; aucun serveur de dev n'a besoin d'être lancé au préalable.
5.  **Build failed (assets)** :
    - Vérifiez que toutes les images référencées dans `src/content/project/*.mdx` existent réellement.

## 📖 À propos

Portfolio professionnel de **Samuel Dulex**, spécialisé dans la création de contenu vidéo et la captation d'événements. Ce site présente mes projets de manière dynamique et immersive, avec un focus sur l'expérience utilisateur et la performance.

**Mission**: _Connecter, Communiquer, Captiver_ — transformer chaque événement en une histoire mémorable.

Consultez la [documentation d'architecture](docs/ARCHITECTURE.md) pour plus de détails techniques.

_(Note: This project is implemented purely as a static Astro SSG architecture without dynamic backend frameworks)._

## ✨ Fonctionnalités

### 🎨 Design & Expérience

- **Mode sombre/clair** avec transition fluide
- **Architecture responsive** optimisée (Mobile First)
- **Animations modernes** avec View Transition API & ScrollReveal
- **Cartes Projets 3D** avec effet Tilt et glare subtil
- **Grille bento** éditoriale de projets sélectionnés, équilibrée par pilier
- **Lecteur vidéo intégré** avec streaming optimisé

### 🚀 Performance & SEO

- **SEO optimisé** avec metadata complète
- **RSS Feed** pour les dernières publications
- **Images optimisées** via Sharp
- **Carbon Badge** avec calcul d'empreinte écologique
- **Lighthouse score** de 100% en Performance et Accessibilité
- **Sécurité renforcée** avec CodeQL Analysis et Headers CSP stricts

## 📚 Documentation

Une documentation détaillée est disponible dans le dossier `docs/` :

- [🏗 Architecture](docs/ARCHITECTURE.md) : Structure du projet, concepts clés et extension.
- [🔐 Environnement](docs/ENV.md) : Variables d'environnement et secrets.
- [📡 API](docs/API.md) : Endpoints statiques (RSS, Sitemap).
- [🤖 AI](docs/AI.md) : Politique d'utilisation de l'IA.

## 🚀 Quick Start

### Prérequis

- Node.js 22+ (Requis pour l'optimisation des images via `sharp`)
- Bun 1.3+ (Gestionnaire de paquets et runtime utilisé par les scripts, les tests et la CI)

### Installation

```bash
# Cloner le repository
git clone https://github.com/kuasar-mknd/profilePro.git
cd profilePro

# Installer les dépendances
bun install

# Configurer l'environnement
cp .env.example .env

# Installer les navigateurs pour les tests E2E
bunx playwright install --with-deps

# Lancer le serveur de développement
bun run dev
```

Le site sera accessible sur `http://localhost:4321`.

### Scripts disponibles

- `bun run dev` : Lance le serveur de développement.
- `bun run build` : Génère le build de production (optimisation d'images + génération CSP).
- `bun run check` : Vérifie le code (linting + formatage + types).
- `bun run audit` : Audit de sécurité des dépendances (`bun audit --audit-level=high`).
- `bun run lighthouse` : Lance l'audit de performance.
- `bun run test:e2e` : Lance les tests end-to-end avec Playwright.
- `bun run test` : Lance les tests unitaires avec Bun.

### API Access (Main Endpoints)

Le site est statique mais expose des données via des endpoints générés au build :

```bash
# Récupérer le flux RSS (XML)
curl https://portfolio.kuasar.xyz/rss.xml

# Récupérer le Sitemap (XML)
curl https://portfolio.kuasar.xyz/sitemap-index.xml

# Récupérer le fichier robots.txt (Directives crawlers)
curl https://portfolio.kuasar.xyz/robots.txt
```

_(Note: There are no dynamic backend routes (such as Hono), Prisma database, or API POST endpoints as this is a fully static Astro application. The project relies purely on file-based markdown collections)._

## 📂 Structure du projet

```text
/
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants Astro
│   ├── content/         # Collections de contenu (MDX)
│   ├── layouts/         # Templates de pages
│   ├── pages/           # Pages du site
│   └── config.mjs       # Configuration du site
├── astro.config.mjs     # Configuration Astro
└── package.json
```

## ⚙️ Configuration

Personnalisez le site via `src/config.mjs` (Titre, Réseaux sociaux, etc.) et ajoutez des projets dans `src/content/project/`.

Voir [ARCHITECTURE.md](docs/ARCHITECTURE.md) pour plus de détails.

## 🌐 Déploiement

Le déploiement est automatisé sur **Cloudflare Pages** via GitHub Actions.
Le workflow assure :

1. Vérification de la qualité (`check`).
2. Tests End-to-End (`test:e2e`).
3. Scan de sécurité (`CodeQL` pour JS/TS, et `Dependency Review` pour bloquer les dépendances à risque sur les PRs).
4. Build et déploiement via Wrangler.

Pour plus de détails sur le pipeline, voir [ARCHITECTURE.md](docs/ARCHITECTURE.md#cicd-pipeline).

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/kuasar-mknd/profilePro/issues). You can also take a look at the [contributing guide](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md).

## 🛡️ Security

Please review our [Security Policy](SECURITY.md) for information on reporting security vulnerabilities.

## 📄 License

Copyright © 2025 [Samuel Dulex](https://github.com/kuasar-mknd).
This project is [MIT](LICENSE) licensed.

---

Construit avec ❤️ par Samuel Dulex
