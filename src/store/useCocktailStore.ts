import { create } from "zustand";
import { CocktailState, AddedIngredient, Recipe, Ingredient } from "../types";
import { recipes } from "../data/recipes";
import { calculateScore } from "../utils/scoring";

const initialUnlocked = recipes
  .filter((r: Recipe) => !r.isHidden)
  .map((r: Recipe) => r.id);

interface CocktailActions {
  selectRecipe: (recipeId: string) => void;
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (ingredientId: string) => void;
  updateIngredientAmount: (ingredientId: string, amount: number) => void;
  startMixing: () => void;
  updateMixProgress: (progress: number) => void;
  updateShakeOffset: (offset: { x: number; y: number }) => void;
  finishCocktail: () => void;
  resetGame: () => void;
  clearShaker: () => void;
}

const STORAGE_KEY = "cocktail-bar-progress";

function loadProgress(): { unlocked: string[]; completed: string[] } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return { unlocked: initialUnlocked, completed: [] };
}

function saveProgress(unlocked: string[], completed: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlocked, completed }));
  } catch {
    // ignore
  }
}

const savedProgress = loadProgress();

export const useCocktailStore = create<CocktailState & CocktailActions>(
  (set, get) => ({
    currentRecipeId: null,
    addedIngredients: [],
    phase: "selecting",
    isMixing: false,
    mixProgress: 0,
    shakeOffset: { x: 0, y: 0 },
    score: null,
    unlockedRecipes: savedProgress.unlocked,
    completedRecipes: savedProgress.completed,

    selectRecipe: (recipeId) => {
      set({
        currentRecipeId: recipeId,
        phase: "adding",
        addedIngredients: [],
        isMixing: false,
        mixProgress: 0,
        shakeOffset: { x: 0, y: 0 },
        score: null,
      });
    },

    addIngredient: (ingredient) => {
      const { addedIngredients } = get();
      const existing = addedIngredients.find((a) => a.id === ingredient.id);
      if (existing) {
        set({
          addedIngredients: addedIngredients.map((a) =>
            a.id === ingredient.id
              ? { ...a, amount: a.amount + ingredient.defaultAmount }
              : a,
          ),
        });
      } else {
        const newIngredient: AddedIngredient = {
          ...ingredient,
          amount: ingredient.defaultAmount,
          order: addedIngredients.length,
        };
        set({ addedIngredients: [...addedIngredients, newIngredient] });
      }
    },

    removeIngredient: (ingredientId) => {
      const { addedIngredients } = get();
      set({
        addedIngredients: addedIngredients
          .filter((a) => a.id !== ingredientId)
          .map((a, idx) => ({ ...a, order: idx })),
      });
    },

    updateIngredientAmount: (ingredientId, amount) => {
      const { addedIngredients } = get();
      set({
        addedIngredients: addedIngredients.map((a) =>
          a.id === ingredientId ? { ...a, amount: Math.max(0, amount) } : a,
        ),
      });
    },

    startMixing: () => {
      set({
        phase: "mixing",
        isMixing: true,
        mixProgress: 0,
        shakeOffset: { x: 0, y: 0 },
      });
    },

    updateMixProgress: (progress) => {
      set({ mixProgress: Math.min(100, Math.max(0, progress)) });
    },

    updateShakeOffset: (offset) => {
      set({ shakeOffset: offset });
    },

    finishCocktail: () => {
      const {
        currentRecipeId,
        addedIngredients,
        completedRecipes,
        unlockedRecipes,
      } = get();
      const recipe = recipes.find((r: Recipe) => r.id === currentRecipeId);
      if (!recipe) return;

      const scoreResult = calculateScore(recipe, addedIngredients);
      let newCompleted = completedRecipes;
      let newUnlocked = unlockedRecipes;

      if (!completedRecipes.includes(recipe.id)) {
        newCompleted = [...completedRecipes, recipe.id];
      }

      const hiddenRecipes = recipes.filter((r: Recipe) => r.isHidden);
      for (const hidden of hiddenRecipes) {
        if (!unlockedRecipes.includes(hidden.id)) {
          if (hidden.id === "whiskey-sour" && newCompleted.length >= 3) {
            newUnlocked = [...newUnlocked, hidden.id];
            scoreResult.unlockedRecipeId = hidden.id;
          }
          if (hidden.id === "espresso-martini" && newCompleted.length >= 5) {
            newUnlocked = [...newUnlocked, hidden.id];
            scoreResult.unlockedRecipeId = hidden.id;
          }
        }
      }

      saveProgress(newUnlocked, newCompleted);

      set({
        phase: "finished",
        isMixing: false,
        shakeOffset: { x: 0, y: 0 },
        score: scoreResult,
        completedRecipes: newCompleted,
        unlockedRecipes: newUnlocked,
      });
    },

    resetGame: () => {
      set({
        currentRecipeId: null,
        addedIngredients: [],
        phase: "selecting",
        isMixing: false,
        mixProgress: 0,
        shakeOffset: { x: 0, y: 0 },
        score: null,
      });
    },

    clearShaker: () => {
      set({
        addedIngredients: [],
        isMixing: false,
        mixProgress: 0,
        shakeOffset: { x: 0, y: 0 },
        score: null,
      });
    },
  }),
);
