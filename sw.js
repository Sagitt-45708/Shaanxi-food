/* =========================================================
   陕西美食 · 三秦味道
   Service Worker：让页面离线也能打开
   注意：改了页面内容后，把 CACHE 版本号 +1，用户才会拿到新版。
   ========================================================= */

var CACHE = 'sanqin-v3';

// 核心文件：缺一个就装不上，所以只放一定存在的
var CORE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.webmanifest',
  './images/favicon.svg'
];

// 图片：单独加载，某张缺失也不影响安装
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
          return cache.add(url).catch(function () { /* 单张失败就跳过 */ });
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

// 先给缓存（快），同时在后台更新（新）
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
        // 断网：有缓存用缓存，导航请求兜底到首页
        return cached || caches.match('./index.html');
      });

      return cached || fresh;
    })
  );
});
