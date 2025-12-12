import { useEffect, useState } from 'react';

export default function CacheIndicator() {
    const [show, setShow] = useState(false);
    const [isCached, setIsCached] = useState(false);

    useEffect(() => {
        // Check if service worker is active and controlling the page
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                if (registration.active && navigator.serviceWorker.controller) {
                    // Check performance entries to see if resources were cached
                    const entries = performance.getEntriesByType('navigation');
                    if (entries.length > 0) {
                        const navEntry =
                            entries[0] as PerformanceNavigationTiming;
                        // If transferSize is very small, it's likely from cache
                        if (navEntry.transferSize < 1000) {
                            setIsCached(true);
                            setShow(true);
                            setTimeout(() => setShow(false), 3000);
                        }
                    }
                }
            });
        }
    }, []);

    if (!show) return null;

    return (
        <div className="animate-fade-up fixed right-4 bottom-4 z-50">
            <div className="rounded-lg bg-[#52b788] px-6 py-3 text-white shadow-lg">
                <div className="flex items-center gap-2">
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                    <span className="font-medium">
                        {isCached
                            ? 'Loaded from cache - Lightning fast!'
                            : 'Content cached for next visit'}
                    </span>
                </div>
            </div>
        </div>
    );
}
