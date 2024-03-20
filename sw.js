const CACHE = "pwabuilder-offline";

importScripts("js/workbox-sw.js");

self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

workbox.routing.registerRoute(
	new RegExp("/*"),
	new workbox.strategies.NetworkFirst({
		cacheName: CACHE
	})
);