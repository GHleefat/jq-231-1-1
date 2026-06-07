import { useRef } from "react";
import { AddedIngredient, Recipe, MixAction } from "../../types";
import { useCocktailStore } from "../../store/useCocktailStore";
import { recipes } from "../../data/recipes";

interface Props {
  className?: string;
}

export default function CocktailShaker({ className = "" }: Props) {
  const {
    addedIngredients,
    currentRecipeId,
    phase,
    isMixing,
    mixProgress,
    shakeOffset,
  } = useCocktailStore();
  const shakerRef = useRef<HTMLDivElement>(null);

  const recipe = recipes.find((r: Recipe) => r.id === currentRecipeId);

  const totalAmount = addedIngredients.reduce((sum, i) => sum + i.amount, 0);
  const maxCapacity = 300;
  const fillPercent = Math.min(100, (totalAmount / maxCapacity) * 100);

  const getLayerGradient = (ings: AddedIngredient[]) => {
    if (ings.length === 0) return "";
    const layers: string[] = [];
    let accumulated = 0;
    const sorted = [...ings].reverse();
    for (const ing of sorted) {
      const percent = (ing.amount / maxCapacity) * 100;
      layers.push(`${ing.color} ${accumulated}%`);
      accumulated += percent;
      layers.push(`${ing.color} ${accumulated}%`);
    }
    return `linear-gradient(180deg, ${layers.join(", ")})`;
  };

  const getActionLabel = (action: MixAction) => {
    switch (action) {
      case "shake":
        return "摇晃";
      case "stir":
        return "搅拌";
      case "build":
        return "直调";
    }
  };

  return (
    <div
      id="cocktail-shaker-zone"
      ref={shakerRef}
      className={`relative flex flex-col items-center justify-center p-6 ${className}`}
    >
      <div
        className={`relative transition-transform duration-75 ${
          isMixing ? (recipe?.action === "shake" ? "animate-shake" : "") : ""
        }`}
        style={{
          transform:
            isMixing && recipe?.action === "shake"
              ? `translate(${shakeOffset.x}px, ${shakeOffset.y}px) rotate(${shakeOffset.x * 0.5}deg)`
              : undefined,
        }}
      >
        <div className="relative">
          <div className="w-20 h-6 bg-gradient-to-b from-[#888] to-[#444] rounded-t-md mx-auto shadow-inner" />
          <div className="w-24 h-4 bg-gradient-to-b from-[#555] to-[#222] mx-auto -mt-1 rounded-b" />

          <div className="relative w-40 h-56 mt-1">
            <div
              className="absolute inset-0 rounded-b-[40%] rounded-t-lg overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #666 0%, #333 25%, #1a1a1a 50%, #333 75%, #666 100%)",
                boxShadow:
                  "inset 0 0 30px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                style={{
                  height: `${fillPercent}%`,
                  background:
                    addedIngredients.length > 0
                      ? getLayerGradient(addedIngredients)
                      : "transparent",
                  transition: "height 0.5s ease, background 0.5s ease",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
                {isMixing && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                )}
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-2 top-4 bottom-4 w-1 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-full" />
                <div className="absolute right-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-full" />
              </div>

              {isMixing && recipe?.action === "stir" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-2 h-32 bg-gradient-to-t from-amber-700 to-amber-600 rounded-full animate-spin"
                    style={{
                      transformOrigin: "top center",
                      animationDuration: "0.5s",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="absolute -right-8 top-0 h-full flex flex-col justify-between py-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-px bg-[#D4AF37]/60" />
                <span className="text-[#D4AF37]/60 text-[10px] w-8">300ml</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-px bg-[#D4AF37]/40" />
                <span className="text-[#D4AF37]/40 text-[10px] w-8">200ml</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-px bg-[#D4AF37]/60" />
                <span className="text-[#D4AF37]/60 text-[10px] w-8">100ml</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-px bg-[#D4AF37]/40" />
                <span className="text-[#D4AF37]/40 text-[10px] w-8">50ml</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-px bg-[#D4AF37]/60" />
                <span className="text-[#D4AF37]/60 text-[10px] w-8">0ml</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        {phase === "adding" && recipe && (
          <div>
            <p className="text-[#D4AF37]/60 text-sm">
              {addedIngredients.length === 0
                ? "👆 拖拽配料到调酒壶中"
                : `已添加 ${addedIngredients.length} 种配料，共 ${totalAmount}ml`}
            </p>
            <p className="text-[#FFF8E7]/50 text-xs mt-1">
              调酒方式：{getActionLabel(recipe.action)}
            </p>
          </div>
        )}
        {phase === "mixing" && recipe && (
          <div>
            <p className="text-[#D4AF37] text-lg font-serif">
              {getActionLabel(recipe.action)}中...
            </p>
            <div className="w-48 h-2 bg-[#1a0f0a] rounded-full mt-2 overflow-hidden border border-[#D4AF37]/30">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] transition-all duration-200"
                style={{ width: `${mixProgress}%` }}
              />
            </div>
            <p className="text-[#FFF8E7]/50 text-xs mt-1">
              {Math.round(mixProgress)}%
            </p>
          </div>
        )}
        {phase === "selecting" && (
          <p className="text-[#FFF8E7]/50 text-sm">
            请从顶部选择一款鸡尾酒配方
          </p>
        )}
        {phase === "finished" && (
          <p className="text-[#D4AF37] text-sm">🎉 调制完成！</p>
        )}
      </div>
    </div>
  );
}
