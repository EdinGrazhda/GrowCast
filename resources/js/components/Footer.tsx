export default function Footer() {
    // Generate random grass blades with varying heights and delays
    const grassBlades = Array.from({ length: 80 }, (_, i) => ({
        height: Math.random() * 30 + 40, // Random height between 40-70px
        delay: Math.random() * 2, // Random delay 0-2s
        left: (i / 80) * 100, // Evenly distributed
    }));

    return (
        <footer
            id="contact"
            className="relative bg-[#1B4332] pt-16 pb-10 text-white"
        >
            {/* Animated Grass Border */}
            <div className="pointer-events-none absolute -top-16 right-0 left-0 z-20 h-20 overflow-visible">
                <div className="relative h-full w-full">
                    {grassBlades.map((blade, i) => (
                        <div
                            key={i}
                            className="grass-blade absolute bottom-0 w-[2%] rounded-t-full bg-gradient-to-t from-[#2D6A4F] via-[#40916C] to-[#52B788] opacity-80"
                            style={{
                                left: `${blade.left}%`,
                                height: `${blade.height}px`,
                                animationDelay: `${blade.delay}s`,
                                animationDuration: `${2 + Math.random() * 2}s`, // 2-4s duration
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-4">
                {/* COLUMN 1 — BRAND */}
                <div>
                    <h3 className="mb-3 text-2xl font-bold">GrowCast</h3>

                    <p className="max-w-xs text-sm leading-relaxed text-white/80">
                        Smart farming powered by weather intelligence and
                        AI-driven crop insights.
                    </p>

                    {/* Social Icons */}
                    <div className="mt-5 flex gap-4">
                        <a
                            href="#"
                            className="text-xl transition hover:text-[#95d5b2]"
                        >
                            <i className="ri-facebook-fill"></i>
                        </a>
                        <a
                            href="#"
                            className="text-xl transition hover:text-[#95d5b2]"
                        >
                            <i className="ri-instagram-line"></i>
                        </a>
                        <a
                            href="#"
                            className="text-xl transition hover:text-[#95d5b2]"
                        >
                            <i className="ri-twitter-x-line"></i>
                        </a>
                        <a
                            href="#"
                            className="text-xl transition hover:text-[#95d5b2]"
                        >
                            <i className="ri-linkedin-fill"></i>
                        </a>
                    </div>
                </div>

                {/* COLUMN 2 — PRODUCT */}
                <div>
                    <h4 className="mb-4 text-lg font-semibold">Product</h4>
                    <ul className="space-y-3 text-white/70">
                        <li className="cursor-pointer transition hover:text-white">
                            Features
                        </li>
                        <li className="cursor-pointer transition hover:text-white">
                            AI Insights
                        </li>
                        <li className="cursor-pointer transition hover:text-white">
                            Pricing
                        </li>
                        <li className="cursor-pointer transition hover:text-white">
                            Farm Dashboard
                        </li>
                    </ul>
                </div>

                {/* COLUMN 3 — COMPANY */}
                <div>
                    <h4 className="mb-4 text-lg font-semibold">Company</h4>
                    <ul className="space-y-3 text-white/70">
                        <li className="cursor-pointer transition hover:text-white">
                            About Us
                        </li>
                        <li className="cursor-pointer transition hover:text-white">
                            Our Mission
                        </li>
                        <li className="cursor-pointer transition hover:text-white">
                            Team
                        </li>
                        <li className="cursor-pointer transition hover:text-white">
                            Careers
                        </li>
                    </ul>
                </div>

                {/* COLUMN 4 — SUPPORT */}
                <div>
                    <h4 className="mb-4 text-lg font-semibold">Support</h4>
                    <ul className="space-y-3 text-white/70">
                        <li className="cursor-pointer transition hover:text-white">
                            Help Center
                        </li>

                        {/* CLICK → Scroll te Footer */}
                        <li
                            onClick={() =>
                                document
                                    .getElementById('contact')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }
                            className="cursor-pointer transition hover:text-white"
                        >
                            Contact Us
                        </li>

                        <li className="cursor-pointer transition hover:text-white">
                            Privacy Policy
                        </li>
                        <li className="cursor-pointer transition hover:text-white">
                            Terms & Conditions
                        </li>
                    </ul>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="mt-14 border-t border-white/10 pt-6">
                <p className="text-center text-sm text-white/60">
                    © {new Date().getFullYear()} GrowCast. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
