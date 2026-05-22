# Guide d'ajout d'une recette

## Emplacement

Les recettes sont dans :

```txt
public/data/recipes.json
```

Chaque recette est un objet JSON dans le tableau principal.

## Règles

1. Utiliser un `id` stable, sans accent, en minuscules, avec des tirets.
2. Ne jamais modifier un `id` déjà utilisé.
3. Renseigner une compétence principale dans `mainSkill`.
4. Renseigner le champ `season` pour que la recette apparaisse dans les filtres de saison.
5. Mettre au moins 3 étapes pédagogiques.
6. Pour chaque étape importante, ajouter si possible :
   - `why`
   - `sensoryCue`
   - `commonMistake`
7. Ajouter `timerMinutes` quand une étape a une durée claire.

## Saisons

Valeurs possibles :

```txt
printemps
ete
automne
hiver
```

Exemples :

```json
"season": ["ete"]
```

```json
"season": ["automne", "hiver"]
```

```json
"season": ["printemps", "ete", "automne", "hiver"]
```

## Exemple d'étape

```json
{
  "id": "step-1",
  "title": "Faire revenir l'oignon",
  "action": "Fais revenir l'oignon dans un peu d'huile pendant 5 minutes.",
  "why": "Cette cuisson douce développe le goût sans brûler les sucres.",
  "sensoryCue": "L'oignon devient translucide et sent plus doux.",
  "commonMistake": "Feu trop fort : l'oignon colore trop vite et devient amer.",
  "timerMinutes": 5
}
```

## Tags utiles

- `classique-francais`
- `vegetarien`
- `vegan`
- `cuisine-du-monde`
- `petit-budget`
- `rapide`
- `dessert`
- `gouter`
- `moderne`
- `quotidien`
- `printemps`
- `ete`
- `automne`
- `hiver`
