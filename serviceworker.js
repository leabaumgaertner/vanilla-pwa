const assets = [
  "/",
  "styles.css",
  "app.js",
  "sw-register.js",
  "https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
];

self.addEventListener("install", (event) => {
  // browser should wait to kill the service worker until they cached all
  event.waitUntil(
    caches.open("assets").then((cache) => {
      cache.addAll(assets);
    })
  );
});

// This pattern is called cache first
self.addEventListener("fetch", (event) => {
  // Path always needs to be absolute
  if (event.request.url == "http://localhost:3000/fake") {
    const response = new Response("Hello, itsa me");
    event.respondWith(response);
  } else {
    // We want to try and see if the request is cached
    caches.open("assets").then((cache) => {
      cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // It's a cache HIT
          return cachedResponse;
        } else {
          // It's a cache MISS
          return fetch(evemt.request);
        }
      });
    });
  }
});
