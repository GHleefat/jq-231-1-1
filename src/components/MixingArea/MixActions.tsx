import { useRef, useState } from "react";
import { Recipe, MixAction } from "../../types";
import { useCocktailStore } from "../../store/useCocktailStore";
import { recipes } from "../../data/recipes";
import { canProceedToMix } from "../../utils/scoring";
import { Trash2, Play, AlertCircle } from "lucide-react";

export default function MixActions() {
  const {
    currentRecipeId,
    addedIngredients,
    phase,
    mixProgress,
    startMixing,
    updateMixProgress,
    updateShakeOffset,
    finishCocktail,
    clearShaker,
  } = useCocktailStore();

  const recipe = recipes.find((r: Recipe) => r.id === currentRecipeId);
  const canMix = recipe && canProceedToMix(recipe, addedIngredients);

  const [isPerforming, setIsPerforming] = useState(false);
  const actionAreaRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const accumulatedRef = useRef(0);
  const angleRef = useRef(0);
  const lastAngleRef = useRef<number | null>(null);
  const circleCenterRef = useRef<{ x: number; y: number } | null>(null);

  const getActionLabel = (action: MixAction) => {
    switch (action) {
      case "shake":
        return "摇晃调酒壶";
      case "stir":
        return "搅拌";
      case "build":
        return "直接完成";
    }
  };

  const getActionHint = (action: MixAction) => {
    switch (action) {
      case "shake":
        return "按住鼠标快速左右拖动";
      case "stir":
        return "按住鼠标绕中心做圆周运动";
      case "build":
        return "点击按钮即可完成";
    }
  };

  const getActionIcon = (action: MixAction) => {
    switch (action) {
      case "shake":
        return "🥢";
      case "stir":
        return "🥄";
      case "build":
        return "✨";
    }
  };

  const handleActionStart = (e: React.MouseEvent) => {
    if (!recipe || phase !== "mixing") return;
    if (recipe.action === "build") return;

    e.preventDefault();
    setIsPerforming(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    accumulatedRef.current = 0;
    angleRef.current = 0;
    lastAngleRef.current = null;

    if (actionAreaRef.current && recipe.action === "stir") {
      const rect = actionAreaRef.current.getBoundingClientRect();
      circleCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    const handleMove = (moveEvent: MouseEvent) => {
      if (!lastPosRef.current || !recipe) return;

      if (recipe.action === "shake") {
        const dx = moveEvent.clientX - lastPosRef.current.x;
        const dy = moveEvent.clientY - lastPosRef.current.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        accumulatedRef.current += absDx + absDy;
        const progress = Math.min(
          100,
          (accumulatedRef.current / (recipe.actionTarget * 100)) * 100,
        );
        updateMixProgress(progress);
        const shakeX = Math.max(-12, Math.min(12, dx * 0.8));
        const shakeY = Math.max(-8, Math.min(8, dy * 0.5));
        updateShakeOffset({ x: shakeX, y: shakeY });
      } else if (recipe.action === "stir" && circleCenterRef.current) {
        const dx = moveEvent.clientX - circleCenterRef.current.x;
        const dy = moveEvent.clientY - circleCenterRef.current.y;
        const angle = Math.atan2(dy, dx);
        if (lastAngleRef.current !== null) {
          let delta = angle - lastAngleRef.current;
          if (delta > Math.PI) delta -= 2 * Math.PI;
          if (delta < -Math.PI) delta += 2 * Math.PI;
          angleRef.current += Math.abs(delta);
          const progress = Math.min(
            100,
            (angleRef.current / (recipe.actionTarget * Math.PI * 0.5)) * 100,
          );
          updateMixProgress(progress);
        }
        lastAngleRef.current = angle;
      }

      lastPosRef.current = { x: moveEvent.clientX, y: moveEvent.clientY };
    };

    const handleUp = () => {
      setIsPerforming(false);
      lastPosRef.current = null;
      lastAngleRef.current = null;
      updateShakeOffset({ x: 0, y: 0 });
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  const handleBuild = () => {
    if (!recipe || recipe.action !== "build") return;
    const target = recipe.actionTarget * 100;
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      updateMixProgress(Math.min(100, (current / target) * 100));
      if (current >= target) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleStartMix = () => {
    if (!canMix) return;
    startMixing();
    if (recipe?.action === "build") {
      handleBuild();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#D4AF37]/20">
        <h4 className="text-[#D4AF37] font-serif text-sm">操作区</h4>
        {phase === "adding" && addedIngredients.length > 0 && (
          <button
            onClick={clearShaker}
            className="text-[#FFF8E7]/50 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            清空
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col p-4 gap-4">
        {phase === "adding" && recipe && (
          <>
            {!canMix ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
                <AlertCircle className="w-10 h-10 text-yellow-500 mb-2" />
                <p className="text-yellow-400 text-sm">请先添加正确的配料</p>
                <p className="text-[#FFF8E7]/50 text-xs mt-1">
                  参考下方配方要求调整配料和用量
                </p>
              </div>
            ) : (
              <button
                onClick={handleStartMix}
                className="flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-[#D4AF37]/50 bg-gradient-to-br from-[#D4AF37]/10 to-[#8B0000]/10 hover:from-[#D4AF37]/20 hover:to-[#8B0000]/20 transition-all group cursor-pointer"
              >
                <div className="text-5xl group-hover:scale-110 transition-transform">
                  {getActionIcon(recipe.action)}
                </div>
                <div>
                  <p className="text-[#D4AF37] font-serif text-lg font-medium">
                    {getActionLabel(recipe.action)}
                  </p>
                  <p className="text-[#FFF8E7]/50 text-xs mt-1">
                    {getActionHint(recipe.action)}
                  </p>
                </div>
                <Play className="w-8 h-8 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </>
        )}

        {phase === "mixing" && recipe && recipe.action !== "build" && (
          <div
            ref={actionAreaRef}
            onMouseDown={handleActionStart}
            className={`flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-grab active:cursor-grabbing select-none ${
              isPerforming
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : "border-[#D4AF37]/40 bg-[#1a0f0a]/40 hover:border-[#D4AF37]/70"
            }`}
          >
            <div className={`text-5xl ${isPerforming ? "animate-bounce" : ""}`}>
              {getActionIcon(recipe.action)}
            </div>
            <p className="text-[#D4AF37] font-serif text-lg">
              {getActionHint(recipe.action)}
            </p>
            <p className="text-[#FFF8E7]/50 text-xs">
              按住鼠标开始{getActionLabel(recipe.action)}
            </p>
          </div>
        )}

        {phase === "mixing" && recipe && recipe.action === "build" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-[#D4AF37]/30 bg-[#1a0f0a]/40">
            <div className="text-5xl">{getActionIcon(recipe.action)}</div>
            <p className="text-[#D4AF37] font-serif text-lg">调制中...</p>
          </div>
        )}

        {phase === "mixing" && mixProgress >= 100 && (
          <button
            onClick={finishCocktail}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a0f0a] font-serif text-lg font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all animate-pulse"
          >
            🍸 倒入酒杯，完成鸡尾酒！
          </button>
        )}

        {phase === "finished" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-[#D4AF37] font-serif text-lg">✨ 已完成</p>
            <p className="text-[#FFF8E7]/50 text-xs mt-1">
              可在右侧查看成品详情
            </p>
          </div>
        )}

        {phase === "selecting" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-[#FFF8E7]/30">
            <span className="text-4xl mb-2">🍹</span>
            <p className="text-sm">请选择配方开始调制</p>
          </div>
        )}
      </div>
    </div>
  );
}
