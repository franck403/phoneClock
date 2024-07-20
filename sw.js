// Define the cache name and an array of resources to cache
const CACHE_NAME = 'clock-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/offline.html'
];

// Install event listener: Cache the static resources during installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Fetch event listener: Handle requests based on network availability
self.addEventListener('fetch', event => {
  event.respondWith(
    // Try to fetch the content from the server
    fetch(event.request).catch(() => {
      // If fetch fails (user is offline), look for a cached version
      return caches.match(event.request).then(response => {
        if (response) {
          return caches.match('/offline.html');
        }
        // If both cache and network fail, show a custom offline page (for navigate requests)
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
      .then(networkResponse => {
        if (networkResponse && networkResponse.ok) {
          // If the content is successfully fetched from the server, update the cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
        }
        return networkResponse;
      })
  );
});
