export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#1B4332] text-white pt-16 pb-10"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-14">

        {/* COLUMN 1 — BRAND */}
        <div>
          <h3 className="text-2xl font-bold mb-3">GrowCast</h3>

          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            Smart farming powered by weather intelligence and AI-driven crop insights.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-[#95d5b2] transition text-xl">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#" className="hover:text-[#95d5b2] transition text-xl">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#" className="hover:text-[#95d5b2] transition text-xl">
              <i className="ri-twitter-x-line"></i>
            </a>
            <a href="#" className="hover:text-[#95d5b2] transition text-xl">
              <i className="ri-linkedin-fill"></i>
            </a>
          </div>
        </div>

        {/* COLUMN 2 — PRODUCT */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Product</h4>
          <ul className="space-y-3 text-white/70">
            <li className="hover:text-white transition cursor-pointer">Features</li>
            <li className="hover:text-white transition cursor-pointer">AI Insights</li>
            <li className="hover:text-white transition cursor-pointer">Pricing</li>
            <li className="hover:text-white transition cursor-pointer">Farm Dashboard</li>
          </ul>
        </div>

        {/* COLUMN 3 — COMPANY */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-white/70">
            <li className="hover:text-white transition cursor-pointer">About Us</li>
            <li className="hover:text-white transition cursor-pointer">Our Mission</li>
            <li className="hover:text-white transition cursor-pointer">Team</li>
            <li className="hover:text-white transition cursor-pointer">Careers</li>
          </ul>
        </div>

        {/* COLUMN 4 — SUPPORT */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-3 text-white/70">
            <li className="hover:text-white transition cursor-pointer">Help Center</li>

            {/* CLICK → Scroll te Footer */}
            <li
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white transition cursor-pointer"
            >
              Contact Us
            </li>

            <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 mt-14 pt-6">
        <p className="text-center text-sm text-white/60">
          © {new Date().getFullYear()} GrowCast. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
