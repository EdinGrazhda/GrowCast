import { Head } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlantSearchSection from "../components/PlantSearchSection";
import AdminShowcase from "../components/AdminShowcase";
import FarmShowcase from "../components/FarmShowcase";
import FarmerStories from "../components/FarmerStories";

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
           <PlantSearchSection />
           <FarmShowcase />
          <AdminShowcase />
          <FarmerStories />
        </main>

        <Footer />
      </div>
    </>
  );
}
