import type { LearningPath, Recipe, UserProgress } from '../types';
import { navigate } from '../App';
import { isRecipeCompleted } from '../utils/storage';
import { findRecipe, skillLabel } from '../utils/recipes';

interface Props {
  recipes: Recipe[];
  paths: LearningPath[];
  progress: UserProgress;
  onChooseWeeklyRecipe: (recipeId: string) => void;
}

export default function PlanPage({ recipes, paths, progress, onChooseWeeklyRecipe }: Props) {
  const path = paths[0];

  if (!path) {
    return <section className="page-stack"><header className="page-header"><h1>Plan</h1><p>Aucun parcours disponible.</p></header></section>;
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Parcours</p>
        <h1>{path.title}</h1>
        <p>{path.description}</p>
      </header>

      <div className="timeline-list">
        {path.weeks.map((week) => {
          const recipe = findRecipe(recipes, week.mainRecipeId);
          const alternatives = week.alternativeRecipeIds.map((id) => findRecipe(recipes, id)).filter(Boolean) as Recipe[];
          const completed = recipe ? isRecipeCompleted(progress, recipe.id) : false;
          const active = progress.activeWeeklyRecipeId === recipe?.id;
          return (
            <article className="card compact timeline-card" key={week.week}>
              <div className="card-topline">
                <span className="pill">Semaine {week.week}</span>
                {completed && <span className="pill success">fait</span>}
                {active && <span className="pill">active</span>}
              </div>
              <h2>{week.title}</h2>
              <p>{week.objective}</p>
              {recipe && (
                <div className="linked-recipe">
                  <strong>{recipe.title}</strong>
                  <span>{recipe.durationMinutes} min · {skillLabel(week.skillId)}</span>
                </div>
              )}
              {alternatives.length > 0 && (
                <details>
                  <summary>Alternatives</summary>
                  <div className="tag-row">
                    {alternatives.map((item) => <span key={item.id}>{item.title}</span>)}
                  </div>
                </details>
              )}
              {recipe && (
                <div className="button-row">
                  <button type="button" onClick={() => onChooseWeeklyRecipe(recipe.id)}>Choisir</button>
                  <button className="secondary" type="button" onClick={() => navigate(`/recette/${recipe.id}`)}>Fiche</button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
