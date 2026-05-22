import type { Recipe, UserProgress } from '../types';
import { navigate } from '../App';
import RecipeCard from '../components/RecipeCard';
import { isRecipeCompleted } from '../utils/storage';
import { getCurrentSeason, getRecipesToReview, seasonLabel, skillLabel } from '../utils/recipes';

interface Props {
  recipes: Recipe[];
  progress: UserProgress;
  recommendedRecipe?: Recipe;
  onChooseWeeklyRecipe: (recipeId: string) => void;
}

export default function HomePage({ recipes, progress, recommendedRecipe, onChooseWeeklyRecipe }: Props) {
  const currentSeason = getCurrentSeason();
  const uniqueCompletedCount = new Set(progress.completedRecipes.map((item) => item.recipeId)).size;
  const seasonalRecipes = recipes
    .filter((recipe) => recipe.id !== recommendedRecipe?.id && recipe.season?.includes(currentSeason) && !isRecipeCompleted(progress, recipe.id))
    .sort((a, b) => a.effort - b.effort || b.desire - a.desire)
    .slice(0, 3);
  const bonusRecipes = recipes
    .filter((recipe) => recipe.id !== recommendedRecipe?.id && !recipe.season?.includes(currentSeason) && !isRecipeCompleted(progress, recipe.id))
    .sort((a, b) => a.effort - b.effort || b.desire - a.desire)
    .slice(0, 3);
  const reviewRecipes = getRecipesToReview(recipes, progress);

  return (
    <section className="page-stack">
      <header className="hero">
        <p className="eyebrow">Atelier Cuisine</p>
        <h1>Une recette par semaine pour progresser sans pression.</h1>
        <p>Choisis une recette claire, cuisine en mode guidé, fais le bilan, puis conserve ta progression.</p>
      </header>

      {recommendedRecipe && (
        <article className="featured-card">
          <p className="eyebrow">Cette semaine · {seasonLabel(currentSeason)}</p>
          <h2>{recommendedRecipe.title}</h2>
          <p>{recommendedRecipe.description}</p>
          <div className="info-grid">
            <span>{recommendedRecipe.durationMinutes} min</span>
            <span>Niveau {recommendedRecipe.level}/5</span>
            <span>{skillLabel(recommendedRecipe.mainSkill)}</span>
            <span>Effort {recommendedRecipe.effort}/5</span>
          </div>
          <div className="button-row wrap">
            <button type="button" onClick={() => navigate(`/cuisiner/${recommendedRecipe.id}`)}>Commencer</button>
            <button className="secondary" type="button" onClick={() => navigate(`/recette/${recommendedRecipe.id}`)}>Fiche</button>
            <button className="secondary" type="button" onClick={() => navigate(`/courses/${recommendedRecipe.id}`)}>Courses</button>
          </div>
        </article>
      )}

      <div className="quick-actions">
        <button className="secondary" type="button" onClick={() => navigate('/plan')}>Voir les parcours</button>
        <button className="secondary" type="button" onClick={() => navigate('/catalogue')}>Explorer le catalogue</button>
      </div>

      <section className="card compact">
        <h2>Progression</h2>
        <p>{uniqueCompletedCount} recette{uniqueCompletedCount > 1 ? 's' : ''} réalisée{uniqueCompletedCount > 1 ? 's' : ''}, {progress.completedRecipes.length} essai{progress.completedRecipes.length > 1 ? 's' : ''} enregistré{progress.completedRecipes.length > 1 ? 's' : ''}.</p>
        <button className="secondary full-width" type="button" onClick={() => navigate('/progression')}>Voir le détail</button>
      </section>

      {seasonalRecipes.length > 0 && (
        <section className="section-block">
          <div className="section-heading">
            <h2>De saison · {seasonLabel(currentSeason)}</h2>
            <button className="text-button" type="button" onClick={() => navigate('/catalogue')}>Catalogue</button>
          </div>
          <div className="card-list">
            {seasonalRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} progress={progress} onChooseWeeklyRecipe={onChooseWeeklyRecipe} />
            ))}
          </div>
        </section>
      )}

      {reviewRecipes.length > 0 && (
        <section className="section-block">
          <div className="section-heading">
            <h2>À refaire pour progresser</h2>
            <button className="text-button" type="button" onClick={() => navigate('/progression')}>Historique</button>
          </div>
          <div className="card-list">
            {reviewRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} progress={progress} onChooseWeeklyRecipe={onChooseWeeklyRecipe} />
            ))}
          </div>
        </section>
      )}

      <section className="section-block">
        <div className="section-heading">
          <h2>Si tu as plus de temps</h2>
          <button className="text-button" type="button" onClick={() => navigate('/catalogue')}>Catalogue</button>
        </div>
        <div className="card-list">
          {bonusRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} progress={progress} onChooseWeeklyRecipe={onChooseWeeklyRecipe} />
          ))}
        </div>
      </section>
    </section>
  );
}
