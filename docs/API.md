# Documentation API

Ce site est principalement statique, mais il interagit avec quelques services externes.

## Services Externes

### 1. Web3Forms (Formulaire de Contact)

Utilisé pour gérer les soumissions du formulaire de contact sans backend serveur.

- **Endpoint**: `POST https://api.web3forms.com/submit`
- **Authentification**: Via `access_key` (champ caché dans le formulaire).
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

- **Type**: Script externe
- **Source**: `https://unpkg.com/website-carbon-badges@1.1.3/b.min.js` (Note: Ce script peut être bloqué par la CSP ou remplacé par une version locale dans `public/scripts/` pour la sécurité).

## API Interne (Build-time)

Le site ne expose pas d'API REST publique. Cependant, il génère les fichiers suivants au build :

- **Sitemap**: `/sitemap-index.xml`
- **RSS Feed**: `/rss.xml` (Contient les derniers projets)
