const CACHE = "2026-04-17-1";
importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js");

// on installation
self.addEventListener("install", (event) => {
	self.skipWaiting();
});

// on activation
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					// if the cache name isn't the current one, delete it
					if(cacheName !== CACHE){
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	self.clients.claim();
});

// on asset fetch
workbox.routing.registerRoute(
	new RegExp("/*"),
	new workbox.strategies.NetworkFirst({
		networkTimeoutSeconds: 3,
		cacheName: CACHE
	})
);