import { useEffect } from "react";

const decorations = [
  { left: "5%", top: "10%", size: "w-12" },
  { left: "12%", top: "40%", size: "w-10" },
  { left: "8%", top: "75%", size: "w-14" },
  { left: "45%", top: "5%", size: "w-12" },
  { left: "50%", top: "50%", size: "w-10" },
  { left: "48%", top: "80%", size: "w-14" },
  { left: "75%", top: "12%", size: "w-16" },
  { left: "88%", top: "30%", size: "w-12" },
  { left: "82%", top: "70%", size: "w-14" },
];

export default function Hero() {

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const parallaxEls = document.querySelectorAll(".parallax");

      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-speed") || "0.02");
        const x = (window.innerWidth - e.clientX * speed) / 70;
        const y = (window.innerHeight - e.clientY * speed) / 70;
        (el as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative w-full bg-white overflow-hidden py-36">

      <div className="pointer-events-none absolute inset-0 opacity-[0.40]">
        {decorations.map((item, i) => (
          <img
            key={i}
            src="/leaf.svg"
            alt=""
            className={`${item.size} absolute animate-wind parallax`}
            data-speed={0.01 * (i + 1)}
            style={{
              left: item.left,
              top: item.top,
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

        <div className="animate-fade-up">
          <p className="text-sm font-medium text-[#40916c] mb-3">
            Weather · AI · Smart Farming
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-[#1b4332] leading-tight mb-6">
            Plan your planting <br /> with confidence.
          </h1>

          <p className="text-[#1b4332]/80 text-lg mb-6 max-w-lg">
            GrowCast helps you choose the perfect day to plant based on weather
            insights and AI-powered crop recommendations.
          </p>

          <button className="px-8 py-3.5 rounded-lg bg-[#2d6a4f] text-white font-semibold hover:bg-[#1b4332] transition shadow-md">
            Get Started
          </button>
        </div>

        <div className="relative animate-fade-up delay-300 flex justify-center md:justify-end">
          <div className="absolute w-[420px] h-[420px] bg-[#d8f3dc] rounded-full blur-[140px] glow-pulse"></div>

          <img
            src="/Smile.png"
            alt="Plant illustration"
            className="relative z-10 max-w-sm w-full object-contain drop-shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
}
