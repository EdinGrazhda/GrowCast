import { lazy, Suspense } from 'react';

// Lazy load the heavy Spline component
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function FarmShowcase() {
    return (
        <section id="farm" className="relative w-full bg-white py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
                {/* LEFT — FRIENDLY TEXT */}
                <div className="animate-fade-up">
                    <p className="mb-3 text-sm font-medium text-[#40916c]">
                        Your Smart Farm · Live in 3D
                    </p>

                    <h2 className="mb-6 text-4xl leading-tight font-bold text-[#1b4332] md:text-5xl">
                        See your farm come to life.
                    </h2>

                    <p className="mb-5 max-w-md text-lg text-[#1b4332]/80">
                        GrowCast gives you a simple and beautiful way to explore
                        your farm from every angle. Zoom in, rotate, and
                        discover how each part reacts to weather and crop
                        health.
                    </p>

                    <p className="mb-10 max-w-md text-[#1b4332]/70">
                        No complicated dashboards — just a friendly 3D view that
                        helps you understand exactly what’s happening on your
                        land.
                    </p>

                    <button className="rounded-lg bg-[#2d6a4f] px-8 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#1b4332]">
                        Learn More
                    </button>
                </div>

                {/* RIGHT — 3D FARM VIEW SMALLER */}
                <div className="animate-fade-up flex justify-center delay-200">
                    <div className="h-[400px] w-full md:h-[450px] md:w-[450px]">
                        <Suspense
                            fallback={
                                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#d8f3dc]/20">
                                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-[#2d6a4f]"></div>
                                </div>
                            }
                        >
                            <Spline scene="https://prod.spline.design/5jQKLtKWRAAOQuwq/scene.splinecode" />
                        </Suspense>
                    </div>
                </div>
            </div>
        </section>
    );
}
