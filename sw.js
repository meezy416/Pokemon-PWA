const CACHE_DATA = "offline-data";
const STACTIC_RESOURCES = ["index.html", "app.js", "logo.png"];

// Install the SW
self.addEventListener("install", async (e) => {
  console.log("SW install");

  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_DATA);
      return await cache.addAll(STACTIC_RESOURCES);
    })()
  );

  self.skipWaiting();
});

// Listen for fetching request
self.addEventListener("fetch", async (e) => {
  console.log(`SW fetch ${e.request.url}`);

  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_DATA);

      try {
        const networkResponse = await fetch(e.request);
        await cache.put(e.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(e.request);
        return cachedResponse;
      }
    })()
  );
});

// Activate the SW
self.addEventListener("activate", async (e) => {
  console.log("SW activate");
}); //
