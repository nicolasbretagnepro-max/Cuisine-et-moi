# Changements V3

## Nouvelles fonctionnalites

- Ajout d'une page `Plan` avec un parcours 12 semaines.
- Ajout d'une page `Courses` pour generer une liste de courses depuis une recette.
- Ajout d'un bilan de fin de recette : note, difficulte ressentie, temps reel, notes personnelles, envie de refaire.
- Le mode cuisine redirige maintenant vers un bilan au lieu de marquer automatiquement la recette comme faite.
- Ajout d'un minuteur simple sur les etapes qui contiennent `timerMinutes`.
- La progression conserve maintenant plusieurs essais pour une meme recette.
- La page progression distingue recettes uniques et essais.
- La fiche recette affiche le carnet personnel lie a cette recette.
- La page ressources donne acces aux reglages et sauvegardes.

## Donnees ajoutees

- Passage de 21 a 32 recettes.
- Ajout de `public/data/paths.json`.
- Nouvelles recettes :
  - Tarte aux pommes simple
  - Cookies chocolat
  - Crepes
  - Gateau au yaourt
  - Ratatouille
  - Hachis parmentier
  - Salade de lentilles, oeuf mollet
  - Chana masala
  - Houmous maison
  - Tofu croustillant sauce cacahuete
  - Soupe miso tofu

## Technique

- Migration du stockage local vers `atelier-cuisine-progress-v2`.
- Recuperation automatique des anciennes donnees `atelier-cuisine-progress-v1` si elles existent.
- Ajout de champs `shoppingChecked` dans la progression.
- Ajout de types pour les parcours pedagogiques.
