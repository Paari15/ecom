self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('zenith-store').then(cache => {
            return cache.addAll(['/', '/styles.css', '/script.js', 'https://via.placeholder.com/100', 'https://via.placeholder.com/50']);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => {
            const fetchPromise = fetch(e.request).then(networkResponse => {
                caches.open('zenith-store').then(cache => cache.put(e.request, networkResponse.clone()));
                return networkResponse;
            }).catch(() => caches.match('/'));
            return response || fetchPromise;
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(key => {
            if (key !== 'zenith-store') return caches.delete(key);
        })))
    );
});