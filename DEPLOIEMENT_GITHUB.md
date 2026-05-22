# Deploiement GitHub Pages

## Methode recommandee : GitHub Desktop

L'upload manuel via l'interface GitHub peut oublier des dossiers, notamment `.github`. La methode la plus fiable est GitHub Desktop.

### 1. Installer GitHub Desktop

Telecharger GitHub Desktop, se connecter au compte GitHub, puis cloner le repository `atelier-cuisine`.

### 2. Copier les fichiers

Dans le dossier local du repository, copier tout le contenu du dossier `atelier-cuisine` fourni dans le zip.

La racine doit contenir :

```txt
.github/
public/
src/
README.md
CHANGELOG_V3.md
DEPLOIEMENT_GITHUB.md
GUIDE_AJOUT_RECETTE.md
index.html
package.json
tsconfig.json
vite.config.ts
```

### 3. Commit et push

Dans GitHub Desktop :

1. verifier que les dossiers `.github`, `public` et `src` apparaissent ;
2. ecrire un message de commit, par exemple `Ajout app Atelier Cuisine V3` ;
3. cliquer sur `Commit to main` ;
4. cliquer sur `Push origin`.

### 4. Activer GitHub Pages

Dans GitHub, aller dans :

```txt
Settings > Pages
```

Dans `Source`, choisir :

```txt
GitHub Actions
```

Ne pas cliquer sur les cartes `Jekyll` ou `Static HTML`.

### 5. Lancer ou verifier le workflow

Aller dans l'onglet :

```txt
Actions
```

Le workflow attendu est :

```txt
Deploy to GitHub Pages
```

S'il ne se lance pas, ouvrir le workflow puis cliquer sur `Run workflow`.

### 6. Recuperer l'URL

Quand le workflow est vert, retourner dans :

```txt
Settings > Pages
```

GitHub affiche l'URL publique de l'app.

## Verification des fichiers critiques

Le repo doit contenir ces chemins :

```txt
.github/workflows/deploy.yml
public/data/recipes.json
public/data/paths.json
src/App.tsx
src/main.tsx
```

S'il manque `src`, l'app ne peut pas compiler.
S'il manque `public/data/recipes.json`, les recettes ne se chargent pas.
S'il manque `.github/workflows/deploy.yml`, GitHub Actions ne sait pas quoi deployer.

## Configuration Vite

Le fichier `vite.config.ts` contient :

```ts
base: './'
```

Cette valeur est volontairement robuste pour GitHub Pages et evite d'avoir a modifier le nom du repository dans la configuration.
