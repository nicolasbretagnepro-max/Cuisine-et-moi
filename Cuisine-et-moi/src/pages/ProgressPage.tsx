import type { Recipe, UserProgress } from '../types';
import { navigate } from '../App';
import { skillLabel } from '../utils/recipes';

interface Props {
  recipes: Recipe[];
  progress: UserProgress;
}

export default function ProgressPage({ recipes, progress }: Props) {
  const completed = progress.completedRecipes
    .map((item) => ({ progress: item, recipe: recipes.find((recipe) => recipe.id === item.recipeId) }))
    .filter((item) => item.recipe)
    .sort((a, b) => b.progress.completedAt.localeCompare(a.progress.completedAt));

  const uniqueCompletedCount = new Set(completed.map((item) => item.progress.recipeId)).size;
  const skills = Object.entries(progress.skillProgress).sort((a, b) => b[1].practiceCount - a[1].practiceCount);
  const averageRating = completed.length
    ? (completed.reduce((sum, item) => sum + (item.progress.rating ?? 0), 0) / completed.filter((item) => item.progress.rating).length || 0)
    : 0;
  const personalEntries = Object.values(progress.recipeJournal ?? {}).flat();
  const photoCount = personalEntries.filter((entry) => entry.photoDataUrl).length + progress.completedRecipes.filter((entry) => entry.photoDataUrl).length;

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Progression</h1>
        <p>Ce que tu as cuisiné, les essais enregistrés et les compétences travaillées.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card"><strong>{uniqueCompletedCount}</strong><span>recettes faites</span></div>
        <div className="stat-card"><strong>{completed.length}</strong><span>essais</span></div>
        <div className="stat-card"><strong>{skills.length}</strong><span>compétences</span></div>
        <div className="stat-card"><strong>{averageRating ? averageRating.toFixed(1) : '-'}</strong><span>note moyenne</span></div>
        <div className="stat-card"><strong>{personalEntries.length}</strong><span>commentaires</span></div>
        <div className="stat-card"><strong>{photoCount}</strong><span>photos</span></div>
      </div>

      <section className="card">
        <h2>Compétences</h2>
        {skills.length === 0 && <p>Aucune compétence enregistrée pour le moment.</p>}
        <div className="skill-list">
          {skills.map(([skill, value]) => (
            <div key={skill} className="skill-item">
              <span>{skillLabel(skill)}</span>
              <strong>Niveau {value.level} · {value.practiceCount} pratique{value.practiceCount > 1 ? 's' : ''}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Historique</h2>
        {completed.length === 0 && <p>Aucune recette réalisée pour le moment.</p>}
        <div className="history-list">
          {completed.map(({ progress: item, recipe }) => (
            <button key={`${item.recipeId}-${item.completedAt}`} className="history-item" type="button" onClick={() => navigate(`/recette/${item.recipeId}`)}>
              <span>{recipe?.title ?? item.recipeId}</span>
              <small>{new Date(item.completedAt).toLocaleDateString('fr-FR')} · {item.rating ? `${item.rating}/5` : 'non noté'}</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
