// sw.js
// ============================================================
// Minimale service worker. Het enige doel hiervan is te voldoen aan
// Chrome/Android's technische eis voor "installeerbaarheid" (een
// geregistreerde service worker met een fetch-listener) -- er wordt
// bewust NIETS gecachet of onderschept. Alle verzoeken (naar de app
// zelf én naar DeepSeek/Claude) gaan gewoon rechtstreeks door, exact
// zoals zonder deze service worker. Dit voorkomt dat een verouderde
// cache ooit een oud antwoord of een oude API-aanroep zou tonen.
// ============================================================

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Bewust een pass-through: gewoon het normale netwerkverzoek laten gebeuren.
  event.respondWith(fetch(event.request));
});
