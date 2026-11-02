/* 1001 — çevrimdışı önbellek (iPhone ana ekran uygulaması). Uygulama dosyaları önbellekten, Gemini/Google istekleri her zaman ağdan. */
var SURUM = '1001-v1';
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(SURUM).then(function (c) { return c.addAll(['./', 'index.html', 'manifest.webmanifest']); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (l) { return Promise.all(l.filter(function (k) { return k !== SURUM; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || /googleapis\.com$/.test(u.hostname) || /\/_blob\//.test(u.pathname)) return;
  var cdn = /cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.(googleapis|gstatic)\.com/.test(u.hostname);
  if (u.origin !== location.origin && !cdn) return;
  // önce ağ (güncel sürüm), ağ yoksa önbellek
  e.respondWith(fetch(e.request).then(function (r) { if (r.ok || r.type === 'opaque') { var k = r.clone(); caches.open(SURUM).then(function (c) { c.put(e.request, k); }); } return r; })
    .catch(function () { return caches.match(e.request, { ignoreSearch: u.origin === location.origin && /index\.html$/.test(u.pathname) }); }));
});
