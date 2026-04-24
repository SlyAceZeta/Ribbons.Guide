const APP_CACHE = "app-2026-04-24-0";
const ASSET_CACHE = "assets-v1";

// helper function to create a timeout for fetch requests
const fetchWithTimeout = (request, timeoutSeconds) => {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new Error("Network timeout"));
		}, timeoutSeconds * 1000);
		
		fetch(request, { cache: "no-cache" }).then(
			(response) => {
				clearTimeout(timeoutId);
				resolve(response);
			},
			(error) => {
				clearTimeout(timeoutId);
				reject(error);
			}
		);
	});
};

// on installation
self.addEventListener("install", (event) => {
	// precache index.html for spinner
	event.waitUntil(
		caches.open(APP_CACHE).then((cache) => cache.addAll(["/", "/index.html"]))
	);
	
	self.skipWaiting();
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
	self.clients.claim();
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
			// load images and fonts from cache first to avoid flickering as much as possible
			if(isAsset && cached) return cached;
			
			// otherwise, pull from network with a 3 second timeout
			return fetchWithTimeout(event.request, 3).then((response) => {
				// ensure the asset was actually retrieved
				if(response.ok){
					const clone = response.clone();
					caches.open(targetCache).then(c => c.put(cacheKey, clone));
				}
				return response;
			}).catch(() => {
				// if network fails or times out, fall back to cache
				if(cached) return cached;
				// if cache was cleared and network failed, return error
				return new Response("Network timeout and no cache available.", { 
					status: 504, 
					statusText: "Gateway Timeout" 
				});
			});
		})
	);
});