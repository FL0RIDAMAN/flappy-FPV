// Service worker for Flappy FPV.
//
// A service worker is a small script the browser keeps running in the background for this site.
// It sits between the page and the network, which lets it keep a copy of the game's files so the
// game still opens when the phone has no signal.
//
// Strategy: NETWORK FIRST. Every request goes to GitHub first and the fresh copy is saved to the
// cache; the cache is only used when the network fails (offline) or takes too long. That way you
// always see the newest version after you push an update, and never get stuck on a stale one.

const CACHE = 'flappy-fpv-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];
const NETWORK_TIMEOUT_MS = 4000;

// install: runs once when the browser first sees this file (or a changed version of it).
// Pre-caches everything the game needs so it works offline right away.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// activate: clean up caches left behind by older versions (if CACHE above is ever renamed).
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// cache: 'no-cache' makes the browser re-check with GitHub every time instead of trusting its own
// HTTP cache (GitHub tells browsers a file is good for 10 minutes, which is exactly how long an
// update would otherwise appear to be "missing"). GitHub answers "not modified" cheaply when
// nothing changed, so this costs almost nothing.
function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('network timeout')), ms);
    fetch(request, { cache: 'no-cache' }).then(res => { clearTimeout(timer); resolve(res); }, err => { clearTimeout(timer); reject(err); });
  });
}

// fetch: runs for every file the page asks for.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetchWithTimeout(req, NETWORK_TIMEOUT_MS);
      if (fresh && fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      // Opening the game itself while offline: hand back the cached page.
      if (req.mode === 'navigate') {
        const page = await cache.match('./index.html');
        if (page) return page;
      }
      throw err;
    }
  })());
});
