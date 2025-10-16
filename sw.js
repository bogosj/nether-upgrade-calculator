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
    fetch(fetchEvent.request).then(networkResponse => {
      // If fetch is successful, update the cache
      return caches.open(cacheName).then(cache => {
        // It's a good practice to only cache successful responses.
        if (networkResponse.status === 200) {
          cache.put(fetchEvent.request, networkResponse.clone());
        }
        return networkResponse;
      });
    }).catch(() => {
      // If fetch fails (e.g., offline), try to get the response from the cache.
      return caches.match(fetchEvent.request);
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
