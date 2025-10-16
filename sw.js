const cacheName = 'nether-tracker-v3';
const assets = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
];

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(fetchEvent.request).then(response => {
        const fetchPromise = fetch(fetchEvent.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            cache.put(fetchEvent.request, networkResponse.clone());
          }
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});

// Clean up old caches
self.addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
