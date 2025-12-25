# 🎬 Samuel Dulex Portfolio

> **L'Art de transformer chaque événement en Histoire**

<!-- Status & Build -->

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fportfolio.kuasar.xyz&label=portfolio.kuasar.xyz)](https://portfolio.kuasar.xyz)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![CI Quality](https://github.com/kuasar-mknd/profilePro/actions/workflows/ci.yml/badge.svg)](https://github.com/kuasar-mknd/profilePro/actions/workflows/ci.yml)

<!-- Tech Stack -->

[![Built with Astro](https://img.shields.io/badge/Astro-5.16-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
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

[🌐 Site Web](https://kuasar.xyz) • [📸 Instagram](https://www.instagram.com/kuasar.mknd) • [🎥 YouTube](https://www.youtube.com/channel/UCLPJkiQD8VAJSV3k3gSml4w)

---

## ❓ Troubleshooting

Si vous rencontrez des problèmes lors de l'installation ou du lancement :

1.  **Erreur `sharp` ou optimisation d'images** :
    - Assurez-vous d'utiliser **Node.js 20** (requis pour `sharp` précompilé).
    - Lancez `bun install` pour reconstruire les binaires natifs.
2.  **Erreur `bun run` introuvable** :
    - Installez Bun via `curl -fsSL https://bun.sh/install | bash`.
3.  **Problèmes d'environnement** :
    - Vérifiez que `.env` existe (copié depuis `.env.example`).
    - Les variables `PUBLIC_` sont nécessaires au build.
4.  **Tests Playwright** :
    - Si `bun run test:e2e` échoue, lancez `bun x playwright install --with-deps` pour installer les navigateurs.

## 📖 À propos

Portfolio professionnel de **Samuel Dulex**, spécialisé dans la création de contenu vidéo et la captation d'événements. Ce site présente mes projets de manière dynamique et immersive, avec un focus sur l'expérience utilisateur et la performance.

**Mission**: _Connecter, Communiquer, Captiver_ — transformer chaque événement en une histoire mémorable.

Consultez la [documentation d'architecture](docs/ARCHITECTURE.md) pour plus de détails techniques.

## ✨ Fonctionnalités

### 🎨 Design & Expérience

- **Mode sombre/clair** avec transition fluide
- **Architecture responsive** optimisée (Mobile First)
- **Animations modernes** avec View Transition API & ScrollReveal
- **Cartes Projets 3D** avec effet Tilt et glare subtil
- **Carousel d'accueil** intelligent
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
- [🔌 API](docs/API.md) : Services externes (Web3Forms) et API internes.
- [🔐 Environnement](docs/ENV.md) : Variables d'environnement et secrets.
- [🤖 AI](docs/AI.md) : Politique d'utilisation de l'IA.

## 🚀 Quick Start

### Prérequis

- Node.js 20 (Requis pour l'optimisation des images via `sharp`)
- Bun 1.0+ (Requis pour l'exécution des scripts et le gestionnaire de paquets)

### Installation

```bash
# Cloner le repository
git clone https://github.com/kuasar-mknd/profilePro.git
cd profilePro

# Installer les dépendances
bun install

# Installer les navigateurs pour les tests E2E
bun x playwright install --with-deps

# Lancer le serveur de développement
bun run dev
```

Le site sera accessible sur `http://localhost:4321`.

### Scripts disponibles

- `bun run dev` : Lancer le serveur de développement.
- `bun run build` : Générer le build de production.
- `bun run check` : Vérifier le code (linting + formatage).
- `bun run lighthouse` : Lancer l'audit de performance.
- `bun run test:e2e` : Lancer les tests end-to-end avec Playwright.

### API Access

Le site est statique mais expose des données via des endpoints générés au build :

```bash
# Récupérer le flux RSS (XML)
curl https://portfolio.kuasar.xyz/rss.xml

# Récupérer le Sitemap (XML)
curl https://portfolio.kuasar.xyz/sitemap-index.xml
```

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
3. Scan de sécurité (`CodeQL`, `Dependency Review`).
4. Build et déploiement via Wrangler.

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
