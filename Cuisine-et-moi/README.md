# Atelier Cuisine

Application web personnelle pour progresser en cuisine : recettes pédagogiques, catalogue saisonnier, progression locale, photos, commentaires, culture produit et installation sur iPhone.

## Lancer en local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Déploiement

Consulte `GITHUB_DEPLOIEMENT_COMPLET.md`.

## Installation iPhone

Consulte `GUIDE_WEB_APP_IPHONE.md`.

## Données importantes

- Les recettes et ressources sont dans `public/data/`.
- La progression, les photos et les commentaires sont stockés dans Safari/localStorage.
- Pense à exporter la progression depuis la page Réglages.

---

# Atelier Cuisine

Application web personnelle pour progresser en cuisine au rythme d'une recette par semaine.

## Fonctionnalités incluses

- Accueil avec recette recommandée de la semaine
- Recommandation qui privilégie les recettes de saison quand c'est possible
- Catalogue de 70 recettes filtrable par saison, catégorie, régime, cuisine et statut
- Recettes françaises, végétariennes, vegan, cuisine du monde et pâtisserie
- Fiches recettes détaillées
- Mode cuisine pas à pas
- Bilan de recette après réalisation
- Carnet de progression local
- Liste de courses générée depuis une recette
- Parcours de progression, dont un parcours dédié aux saisons
- Ressources : glossaire et erreurs fréquentes
- Favoris
- Export / import de la progression en JSON
- Données de recettes séparées dans `public/data/recipes.json`

## Installation locale

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée par Vite dans le navigateur.

## Build

```bash
npm run build
```

## Données importantes

Le contenu de l'app est stocké dans :

```txt
public/data/recipes.json
public/data/paths.json
public/data/skills.json
public/data/glossary.json
public/data/errors.json
```

La progression personnelle n'est pas dans ces fichiers. Elle est stockée dans le navigateur via `localStorage`, avec export/import possible depuis l'app.

## Ajouter une recette

Ajouter un nouvel objet dans `public/data/recipes.json`.

Champs minimum :

```json
{
  "id": "recette-exemple",
  "title": "Recette exemple",
  "description": "Description courte.",
  "category": "plat",
  "cuisine": "francaise",
  "diet": [],
  "level": 1,
  "durationMinutes": 30,
  "activeTimeMinutes": 15,
  "budget": "faible",
  "effort": 2,
  "desire": 4,
  "servings": 2,
  "mainSkill": "cuisson-poele",
  "skills": ["assaisonnement"],
  "tags": ["quotidien"],
  "season": ["printemps", "ete", "automne", "hiver"],
  "ingredients": [],
  "equipment": [],
  "steps": []
}
```

Valeurs possibles pour `season` :

```txt
printemps
ete
automne
hiver
```

Règle importante : ne jamais changer l'`id` d'une recette déjà publiée, car la progression s'appuie dessus.

## Déploiement GitHub Pages

Le projet contient un workflow dans :

```txt
.github/workflows/deploy.yml
```

Dans GitHub :

1. envoyer tous les fichiers et dossiers du projet ;
2. aller dans `Settings > Pages` ;
3. choisir `GitHub Actions` comme source ;
4. aller dans l'onglet `Actions` ;
5. attendre que le workflow `Deploy to GitHub Pages` passe au vert.

Le fichier `DEPLOIEMENT_GITHUB.md` détaille les étapes.
