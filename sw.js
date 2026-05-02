const APP_CACHE = "app-2026-05-02-1";
const ASSET_CACHE = "assets-v1";

// on installation
self.addEventListener("install", (event) => {
	// precache index.html
	const requests = ["/", "/index.html"].map(
		(url) => new Request(url, { cache: "no-cache" })
	);
	
	event.waitUntil(
		caches.open(APP_CACHE).then((cache) => cache.addAll(requests))
	);
});

// on activation
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					// if this is not a current cache, delete it
					if(cacheName !== APP_CACHE && cacheName !== ASSET_CACHE){
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// on asset fetch
self.addEventListener("fetch", (event) => {
	// ignore requests that aren't fetching an asset (such as POST requests to APIs)
	if(event.request.method !== "GET") return;
	
	// normalize "/" to "/index.html" to avoid duplicating them
	const url = new URL(event.request.url);
	const cacheKey = (url.pathname === "/") ? "/index.html" : event.request;
	
	// store images and fonts in a dedicated cache since they rarely change
	const isAsset = event.request.destination === "image" || event.request.destination === "font";
	const targetCache = isAsset ? ASSET_CACHE : APP_CACHE;
	
	event.respondWith(
		caches.match(cacheKey).then((cached) => {
			// load everything from cache first if it exists
			if(cached) return cached;
			
			// otherwise, fetch from network, cache, and return
			return fetch(event.request).then((response) => {
				if(response.ok){
					const clone = response.clone();
					caches.open(targetCache).then(c => c.put(cacheKey, clone));
				}
				return response;
			}).catch(() => {
				// if user is offline and this asset isn't cached, fail
				return new Response("Asset offline", { status: 503, statusText: "Service Unavailable" });
			});
		})
	);
});

// on message received from app
self.addEventListener("message", (event) => {
	if(event.data && event.data.type === "SKIP_WAITING"){
		self.skipWaiting();
	}
});