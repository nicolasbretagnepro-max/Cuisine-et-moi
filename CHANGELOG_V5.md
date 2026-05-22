# Atelier Cuisine V5 — Carnet personnel, culture produit et pédagogie

## Ajouts principaux

- Ajout d’un carnet personnel par recette : commentaire libre et photo personnelle.
- Ajout possible d’une photo dans le bilan de fin de recette.
- Les photos sont compressées côté navigateur avant sauvegarde locale.
- Les commentaires et photos sont stockés dans la progression locale, séparément du catalogue de recettes.
- Ajout de fiches de culture produit dans `public/data/product-guides.json`.
- Nouvelle section `Produits` dans la page Ressources.
- Ajout de blocs pédagogiques `whyBlocks` dans les recettes pour expliquer les grands “pourquoi”.
- Ajout de notes `productCulture` dans les fiches recettes quand un ingrédient clé est reconnu.
- Mise à jour du modèle TypeScript pour inclure :
  - `whyBlocks`
  - `productCulture`
  - `relatedProductIds`
  - `recipeJournal`
  - `photoDataUrl`

## Données utilisateur

La structure de progression passe en version 3.

Anciennes données V1/V2 : migration automatique vers la nouvelle structure.

Les données personnelles restent stockées dans le navigateur :

- recettes réalisées ;
- notes ;
- commentaires ;
- photos compressées ;
- favoris ;
- progression par compétence ;
- liste de courses cochée.

## Limite importante

Les photos sont stockées localement dans le navigateur. Cela fonctionne pour un usage personnel, mais il ne faut pas ajouter des centaines de photos lourdes sans exporter régulièrement la progression.

Utilise `Réglages > Exporter` pour sauvegarder les données.
