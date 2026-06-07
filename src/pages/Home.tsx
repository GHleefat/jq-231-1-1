import RecipeSelector from '@/components/RecipeSelector/RecipeSelector';
import LiquorShelf from '@/components/LiquorShelf/LiquorShelf';
import MixingArea from '@/components/MixingArea/MixingArea';
import ResultArea from '@/components/ResultArea/ResultArea';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0a07] text-[#FFF8E7] overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.08),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="shrink-0 px-6 py-4 border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#2C1810] via-[#1a0f0a] to-[#2C1810]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🍸</div>
              <div>
                <h1 className="font-serif text-2xl text-[#D4AF37] tracking-wide">
                  虚拟调酒台
                </h1>
                <p className="text-[#FFF8E7]/50 text-xs">Virtual Cocktail Bar</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-[#FFF8E7]/40">
              <span>拖拽配料 · 模拟调酒 · 解锁酒款</span>
            </div>
          </div>
        </header>

        <RecipeSelector />

        <main className="flex-1 p-4 lg:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
            <div className="lg:col-span-3 min-h-[400px] lg:min-h-0">
              <LiquorShelf />
            </div>
            <div className="lg:col-span-6 min-h-[500px] lg:min-h-0">
              <MixingArea />
            </div>
            <div className="lg:col-span-3 min-h-[400px] lg:min-h-0">
              <ResultArea />
            </div>
          </div>
        </main>

        <footer className="shrink-0 px-6 py-3 border-t border-[#D4AF37]/10 bg-[#0f0a07]/80">
          <p className="text-center text-[#D4AF37]/30 text-xs">
            请适度饮酒 · 禁止酒后驾车 · 未成年人禁止饮酒
          </p>
        </footer>
      </div>
    </div>
  );
}
