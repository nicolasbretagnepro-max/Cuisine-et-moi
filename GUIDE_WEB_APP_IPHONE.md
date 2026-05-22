# Installer Atelier Cuisine comme web app sur iPhone

## Depuis Safari

1. Ouvre l'URL GitHub Pages de l'app.
2. Appuie sur l'icône de partage Safari.
3. Descends dans la liste.
4. Appuie sur `Sur l'écran d'accueil`.
5. Renomme si besoin en `Atelier Cuisine`.
6. Valide.

L'app s'ouvrira ensuite depuis l'écran d'accueil avec son icône.

## Fichiers nécessaires à cette installation

```txt
public/manifest.webmanifest
public/icons/icon-192.png
public/icons/icon-512.png
public/icons/icon-maskable-512.png
public/apple-touch-icon.png
public/sw.js
```

Le service worker permet de mettre en cache l'app et les données principales. Il ne remplace pas une sauvegarde de progression.

## Important sur les données

Les photos, commentaires et bilans sont stockés dans Safari. Si Safari supprime les données du site, ces informations peuvent être perdues.

À faire régulièrement :

```txt
Réglages > Exporter la progression
```
