// resources/js/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#1B4332] text-white py-12 md:py-16 overflow-hidden">
      
      {/* Soft background glow */}
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#52B788]/30 blur-3xl rounded-full animate-float opacity-70"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Logo / Name */}
        <div>
          <h3 className="text-2xl font-semibold mb-2 tracking-tight">
            GrowCast
          </h3>
          <p className="text-sm text-white/70 max-w-xs">
            Smarter planting, powered by weather & AI.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-2 text-sm">
          <a href="#" className="text-white/70 hover:text-white transition">
            Home
          </a>
          <a href="#" className="text-white/70 hover:text-white transition">
            Features
          </a>
          <a href="#" className="text-white/70 hover:text-white transition">
            How it works
          </a>
          <a href="#" className="text-white/70 hover:text-white transition">
            Contact
          </a>
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm font-medium mb-2">Contact</p>
          <p className="text-sm text-white/70">support@growcast.ai</p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} GrowCast. All rights reserved.
      </div>
    </footer>
  );
}
