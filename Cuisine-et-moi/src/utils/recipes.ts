import type { LearningPath, Recipe, Season, UserProgress } from '../types';
import { isRecipeCompleted } from './storage';

export async function loadRecipes(): Promise<Recipe[]> {
  const response = await fetch('./data/recipes.json');
  if (!response.ok) throw new Error('Impossible de charger les recettes.');
  const recipes = (await response.json()) as Recipe[];
  return recipes.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

export async function loadLearningPaths(): Promise<LearningPath[]> {
  const response = await fetch('./data/paths.json');
  if (!response.ok) return [];
  return (await response.json()) as LearningPath[];
}

export function findRecipe(recipes: Recipe[], id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}

export function getRecommendedRecipe(recipes: Recipe[], progress: UserProgress): Recipe | undefined {
  if (progress.activeWeeklyRecipeId) {
    const active = findRecipe(recipes, progress.activeWeeklyRecipeId);
    if (active) return active;
  }

  const notCompleted = recipes.filter((recipe) => !isRecipeCompleted(progress, recipe.id));
  const accessible = notCompleted.filter((recipe) => recipe.level <= 2 && recipe.durationMinutes <= 60);
  const currentSeason = getCurrentSeason();
  const seasonalAccessible = accessible.filter((recipe) => recipe.season?.includes(currentSeason));
  const recommendationPool = seasonalAccessible.length > 0 ? seasonalAccessible : accessible;
  const sorted = recommendationPool.sort((a, b) => b.desire - a.desire || a.effort - b.effort || a.durationMinutes - b.durationMinutes);
  return sorted[0] ?? notCompleted[0] ?? recipes[0];
}

export function getRecipesToReview(recipes: Recipe[], progress: UserProgress): Recipe[] {
  const attemptsByRecipe = new Map<string, string>();
  for (const attempt of progress.completedRecipes) {
    const previous = attemptsByRecipe.get(attempt.recipeId);
    if (!previous || attempt.completedAt > previous) attemptsByRecipe.set(attempt.recipeId, attempt.completedAt);
  }

  return recipes
    .filter((recipe) => attemptsByRecipe.has(recipe.id))
    .sort((a, b) => String(attemptsByRecipe.get(a.id)).localeCompare(String(attemptsByRecipe.get(b.id))))
    .slice(0, 3);
}

export function formatBudget(budget: string): string {
  if (budget === 'faible') return '€';
  if (budget === 'moyen') return '€€';
  return '€€€';
}

export function formatIngredientQuantity(quantity?: number | string, unit?: string): string {
  if (quantity === undefined || quantity === '') return '';
  return `${quantity} ${unit ?? ''}`.trim();
}

export function skillLabel(skill: string): string {
  return skill
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}


export function getCurrentSeason(date = new Date()): Season {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

export function seasonLabel(season: string): string {
  if (season === 'printemps') return 'Printemps';
  if (season === 'ete') return 'Été';
  if (season === 'automne') return 'Automne';
  if (season === 'hiver') return 'Hiver';
  return season;
}

export function formatRecipeSeasons(recipe: Pick<Recipe, 'season'>): string {
  if (!recipe.season || recipe.season.length === 0) return 'Toutes saisons';
  if (recipe.season.length === 4) return 'Toutes saisons';
  return recipe.season.map(seasonLabel).join(' · ');
}
