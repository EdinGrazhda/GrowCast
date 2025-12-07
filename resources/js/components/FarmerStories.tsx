import React from "react";

const stories = [
  {
    name: "Michael Turner",
    location: "Iowa, USA",
    image:
      "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    quote:
      "Before GrowCast, unpredictable weather caused serious losses. Now I receive accurate planting alerts and my crop yield has increased by 32%.",
    result: "+32% Yield Increase",
  },
  {
    name: "Elena Rodriguez",
    location: "Seville, Spain",
    image:
      "https://images.unsplash.com/photo-1619689913858-cbc9eb4179de?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0",
    quote:
      "GrowCast helped me optimize irrigation and avoid early-stage crop diseases. It’s the most reliable farming tool I have ever used.",
    result: "−27% Water Costs",
  },
  {
    name: "Daniel Fischer",
    location: "Berlin, Germany",
    image:
      "https://plus.unsplash.com/premium_photo-1726815616472-8ddb1c5ea697?q=80&w=1048&auto=format&fit=crop&ixlib=rb-4.1.0",
    quote:
      "With GrowCast, every decision I make is backed by real weather intelligence. It tells me the perfect time to plant based on local forecasts.",
    result: "100% Better Timing Accuracy",
  },
];

export default function FarmerStories() {
  return (
    <section
      id="stories"
      className="relative w-full bg-white py-28 overflow-hidden"
    >
      {/* Soft Glow */}
      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] 
                   bg-[#d8f3dc] blur-[150px] opacity-40 
                   -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold text-[#1b4332] mb-4 fade-in-up">
          Farmer Success Stories
        </h2>

        <p className="text-[#2d6a4f] text-lg mb-14 max-w-2xl mx-auto fade-in-up delay-200">
          Farmers across the world are improving their results using GrowCast’s
          intelligent recommendations.
        </p>

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 fade-in-up delay-300">
          {stories.map((farmer, i) => (
            <div
              key={i}
              className="bg-white border border-[#d8f3dc] rounded-3xl shadow-lg p-6 
                         hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
            >
              {/* Farmer Image */}
              <img
                src={farmer.image}
                alt={farmer.name}
                className="w-28 h-28 mx-auto rounded-full object-cover shadow-md mb-4"
              />

              {/* Name */}
              <h3 className="text-xl font-semibold text-[#1b4332]">
                {farmer.name}
              </h3>

              {/* Location */}
              <p className="text-sm text-[#2d6a4f]/70 mb-3">{farmer.location}</p>

              {/* Quote */}
              <p className="text-[#1b4332]/80 italic mb-4">"{farmer.quote}"</p>

              {/* Result Tag */}
              <div className="inline-block bg-[#52b788] text-white text-sm font-semibold px-4 py-1 rounded-xl">
                {farmer.result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
