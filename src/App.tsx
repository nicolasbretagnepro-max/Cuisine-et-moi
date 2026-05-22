import { useEffect, useMemo, useState } from 'react';
import type { LearningPath, Recipe, UserProgress } from './types';
import { getProgress, saveProgress, setWeeklyRecipe } from './utils/storage';
import { getRecommendedRecipe, loadLearningPaths, loadRecipes } from './utils/recipes';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import RecipePage from './pages/RecipePage';
import CookPage from './pages/CookPage';
import ReviewPage from './pages/ReviewPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import ResourcesPage from './pages/ResourcesPage';
import PlanPage from './pages/PlanPage';
import ShoppingListPage from './pages/ShoppingListPage';

type Route = {
  name: string;
  id?: string;
};

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [name = '', id] = hash.split('/');
  return { name: name || 'accueil', id };
}

export function navigate(path: string): void {
  window.location.hash = path.startsWith('/') ? path : `/${path}`;
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [progress, setProgress] = useState<UserProgress>(() => getProgress());
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes()
      .then(setRecipes)
      .catch((error: unknown) => setLoadingError(error instanceof Error ? error.message : 'Erreur inconnue.'));
    loadLearningPaths().then(setPaths).catch(() => setPaths([]));
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const recommendedRecipe = useMemo(() => getRecommendedRecipe(recipes, progress), [recipes, progress]);

  function updateProgress(next: UserProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function chooseWeeklyRecipe(recipeId: string) {
    updateProgress(setWeeklyRecipe(progress, recipeId));
    navigate('/accueil');
  }

  if (loadingError) {
    return <main className="app-shell"><div className="card"><h1>Erreur</h1><p>{loadingError}</p></div></main>;
  }

  if (!recipes.length) {
    return <main className="app-shell"><div className="card"><h1>Atelier Cuisine</h1><p>Chargement des recettes...</p></div></main>;
  }

  const selectedRecipe = route.id ? recipes.find((recipe) => recipe.id === route.id) : undefined;

  let page = <HomePage recipes={recipes} progress={progress} recommendedRecipe={recommendedRecipe} onChooseWeeklyRecipe={chooseWeeklyRecipe} />;

  if (route.name === 'catalogue') {
    page = <CataloguePage recipes={recipes} progress={progress} onChooseWeeklyRecipe={chooseWeeklyRecipe} />;
  }

  if (route.name === 'plan') {
    page = <PlanPage recipes={recipes} paths={paths} progress={progress} onChooseWeeklyRecipe={chooseWeeklyRecipe} />;
  }

  if (route.name === 'courses') {
    page = <ShoppingListPage recipes={recipes} recipe={selectedRecipe ?? recommendedRecipe} progress={progress} onProgressChange={updateProgress} />;
  }

  if (route.name === 'recette') {
    page = <RecipePage recipe={selectedRecipe} progress={progress} onProgressChange={updateProgress} />;
  }

  if (route.name === 'cuisiner') {
    page = <CookPage recipe={selectedRecipe} />;
  }

  if (route.name === 'bilan') {
    page = <ReviewPage recipe={selectedRecipe} progress={progress} onProgressChange={updateProgress} />;
  }

  if (route.name === 'progression') {
    page = <ProgressPage recipes={recipes} progress={progress} />;
  }

  if (route.name === 'ressources') {
    page = <ResourcesPage />;
  }

  if (route.name === 'reglages') {
    page = <SettingsPage progress={progress} onProgressChange={updateProgress} />;
  }

  return (
    <>
      <main className="app-shell">{page}</main>
      {route.name !== 'cuisiner' && <BottomNav current={route.name} />}
    </>
  );
}
