import CocktailShaker from "./CocktailShaker";
import IngredientList from "./IngredientList";
import MixActions from "./MixActions";
import { useCocktailStore } from "../../store/useCocktailStore";
import { recipes } from "../../data/recipes";
import { Recipe } from "../../types";

export default function MixingArea() {
  const { currentRecipeId } = useCocktailStore();
  const recipe = recipes.find((r: Recipe) => r.id === currentRecipeId);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#2C1810] via-[#3D2317] to-[#2C1810] rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden">
      {recipe && (
        <div className="px-4 py-3 border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#FFF8E7] font-serif text-xl">
                {recipe.name}
              </h3>
              <p className="text-[#D4AF37]/70 text-xs">{recipe.nameEn}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#FFF8E7]/50 text-xs">难度:</span>
              <span
                className={`text-xs ${
                  recipe.difficulty === "easy"
                    ? "text-green-400"
                    : recipe.difficulty === "medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {recipe.difficulty === "easy"
                  ? "简单"
                  : recipe.difficulty === "medium"
                    ? "中等"
                    : "困难"}
              </span>
            </div>
          </div>
          <p className="text-[#FFF8E7]/60 text-xs mt-2">{recipe.description}</p>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-2 p-2 min-h-0">
        <div className="lg:col-span-2 border border-[#D4AF37]/10 rounded-xl overflow-hidden bg-[#1a0f0a]/30">
          <IngredientList />
        </div>

        <div className="lg:col-span-2 flex items-center justify-center bg-[#1a0f0a]/20 rounded-xl border border-[#D4AF37]/10 overflow-hidden">
          <CocktailShaker />
        </div>

        <div className="lg:col-span-1 border border-[#D4AF37]/10 rounded-xl overflow-hidden bg-[#1a0f0a]/30">
          <MixActions />
        </div>
      </div>
    </div>
  );
}
