# Architecture du Projet

Ce document décrit l'architecture technique du portfolio, construit avec Astro 5.

## Vue d'ensemble

Le projet suit une architecture de site statique (SSG) généré par Astro, avec des composants interactifs hydratés côté client (Islands Architecture) uniquement lorsque nécessaire.

### Stack Technique
- **Core**: Astro 5 (Static Site Generation)
- **Styling**: Tailwind CSS 4 (CSS-first config)
- **Scripting**: TypeScript (Strict mode)
- **Type Checking**: `astro check` (via CI)
- **Contenu**: MDX (Markdown + Components)
- **Package Manager**: Bun (Utilisé pour le développement et le build)

## Structure des Dossiers

```text
src/
├── components/       # Composants réutilisables
│   ├── common/       # Composants globaux (Header, Footer, SEO)
│   ├── features/     # Composants métier complexes (Hero, ProjectCard)
│   ├── ui/           # Composants atomiques (Button, Badge, SocialIcon)
│   └── icons/        # Icônes SVG/Astro
├── content/          # Collections de données (MDX)
│   ├── project/      # Fichiers de projets (Portfolio)
│   └── config.ts     # Définition des schémas de contenu (Zod)
├── layouts/          # Templates de pages (Base, Article, Project)
├── pages/            # Routage basé sur le système de fichiers
│   ├── index.astro   # Page d'accueil
│   ├── about.astro   # Page À propos
│   ├── project/      # Routes dynamiques de projets ([slug].astro)
│   └── rss.xml.js    # Génération du flux RSS
├── css/              # Styles globaux et configuration Tailwind
├── config.mjs        # Configuration globale du site (métadonnées)
└── env.d.ts          # Définitions de types TypeScript
```

## Concepts Clés

### 1. Islands Architecture
Le site est statique par défaut. L'interactivité est ajoutée via des "îlots" interactifs.
Exemple : Le formulaire de contact (`ContactForm.astro`) est hydraté avec `client:visible` ou des scripts inline optimisés.

### 2. Content Collections
Les projets sont gérés via les Content Collections d'Astro (`src/content/project`). Chaque projet est un fichier `.mdx` avec un frontmatter typé (validé par Zod dans `src/content/config.ts`).

### 3. View Transitions
La navigation SPA (Single Page Application) est simulée grâce à l'API View Transitions d'Astro, offrant des transitions fluides sans rechargement complet de la page.

### 4. Performance
- **Images**: Optimisées au build via Sharp (`<Picture />` et `getImage`).
- **Scripts**: Chargement différé et exécution conditionnelle.
- **CSS**: Inliné pour réduire les requêtes bloquantes (Critical CSS).

## Extension du Projet

### Ajouter une nouvelle page
Créer un fichier `.astro` dans `src/pages/`. Il sera automatiquement accessible via son nom de fichier.

### Ajouter un composant UI
Créer le composant dans `src/components/ui/` et l'importer là où nécessaire. Privilégier les composants `.astro` purs quand c'est possible.
