// Define the cache name and an array of resources to cache
const CACHE_NAME = 'clock-v1';
const URLS_TO_CACHE = [
  '/phoneClock/',
  'index.html',
  'style.css',
  'offline.html'
];

var externalAssets = ['boxicon.min.css']
var externalAssetsURl = ['https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css']

function addExternalAsset(name,url) {
  externalAssets.push(name.replaceAll('/',''))
  externalAssetsURl.push(url)
}

// Install event listener: Cache the static resources during installation
self.addEventListener('install', event => {
    event.waitUntil(
    caches.open('external-assets').then(cache => {
      // cache the external-assets
      return cache.addAll(externalAssetsURl);
    })
  );
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  
});
function externalAssetsFunc(event) {
        const url = event.request.url.replace('/externalAsset/','').replaceAll('/','')
        event.respondWith(
          caches.match(externalAssetsURl[externalAssets.indexOf('boxicon.min.css')]).then(response => {
            return response;
          })
        );
}

// Fetch event listener: Handle requests based on network availability
self.addEventListener('fetch', event => {
  event.respondWith(
    // Try to fetch the content from the server
    fetch(event.request).catch(() => {
      console.log(event.request.url)
      if (event.request.url.includes('/externalAsset/')) {
          return externalAssetsFunc(event)
      }
      return caches.match(event.request).then(response => {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
      .then(networkResponse => {      
        console.log(event.request.url)
        if (event.request.url.includes('/externalAsset/')) {
            return externalAssetsFunc(event)
        }
        if (networkResponse && networkResponse.ok) {
          caches.open(CACHE_NAME)
            .then(cache => {
              try {
                cache.put(event.request, networkResponse.clone());                
              } catch {
                console.log('elements already added')
              }
            });
        }
        return networkResponse;
      })
  );
});
