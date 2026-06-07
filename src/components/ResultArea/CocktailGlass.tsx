import { Recipe } from "../../types";

interface Props {
  recipe: Recipe;
  showPour?: boolean;
}

export default function CocktailGlass({ recipe, showPour = false }: Props) {
  const prefix = recipe.id;

  const liquidFillStyle = {
    transformOrigin: "bottom",
    transformBox: "fill-box" as const,
  };

  const getGlassPath = (type: string) => {
    switch (type) {
      case "cocktail":
        return (
          <>
            <path
              d="M40 20 L80 20 L70 80 Q60 90 60 90 L60 110 L80 110 L80 120 L40 120 L40 110 L60 110 L60 90 Q60 90 50 80 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <defs>
              <clipPath id={`${prefix}-cocktail-clip`}>
                <path d="M42 22 L78 22 L69 78 Q60 88 60 88 L60 90 Q60 88 51 78 Z" />
              </clipPath>
            </defs>
            <rect
              x="40"
              y="30"
              width="40"
              height="60"
              fill={recipe.color}
              clipPath={`url(#${prefix}-cocktail-clip)`}
              className={showPour ? "animate-fill" : ""}
              style={liquidFillStyle}
            />
          </>
        );
      case "highball":
        return (
          <>
            <rect
              x="42"
              y="15"
              width="36"
              height="95"
              rx="3"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <defs>
              <clipPath id={`${prefix}-highball-clip`}>
                <rect x="44" y="17" width="32" height="91" rx="2" />
              </clipPath>
            </defs>
            <rect
              x="44"
              y="25"
              width="32"
              height="83"
              fill={recipe.color}
              clipPath={`url(#${prefix}-highball-clip)`}
              className={showPour ? "animate-fill" : ""}
              style={liquidFillStyle}
            />
            <rect
              x="35"
              y="110"
              width="50"
              height="8"
              rx="2"
              fill="rgba(255,255,255,0.2)"
            />
          </>
        );
      case "rocks":
        return (
          <>
            <path
              d="M38 20 L82 20 L78 90 L72 95 L48 95 L42 90 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <defs>
              <clipPath id={`${prefix}-rocks-clip`}>
                <path d="M40 22 L80 22 L76 88 L72 92 L48 92 L44 88 Z" />
              </clipPath>
            </defs>
            <rect
              x="40"
              y="35"
              width="40"
              height="57"
              fill={recipe.color}
              clipPath={`url(#${prefix}-rocks-clip)`}
              className={showPour ? "animate-fill" : ""}
              style={liquidFillStyle}
            />
          </>
        );
      case "hurricane":
        return (
          <>
            <path
              d="M60 15 L60 30 Q40 40 35 60 Q30 85 45 100 L55 105 L55 115 L75 115 L65 115 L65 105 L75 100 Q90 85 85 60 Q80 40 60 30 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <defs>
              <clipPath id={`${prefix}-hurricane-clip`}>
                <path d="M60 32 Q42 40 37 60 Q32 84 46 98 L55 103 L65 103 L74 98 Q88 84 83 60 Q78 40 60 32 Z" />
              </clipPath>
            </defs>
            <rect
              x="35"
              y="40"
              width="50"
              height="65"
              fill={recipe.color}
              clipPath={`url(#${prefix}-hurricane-clip)`}
              className={showPour ? "animate-fill" : ""}
              style={liquidFillStyle}
            />
          </>
        );
      default:
        return (
          <>
            <rect
              x="42"
              y="20"
              width="36"
              height="80"
              rx="4"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <defs>
              <clipPath id={`${prefix}-default-clip`}>
                <rect x="44" y="22" width="32" height="76" rx="3" />
              </clipPath>
            </defs>
            <rect
              x="44"
              y="30"
              width="32"
              height="68"
              fill={recipe.color}
              clipPath={`url(#${prefix}-default-clip)`}
              className={showPour ? "animate-fill" : ""}
              style={liquidFillStyle}
            />
          </>
        );
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 140" className="w-32 h-40 drop-shadow-2xl">
        <defs>
          <linearGradient
            id={`${prefix}-glass-reflect`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {getGlassPath(recipe.glassType)}
        <ellipse cx="60" cy="20" rx="20" ry="3" fill="rgba(255,255,255,0.3)" />
      </svg>
      {showPour && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="w-8 h-16 rounded-b-full bg-gradient-to-b from-transparent via-white/20 to-[#D4AF37]/30 animate-pour" />
        </div>
      )}
    </div>
  );
}
