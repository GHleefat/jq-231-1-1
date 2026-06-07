import { useState } from 'react';
import { Ingredient } from '../../types';
import { useCocktailStore } from '../../store/useCocktailStore';

interface Props {
  ingredient: Ingredient;
}

const typeLabels: Record<string, string> = {
  spirit: '基酒',
  liqueur: '利口酒',
  juice: '果汁',
  syrup: '糖浆',
  garnish: '装饰',
  other: '其他',
};

export default function IngredientItem({ ingredient }: Props) {
  const { addIngredient, phase } = useCocktailStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  const canAdd = phase === 'adding';

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canAdd) return;
    e.preventDefault();
    setIsDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setDragPos({ x: moveEvent.clientX, y: moveEvent.clientY });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      const shaker = document.getElementById('cocktail-shaker-zone');
      if (shaker) {
        const rect = shaker.getBoundingClientRect();
        if (
          upEvent.clientX >= rect.left &&
          upEvent.clientX <= rect.right &&
          upEvent.clientY >= rect.top &&
          upEvent.clientY <= rect.bottom
        ) {
          addIngredient(ingredient);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = () => {
    if (canAdd) {
      addIngredient(ingredient);
    }
  };

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`relative flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
          canAdd
            ? 'cursor-grab active:cursor-grabbing hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:scale-105 border-[#D4AF37]/20 bg-[#1a0f0a]/60'
            : 'opacity-50 cursor-not-allowed border-gray-700/30 bg-[#1a0f0a]/30'
        }`}
      >
        <div
          className="w-12 h-16 rounded-t-lg rounded-b-sm relative overflow-hidden border border-white/10 shadow-lg"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, ${ingredient.color}40 30%, ${ingredient.color} 70%, ${ingredient.color}99 100%)`,
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-[#8B4513] rounded-b" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
        </div>
        <div className="mt-2 text-center">
          <span className="text-2xl">{ingredient.icon}</span>
          <p className="text-[#FFF8E7] text-xs font-medium mt-1">{ingredient.name}</p>
          <p className="text-[#D4AF37]/50 text-[10px]">{ingredient.nameEn}</p>
          <p className="text-[#D4AF37]/30 text-[10px] mt-0.5">
            {typeLabels[ingredient.type]} · {ingredient.defaultAmount}ml
          </p>
        </div>
      </div>

      {isDragging && (
        <div
          className="fixed pointer-events-none z-50 opacity-80"
          style={{
            left: dragPos.x - 30,
            top: dragPos.y - 40,
          }}
        >
          <div
            className="w-12 h-16 rounded-t-lg rounded-b-sm border border-white/30 shadow-2xl"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, ${ingredient.color}40 30%, ${ingredient.color} 70%, ${ingredient.color}99 100%)`,
            }}
          />
        </div>
      )}
    </>
  );
}
