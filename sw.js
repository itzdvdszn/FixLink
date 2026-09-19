const CACHE = 'fixlink-pwa-v12';

const CORE = [
  './',
  './index.html',
  './assistant.html',
  './assistant.js',
  './search.html',
  './search.js',
  './bookings.html',
  './messages.html',
  './profile.html',
  './settings.html',
  './pages.css',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './assets/fixlink-logo.png',
  './assets/ac-technician.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
