self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('rhymic-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/manifest.json',
                '/style.css',
                '/script.js',
                '/icon.png',
                // Add other static assets here
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});