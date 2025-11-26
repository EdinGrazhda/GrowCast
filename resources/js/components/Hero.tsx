// resources/js/components/Hero.tsx

const leaves = [
  { left: "3%", top: "8%", size: "w-12" },
  { left: "15%", top: "65%", size: "w-10" },
  { left: "58%", top: "18%", size: "w-14" },
  { left: "82%", top: "60%", size: "w-12" },
  { left: "92%", top: "12%", size: "w-10" },
  { left: "32%", top: "4%", size: "w-12" },
  { left: "45%", top: "48%", size: "w-10" },
  { left: "70%", top: "32%", size: "w-14" },
];

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 lg:px-6 py-16 md:py-24 overflow-hidden">
      {/* Floating leaves background */}
      <div className="pointer-events-none absolute inset-0">
        {leaves.map((leaf, i) => (
          <img
            key={i}
            src="/leaf.svg"
            alt="leaf"
            className={`${leaf.size} opacity-70 animate-float-leaf absolute`}
            style={{
              left: leaf.left,
              top: leaf.top,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* LEFT */}
        <div>
          <p className="text-sm font-medium text-[#40916C] mb-3">
            Weather · AI · Simple decisions
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1B4332] leading-tight mb-4">
            Plan your planting
            <br />
            with confidence.
          </h1>

          <p className="text-base md:text-lg text-[#1B4332]/80 mb-4 max-w-2xl">
            GrowCast helps you pick the right day to sow based on local weather
            and smart AI suggestions — so every season feels a little easier.
          </p>

          <p className="text-sm md:text-base text-[#1B4332]/75 mb-8 max-w-2xl">
            No dashboards. No complex charts. Just clear, friendly guidance for
            your fields.
          </p>

          <button className="px-7 py-3.5 rounded-lg bg-[#2D6A4F] text-white text-sm font-medium hover:bg-[#1B4332] transition">
            Get Started
          </button>
        </div>

        {/* RIGHT – Illustration */}
        <div className="flex justify-center md:justify-end">
         <img
  src="/12345.png"
  alt="Growing plants illustration"
  className="w-full max-w-md object-contain drop-shadow-lg"
/>

        </div>
      </div>
    </section>
  );
}
