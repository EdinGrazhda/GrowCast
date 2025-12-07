import { useState } from "react";

interface PlantData {
  name: string;
  planting_time: string;
  watering: string;
  temperature: string;
}

export default function PlantSearchSection() {
  const [query, setQuery] = useState("");
  const [plant, setPlant] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setPlant(null);

    const response = await fetch(`/api/plants?name=${query}`);
    const data = await response.json();

    setPlant(data);
    setLoading(false);
  };

  return (
    <section
      id="search"
      className="relative w-full py-36 overflow-hidden
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

      {/* GREEN GLOW */}
      <div
        className="absolute top-[20%] left-[70%] w-[450px] h-[450px]
                   bg-[#b7e4c7] blur-[160px] opacity-40 rounded-full"
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-5xl font-bold text-[#1b4332]">Plant Knowledge Hub</h2>
          <p className="text-[#2d6a4f] mt-4 text-lg max-w-2xl mx-auto">
            Search any crop to get instant planting insights powered by GrowCast AI.
          </p>

          <div className="w-full flex justify-center mt-6">
            <div className="h-[4px] w-32 bg-gradient-to-r from-[#52b788] to-[#40916c] rounded-full animate-pulse" />
          </div>
        </div>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 justify-center mb-16 fade-in-up delay-200"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a plant…"
            className="w-full md:w-96 px-6 py-3 rounded-xl border border-[#b7e4c7]/60 
                       bg-white/70 backdrop-blur-md shadow-lg
                       text-[#1b4332] placeholder:text-[#1b4332]/60
                       focus:outline-none focus:ring-2 focus:ring-[#52b788]"
          />

          <button
            type="submit"
            className="relative px-10 py-3 rounded-xl bg-gradient-to-r from-[#52b788] to-[#40916c]
                       text-white font-semibold shadow-md overflow-hidden 
                       hover:scale-[1.05] transition-all"
          >
            <span
              className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 
                             transition-all duration-700 mix-blend-overlay"
            />
            Search
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="h-6 shimmer rounded-xl w-1/3 mx-auto mb-3" />
            <div className="h-40 shimmer rounded-3xl" />
          </div>
        )}

        {/* Results */}
        {plant && (
          <div
            className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl 
                          border border-[#d8f3dc] fade-in-up animate-pop delay-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-12 w-12 rounded-xl bg-[#52b788] flex items-center justify-center 
                             text-white text-lg font-bold animate-floating"
              >
                🌱
              </div>

              <h3 className="text-3xl font-semibold text-[#1b4332]">
                {plant.name}
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-[#f6fff8] p-5 rounded-xl border border-[#ccefd8] hover:-translate-y-2 transition shadow-sm">
                <p className="text-[#40916c] font-semibold text-sm">Planting Time</p>
                <p className="text-[#1b4332] text-lg">{plant.planting_time}</p>
              </div>

              <div className="bg-[#f6fff8] p-5 rounded-xl border border-[#ccefd8] hover:-translate-y-2 transition shadow-sm">
                <p className="text-[#40916c] font-semibold text-sm">Watering</p>
                <p className="text-[#1b4332] text-lg">{plant.watering}</p>
              </div>

              <div className="bg-[#f6fff8] p-5 rounded-xl border border-[#ccefd8] hover:-translate-y-2 transition shadow-sm">
                <p className="text-[#40916c] font-semibold text-sm">Temperature</p>
                <p className="text-[#1b4332] text-lg">{plant.temperature}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
