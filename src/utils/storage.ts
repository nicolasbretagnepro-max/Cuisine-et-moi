import type { CompletionFeedback, PersonalRecipeEntry, Recipe, UserProgress } from '../types';

const STORAGE_KEY = 'atelier-cuisine-progress-v3';
const LEGACY_STORAGE_KEYS = ['atelier-cuisine-progress-v2', 'atelier-cuisine-progress-v1'];

const defaultProgress: UserProgress = {
  version: 3,
  completedRecipes: [],
  favoriteRecipeIds: [],
  activeWeeklyRecipeId: null,
  skillProgress: {},
  shoppingChecked: {},
  recipeJournal: {},
  lastUpdatedAt: new Date().toISOString()
};

function normalizeProgress(raw: Partial<UserProgress> | null): UserProgress {
  return {
    ...defaultProgress,
    ...(raw ?? {}),
    version: 3,
    completedRecipes: Array.isArray(raw?.completedRecipes) ? raw.completedRecipes : [],
    favoriteRecipeIds: Array.isArray(raw?.favoriteRecipeIds) ? raw.favoriteRecipeIds : [],
    skillProgress: raw?.skillProgress ?? {},
    shoppingChecked: raw?.shoppingChecked ?? {},
    recipeJournal: raw?.recipeJournal ?? {}
  };
}

export function getProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean);
    if (!raw) return defaultProgress;
    const progress = normalizeProgress(JSON.parse(raw) as Partial<UserProgress>);
    saveProgress(progress);
    return progress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  const next = { ...normalizeProgress(progress), lastUpdatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function isRecipeCompleted(progress: UserProgress, recipeId: string): boolean {
  return progress.completedRecipes.some((item) => item.recipeId === recipeId);
}

export function getRecipeAttempts(progress: UserProgress, recipeId: string) {
  return progress.completedRecipes
    .filter((item) => item.recipeId === recipeId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

export function getRecipeJournal(progress: UserProgress, recipeId: string): PersonalRecipeEntry[] {
  return [...(progress.recipeJournal?.[recipeId] ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function isFavorite(progress: UserProgress, recipeId: string): boolean {
  return progress.favoriteRecipeIds.includes(recipeId);
}

export function toggleFavorite(progress: UserProgress, recipeId: string): UserProgress {
  const exists = isFavorite(progress, recipeId);
  return {
    ...progress,
    favoriteRecipeIds: exists
      ? progress.favoriteRecipeIds.filter((id) => id !== recipeId)
      : [...progress.favoriteRecipeIds, recipeId]
  };
}

export function markRecipeCompleted(progress: UserProgress, recipe: Recipe, feedback: CompletionFeedback = {}): UserProgress {
  const now = new Date().toISOString();
  const skillProgress = { ...progress.skillProgress };

  for (const skill of Array.from(new Set([recipe.mainSkill, ...recipe.skills]))) {
    const current = skillProgress[skill] ?? { level: 0, practiceCount: 0, lastPracticedAt: now };
    const practiceCount = current.practiceCount + 1;
    skillProgress[skill] = {
      level: Math.min(5, Math.max(current.level, Math.ceil(practiceCount / 2))),
      practiceCount,
      lastPracticedAt: now
    };
  }

  const completedEntry = {
    recipeId: recipe.id,
    completedAt: now,
    rating: feedback.rating,
    difficultyFelt: feedback.difficultyFelt,
    realDurationMinutes: feedback.realDurationMinutes,
    notes: feedback.notes ?? '',
    wouldCookAgain: feedback.wouldCookAgain ?? true,
    photoDataUrl: feedback.photoDataUrl
  };

  const existingJournal = progress.recipeJournal?.[recipe.id] ?? [];
  const recipeJournal = feedback.notes || feedback.photoDataUrl
    ? {
        ...progress.recipeJournal,
        [recipe.id]: [
          ...existingJournal,
          {
            id: crypto.randomUUID ? crypto.randomUUID() : `${recipe.id}-${Date.now()}`,
            recipeId: recipe.id,
            createdAt: now,
            comment: feedback.notes ?? '',
            photoDataUrl: feedback.photoDataUrl
          }
        ]
      }
    : progress.recipeJournal;

  return {
    ...progress,
    completedRecipes: [...progress.completedRecipes, completedEntry],
    skillProgress,
    recipeJournal
  };
}

export function addRecipeJournalEntry(progress: UserProgress, recipeId: string, comment: string, photoDataUrl?: string): UserProgress {
  const now = new Date().toISOString();
  const entry: PersonalRecipeEntry = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${recipeId}-${Date.now()}`,
    recipeId,
    createdAt: now,
    comment,
    photoDataUrl
  };

  return {
    ...progress,
    recipeJournal: {
      ...progress.recipeJournal,
      [recipeId]: [...(progress.recipeJournal?.[recipeId] ?? []), entry]
    }
  };
}

export function deleteRecipeJournalEntry(progress: UserProgress, recipeId: string, entryId: string): UserProgress {
  return {
    ...progress,
    recipeJournal: {
      ...progress.recipeJournal,
      [recipeId]: (progress.recipeJournal?.[recipeId] ?? []).filter((entry) => entry.id !== entryId)
    }
  };
}

export function setWeeklyRecipe(progress: UserProgress, recipeId: string): UserProgress {
  return { ...progress, activeWeeklyRecipeId: recipeId };
}

export function shoppingKey(recipeId: string, ingredientName: string): string {
  return `${recipeId}::${ingredientName}`;
}

export function toggleShoppingItem(progress: UserProgress, recipeId: string, ingredientName: string): UserProgress {
  const key = shoppingKey(recipeId, ingredientName);
  return {
    ...progress,
    shoppingChecked: {
      ...progress.shoppingChecked,
      [key]: !progress.shoppingChecked[key]
    }
  };
}

export function clearShoppingForRecipe(progress: UserProgress, recipeId: string): UserProgress {
  const shoppingChecked = Object.fromEntries(
    Object.entries(progress.shoppingChecked).filter(([key]) => !key.startsWith(`${recipeId}::`))
  );
  return { ...progress, shoppingChecked };
}

export function resetProgress(): UserProgress {
  saveProgress(defaultProgress);
  return defaultProgress;
}

export function exportProgress(progress: UserProgress): void {
  const blob = new Blob([JSON.stringify(normalizeProgress(progress), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `atelier-cuisine-progression-${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file: File): Promise<UserProgress> {
  const text = await file.text();
  const parsed = JSON.parse(text) as Partial<UserProgress>;
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.completedRecipes)) {
    throw new Error('Fichier de progression invalide.');
  }
  const next = normalizeProgress(parsed);
  saveProgress(next);
  return next;
}
