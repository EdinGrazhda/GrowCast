// resources/js/components/Testimonials.tsx

export default function Testimonials() {
  return (
    <section className="w-full bg-[#f8fff9] py-16 md:py-24 border-t border-[#e6f4ec]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-[#40916C] uppercase tracking-[0.15em] mb-3 opacity-0 animate-fade-up">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1B4332] mb-3 opacity-0 animate-fade-up delay-200">
            What farmers say about GrowCast
          </h2>
          <p className="text-sm md:text-base text-[#1B4332]/75 max-w-2xl mx-auto opacity-0 animate-fade-up delay-400">
            Early users are already planning their seasons with more clarity,
            less guesswork and a bit more peace of mind.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-2xl bg-white border border-[#e6f4ec] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#52B788]/60 opacity-0 animate-fade-up delay-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌾</span>
              <p className="text-[11px] font-medium tracking-wide text-[#40916C] uppercase">
                Grain farmer
              </p>
            </div>
            <p className="text-sm text-[#1B4332]/80 mb-4">
              “Before GrowCast, I was checking three different apps. Now I just
              open one place and know if it’s a good day to sow or not.”
            </p>
            <div className="mt-auto">
              <p className="text-sm font-semibold text-[#1B4332]">
                Arben K.
              </p>
              <p className="text-xs text-[#1B4332]/60">Prizren · Wheat</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl bg-white border border-[#e6f4ec] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#52B788]/60 opacity-0 animate-fade-up delay-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🥕</span>
              <p className="text-[11px] font-medium tracking-wide text-[#40916C] uppercase">
                Vegetable grower
              </p>
            </div>
            <p className="text-sm text-[#1B4332]/80 mb-4">
              “I like that it doesn’t feel technical. The suggestions are in
              plain language, so my dad can use it too.”
            </p>
            <div className="mt-auto">
              <p className="text-sm font-semibold text-[#1B4332]">
                Lirije M.
              </p>
              <p className="text-xs text-[#1B4332]/60">Suharekë · Mixed crops</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl bg-white border border-[#e6f4ec] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#52B788]/60 opacity-0 animate-fade-up delay-900">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌱</span>
              <p className="text-[11px] font-medium tracking-wide text-[#40916C] uppercase">
                Small family farm
              </p>
            </div>
            <p className="text-sm text-[#1B4332]/80 mb-4">
              “It feels like having a friend who quietly checks the weather for
              you and tells you when it’s a good moment to plant.”
            </p>
            <div className="mt-auto">
              <p className="text-sm font-semibold text-[#1B4332]">
                Mentor D.
              </p>
              <p className="text-xs text-[#1B4332]/60">Rahovec · Vineyards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
