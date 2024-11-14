const CACHE_NAME = 'server-room-monitor-cache-v1';
const urlsToCache = [
  'https://eloquent-cactus-989093.netlify.app/',
  'https://eloquent-cactus-989093.netlify.app/index.html',
  'https://eloquent-cactus-989093.netlify.app/history.html',
  'https://eloquent-cactus-989093.netlify.app/raw-data.html',
  'https://eloquent-cactus-989093.netlify.app/manifest.json',
  'https://eloquent-cactus-989093.netlify.app/icons/logo-192x192.png',
  'https://eloquent-cactus-989093.netlify.app/icons/logo-512x512.png'
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
