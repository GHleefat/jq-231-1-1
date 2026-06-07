import { useState } from "react";
import { IngredientType } from "../../types";
import { ingredients } from "../../data/recipes";
import IngredientItem from "./IngredientItem";
import { useCocktailStore } from "../../store/useCocktailStore";

const typeLabels: Record<IngredientType, string> = {
  spirit: "基酒",
  liqueur: "利口酒",
  juice: "果汁",
  syrup: "糖浆",
  garnish: "装饰",
  other: "其他",
};

export default function LiquorShelf() {
  const { phase } = useCocktailStore();
  const [activeType, setActiveType] = useState<IngredientType | "all">("all");

  const types: (IngredientType | "all")[] = [
    "all",
    "spirit",
    "liqueur",
    "juice",
    "syrup",
    "garnish",
    "other",
  ];

  const filteredIngredients =
    activeType === "all"
      ? ingredients
      : ingredients.filter((i) => i.type === activeType);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0f0a] via-[#2C1810] to-[#1a0f0a] rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
        <h3 className="text-[#D4AF37] font-serif text-lg flex items-center gap-2">
          <span>🍾</span>
          酒架
        </h3>
        <p className="text-[#FFF8E7]/50 text-xs mt-1">
          {phase === "adding"
            ? "拖拽或点击添加到调酒壶"
            : phase === "selecting"
              ? "请先选择一款鸡尾酒配方"
              : "正在调酒中..."}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 px-4 py-2 border-b border-[#D4AF37]/10">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1 rounded-full text-xs transition-all ${
              activeType === type
                ? "bg-[#D4AF37] text-[#1a0f0a] font-medium"
                : "text-[#FFF8E7]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
            }`}
          >
            {type === "all" ? "全部" : typeLabels[type]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
          }}
        >
          {filteredIngredients.map((ingredient) => (
            <IngredientItem key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      </div>

      <div className="px-4 py-2 border-t border-[#D4AF37]/10 bg-[#D4AF37]/5 text-center">
        <p className="text-[#D4AF37]/50 text-[10px]">
          共 {filteredIngredients.length} 种配料
        </p>
      </div>
    </div>
  );
}
