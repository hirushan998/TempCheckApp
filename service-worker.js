const CACHE_NAME = 'server-room-monitor-cache-v1';
const urlsToCache = [
  '/realtime/',
  '/realtime/index.html',
  '/realtime/history.html',
  '/realtime/raw-data.html',
  '/realtime/manifest.json',
  '/realtime/icons/logo-192x192.png',
  '/realtime/icons/logo-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch: ${url}`);
                }
                return cache.put(url, response);
              })
              .catch(error => {
                console.error(`Error caching ${url}:`, error);
              });
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(error => {
          console.error('Fetch failed:', error);
          throw error;
        });
      })
  );
});
