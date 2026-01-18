/**
 * Chidiya Udd PWA Service Worker
 * Provides offline support and caching for the game
 */

const CACHE_NAME = 'chidiya-udd-v1';
const STATIC_CACHE = 'chidiya-udd-static-v1';

// Assets to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/game.js',
  '/peer-multiplayer.js',
  '/manifest.json'
];

// External resources (cache with network fallback)
const externalResources = [
  'https://unpkg.com/peerjs@1.5.1/dist/peerjs.min.js',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Try to cache external resources (non-blocking)
        return caches.open(CACHE_NAME).then((cache) => {
          return Promise.allSettled(
            externalResources.map((url) => 
              fetch(url)
                .then((response) => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                })
                .catch(() => console.log('[SW] Could not cache:', url))
            )
          );
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // For PeerJS signaling server - always use network
  if (url.hostname.includes('peerjs') && url.pathname.includes('/peerjs')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // For navigation requests - serve index.html from cache
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then((response) => response || fetch(request))
        .catch(() => caches.match('/index.html'))
    );
    return;
  }
  
  // For static assets - cache first, then network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline fallback for HTML pages
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
