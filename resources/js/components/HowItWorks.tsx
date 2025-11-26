// resources/js/components/HowItWorks.tsx

export default function HowItWorks() {
  return (
    <section className="w-full bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-[#1B4332] mb-4 opacity-0 animate-fade-up">
          How GrowCast Works
        </h2>
        <p className="text-sm md:text-base text-[#1B4332]/70 max-w-xl mx-auto mb-16 opacity-0 animate-fade-up delay-200">
          Three simple steps — revealed one by one.
        </p>

        {/* Steps Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-4 opacity-0 animate-fade-up delay-300">
            <div className="w-16 h-16 rounded-full bg-[#2D6A4F] text-white text-3xl flex items-center justify-center shadow-lg">
              1
            </div>
            <h3 className="text-xl font-semibold text-[#1B4332]">
              Select your location
            </h3>
            <p className="text-sm text-[#1B4332]/70 max-w-xs">
              GrowCast reads real weather near your fields.
            </p>
          </div>

          {/* Step Divider Line */}
          <div className="hidden md:block w-20 h-1 bg-[#d8f3dc] opacity-0 animate-fade-up delay-450"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-4 opacity-0 animate-fade-up delay-600">
            <div className="w-16 h-16 rounded-full bg-[#2D6A4F] text-white text-3xl flex items-center justify-center shadow-lg">
              2
            </div>
            <h3 className="text-xl font-semibold text-[#1B4332]">
              Choose your crop
            </h3>
            <p className="text-sm text-[#1B4332]/70 max-w-xs">
              Tailored suggestions for what you grow.
            </p>
          </div>

          {/* Step Divider Line */}
          <div className="hidden md:block w-20 h-1 bg-[#d8f3dc] opacity-0 animate-fade-up delay-750"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-4 opacity-0 animate-fade-up delay-900">
            <div className="w-16 h-16 rounded-full bg-[#2D6A4F] text-white text-3xl flex items-center justify-center shadow-lg">
              3
            </div>
            <h3 className="text-xl font-semibold text-[#1B4332]">
              Get the best planting day
            </h3>
            <p className="text-sm text-[#1B4332]/70 max-w-xs">
              Clear recommendations powered by AI + weather.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
