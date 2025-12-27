# Variables d'Environnement

Ce projet utilise des variables d'environnement pour la configuration et les intégrations externes.

## Configuration Locale

Copiez le fichier `.env.example` vers `.env` pour le développement local :

```bash
cp .env.example .env
```

## Variables Disponibles

| Variable | Description | Requis | Contexte |
|----------|-------------|--------|----------|
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Clé d'API publique pour le service de formulaire de contact Web3Forms. | Oui* | Runtime (Client) |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Token pour les analytics Cloudflare (Web Analytics). | Non | Runtime (Client) |

*> Note : Actuellement, cette clé peut être définie directement dans le code source de `ContactForm.astro` ou via l'environnement.

## Secrets CI/CD (GitHub Secrets)

Ces variables sont configurées dans les secrets du dépôt GitHub pour le déploiement sur Cloudflare Pages.

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Token d'authentification pour l'API Cloudflare. |
| `CLOUDFLARE_ACCOUNT_ID` | ID du compte Cloudflare. |

## Validation

Les variables d'environnement sont typées via `env.d.ts` et peuvent être validées via `src/content/config.ts` ou `astro.config.mjs` si configuré.

_Note: Ne jamais committer le fichier `.env` avec des valeurs réelles._
