const CACHE = "2025-10-04-1";
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");
self.addEventListener("install", (event) => {
	self.skipWaiting();
});
workbox.routing.registerRoute(
	new RegExp("/*"),
	new workbox.strategies.NetworkFirst({
		networkTimeoutSeconds: 3,
		cacheName: CACHE
	})
);