/**
 * Chidiya Udd PWA Service Worker
 * Minimal version - no aggressive caching to ensure updates are always reflected
 */

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  // Clear all old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first strategy - always fetch from network, no caching
self.addEventListener('fetch', (event) => {
  // Just pass through to network, no caching
  event.respondWith(fetch(event.request));
});
