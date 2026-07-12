# 🧭 Analyse complète & Roadmap de refonte

> État des lieux du portfolio (code, visuel, contenu) et plan d'action priorisé.
> Rédigé le 11 juillet 2026 · Branche `claude/project-analysis-redesign-eiigj8`

---

## 1. Résumé exécutif

Le site est techniquement solide (Astro 6, Tailwind 4, CI complète, accessibilité soignée, très bonnes performances), mais il souffre de trois problèmes de fond :

1. **Le portfolio ne prouve pas le positionnement.** Le site annonce 4 expertises (Vidéo, Développement Web, Photographie, Stratégie Digitale) mais les 18 projets publiés sont à ~85 % audiovisuels. **Aucun projet web, aucune étude de cas stratégie.** C'est la cause directe de l'impression « ce sont surtout mes projets vidéo qui sont mis en avant » — et la mécanique du site (tri par date, carrousel aléatoire) amplifie ce biais au lieu de le corriger.
2. **Deux bugs critiques sont actifs en production** (vérifiés le 11.07.2026) :
   - Le **formulaire de contact est cassé** : `POST /api/submit` répond `405` — la Cloudflare Pages Function n'est pas déployée. Et même déployée, elle refuserait les requêtes (l'allowlist d'origines ne contient pas `portfolio.kuasar.xyz`). **Aucun prospect ne peut vous contacter via le site.**
   - **Chaque projet existe à deux URLs** (`/slug/` et `/project/slug/`), toutes deux indexables et présentes dans le sitemap → contenu dupliqué, référencement dilué.
3. **Dette d'automatisation.** Les bots (Bolt/Sentinel/Palette/DocOps) ont laissé beaucoup de bruit : fichiers morts à la racine, 2 lockfiles, 2 workflows CI redondants, docs contradictoires, commentaires de justification partout, et des micro-optimisations qui complexifient sans bénéfice mesurable.

**La recommandation centrale** : ne pas « rajouter un filtre », mais restructurer le contenu autour de **catégories éditoriales** (Image, Web, Communication) avec un champ `featured`, écrire les 4–6 études de cas manquantes (web + communication), et re-raconter les projets existants autour de **votre rôle** plutôt que du récit du tournage.

---

## 2. État des lieux

### 2.1 Contenu — le déséquilibre en chiffres

Inventaire des 18 projets (`src/content/project/`) :

| Tag actuel    | Nb  | Projets                                                                    |
| ------------- | --- | -------------------------------------------------------------------------- |
| clip musical  | 6   | frencha, izia-proudRebel, jimmy-cpdv, lamia, lola, xxcent-sourire          |
| court-métrage | 5   | 48h-geneve-2024, 48h-geneve-2025, 48h-lausanne-2024, 48h-vevey-2025, nuage |
| communication | 2   | paternelle-2024, paternelle-2025                                           |
| événementiel  | 2   | paternelle, larev                                                          |
| photo         | 1   | izia-fete-musique                                                          |
| documentaire  | 1   | corps-et-ame                                                               |
| production    | 1   | producteur (page fourre-tout)                                              |

Constats :

- **0 projet « développement web »**, alors que c'est un pilier annoncé partout (hero, services, JSON-LD, FAQ, à-propos). Le paradoxe : ce portfolio lui-même (Astro, Lighthouse 100, PWA, CI/CD) est une preuve de compétence web… jamais présentée comme projet.
- **0 étude de cas « stratégie digitale »**, alors que La Paternelle contient déjà la matière (8 000 spectateurs, guichets fermés, gestion 360°) — elle est racontée comme de l'événementiel, pas comme un cas de communication chiffré.
- **5 des 6 « clips musicaux » sont en réalité des projets de photographie** (photographe de plateau). Ils sont tagués et racontés comme des projets vidéo d'autrui, ce qui gonfle artificiellement la catégorie vidéo et affaiblit la catégorie photo.
- Sur la majorité des projets, le rôle est **« assistant / photographe de plateau / électro »** sur les œuvres d'autres réalisateurs. Le récit global qui s'en dégage est « technicien de plateau » plutôt que « créateur hybride qui pilote des projets » — à rebours du CV (responsable comm, dev, prix entrepreneuriat).
- Anomalies ponctuelles : `producteur.mdx` et `jimmy-cpdv.mdx` pointent vers **la même vidéo YouTube** ; `jimmy-cpdv` utilise votre photo de profil comme cover ; la page CV (`/cv/`) n'est **liée nulle part** (orpheline) ; la home affiche « Projets récents » = tri par date brut, donc dominé par les 48h/clips.
- Les textes sont longs, très adjectivés (« énergie brute », « osmose bouillonnante »…), sans données concrètes ni livrables — un ton généré qui dilue la crédibilité. Le « temps de lecture » affiché sur chaque carte renforce l'effet blog au détriment de l'effet portfolio.

### 2.2 Bugs critiques (confirmés en production)

| #   | Problème                     | Preuve                                                                                                                                                                                                                                                      | Impact                                          |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| B1  | **Formulaire de contact HS** | `POST https://portfolio.kuasar.xyz/api/submit` → `405` (function non déployée). Second verrou : `functions/api/submit.ts` n'autorise que les origines `kuasar.xyz` / `www.kuasar.xyz`, jamais `portfolio.kuasar.xyz` (le domaine réel, cf. `public/CNAME`). | Perte de 100 % des leads du site                |
| B2  | **Routes dupliquées**        | `/48h-geneve-2024/` et `/project/48h-geneve-2024/` répondent tous deux `200`, chacun avec un canonical auto-référent ; le sitemap liste **les deux** séries d'URLs (`src/pages/[slug].astro` duplique `src/pages/project/[slug].astro`)                     | SEO dilué, contenu dupliqué, maintenance double |

### 2.3 Code — forces et dettes

**Forces (à préserver)** : stack moderne et bien choisie (Astro 6 SSG, Tailwind 4, TypeScript strict) ; pipeline d'images AVIF efficace ; accessibilité réellement travaillée (aria, clavier, `prefers-reduced-motion`) ; sécurité prise au sérieux (CSP générée au build, sanitisation, honeypot) ; CI riche (lint, format, types, tests unitaires Bun, e2e Playwright, Lighthouse CI, CodeQL).

**Dettes :**

| #   | Problème                                                                                                                                                                                                                                                                                 | Localisation                                                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| C1  | Page projet dupliquée (cause de B2) : deux templates à maintenir, styles divergents                                                                                                                                                                                                      | `src/pages/[slug].astro` vs `src/pages/project/[slug].astro` |
| C2  | Deux workflows CI quasi identiques (double coût, dont un step Prisma sans objet dans un repo sans Prisma)                                                                                                                                                                                | `.github/workflows/ci.yml` + `pipeline.yml`                  |
| C3  | Deux lockfiles (`bun.lock` + `pnpm-lock.yaml`) → installations non reproductibles selon l'outil                                                                                                                                                                                          | racine                                                       |
| C4  | Fichiers morts / reliquats à la racine : `PR_AUDIT_REPORT.md`, `format2.mjs`, `update_palette.cjs`, `analyze_lighthouse.cjs`, `src/components/common/Header.astro.orig`                                                                                                                  | racine, `src/components`                                     |
| C5  | Docs contradictoires : README (Node 20 vs `engines >=22` ; licence « MIT » vs `UNLICENSED` vs badge « All Rights Reserved » ; sections Hono/Prisma hypothétiques), `agent.md` (annonce Astro v5 + React 19 + bun — faux sur les trois points)                                            | `README.md`, `agent.md`, `.github/workflows/ci.yml`          |
| C6  | Fonts inutilisées : Inter et Space Grotesk v15 préchargées dans `public/fonts/` sans `@font-face`, et 3 dépendances `@fontsource/*` jamais importées                                                                                                                                     | `public/fonts/`, `package.json`                              |
| C7  | Sur-ingénierie de bots : commentaires ⚡🛡️🎨 justificatifs omniprésents, `crypto.getRandomValues` pour mélanger un carrousel, pattern `window.__*` répété 8 fois pour dédupliquer des listeners                                                                                          | diffus (`Hero.astro` est le pire cas)                        |
| C8  | Incohérences de config : `og:type` invalide (`video`/`photo`/`general` ne sont pas des types Open Graph) ; token `--aspect-9-10: 9/16` (nom ≠ valeur) ; `latestPosts: 5` vs `postLimit={7}` ; `postsPerPage: 20` pour 18 projets ; `homepage: kuasar.xyz` vs site `portfolio.kuasar.xyz` | `SeoHead.astro`, `style.css`, `config.mjs`, `package.json`   |
| C9  | 83 Mo / 778 images versionnées ; les galeries 48h embarquent ~54 photos chacune                                                                                                                                                                                                          | `src/assets/`                                                |
| C10 | Schéma de contenu trop pauvre pour un portfolio : `tag` libre unique + `type` redondant ; pas de `role`, `client`, `featured`, `skills`, `metrics`                                                                                                                                       | `src/content.config.ts`                                      |

### 2.4 Visuel — diagnostic

Le design (thème « Pacamara » adapté) est cohérent en mode clair/sombre et responsive, mais :

- **Surcharge d'effets** : titre animé lettre par lettre, dégradé `text-shimmer` en boucle infinie sur ~tous les titres, cartes 3D tilt + glare, glows, blobs flottants, carrousel infini incliné, vibrations haptiques (`navigator.vibrate`), raccourcis clavier affichés en `<kbd>` sur chaque lien de nav… L'ensemble fait « démo de template » et détourne l'attention **des projets eux-mêmes** — or dans un portfolio visuel, ce sont les images qui doivent briller, pas le chrome autour.
- **Palette dispersée** : indigo (secondary) + rouge-rose (accent) + violet + « neon blue/purple » — trop de couleurs en compétition, sans signification. Aucune n'encode d'information (par ex. la catégorie du projet).
- **Cartes projet peu informatives** : tag libre + date + « X min de lecture ». Ni le rôle, ni le client, ni la catégorie — les trois informations qu'un prospect ou recruteur cherche en premier.
- **Hero home** : le carrousel tire 15 images **au hasard** parmi les covers → statistiquement ~85 % de photos de plateau/cinéma. La tagline « L'Art de transformer chaque événement en Histoire » est un positionnement 100 % événementiel/vidéo qui contredit le « créateur hybride ».
- **Navigation squelettique** : 3 entrées (Accueil, Projets, À propos). Pas de Services, pas de Contact dédié, CV introuvable, footer sans liens utiles.

---

## 3. Vision cible

### 3.1 Positionnement proposé

> **Samuel Dulex — Créateur hybride : image, web & communication.**
> Je conçois des contenus (vidéo, photo), les plateformes qui les diffusent (web) et les stratégies qui les font performer (communication).

Trois piliers visibles (au lieu de 4 services vagues), chacun **prouvé** par des projets :

| Pilier               | Catégories de contenu | Preuves existantes                                  | Preuves à créer                                |
| -------------------- | --------------------- | --------------------------------------------------- | ---------------------------------------------- |
| 🎬 **Image**         | `video`, `photo`      | 48h (3 prix !), clips, docu, reportages             | Showreel 90 s                                  |
| 💻 **Web**           | `web`                 | —                                                   | Ce portfolio, projets HEIG-VD/stage, app perso |
| 📣 **Communication** | `communication`       | La Paternelle (8 000 spectateurs), Les Insomniaques | Étude de cas Paternelle chiffrée               |

### 3.2 Nouveau modèle de contenu (`src/content.config.ts`)

```ts
const projectCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string().max(100),
      intro: z.string().max(300),
      // — Taxonomie éditoriale —
      category: z.enum(["video", "photo", "web", "communication"]),
      tags: z.array(z.string()).default([]), // secondaire, libre
      role: z.string(), // "Gaffer & DIT", "Développeur fullstack"…
      client: z.string().optional(), // "La Paternelle", "48H Film Project"…
      featured: z.number().int().min(0).default(0), // poids éditorial (0 = non mis en avant)
      awards: z.array(z.string()).default([]), // "Prix du Meilleur Film 2024"
      metrics: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),
      skills: z.array(z.string()).default([]), // outils/stack : "DaVinci", "Astro", "Meta Ads"
      // — Médias & liens —
      image: image(),
      videoUrl: z.string().url().optional(),
      gallery: z.array(image()).optional(),
      liveUrl: z.string().url().optional(), // pour les projets web
      repoUrl: z.string().url().optional(),
      pubDate: z.date(),
      author: reference("author"),
      // SEO inchangé (seoTitle, seoDescription, ogImage)
    }),
});
```

Ce schéma permet : filtres par pilier, badge de rôle sur les cartes, fiche technique structurée en tête de page projet, sélection éditoriale de la home (`featured`), blocs « résultats » chiffrés, et cartes adaptées aux projets web (liens live/repo au lieu de player vidéo).

### 3.3 Architecture de pages cible

```
/                        Home refondue : hero valeur + 3 piliers + sélection featured équilibrée + preuve sociale + CTA
/realisations/           Grille tous projets, filtres par pilier (remplace /project/, redirections 301)
/realisations/[slug]/    Fiche projet « étude de cas » (rôle, client, année, outils, résultats, médias)
/services/               (nouveau) 3 piliers détaillés, process, chaque pilier liant ses projets
/about/                  Parcours + compétences + lien CV visible
/cv/ et /cv/en/          Inchangés, mais reliés depuis la nav/footer
/contact/                (nouveau, optionnel) formulaire réparé + délais de réponse + réseaux
```

_(Garder `/project/` comme base d'URL est acceptable pour limiter les redirections — dans ce cas ne créer que les 301 des routes racine dupliquées.)_

---

## 4. Roadmap

### 🚨 Phase 0 — Réparer & assainir (1–2 jours) — _avant tout le reste_

**0.1 Réparer le formulaire de contact (B1)** — `functions/api/submit.ts`, `.github/workflows/pipeline.yml`

- [x] Ajouter `https://portfolio.kuasar.xyz` (et le futur domaine) à `allowedOrigins`.
- [x] Corriger le déploiement pour que `functions/` soit réellement publié : `wrangler pages deploy` sans argument (utilise `pages_build_output_dir` de `wrangler.toml` et embarque `functions/`).
- [x] Ajouter un smoke test post-deploy dans le job `deploy` : `POST /api/submit` avec payload honeypot doit répondre `200` (sinon le déploiement échoue). **→ À surveiller au premier déploiement sur `master` : si le smoke test échoue encore, inspecter les logs wrangler (« Compiled Worker successfully ») et la config du projet Pages.**

**0.2 Éliminer les routes dupliquées (B2)** — `src/pages/[slug].astro`, `public/_redirects`

- [x] Supprimer `src/pages/[slug].astro`.
- [x] Créer `public/_redirects` avec les redirections explicites `/<slug>[/] → /project/<slug>/ 301` (liste explicite, pas de placeholder `/:slug` qui capturerait `/about/`).
- [x] Vérifier que le sitemap ne liste plus qu'une URL par projet.

**0.3 Nettoyage du dépôt** —

- [x] Supprimer : `PR_AUDIT_REPORT.md`, `format2.mjs`, `update_palette.cjs`, `analyze_lighthouse.cjs`, `src/components/common/Header.astro.orig`, `bun.lock` (pnpm est le gestionnaire de fait — un seul lockfile).
- [x] Fusionner `ci.yml` dans `pipeline.yml` (le step Prisma disparaît) : `ci.yml` supprimé, `pipeline.yml` reste l'unique workflow test + deploy (aucun check requis par une protection de branche n'était lié à `ci.yml`).
- [x] Supprimer les fonts mortes (`inter-v12-*`, `space-grotesk-v15-*`) et les deps `@fontsource/*` inutilisées.
- [x] Corriger README (Node 22, licence MIT alignée sur le fichier `LICENSE`, retrait de la section Hono/Prisma, badge CI → `pipeline.yml`) et `agent.md` (Astro 6, pas de React, pnpm).
- [x] Micro-fixes : `og:type` (`website` / `article` / `video.other`), token `--aspect-9-10` → `--aspect-9-16`, `homepage` et `license` de `package.json`. (`latestPosts`/`postsPerPage` : laissés en l'état, revus en Phase 1 avec la home éditoriale.)
- [x] **Traiter les vulnérabilités de dépendances** : overrides pnpm mis à jour (`undici ^7.28.0`, `tmp ^0.2.6`, `basic-ftp >=5.3.1`, `qs >=6.15.2`, `tar >=7.5.16`, `esbuild` scopé vite/astro `>=0.28.1`), `vite ^7.3.5`, lockfile régénéré → `pnpm audit` : **0 vulnérabilité** (contre 16). Les PRs Dependabot redondantes peuvent être fermées.
- [ ] Recadrer ou suspendre les bots Jules le temps de la refonte (ils génèrent des dizaines de PRs dupliquées — cf. `PR_AUDIT_REPORT.md` : 100 PRs fermées en un jour).

### 🎯 Phase 1 — Rééquilibrer le contenu (1–2 semaines) — _le cœur de votre demande_

**1.1 Nouvelle taxonomie** — `src/content.config.ts`

- [x] Implémenter le schéma §3.2 (catégorie, rôle, client, featured, awards, metrics, skills, liveUrl/repoUrl). _Note : `tag` est conservé pour ne pas casser les URLs de filtres existantes — la bascule des filtres vers `category` se fera avec la Phase 2._
- [x] Migrer les 18 fichiers MDX (frontmatter uniquement, textes intacts ; cover de `jimmy-cpdv` remplacée par une photo de tournage). Recatégorisation appliquée :
  - `video` : 48h ×4 (avec `awards`), nuage, corps-et-ame, jimmy-cpdv (réalisation — remplacer la cover).
  - `photo` : **frencha, izia-proudRebel, lamia, lola, xxcent-sourire** (photographie de plateau = travail photo !), izia-fete-musique.
  - `communication` : paternelle (fiche mère, `featured` élevé, metrics « 8 000 spectateurs · guichets fermés »), paternelle-2024, paternelle-2025, larev.
  - Supprimer `producteur.mdx` (doublon de vidéo avec jimmy-cpdv, contenu générique) ou le transformer en page Services/Showreel.
- [ ] Réécrire chaque `title`/`intro` pour mettre **le rôle en premier** (ex. « Gaffer sur _Gamines_ — court-métrage primé, 48H Genève 2025 »).

**1.2 Créer les projets manquants (4–6 études de cas)**

- [x] 💻 **Ce portfolio** : Astro 6, Lighthouse 100, PWA, CI/CD, pipeline images — votre meilleure preuve web est déjà en ligne. _Fait : `portfolio-kuasar.mdx` (category `web`, featured 88, liens live/repo, captures d'écran générées)._
- [ ] 💻 1–2 projets dev (HEIG-VD, stage becash, app Laravel/Vue perso) : contexte, stack, captures, liens live/repo.
- [ ] 📣 **La Paternelle — étude de cas 360°** : problème → stratégie → dispositifs (affichage, presse, réseaux) → résultats chiffrés. C'est le projet qui prouve « stratégie digitale ».
- [ ] 📷 1 série photo autonome (portraits ou événement) pour ancrer le pilier photo au-delà du plateau.
- [ ] 🎬 Showreel 90 s (hébergé YouTube/Vimeo) en tête du pilier Image.
- [ ] Passe éditoriale globale : dégraisser les textes (300–400 mots utiles), remplacer les adjectifs par des faits (matériel, contraintes, résultats), structure commune Contexte → Rôle → Réalisation → Résultat.

**1.3 Reprendre le contrôle éditorial de la home** — `src/pages/index.astro`, `Hero.astro`, `LatestPosts.astro`

- [x] Remplacer le tirage aléatoire du carrousel par la liste des projets `featured` (triés par poids), en garantissant la mixité des piliers (`src/utils/featured.ts` + tests).
- [x] « Projets récents » → « Projets sélectionnés » : 7 cartes pilotées par `featured` en alternant les piliers, le bento mettant la plus grande carte sur le projet phare. Les cartes affichent désormais **le rôle** à la place du temps de lecture, et la page projet affiche rôle + client sous le titre.
- [ ] Ajouter une section preuve sociale : 3 prix 48h, 8 000 spectateurs Paternelle, prix HEIG-VD/hackdays (déjà dans `cv-basics.yml`).

### 🎨 Phase 2 — Refonte visuelle (2–3 semaines)

**2.1 Apaiser le système** — `src/css/style.css`, `Hero.astro`

- [ ] Supprimer : animation lettre par lettre, `text-shimmer` permanent (le réserver éventuellement à un seul élément du hero, statique au repos), vibrations haptiques, hints `<kbd>` visibles (garder les raccourcis fonctionnels), neons inutilisés. _Constat aggravant (captures headless du 11.07.2026) : le titre « Connecter. Captiver. » est pratiquement **invisible dans les deux thèmes** (dégradé blanc 60-80 % sur fond clair ; opacité 0.25 en sombre) — le H1 principal de la home n'apporte actuellement rien visuellement._
- [ ] Réduire les blobs/glows d'arrière-plan à un seul élément discret par page ; limiter TiltCard aux cartes services.
- [ ] Palette : 1 accent principal + 4 **couleurs de catégorie** signifiantes (réutiliser purple/blue/pink/orange déjà définies dans `ServicesPreview`) appliquées aux badges de pilier partout (cartes, filtres, pages projet).
- [ ] Typo : officialiser le duo Space Grotesk (titres) / Outfit (texte) — c'est déjà l'usage réel.

**2.2 Cartes & grilles orientées preuve** — `Post.astro`, `ProjectFilter.astro`, `project/[...page].astro`

- [ ] Carte projet : badge catégorie coloré + **rôle** + client/année ; supprimer « min de lecture » et la date brute (l'année suffit).
- [ ] Filtres par pilier (4 boutons + « Tous ») au lieu des 7 tags libres ; tags relégués en filtre secondaire ou supprimés de l'UI.
- [ ] Tri : featured d'abord, puis chronologie.

**2.3 Page projet « étude de cas »** — `project/[slug].astro`

- [ ] En-tête structuré sous le titre : Rôle · Client · Année · Outils · Prix (données du frontmatter, fini les fiches techniques en prose).
- [ ] Bloc « Résultats » (metrics) mis en forme quand présent.
- [ ] Variante de mise en page par catégorie : player pour `video`, galerie plein écran pour `photo`, captures + boutons Live/Repo pour `web`, chiffres en avant pour `communication`.
- [ ] « D'autres projets » : proposer en priorité des projets du même pilier.

**2.4 Navigation & structure** — `Navigation.astro`, `Footer.astro`, nouvelle page `services.astro`

- [ ] Nav : Accueil · Réalisations · Services · À propos · Contact.
- [ ] Créer `/services/` (3 piliers, process, FAQ — recycler le JSON-LD FAQ existant).
- [ ] Footer : liens vers CV (fr/en), services, réalisations par pilier, réseaux, mention légale.
- [ ] Hero : nouvelle tagline hybride (§3.1) ; les 3 piliers cliquables vers leurs filtres.

### 📈 Phase 3 — Croissance (en continu, après la refonte)

- [ ] Témoignages clients (2–3 citations : artistes, La Paternelle, prof/employeur) sur home et services.
- [ ] Page contact enrichie : types de demande, budget indicatif, délai de réponse.
- [ ] SEO local : pages d'atterrissage par service × région si la prospection Suisse romande est un objectif (« vidéaste Lausanne », « développeur web Lausanne »).
- [ ] Mesurer : événements analytics sur les CTA/formulaire (Cloudflare Analytics est déjà en place) pour valider que la refonte convertit.
- [ ] Alléger le dépôt : galeries 48h réduites à 10–12 photos sélectionnées (~-40 Mo), envisager Git LFS ou un bucket R2 si le volume recroît.
- [ ] i18n EN du site (le CV l'est déjà) si la cible internationale (permis EIC Canada mentionné au CV) devient prioritaire.

---

## 5. Décisions à trancher (bloquantes pour les phases 1–2)

1. **Positionnement** : assumer le profil hybride 3 piliers (recommandé, cf. §3.1) ou recentrer sur 2 piliers (Image + Web) ? → détermine la home, les services et le tri des contenus.
2. **Cible principale** : clients freelance en Suisse romande, ou recruteurs (CV/EIC Canada) ? → détermine le CTA principal (devis vs CV/LinkedIn) et la place de la page CV.
3. **Marque & domaines** : Samuel Dulex vs « Kuasar » ; unifier `portfolio.kuasar.xyz` / `kuasar.xyz` / email `edulex.ch` (l'écart entre domaine du site et domaine de l'email nuit à la confiance et a contribué au bug du formulaire).
4. **Bots Jules** : les couper, ou les recadrer (périmètre restreint, quota de PRs) ? En l'état ils produisent plus de bruit que de valeur.
5. **URL des projets** : conserver `/project/` (moins de redirections) ou migrer vers `/realisations/` (cohérence FR) ?

---

## 6. Ordre d'exécution suggéré

| Sprint  | Contenu                                      | Livrable visible                                  |
| ------- | -------------------------------------------- | ------------------------------------------------- |
| S1      | Phase 0 complète                             | Formulaire fonctionnel, URLs uniques, repo propre |
| S2      | 1.1 taxonomie + migration MDX                | Filtres par pilier en ligne                       |
| S3      | 1.2 nouveaux projets (web + Paternelle 360°) | Le pilier web existe enfin                        |
| S4      | 1.3 home éditoriale + 2.4 navigation         | La home raconte le profil hybride                 |
| S5–S6   | 2.1 → 2.3 refonte visuelle                   | Nouveau look calme et pro                         |
| Continu | Phase 3                                      | Témoignages, SEO local, mesure                    |

Chaque sprint est déployable indépendamment : le site reste en ligne et s'améliore par incréments.
