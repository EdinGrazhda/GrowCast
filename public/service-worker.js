const CACHE_NAME = 'growcast-v1';
const ASSETS_TO_CACHE = ['/', '/build/assets/app.css', '/build/assets/app.js'];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching assets');
            return cache.addAll(ASSETS_TO_CACHE);
        }),
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                }),
            );
        }),
    );
    self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip cross-origin requests
    if (!request.url.startsWith(self.location.origin)) {
        // For images from external sources (Unsplash, etc), cache them too
        if (request.destination === 'image') {
            event.respondWith(
                caches.open(CACHE_NAME).then((cache) => {
                    return cache.match(request).then((response) => {
                        return (
                            response ||
                            fetch(request).then((fetchResponse) => {
                                cache.put(request, fetchResponse.clone());
                                return fetchResponse;
                            })
                        );
                    });
                }),
            );
        }
        return;
    }

    event.respondWith(
        caches.match(request).then((response) => {
            if (response) {
                // Return from cache
                return response;
            }

            // Not in cache, fetch from network
            return fetch(request).then((fetchResponse) => {
                // Don't cache non-GET requests or error responses
                if (
                    request.method !== 'GET' ||
                    !fetchResponse ||
                    fetchResponse.status !== 200
                ) {
                    return fetchResponse;
                }

                // Cache images, CSS, JS, fonts
                const responseToCache = fetchResponse.clone();
                const shouldCache =
                    request.destination === 'image' ||
                    request.destination === 'style' ||
                    request.destination === 'script' ||
                    request.destination === 'font' ||
                    request.url.includes('/build/');

                if (shouldCache) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }

                return fetchResponse;
            });
        }),
    );
});
