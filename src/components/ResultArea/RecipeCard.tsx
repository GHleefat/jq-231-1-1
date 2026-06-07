import { Recipe } from "../../types";
import { ingredients } from "../../data/recipes";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const getActionLabel = (action: string) => {
    switch (action) {
      case "shake":
        return "摇荡法";
      case "stir":
        return "搅拌法";
      case "build":
        return "直调法";
      default:
        return action;
    }
  };

  const getGlassLabel = (type: string) => {
    switch (type) {
      case "cocktail":
        return "鸡尾酒杯";
      case "highball":
        return "高球杯";
      case "rocks":
        return "古典杯";
      case "hurricane":
        return "飓风杯";
      default:
        return type;
    }
  };

  return (
    <div className="relative p-4 rounded-xl overflow-hidden border-2 border-[#D4AF37]/40 bg-gradient-to-br from-[#FFF8E7] to-[#F5E6C8] shadow-xl">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]" />
      <div className="absolute inset-x-4 top-2 h-px bg-[#D4AF37]/30" />
      <div className="absolute inset-x-4 bottom-2 h-px bg-[#D4AF37]/30" />

      <div className="relative space-y-3">
        <div className="text-center pb-2 border-b border-[#D4AF37]/30">
          <h3 className="text-[#2C1810] font-serif text-lg font-bold">
            {recipe.name}
          </h3>
          <p className="text-[#8B4513] text-xs italic">{recipe.nameEn}</p>
        </div>

        <div>
          <p className="text-[#2C1810]/70 text-xs mb-2 font-medium">配料：</p>
          <div className="space-y-1">
            {recipe.ingredients.map((ri) => {
              const ing = ingredients.find((i) => i.id === ri.ingredientId);
              return (
                <div
                  key={ri.ingredientId}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-1 text-[#2C1810]">
                    <span>{ing?.icon}</span>
                    <span>{ing?.name}</span>
                  </span>
                  <span className="text-[#8B4513] font-medium">
                    {ri.amount}ml
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#D4AF37]/30">
          <div>
            <span className="text-[#2C1810]/60">调法：</span>
            <span className="text-[#2C1810] font-medium">
              {getActionLabel(recipe.action)}
            </span>
          </div>
          <div>
            <span className="text-[#2C1810]/60">杯具：</span>
            <span className="text-[#2C1810] font-medium">
              {getGlassLabel(recipe.glassType)}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-[#2C1810]/60">装饰：</span>
            <span className="text-[#2C1810] font-medium">{recipe.garnish}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#D4AF37]/30">
          <p className="text-[#2C1810]/80 text-xs italic leading-relaxed">
            "{recipe.description}"
          </p>
        </div>
      </div>
    </div>
  );
}
