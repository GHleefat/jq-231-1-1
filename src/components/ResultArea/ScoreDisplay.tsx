import { ScoreResult } from '../../types';

interface Props {
  score: ScoreResult;
}

export default function ScoreDisplay({ score }: Props) {
  const getGrade = () => {
    const percent = (score.score / score.maxScore) * 100;
    if (percent >= 90) return { label: 'S', color: 'text-yellow-300', desc: '完美！大师级调酒师！' };
    if (percent >= 80) return { label: 'A', color: 'text-green-400', desc: '优秀！非常棒的作品！' };
    if (percent >= 70) return { label: 'B', color: 'text-blue-400', desc: '不错！继续努力！' };
    if (percent >= 60) return { label: 'C', color: 'text-yellow-500', desc: '及格了，还可以做得更好' };
    return { label: 'D', color: 'text-red-400', desc: '需要多练习哦~' };
  };

  const grade = getGrade();

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-[#D4AF37]/10 to-[#8B0000]/10 rounded-xl border border-[#D4AF37]/30">
      <div className="relative mb-3">
        <svg className="w-24 h-24" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(212, 175, 55, 0.1)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#score-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(score.score / score.maxScore) * 264} 264`}
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-out"
            style={{ strokeDashoffset: 0 }}
          />
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-serif font-bold ${grade.color}`}>
            {grade.label}
          </span>
          <span className="text-[#D4AF37] text-sm">
            {score.score}/{score.maxScore}
          </span>
        </div>
      </div>

      <p className={`text-sm font-medium ${grade.color} mb-2`}>{grade.desc}</p>

      <div className="w-full space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-[#FFF8E7]/60">配料准确度</span>
          <span className="text-[#D4AF37]">{score.accuracy}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1a0f0a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] transition-all duration-1000"
            style={{ width: `${score.accuracy}%` }}
          />
        </div>
      </div>

      {score.unlockedRecipeId && (
        <div className="mt-4 w-full p-3 bg-gradient-to-r from-yellow-500/20 to-[#D4AF37]/20 rounded-lg border border-[#D4AF37]/40 animate-pulse">
          <p className="text-[#D4AF37] text-center font-serif text-sm">🎉 解锁隐藏酒款！</p>
        </div>
      )}
    </div>
  );
}
