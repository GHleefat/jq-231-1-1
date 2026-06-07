import CocktailGlass from "./CocktailGlass";
import RecipeCard from "./RecipeCard";
import ScoreDisplay from "./ScoreDisplay";
import { useCocktailStore } from "../../store/useCocktailStore";
import { recipes } from "../../data/recipes";
import { Recipe } from "../../types";
import { RotateCcw, Sparkles } from "lucide-react";

export default function ResultArea() {
  const {
    currentRecipeId,
    phase,
    score,
    resetGame,
    completedRecipes,
    unlockedRecipes,
    selectRecipe,
  } = useCocktailStore();

  const recipe = recipes.find((r: Recipe) => r.id === currentRecipeId);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0f0a] via-[#2C1810] to-[#1a0f0a] rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#D4AF37]/20 bg-gradient-to-l from-[#D4AF37]/10 to-transparent">
        <h3 className="text-[#D4AF37] font-serif text-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          成品展示
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {phase === "finished" && recipe && score && (
          <>
            <div className="relative flex items-center justify-center py-6 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent rounded-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#D4AF37]/10 blur-3xl animate-pulse" />
              </div>
              <CocktailGlass recipe={recipe} showPour />
            </div>

            <div className="text-center">
              <h2 className="text-[#FFF8E7] font-serif text-2xl font-bold">
                {recipe.name}
              </h2>
              <p className="text-[#D4AF37]/70 text-sm italic">
                {recipe.nameEn}
              </p>
            </div>

            <ScoreDisplay score={score} />

            <RecipeCard recipe={recipe} />

            <div className="flex gap-2">
              <button
                onClick={resetGame}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-[#FFF8E7] font-medium hover:shadow-lg hover:shadow-[#8B0000]/30 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                重新开始
              </button>
            </div>
          </>
        )}

        {phase !== "finished" && recipe && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
            <CocktailGlass recipe={recipe} />
            <div>
              <p className="text-[#FFF8E7] font-serif text-lg">{recipe.name}</p>
              <p className="text-[#D4AF37]/50 text-xs mt-1">
                完成调制后查看详情
              </p>
            </div>
          </div>
        )}

        {!recipe && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12 text-[#FFF8E7]/30">
            <span className="text-5xl">🍸</span>
            <p className="text-sm">选择配方开始调酒</p>
            <p className="text-xs">完成后将在这里展示成品</p>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-[#D4AF37]/10">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg bg-[#1a0f0a]/50">
              <p className="text-[#D4AF37] text-2xl font-serif font-bold">
                {completedRecipes.length}
              </p>
              <p className="text-[#FFF8E7]/50 text-xs">已完成</p>
            </div>
            <div className="p-3 rounded-lg bg-[#1a0f0a]/50">
              <p className="text-[#D4AF37] text-2xl font-serif font-bold">
                {unlockedRecipes.length}
              </p>
              <p className="text-[#FFF8E7]/50 text-xs">已解锁</p>
            </div>
          </div>

          {completedRecipes.length > 0 && (
            <div className="mt-3">
              <p className="text-[#FFF8E7]/50 text-xs mb-2">已完成的酒款：</p>
              <div className="flex flex-wrap gap-1">
                {completedRecipes.map((id) => {
                  const r = recipes.find((x: Recipe) => x.id === id);
                  if (!r) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => selectRecipe(id)}
                      className="px-2 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37]/80 text-xs hover:bg-[#D4AF37]/20 transition-colors"
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
