// Nazwa cache'u
const CACHE_NAME = 'courier-nav-cache-v1';

// Lista zasobów do zapisania w cache podczas instalacji
const urlsToCache = [
  '/',
  '/static/css/style.css',
  '/static/js/map.js',
  '/static/js/form.js',
  '/static/js/polyline.js',
  '/static/js/analytics.js',
  '/static/manifest.json',
  '/static/icons/icon-192x192.png',
  '/static/icons/icon-512x512.png',
  'https://cdn.replit.com/agent/bootstrap-agent-dark-theme.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Instalacja service workera
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache otwarte');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Błąd podczas cache\'owania zasobów:', error);
      })
  );
});

// Aktywacja service workera
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Usuń stare cache'e
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Obsługa żądań
self.addEventListener('fetch', event => {
  // Nie cache'uj żądań API
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('openrouteservice.org') ||
      event.request.url.includes('openweathermap.org')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Zwróć z cache, jeśli istnieje
        if (response) {
          return response;
        }
        
        // Sklonuj żądanie, ponieważ jest jednorazowe
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Sprawdź czy otrzymaliśmy prawidłową odpowiedź
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Sklonuj odpowiedź, ponieważ będzie używana przez przeglądarką i cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        }).catch(error => {
          // Obsługa błędów offline
          console.log('Brak połączenia z internetem, zwracanie odpowiedzi z cache');
          return caches.match('/offline.html');
        });
      })
  );
});

// Obsługa wiadomości (np. do wylogowania)
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Background sync dla offline'owych żądań
self.addEventListener('sync', event => {
  if (event.tag === 'sync-routes') {
    event.waitUntil(syncRoutes());
  }
});

// Funkcja do synchronizacji tras zapisanych offline
async function syncRoutes() {
  // Tu implementacja synchronizacji danych offline
  console.log('Synchronizowanie tras offline');
}