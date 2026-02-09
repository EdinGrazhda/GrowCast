// resources/js/components/AdminShowcase.tsx

import { useState, useEffect } from "react";

const slides = [
  "/image/growcastimages/farms.png",
  "/image/growcastimages/plants.png",
  "/image/growcastimages/spray.png",
  "/image/growcastimages/AI-spra.png",
  "/image/growcastimages/disease.png",
  "/image/growcastimages/wetherforecastpng.png",
];

export default function AdminShowcase() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="admin"
      className="w-full bg-[#f2fff5] py-24 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT TEXT */}
        <div className="animate-fade-up">
          <p className="text-sm font-medium text-[#40916c] mb-3">
            GrowCast Admin Panel
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#1b4332] leading-tight mb-6">
            Powerful tools to manage <br /> your farming data.
          </h2>

          <p className="text-[#1b4332]/80 text-lg mb-6 max-w-md">
            Easily add crops, update weather conditions, view analytics, and
            automate planting recommendations — all from one dashboard.
          </p>

          <p className="text-[#1b4332]/70 max-w-md">
            Designed to be clean, simple and intuitive so you can focus on 
            the data that matters.
          </p>
        </div>

        {/* RIGHT — PHONE FRAME + CAROUSEL */}
        <div className="flex justify-center animate-fade-up delay-200">
          <div className="relative w-[260px] h-[520px] rounded-[40px] bg-black 
                          overflow-hidden shadow-2xl border-[6px] border-black">

            {/* PHONE SCREEN */}
            <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-white">

              {/* SLIDE CAROUSEL */}
              <div
                className="w-full h-full transition-transform duration-700"
                style={{ transform: `translateY(-${index * 100}%)` }}
              >
                {slides.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Slide ${i}`}
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>
            </div>

            {/* TOP NOTCH */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-3xl bg-black"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
