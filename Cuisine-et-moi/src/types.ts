export type RecipeCategory = 'plat' | 'dessert' | 'technique';
export type Budget = 'faible' | 'moyen' | 'eleve';
export type Season = 'printemps' | 'ete' | 'automne' | 'hiver';

export interface Ingredient {
  name: string;
  quantity?: number | string;
  unit?: string;
  note?: string;
}

export interface RecipeStep {
  id: string;
  title: string;
  action: string;
  why?: string;
  sensoryCue?: string;
  commonMistake?: string;
  timerMinutes?: number;
}

export interface WhyBlock {
  title: string;
  explanation: string;
  example?: string;
}

export interface ProductCultureNote {
  product: string;
  choosing?: string;
  storage?: string;
  seasonality?: string;
  technique?: string;
  pairing?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  cuisine: string;
  diet: string[];
  level: number;
  durationMinutes: number;
  activeTimeMinutes: number;
  budget: Budget;
  effort: number;
  desire: number;
  servings: number;
  mainSkill: string;
  skills: string[];
  tags: string[];
  season?: Season[];
  ingredients: Ingredient[];
  equipment: string[];
  steps: RecipeStep[];
  commonErrors?: string[];
  variants?: string[];
  isCertified?: boolean;
  whyBlocks?: WhyBlock[];
  productCulture?: ProductCultureNote[];
  relatedProductIds?: string[];
}

export interface CompletionFeedback {
  rating?: number;
  difficultyFelt?: number;
  realDurationMinutes?: number;
  notes?: string;
  wouldCookAgain?: boolean;
  photoDataUrl?: string;
}

export interface CompletedRecipe extends CompletionFeedback {
  recipeId: string;
  completedAt: string;
}

export interface PersonalRecipeEntry {
  id: string;
  recipeId: string;
  createdAt: string;
  comment: string;
  photoDataUrl?: string;
}

export interface SkillProgress {
  level: number;
  practiceCount: number;
  lastPracticedAt: string;
}

export interface UserProgress {
  version: number;
  completedRecipes: CompletedRecipe[];
  favoriteRecipeIds: string[];
  activeWeeklyRecipeId: string | null;
  skillProgress: Record<string, SkillProgress>;
  shoppingChecked: Record<string, boolean>;
  recipeJournal: Record<string, PersonalRecipeEntry[]>;
  lastUpdatedAt: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  example?: string;
}

export interface KitchenError {
  id: string;
  title: string;
  causes: string[];
  solutions: string[];
  prevention: string[];
}

export interface ProductGuide {
  id: string;
  name: string;
  family: string;
  seasons?: Season[];
  howToChoose: string[];
  howToStore: string[];
  techniques: string[];
  pairings: string[];
  commonMistakes: string[];
}

export interface LearningPathWeek {
  week: number;
  title: string;
  objective: string;
  mainRecipeId: string;
  alternativeRecipeIds: string[];
  skillId: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  weeks: LearningPathWeek[];
}
