import type { Recipe, UserProgress } from '../types';
import { navigate } from '../App';
import { formatBudget, formatRecipeSeasons, skillLabel } from '../utils/recipes';
import { isFavorite, isRecipeCompleted } from '../utils/storage';

interface Props {
  recipe: Recipe;
  progress: UserProgress;
  onChooseWeeklyRecipe?: (recipeId: string) => void;
}

export default function RecipeCard({ recipe, progress, onChooseWeeklyRecipe }: Props) {
  const completed = isRecipeCompleted(progress, recipe.id);
  const favorite = isFavorite(progress, recipe.id);

  return (
    <article className="recipe-card" onClick={() => navigate(`/recette/${recipe.id}`)}>
      <div className="card-topline">
        <span className="pill">{recipe.category}</span>
        <span className="muted">{recipe.durationMinutes} min · {formatBudget(recipe.budget)}</span>
      </div>
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
      <div className="tag-row">
        <span>{formatRecipeSeasons(recipe)}</span>
        <span>{skillLabel(recipe.mainSkill)}</span>
        {completed && <span>Fait</span>}
        {favorite && <span>Favori</span>}
      </div>
      {onChooseWeeklyRecipe && (
        <button
          className="secondary full-width"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onChooseWeeklyRecipe(recipe.id);
          }}
        >
          Choisir cette semaine
        </button>
      )}
    </article>
  );
}
