# Documentation API

Ce site est statique (SSG), il ne possède pas de backend serveur (API REST/GraphQL) propre au runtime. Cependant, il interagit avec des services externes et génère des endpoints de données au moment du build.

## Services Externes

### 1. Web3Forms (Formulaire de Contact)

Utilisé pour gérer les soumissions du formulaire de contact sans backend serveur.

- **Endpoint**: `POST https://api.web3forms.com/submit`
- **Authentification**: Via `access_key` (champ caché dans le formulaire, voir `docs/ENV.md`).
- **Payload (JSON)**:
  ```json
  {
    "access_key": "YOUR_ACCESS_KEY",
    "name": "Nom de l'utilisateur",
    "email": "email@example.com",
    "message": "Contenu du message",
    "subject": "Nouveau message...",
    "botcheck": "" // Champ honeypot (doit être vide)
  }
  ```

### 2. Website Carbon (Badge Écologique)

Utilisé pour afficher l'impact écologique de la page.

- **Type**: Implémentation locale inline (voir `src/components/common/Footer.astro`).
- **Note de sécurité**: L'ancien script externe `website-carbon-badges.js` a été supprimé pour réduire la surface d'attaque (injection HTML) et améliorer la performance.

## API Interne (Build-time)

Le site génère les fichiers de données suivants lors de la compilation (`bun run build`), accessibles comme des fichiers statiques :

- **Sitemap**: `/sitemap-index.xml` (Index des pages pour les moteurs de recherche)
- **RSS Feed**: `/rss.xml` (Flux des derniers projets publiés)

Exemple d'accès :
```bash
curl https://portfolio.kuasar.xyz/rss.xml
```
