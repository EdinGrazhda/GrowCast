import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const menuItems = ["Services", "Our Mission", "Demo", "Contact"];

  return (
    <header className="w-full bg-white/95 shadow-sm border-b border-[#b7e4c7]/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO SPACE */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-[#52B788] flex items-center justify-center shadow-md">
            {/* logo G (më vonë e ndërron me svg-in tënd) */}
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-xl font-semibold text-[#1B4332]">
            GrowCast
          </span>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#1B4332]/80">
          {menuItems.map((item) => (
            <button
              key={item}
              className="relative group hover:text-[#2D6A4F] transition"
            >
              <span>{item}</span>
              {/* underline efekt i butë */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#2D6A4F] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex gap-2 text-sm">
          <button className="px-4 py-1.5 rounded-lg text-[#1B4332] hover:bg-[#d8f3dc] hover:scale-[1.05] transition">
            Login
          </button>
          <button className="px-4 py-1.5 rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] hover:scale-[1.05] transition shadow-sm hover:shadow-md">
            Register
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-[#1B4332] text-2xl"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#b7e4c7]/60 px-4 py-3 space-y-3 text-[#1B4332]/80 text-sm">
          {menuItems.map((item) => (
            <button
              key={item}
              className="block w-full text-left py-1 hover:text-[#2D6A4F] transition"
            >
              {item}
            </button>
          ))}

          <div className="pt-2 flex gap-2">
            <button className="flex-1 px-4 py-2 rounded-lg text-[#1B4332] border border-[#b7e4c7] hover:bg-[#d8f3dc]/70 transition">
              Login
            </button>
            <button className="flex-1 px-4 py-2 rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] transition">
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
