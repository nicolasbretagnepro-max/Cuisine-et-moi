import { useMemo, useState } from 'react';
import type { Recipe, UserProgress } from '../types';
import RecipeCard from '../components/RecipeCard';
import { isFavorite, isRecipeCompleted } from '../utils/storage';
import { getCurrentSeason, seasonLabel } from '../utils/recipes';

interface Props {
  recipes: Recipe[];
  progress: UserProgress;
  onChooseWeeklyRecipe: (recipeId: string) => void;
}

const currentSeason = getCurrentSeason();

const filters = [
  { id: 'all', label: 'Tout' },
  { id: 'saison', label: `De saison · ${seasonLabel(currentSeason)}` },
  { id: 'printemps', label: 'Printemps' },
  { id: 'ete', label: 'Été' },
  { id: 'automne', label: 'Automne' },
  { id: 'hiver', label: 'Hiver' },
  { id: 'plat', label: 'Plats' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'vegetarien', label: 'Végétarien' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'monde', label: 'Monde' },
  { id: 'classique', label: 'Classiques' },
  { id: 'budget', label: 'Petit budget' },
  { id: 'rapide', label: 'Rapide' },
  { id: 'favoris', label: 'Favoris' },
  { id: 'faits', label: 'Déjà faits' }
];

export default function CataloguePage({ recipes, progress, onChooseWeeklyRecipe }: Props) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesQuery = !q || [recipe.title, recipe.description, recipe.cuisine, recipe.mainSkill, ...(recipe.season ?? []), ...recipe.tags].join(' ').toLowerCase().includes(q);
      if (!matchesQuery) return false;
      if (filter === 'all') return true;
      if (filter === 'saison') return recipe.season?.includes(currentSeason);
      if (filter === 'printemps' || filter === 'ete' || filter === 'automne' || filter === 'hiver') return recipe.season?.includes(filter);
      if (filter === 'plat' || filter === 'dessert') return recipe.category === filter;
      if (filter === 'vegetarien') return recipe.diet.includes('vegetarien') || recipe.diet.includes('vegan');
      if (filter === 'vegan') return recipe.diet.includes('vegan');
      if (filter === 'monde') return recipe.tags.includes('cuisine-du-monde');
      if (filter === 'classique') return recipe.tags.includes('classique-francais');
      if (filter === 'budget') return recipe.budget === 'faible' || recipe.tags.includes('petit-budget');
      if (filter === 'rapide') return recipe.durationMinutes <= 30;
      if (filter === 'favoris') return isFavorite(progress, recipe.id);
      if (filter === 'faits') return isRecipeCompleted(progress, recipe.id);
      return true;
    });
  }, [recipes, progress, filter, query]);

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Catalogue</h1>
        <p>Explore les recettes par envie, saison, niveau, durée ou type de cuisine.</p>
      </header>

      <input
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Chercher une recette, une saison, une compétence..."
      />

      <div className="filter-row" role="tablist">
        {filters.map((item) => (
          <button key={item.id} className={filter === item.id ? 'active' : ''} type="button" onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <p className="muted">{filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} trouvée{filteredRecipes.length > 1 ? 's' : ''}.</p>

      <div className="card-list">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} progress={progress} onChooseWeeklyRecipe={onChooseWeeklyRecipe} />
        ))}
      </div>
    </section>
  );
}
