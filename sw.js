const C = 'binaa-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html'])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.startsWith('blob:') || e.request.url.startsWith('data:')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok || res.type === 'opaque') { const cl = res.clone(); caches.open(C).then(c => c.put(e.request, cl)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
