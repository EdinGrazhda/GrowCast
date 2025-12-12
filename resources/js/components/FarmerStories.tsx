const stories = [
    {
        name: 'Michael Turner',
        location: 'Iowa, USA',
        image: 'https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0',
        quote: 'Before GrowCast, unpredictable weather caused serious losses. Now I receive accurate planting alerts and my crop yield has increased by 32%.',
        result: '+32% Yield Increase',
    },
    {
        name: 'Elena Rodriguez',
        location: 'Seville, Spain',
        image: 'https://images.unsplash.com/photo-1619689913858-cbc9eb4179de?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0',
        quote: 'GrowCast helped me optimize irrigation and avoid early-stage crop diseases. It’s the most reliable farming tool I have ever used.',
        result: '−27% Water Costs',
    },
    {
        name: 'Daniel Fischer',
        location: 'Berlin, Germany',
        image: 'https://plus.unsplash.com/premium_photo-1726815616472-8ddb1c5ea697?q=80&w=1048&auto=format&fit=crop&ixlib=rb-4.1.0',
        quote: 'With GrowCast, every decision I make is backed by real weather intelligence. It tells me the perfect time to plant based on local forecasts.',
        result: '100% Better Timing Accuracy',
    },
];

export default function FarmerStories() {
    return (
        <section
            id="stories"
            className="relative w-full overflow-hidden bg-white py-28"
        >
            {/* Soft Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#d8f3dc] opacity-40 blur-[150px]"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
                {/* Title */}
                <h2 className="fade-in-up mb-4 text-4xl font-bold text-[#1b4332]">
                    Farmer Success Stories
                </h2>

                <p className="fade-in-up mx-auto mb-14 max-w-2xl text-lg text-[#2d6a4f] delay-200">
                    Farmers across the world are improving their results using
                    GrowCast’s intelligent recommendations.
                </p>

                {/* Stories Grid */}
                <div className="fade-in-up grid gap-10 delay-300 sm:grid-cols-2 lg:grid-cols-3">
                    {stories.map((farmer, i) => (
                        <div
                            key={i}
                            className="rounded-3xl border border-[#d8f3dc] bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                        >
                            {/* Farmer Image */}
                            <img
                                src={farmer.image}
                                alt={farmer.name}
                                className="mx-auto mb-4 h-28 w-28 rounded-full object-cover shadow-md"
                                loading="lazy"
                            />

                            {/* Name */}
                            <h3 className="text-xl font-semibold text-[#1b4332]">
                                {farmer.name}
                            </h3>

                            {/* Location */}
                            <p className="mb-3 text-sm text-[#2d6a4f]/70">
                                {farmer.location}
                            </p>

                            {/* Quote */}
                            <p className="mb-4 text-[#1b4332]/80 italic">
                                "{farmer.quote}"
                            </p>

                            {/* Result Tag */}
                            <div className="inline-block rounded-xl bg-[#52b788] px-4 py-1 text-sm font-semibold text-white">
                                {farmer.result}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
