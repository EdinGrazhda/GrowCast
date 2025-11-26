import { Head } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Welcome() {
  return (
    <>
      <Head title="GrowCast" />

      <div className="min-h-screen flex flex-col bg-[#D8F3DC]">
        <Navbar />

        {/* Main content */}
        <main className="flex-1">
          <Hero />
          <Features />
          <HowItWorks />
          <Testimonials />
          <CTA />
        </main>

        <Footer />
      </div>
    </>
  );
}
