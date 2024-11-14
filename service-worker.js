const CACHE_NAME = 'v1';
const urlsToCache = [
  'https://server-room-temp-monitor.netlify.app/',
  'https://server-room-temp-monitor.netlify.app/index.html',
  'https://server-room-temp-monitor.netlify.app/history.html',
  'https://server-room-temp-monitor.netlify.app/raw-data.html',
  'https://server-room-temp-monitor.netlify.app/manifest.json',
  'https://server-room-temp-monitor.netlify.app/icons/logo-192x192.png',
  'https://server-room-temp-monitor.netlify.app/icons/logo-512x512.png'
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

self.addEventListener("activate", (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
          return Promise.all(
              cacheNames.map((cache) => {
                  if (cache !== CACHE_NAME) {
                      return caches.delete(cache);
                  }
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
