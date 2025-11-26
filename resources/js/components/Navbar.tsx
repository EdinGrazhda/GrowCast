import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const menuItems = ['Services', 'Our Mission', 'Demo', 'Contact'];

    return (
        <header className="w-full border-b border-[#b7e4c7]/60 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                {/* LOGO SPACE */}
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52B788] shadow-md">
                        {/* logo G (më vonë e ndërron me svg-in tënd) */}
                        <span className="text-lg font-bold text-white">G</span>
                    </div>
                    <span className="text-xl font-semibold text-[#1B4332]">
                        GrowCast
                    </span>
                </div>

                {/* DESKTOP MENU */}
                <nav className="hidden items-center gap-8 text-sm text-[#1B4332]/80 md:flex">
                    {menuItems.map((item) => (
                        <button
                            key={item}
                            className="group relative transition hover:text-[#2D6A4F]"
                        >
                            <span>{item}</span>
                            {/* underline efekt i butë */}
                            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#2D6A4F] transition-all duration-300 group-hover:w-full" />
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
                        className="rounded-lg bg-[#2D6A4F] px-4 py-1.5 text-white shadow-sm transition hover:scale-[1.05] hover:bg-[#1B4332] hover:shadow-md"
                    >
                        Register
                    </Link>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="text-2xl text-[#1B4332] md:hidden"
                    aria-label="Toggle navigation"
                >
                    ☰
                </button>
            </div>

            {/* MOBILE DROPDOWN */}
            {open && (
                <div className="space-y-3 border-t border-[#b7e4c7]/60 bg-white px-4 py-3 text-sm text-[#1B4332]/80 md:hidden">
                    {menuItems.map((item) => (
                        <button
                            key={item}
                            className="block w-full py-1 text-left transition hover:text-[#2D6A4F]"
                        >
                            {item}
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
