export default function ContactSection() {
    return (
        <section
            id="contact"
            className="relative w-full overflow-hidden bg-white py-28"
        >
            {/* Soft Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#d8f3dc] opacity-40 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* Title */}
                <h2 className="fade-in-up mb-4 text-4xl font-bold text-[#1b4332]">
                    Get in Touch
                </h2>

                <p className="fade-in-up mx-auto mb-14 max-w-2xl text-lg text-[#2d6a4f] delay-200">
                    Have questions about GrowCast or want to collaborate?
                    Send us a message and our team will get back to you shortly.
                </p>

                {/* Form */}
                <form className="fade-in-up mx-auto space-y-6 delay-300">
                    {/* Name */}
                    <div className="text-left">
                        <label className="mb-1 block text-sm font-semibold text-[#1b4332]">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            className="w-full rounded-xl border border-[#d8f3dc] px-4 py-3 text-[#1b4332] outline-none transition focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/30"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="text-left">
                        <label className="mb-1 block text-sm font-semibold text-[#1b4332]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-[#d8f3dc] px-4 py-3 text-[#1b4332] outline-none transition focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/30"
                            required
                        />
                    </div>

                    {/* Message */}
                    <div className="text-left">
                        <label className="mb-1 block text-sm font-semibold text-[#1b4332]">
                            Message
                        </label>
                        <textarea
                            rows={5}
                            placeholder="Write your message here..."
                            className="w-full resize-none rounded-xl border border-[#d8f3dc] px-4 py-3 text-[#1b4332] outline-none transition focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/30"
                            required
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="mx-auto mt-6 inline-flex items-center justify-center rounded-full bg-[#52b788] px-10 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#40916c]"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </section>
    );
}
