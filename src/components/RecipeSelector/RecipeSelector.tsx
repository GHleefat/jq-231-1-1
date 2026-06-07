import { Recipe } from "../../types";
import { recipes } from "../../data/recipes";
import { useCocktailStore } from "../../store/useCocktailStore";
import { Lock, Star } from "lucide-react";

export default function RecipeSelector() {
  const {
    currentRecipeId,
    selectRecipe,
    unlockedRecipes,
    completedRecipes,
    phase,
  } = useCocktailStore();

  const visibleRecipes = recipes.filter(
    (r: Recipe) => unlockedRecipes.includes(r.id) || !r.isHidden,
  );

  const hiddenLocked = recipes.filter(
    (r) => r.isHidden && !unlockedRecipes.includes(r.id),
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "简单";
      case "medium":
        return "中等";
      case "hard":
        return "困难";
      default:
        return difficulty;
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#2C1810] via-[#3D2317] to-[#2C1810] border-b-2 border-[#D4AF37]/40 px-6 py-4">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        <h2 className="text-[#D4AF37] font-serif text-xl whitespace-nowrap shrink-0">
          选择配方
        </h2>
        <div className="flex gap-3">
          {visibleRecipes.map((recipe: Recipe) => (
            <button
              key={recipe.id}
              onClick={() => phase !== "mixing" && selectRecipe(recipe.id)}
              disabled={phase === "mixing"}
              className={`shrink-0 relative group transition-all duration-300 rounded-xl px-4 py-3 border-2 ${
                currentRecipeId === recipe.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "border-[#D4AF37]/20 bg-[#1a0f0a] hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5"
              } ${phase === "mixing" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div
                className="w-10 h-10 rounded-full mx-auto mb-2 shadow-inner border border-white/10"
                style={{ backgroundColor: recipe.color }}
              />
              <div className="text-center">
                <p className="text-[#FFF8E7] font-serif text-sm font-medium">
                  {recipe.name}
                </p>
                <p className="text-[#D4AF37]/70 text-xs">{recipe.nameEn}</p>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span
                  className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}
                >
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
                {completedRecipes.includes(recipe.id) && (
                  <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                )}
              </div>
            </button>
          ))}
          {hiddenLocked.map((recipe: Recipe) => (
            <div
              key={recipe.id}
              className="shrink-0 relative rounded-xl px-4 py-3 border-2 border-gray-600/30 bg-[#1a0f0a]/50"
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 bg-gray-700/50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-center">
                <p className="text-gray-500 font-serif text-sm">???</p>
                <p className="text-gray-600 text-xs">Hidden</p>
              </div>
              <p className="text-gray-500 text-xs text-center mt-1">
                {recipe.unlockCondition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
