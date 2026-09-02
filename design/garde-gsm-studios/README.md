# Page de garde — candidature GSM Studios

Maquette éditable de la **couverture** du PDF (mono-color, traitement
photocopy, deux encres). Elle sert de banc d'essai : la page réelle est
`src/pages/portfolio-pdf.astro`, dont les textes se pilotent depuis le
bloc `cover:` de `src/data/portfolio-pdf.yml`.

Les trois spécimens tramés sont partagés avec le site et vivent dans
`src/assets/portfolio-pdf/` — les regénérer met donc à jour la couverture
du PDF du même coup.

## Modifier

Tout se règle dans le bloc `RÉGLAGES` en tête de [garde.html](garde.html) :
positions/tailles en mm (page A4 paysage 297 × 210), encres, et les textes
directement dans le HTML en dessous.

## Re-rendre l'aperçu

```bash
node design/garde-gsm-studios/render.mjs
```

→ produit `garde.png` (aperçu 2×) dans ce dossier.

## Régénérer un spécimen (autre photo, autre traitement)

`treatments.mjs` fabrique un élément tramé depuis n'importe quelle image
(traitements : `photocopy`, `grain`, `cyanotype`) ; `halftone.mjs` fait la
trame à points classique. Exemple — recadrer/regénérer le lustre :

```bash
node design/garde-gsm-studios/treatments.mjs src/assets/paternelle.avif src/assets/portfolio-pdf/spec-lustre.png '{"treatment":"photocopy","outWidth":1300,"ink":"#173AE3","gamma":1.5,"lowClip":0.11,"invert":true,"crop":{"left":0.418,"top":0,"width":0.2,"height":0.21},"mask":{"type":"radial","cx":0.49,"cy":0.48,"rx":0.46,"ry":0.46,"feather":0.25}}'
```

Options utiles : `crop` (fractions 0..1 de l'image source), `mask`
(`radial` ou `band-x`, coordonnées du rendu), `invert` (l'encre imprime la
lumière — pour les scènes sombres), `gamma`/`lowClip` (contraste et seuil).
