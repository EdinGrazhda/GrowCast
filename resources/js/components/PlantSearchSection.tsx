import { Link } from "@inertiajs/react";

export default function PlantSearchSection() {
  return (
    <section
      id="plant-diagnosis"
      className="relative w-full py-40 overflow-hidden
                 bg-gradient-to-b from-[#E8F7EE] to-white"
    >
      {/* PATTERN DOTS */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#b7e4c7 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* SOFT GREEN GLOWS */}
      <div className="absolute top-[15%] left-[10%] w-[420px] h-[420px] bg-[#b7e4c7] blur-[160px] opacity-40 rounded-full" />
      <div className="absolute top-[25%] right-[10%] w-[420px] h-[420px] bg-[#95d5b2] blur-[160px] opacity-40 rounded-full" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center fade-in-up">

        {/* BADGE */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full
                        bg-[#52b788]/10 text-[#40916c] font-semibold mb-6">
          🧠 AI-powered plant analysis
        </div>

        {/* TITLE */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-[#1b4332] leading-tight">
          Detect Plant Problems
          <span className="block text-[#40916c]">
            From a Single Photo
          </span>
        </h2>

        {/* SUBTITLE */}
        <p className="text-[#2d6a4f] mt-8 text-lg md:text-xl max-w-2xl mx-auto">
          Upload a clear photo of your plant and let GrowCast AI identify
          the <span className="font-semibold">possible issue</span>.
          <span className="block mt-2 font-semibold">
            Diagnosis only — no treatment recommendations.
          </span>
        </p>

        {/* DIVIDER */}
        <div className="w-full flex justify-center mt-10">
          <div className="h-[4px] w-36 bg-gradient-to-r from-[#52b788] to-[#40916c] rounded-full animate-pulse" />
        </div>

        {/* CTA CARD */}
        <div className="mt-16 flex justify-center">
          <div
            className="backdrop-blur-md bg-white/70 border border-[#d8f3dc]
                       rounded-3xl px-12 py-10 shadow-2xl"
          >
            <p className="text-[#1b4332] font-semibold mb-6">
              Ready to analyze your plant?
            </p>

            <Link
              href="/plant-diagnosis"
              className="group inline-flex items-center gap-4
                         px-14 py-5 rounded-full
                         bg-gradient-to-r from-[#52b788] to-[#40916c]
                         text-white text-xl font-bold shadow-xl
                         hover:scale-105 transition-all"
            >
              <span className="text-2xl group-hover:scale-110 transition">
                📷
              </span>
              Upload Plant Photo
            </Link>

            <p className="mt-4 text-sm text-[#2d6a4f]/70">
              JPG or PNG • Best results with leaf close-ups
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
