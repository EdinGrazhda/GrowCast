import { Link } from '@inertiajs/react';

export default function DiseaseDetectionBanner() {
    return (
        <section
            id="disease-demo"
            className="relative w-full overflow-hidden bg-gradient-to-b from-white to-[#E8F7EE] py-28"
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b7e4c7] opacity-30 blur-[160px]" />

            {/* Dot pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        'radial-gradient(#52b788 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* Icon */}
                <div className="fade-in-up mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#52b788]/20 shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-[#2d6a4f]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h2 className="fade-in-up mb-4 text-4xl font-bold text-[#1b4332] md:text-5xl">
                    Plant Disease Detector
                </h2>

                {/* Description */}
                <p className="fade-in-up mx-auto mb-4 max-w-2xl text-lg text-[#2d6a4f] delay-200">
                    Do you want to try the demo version of the plant disease
                    detector?
                </p>

                <p className="fade-in-up mx-auto mb-8 max-w-xl text-base text-[#2d6a4f]/70 delay-200">
                    Upload a photo of your plant and our AI will instantly
                    analyze it for diseases, pests, and health issues — no
                    account needed.
                </p>

                {/* Animated divider */}
                <div className="fade-in-up mx-auto mb-10 flex justify-center delay-200">
                    <div className="h-[4px] w-32 animate-pulse rounded-full bg-gradient-to-r from-[#52b788] to-[#40916c]" />
                </div>

                {/* CTA Button */}
                <Link
                    href="/demo/plant-disease"
                    className="fade-in-up group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#52b788] to-[#40916c] px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all delay-300 duration-300 hover:scale-[1.05] hover:shadow-xl"
                >
                    <span className="absolute inset-0 bg-white/20 opacity-0 mix-blend-overlay transition-all duration-700 group-hover:opacity-100" />
                    {/* Leaf icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Try It Now
                </Link>

                {/* Demo badge */}
                <p className="fade-in-up mt-6 text-sm text-[#2d6a4f]/60 delay-300">
                    Free demo · Limited to 3 scans per session · No sign-up
                    required
                </p>
            </div>
        </section>
    );
}
