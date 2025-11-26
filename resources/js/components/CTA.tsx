// resources/js/components/CTA.tsx

export default function CTA() {
  return (
    <section className="w-full bg-[#2D6A4F] py-16 md:py-24 text-white overflow-hidden relative">
      
      {/* Soft glow circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#52B788]/40 blur-3xl opacity-70 animate-float"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#40916c]/40 blur-3xl opacity-70 animate-float delay-3000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 animate-fade-up">
          Ready to grow smarter?
        </h2>

        <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto mb-10 animate-fade-up delay-300">
          Start using AI-powered planting guidance and make every season easier.
        </p>

        <button className="px-8 py-3.5 rounded-lg bg-white text-[#1B4332] text-sm md:text-base font-semibold hover:scale-105 hover:shadow-xl transition-transform duration-300 animate-fade-up delay-600">
          Get Started
        </button>
      </div>
    </section>
  );
}
