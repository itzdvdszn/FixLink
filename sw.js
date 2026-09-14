const CACHE = 'fixlink-pwa-v11';
const CORE = ['./','./index.html','./assistant.html','./assistant.js','./search.html','./search.js','./bookings.html','./messages.html','./profile.html','./settings.html','./pages.css','./styles.css','./script.js','./manifest.webmanifest','./assets/fixlink-logo.png','./assets/ac-technician.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => { if(e.request.method !== 'GET') return; e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => { const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r; }).catch(()=>caches.match('./index.html')))); });
