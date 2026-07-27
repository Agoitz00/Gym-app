// TPV Hostelería — Service Worker v3
// Estrategia: cache-first assets, network-first API, offline fallback HTML
const CACHE = 'tpv-v3';
const ASSETS = [
  '/tpv', '/cocina', '/login',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS).catch(()=>{}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // SSE — nunca cachear
  if (url.pathname === '/api/events') return;

  // API — Network first, 503 offline
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({error:'Sin conexión',offline:true}),
          {headers:{'Content-Type':'application/json'},status:503})
      )
    );
    return;
  }

  // Fotos de productos — Cache first + background update
  if (url.pathname.startsWith('/uploads/') || url.pathname.startsWith('/icons/')) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const hit = await cache.match(e.request);
        const net = fetch(e.request).then(r=>{if(r.ok)cache.put(e.request,r.clone());return r;}).catch(()=>null);
        return hit || await net || new Response('',{status:404});
      })
    );
    return;
  }

  // HTML + assets — Stale-while-revalidate
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const hit = await cache.match(e.request);
      const net = fetch(e.request).then(r=>{if(r.ok)cache.put(e.request,r.clone());return r;}).catch(()=>null);
      if (hit) { net.catch(()=>{}); return hit; }
      const fresh = await net;
      if (fresh) return fresh;
      // Offline fallback
      if (e.request.headers.get('accept')?.includes('text/html')) {
        return (await cache.match('/tpv')) || new Response(
          `<!DOCTYPE html><html><head><meta charset=UTF-8><meta name=viewport content="width=device-width,initial-scale=1">
          <title>Sin conexión</title><style>body{font-family:sans-serif;background:#0f0e0c;color:#f0ead8;display:flex;align-items:center;justify-content:center;height:100dvh;flex-direction:column;gap:1rem;text-align:center;padding:1.5rem}</style></head>
          <body><div style="font-size:3rem">📡</div><h2>Sin conexión</h2>
          <p style="color:#8a8070;max-width:280px">Comprueba que el servidor TPV está encendido y en la misma red WiFi.</p>
          <button onclick="location.reload()" style="padding:11px 24px;background:#c8a96e;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;color:#0f0e0c">↻ Reintentar</button>
          </body></html>`,
          {headers:{'Content-Type':'text/html'}}
        );
      }
      return new Response('',{status:503});
    })
  );
});

self.addEventListener('message', e => {
  if (e.data==='skipWaiting') self.skipWaiting();
});
