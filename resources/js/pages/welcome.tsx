import CacheIndicator from '@/components/CacheIndicator';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

// Lazy load components below the fold
const PlantSearchSection = lazy(
    () => import('../components/PlantSearchSection'),
);
const FarmShowcase = lazy(() => import('../components/FarmShowcase'));
const AdminShowcase = lazy(() => import('../components/AdminShowcase'));
const ContactSection = lazy(
    () => import('../components/ContactSection'),
);
const Footer = lazy(() => import('@/components/Footer'));

// Simple loading fallback
const SectionLoader = () => (
    <div className="flex w-full justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d6a4f]"></div>
    </div>
);

export default function Welcome() {
    return (
        <>
            <Head title="GrowCast">
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#1B4332" />
                <meta
                    name="description"
                    content="Smart farming powered by weather intelligence and AI-driven crop insights"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#D8F3DC]">
                <Navbar />

                <main className="flex-1">
                    <Hero />

                    <Suspense fallback={<SectionLoader />}>
                        <PlantSearchSection />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <FarmShowcase />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <AdminShowcase />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <ContactSection />
                    </Suspense>
                </main>

                <Suspense fallback={<SectionLoader />}>
                    <Footer />
                </Suspense>
            </div>

            <CacheIndicator />
        </>
    );
}
