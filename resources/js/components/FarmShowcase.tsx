import Spline from "@splinetool/react-spline";

export default function FarmShowcase() {
  return (
    <section
      id="farm"
      className="relative w-full py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT — FRIENDLY TEXT */}
        <div className="animate-fade-up">
          <p className="text-sm font-medium text-[#40916c] mb-3">
            Your Smart Farm · Live in 3D
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#1b4332] leading-tight mb-6">
            See your farm come to life.
          </h2>

          <p className="text-[#1b4332]/80 text-lg mb-5 max-w-md">
            GrowCast gives you a simple and beautiful way to explore your farm
            from every angle. Zoom in, rotate, and discover how each part reacts 
            to weather and crop health.
          </p>

          <p className="text-[#1b4332]/70 mb-10 max-w-md">
            No complicated dashboards — just a friendly 3D view that helps you
            understand exactly what’s happening on your land.
          </p>

          <button className="px-8 py-3.5 rounded-lg bg-[#2d6a4f] text-white font-semibold 
                             hover:bg-[#1b4332] transition shadow-md">
            Learn More
          </button>
        </div>

        {/* RIGHT — 3D FARM VIEW SMALLER */}
        <div className="animate-fade-up delay-200 flex justify-center">
          <div className="w-[400px] h-[400px] md:w-[450px] md:h-[450px]">
            <Spline 
              scene="https://prod.spline.design/5jQKLtKWRAAOQuwq/scene.splinecode"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
