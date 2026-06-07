export type IngredientType =
  | "spirit"
  | "liqueur"
  | "juice"
  | "syrup"
  | "garnish"
  | "other";

export interface Ingredient {
  id: string;
  name: string;
  nameEn: string;
  type: IngredientType;
  color: string;
  icon: string;
  defaultAmount: number;
}

export interface AddedIngredient extends Ingredient {
  amount: number;
  order: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  amount: number;
  tolerance: number;
}

export type MixAction = "shake" | "stir" | "build";

export interface Recipe {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  ingredients: RecipeIngredient[];
  action: MixAction;
  actionTarget: number;
  glassType: string;
  color: string;
  garnish: string;
  isHidden?: boolean;
  unlockCondition?: string;
  difficulty: "easy" | "medium" | "hard";
}

export type GamePhase = "selecting" | "adding" | "mixing" | "finished";

export interface ScoreResult {
  score: number;
  maxScore: number;
  accuracy: number;
  unlockedRecipeId?: string;
}

export interface CocktailState {
  currentRecipeId: string | null;
  addedIngredients: AddedIngredient[];
  phase: GamePhase;
  isMixing: boolean;
  mixProgress: number;
  shakeOffset: { x: number; y: number };
  score: ScoreResult | null;
  unlockedRecipes: string[];
  completedRecipes: string[];
}
