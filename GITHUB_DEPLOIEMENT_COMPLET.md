# Déploiement GitHub Pages - Atelier Cuisine

Ce guide part d'un projet React/Vite déjà prêt.

## 1. Ce qu'il faut mettre dans GitHub

Il faut mettre le contenu du dossier `atelier-cuisine`, pas le fichier ZIP.

Le dépôt doit contenir au minimum :

```txt
.github/workflows/deploy.yml
public/
src/
index.html
package.json
package-lock.json
tsconfig.json
vite.config.ts
README.md
```

Les dossiers importants :

```txt
public/data/              Catalogue, parcours, glossaire, fiches produits
public/icons/             Icônes de web app
public/sw.js              Service worker pour le cache hors ligne
public/manifest.webmanifest
src/                      Code React
.github/workflows/        Déploiement automatique GitHub Pages
```

Ne mets pas `node_modules` dans GitHub.
Ne mets pas `dist` dans GitHub si tu utilises GitHub Actions.

## 2. Méthode recommandée : GitHub Desktop

L'upload manuel dans le navigateur est fragile avec les dossiers cachés comme `.github`.

1. Installe GitHub Desktop.
2. Clone ton dépôt `atelier-cuisine`.
3. Copie tous les fichiers du dossier `atelier-cuisine` dans le dossier local du dépôt.
4. Dans GitHub Desktop, vérifie que les changements apparaissent.
5. Commit : `Ajout de la web app Atelier Cuisine`.
6. Clique sur `Push origin`.

## 3. Vérifier la structure sur GitHub

Dans l'onglet `Code`, tu dois voir :

```txt
.github/
public/
src/
.gitignore
index.html
package.json
package-lock.json
tsconfig.json
vite.config.ts
```

Si tu ne vois pas `src` ou `public`, l'app ne peut pas fonctionner.
Si tu ne vois pas `.github`, GitHub Actions ne se lancera pas.

## 4. Activer GitHub Pages

1. Va dans `Settings`.
2. Va dans `Pages`.
3. Dans `Source`, choisis `GitHub Actions`.
4. Ne choisis pas Jekyll.
5. Va dans l'onglet `Actions`.
6. Attends que `Deploy to GitHub Pages` passe au vert.

L'URL sera du type :

```txt
https://TON-COMPTE.github.io/atelier-cuisine/
```

## 5. Tester sur iPhone

1. Ouvre l'URL dans Safari.
2. Appuie sur le bouton de partage.
3. Choisis `Sur l'écran d'accueil`.
4. Ouvre l'app depuis l'icône créée.

## 6. En cas d'erreur de page blanche

Vérifie `vite.config.ts`.

Pour GitHub Pages, la configuration fournie utilise :

```ts
base: './'
```

Cette valeur est volontairement compatible avec GitHub Pages et l'ouverture locale du build.

## 7. Sauvegarde de progression

La progression, les commentaires et les photos sont stockés localement dans Safari.
Utilise régulièrement :

```txt
Réglages > Exporter la progression
```

Conserve ce fichier JSON dans iCloud Drive ou sur ton ordinateur.
