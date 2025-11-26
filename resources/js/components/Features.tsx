// resources/js/components/Features.tsx

export default function Features() {
  return (
    <section className="w-full border-t border-[#e6f4ec] bg-[#f8fff9]/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 md:py-20">
        {/* Top text */}
        <div className="max-w-2xl mb-12">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8f3dc] text-[#1B4332] text-xs font-medium mb-4">
            <span className="text-base animate-bounce-slow">🌱</span>
            <span>Built for real fields, not just dashboards.</span>
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-[#1B4332] mb-3">
            Why farmers trust GrowCast
          </h2>

          <p className="text-sm md:text-base text-[#1B4332]/80">
            Simple, clear suggestions that fit into your day — not another tool
            you have to learn.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-2xl bg-white border border-[#e6f4ec] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#52B788]/60">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#d8f3dc] text-2xl mb-2 group-hover:scale-110 transition">
              🌤
            </div>
            <h3 className="text-lg font-semibold text-[#1B4332] mb-1">
              Weather made useful
            </h3>
            <p className="text-sm text-[#1B4332]/75">
              Turns weather into a simple “good day / bad day” for sowing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl bg-white border border-[#e6f4ec] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#52B788]/60">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#d8f3dc] text-2xl mb-2 group-hover:scale-110 transition">
              🌾
            </div>
            <h3 className="text-lg font-semibold text-[#1B4332] mb-1">
              Focused on your crops
            </h3>
            <p className="text-sm text-[#1B4332]/75">
              Suggestions tailored to what you’re actually growing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl bg-white border border-[#e6f4ec] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#52B788]/60">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#d8f3dc] text-2xl mb-2 group-hover:scale-110 transition">
              🤝
            </div>
            <h3 className="text-lg font-semibold text-[#1B4332] mb-1">
              Built to feel friendly
            </h3>
            <p className="text-sm text-[#1B4332]/75">
              Clear language. No jargon. A companion that helps each season.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
