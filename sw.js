/* =========================================================
   Flavors of Sanqin · Shaanxi Food
   Service worker: keeps the site usable offline.
   After changing any page, bump CACHE so visitors get the new files.
   ========================================================= */

var CACHE = 'sanqin-v4';

// Core files — if one of these is missing the install fails, so keep it tight
var CORE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.webmanifest',
  './images/favicon.svg'
];

// Photos and icons: added one by one, a missing file doesn't break the install
var MEDIA = [
  './images/roujiamo.jpg',
  './images/yangrou-paomo.jpg',
  './images/biangbiang.jpg',
  './images/saozi-mian.jpg',
  './images/liangpi.jpg',
  './images/hulutou.jpg',
  './images/zenggao.jpg',
  './images/shizibing.jpg',
  './images/og-cover.jpg',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(CORE).then(function () {
        return Promise.all(MEDIA.map(function (url) {
          return cache.add(url).catch(function () { /* skip a missing photo */ });
        }));
      });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Serve from cache first (fast), refresh in the background (fresh)
self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(function (cached) {
      var fresh = fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(request, copy);
          });
        }
        return response;
      }).catch(function () {
        // Offline: fall back to cache, and to the home page for navigation
        return cached || caches.match('./index.html');
      });

      return cached || fresh;
    })
  );
});
