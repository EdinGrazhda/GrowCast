import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { label: 'Home', target: 'hero' },
        { label: 'Disease Detector', target: 'disease-demo' },
        { label: '3D Farm', target: 'farm' },
        { label: 'Admin Panel', target: 'admin' },
        { label: 'Success Stories', target: 'stories' },
        { label: 'Contact', target: 'footer' },
    ];

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setOpen(false); // close mobile menu
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#b7e4c7] bg-[#e9f8f1]/90 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                {/* LOGO (click → Home) */}
                <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => scrollToSection('hero')}
                >
                    <img
                        src="/Smile.png"
                        alt="GrowCast Logo"
                        className="h-10 w-10 object-contain"
                    />
                    <span className="text-xl font-semibold text-[#1B4332]">
                        GrowCast
                    </span>
                </div>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden items-center gap-8 text-sm text-[#1B4332]/80 md:flex">
                    {menuItems.map((item) => (
                        <button
                            key={item.target}
                            onClick={() => scrollToSection(item.target)}
                            className="group relative transition hover:text-[#2D6A4F]"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#2D6A4F] transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </nav>

                {/* AUTH BUTTONS */}
                <div className="hidden gap-2 text-sm md:flex">
                    <Link
                        href="/login"
                        className="rounded-lg px-4 py-1.5 text-[#1B4332] transition hover:scale-[1.05] hover:bg-[#d8f3dc]"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-lg bg-[#2D6A4F] px-4 py-1.5 text-white shadow-sm transition hover:scale-[1.05] hover:bg-[#1B4332]"
                    >
                        Register
                    </Link>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button
                    onClick={() => setOpen(!open)}
                    className="text-2xl text-[#1B4332] md:hidden"
                >
                    ☰
                </button>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {open && (
                <div className="animate-fade-up space-y-3 border-t border-[#b7e4c7] bg-[#e9f8f1] px-4 py-3 text-sm text-[#1B4332]/80 md:hidden">
                    {menuItems.map((item) => (
                        <button
                            key={item.target}
                            onClick={() => scrollToSection(item.target)}
                            className="block w-full py-1 text-left transition hover:text-[#2D6A4F]"
                        >
                            {item.label}
                        </button>
                    ))}

                    <div className="flex gap-2 pt-2">
                        <Link
                            href="/login"
                            className="flex-1 rounded-lg border border-[#b7e4c7] px-4 py-2 text-center text-[#1B4332] transition hover:bg-[#d8f3dc]/70"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="flex-1 rounded-lg bg-[#2D6A4F] px-4 py-2 text-center text-white transition hover:bg-[#1B4332]"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
