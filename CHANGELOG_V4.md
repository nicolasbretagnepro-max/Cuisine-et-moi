# Changelog V4

## Catalogue

- Passage de 32 à 70 recettes.
- Ajout de recettes plus originales et modernes.
- Renforcement des recettes vegan, végétariennes, cuisine du monde et pâtisserie.
- Ajout de recettes explicitement pensées pour les saisons.

## Saisonnalité

- Ajout du champ `season` dans les recettes.
- Ajout des filtres catalogue : printemps, été, automne, hiver et saison actuelle.
- La recommandation hebdomadaire privilégie désormais une recette de saison quand c'est possible.
- Ajout d'un bloc “De saison” sur la page d'accueil.
- Ajout d'un parcours “Cuisiner les saisons en 12 semaines”.

## Interface

- Les cartes recettes affichent désormais la saison.
- Les fiches recettes affichent les saisons associées.
- Le catalogue affiche le nombre de recettes trouvées après filtrage.

## Technique

- Ajout du type `Season`.
- Ajout des helpers `getCurrentSeason`, `seasonLabel` et `formatRecipeSeasons`.
- Mise à jour de `skills.json` pour couvrir les nouvelles compétences.
