import { AddedIngredient, Recipe } from "../../types";
import { useCocktailStore } from "../../store/useCocktailStore";
import { recipes, ingredients } from "../../data/recipes";
import { getIngredientStatus } from "../../utils/scoring";
import { X, Plus, Minus } from "lucide-react";

export default function IngredientList() {
  const {
    addedIngredients,
    currentRecipeId,
    phase,
    updateIngredientAmount,
    removeIngredient,
  } = useCocktailStore();

  const recipe = recipes.find((r: Recipe) => r.id === currentRecipeId);

  const totalAmount = addedIngredients.reduce((sum, i) => sum + i.amount, 0);

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "correct":
        return "border-green-500/50 bg-green-500/10";
      case "wrong":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "extra":
        return "border-red-500/50 bg-red-500/10";
      default:
        return "border-[#D4AF37]/20 bg-[#1a0f0a]/40";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "correct":
        return "✓";
      case "wrong":
        return "⚠";
      case "extra":
        return "✗";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#D4AF37]/20">
        <h4 className="text-[#D4AF37] font-serif text-sm">已添加配料</h4>
        <span className="text-[#FFF8E7]/60 text-xs">总量: {totalAmount}ml</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {addedIngredients.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#FFF8E7]/30">
            <span className="text-4xl mb-2">🫗</span>
            <p className="text-sm">调酒壶是空的</p>
            <p className="text-xs mt-1">从左侧酒架添加配料</p>
          </div>
        ) : (
          addedIngredients.map((ing: AddedIngredient, idx: number) => {
            const status = recipe
              ? getIngredientStatus(ing.id, recipe, addedIngredients)
              : undefined;
            return (
              <div
                key={ing.id}
                className={`relative flex items-center gap-2 p-2 rounded-lg border transition-all ${getStatusStyle(
                  status,
                )}`}
              >
                <div className="absolute -left-1 -top-1 w-5 h-5 rounded-full bg-[#D4AF37] text-[#1a0f0a] text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </div>

                {status && (
                  <span className="absolute -right-1 -top-1 text-sm">
                    {getStatusLabel(status)}
                  </span>
                )}

                <div
                  className="w-8 h-10 rounded-t-md rounded-b-sm shrink-0 border border-white/10"
                  style={{ backgroundColor: ing.color }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-[#FFF8E7] text-sm font-medium truncate">
                    {ing.name}
                  </p>
                  <p className="text-[#D4AF37]/50 text-[10px]">{ing.nameEn}</p>
                </div>

                {phase === "adding" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateIngredientAmount(ing.id, ing.amount - 5)
                      }
                      className="w-6 h-6 rounded bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[#FFF8E7] text-xs w-10 text-center">
                      {ing.amount}ml
                    </span>
                    <button
                      onClick={() =>
                        updateIngredientAmount(ing.id, ing.amount + 5)
                      }
                      className="w-6 h-6 rounded bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {phase !== "adding" && (
                  <span className="text-[#FFF8E7] text-xs w-12 text-right">
                    {ing.amount}ml
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {recipe && phase === "adding" && (
        <div className="border-t border-[#D4AF37]/20 p-3 bg-[#D4AF37]/5">
          <p className="text-[#D4AF37]/70 text-xs font-medium mb-2">
            配方要求:
          </p>
          <div className="space-y-1">
            {recipe.ingredients.map((ri) => {
              const ing = ingredients.find((i) => i.id === ri.ingredientId);
              const added = addedIngredients.find(
                (a) => a.id === ri.ingredientId,
              );
              const status = getIngredientStatus(
                ri.ingredientId,
                recipe,
                addedIngredients,
              );
              return (
                <div
                  key={ri.ingredientId}
                  className={`flex items-center justify-between text-xs px-2 py-1 rounded ${
                    status === "correct"
                      ? "text-green-400 bg-green-500/10"
                      : status === "wrong"
                        ? "text-yellow-400 bg-yellow-500/10"
                        : "text-[#FFF8E7]/50"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>{ing?.icon}</span>
                    <span>{ing?.name}</span>
                  </span>
                  <span>
                    {added ? `${added.amount}ml` : "—"} / {ri.amount}ml
                    {status === "correct" && " ✓"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
