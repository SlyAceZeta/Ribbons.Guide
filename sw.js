const CACHE = "2026-04-17-1";

const PRECACHE = [
	"/",
	"/index.html"
];

// helper function to create a timeout for fetch requests
const fetchWithTimeout = (request, timeoutSeconds) => {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new Error("Network timeout"));
		}, timeoutSeconds * 1000);
		
		fetch(request).then(
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
	// precache basic UI
	event.waitUntil(
		caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
	);
	
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
self.addEventListener("fetch", (event) => {
	// ignore requests that aren't fetching an asset (such as POST requests to APIs)
	if(event.request.method !== "GET") return;
	
	// normalize "/" to "/index.html" to avoid duplicating them
	const url = new URL(event.request.url);
	const cacheKey = (url.pathname === "/") ? "/index.html" : event.request;
	
	// load images from cache first to avoid flickering as much as possible
	if(event.request.destination === "image"){
		event.respondWith(
			caches.match(cacheKey).then((cached) => {
				return cached || fetch(event.request).then((response) => {
					// ensure the image was actually retrieved
					if(response && response.status === 200 && response.ok){
						const clone = response.clone();
						caches.open(CACHE).then(c => c.put(cacheKey, clone));
					}
					return response;
				});
			})
		);
		return;
	}
	
	// load everything else from the network first, but if 3 seconds have passed with no response, time out and fall back on cache
	event.respondWith(
		fetchWithTimeout(event.request, 3).then((response) => {
			// ensure the asset was actually retrieved
			if(response && response.status === 200 && response.ok){
				const clone = response.clone();
				caches.open(CACHE).then(c => c.put(cacheKey, clone));
			}
			return response;
		}).catch(() => {
			// if network fails or times out, fall back to cache
			return caches.match(cacheKey);
		})
	);
});