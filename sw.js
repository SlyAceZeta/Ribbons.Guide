const CACHE = "2025-10-15-0";
importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js");
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