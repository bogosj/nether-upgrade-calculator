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
    caches.match(fetchEvent.request).then(cachedResponse => {
      // If the resource is in the cache, return it
      if (cachedResponse) {
        return cachedResponse;
      }

      // If the resource is not in the cache, fetch it from the network
      return fetch(fetchEvent.request).then(networkResponse => {
        // If fetch is successful, update the cache
        return caches.open(cacheName).then(cache => {
          // It's a good practice to only cache successful responses.
          if (networkResponse.status === 200) {
            cache.put(fetchEvent.request, networkResponse.clone());
          }
          return networkResponse;
        });
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