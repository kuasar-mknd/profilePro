#!/bin/bash

# Script de nettoyage des fichiers Git
# Supprime les fichiers qui ne devraient pas être trackés

echo "🧹 Nettoyage du repository Git..."

# Supprimer les fichiers du cache Git (si présents)
FILES_TO_REMOVE=(
  ".frontmatter"
  ".lighthouseci"
  ".DS_Store"
  "stats.html"
  ".eslintcache"
  ".stylelintcache"
  "dist"
  "node_modules"
  "*.log"
)

for file in "${FILES_TO_REMOVE[@]}"; do
  if git ls-files | grep -q "$file"; then
    echo "  → Suppression de $file du cache Git..."
    git rm -r --cached "$file" 2>/dev/null && echo "    ✓ $file supprimé" || echo "    ✗ Erreur ou déjà supprimé"
  fi
done

echo ""
echo "✅ Nettoyage terminé !"
echo ""
echo "Prochaines étapes :"
echo "  1. Vérifier les changements : git status"
echo "  2. Commiter : git add .gitignore && git commit -m 'chore: clean up gitignore and remove unwanted files'"
echo "  3. Pusher : git push"
