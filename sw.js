const CACHE = "2026-04-04-0";

// basic UI
const PRECACHE = [
	"/",
	"/index.html",
	"/favicon.ico",
	"/manifest.json",
	"/fonts/NunitoSans-Regular.woff2",
	"/fonts/NunitoSans-Bold.woff2",
	"/js/jquery.min.js",
	"/js/select2.min.js",
	"/js/sortable.min.js",
	"/js/bootstrap.bundle.min.js",
	"/js/Dropbox-sdk.min.js",
	"/css/bootstrap.min.css",
	"/css/select2.min.css",
	"/css/themes.css",
	"/css/main.css",
	"/js/main.js"
];

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
	const url = new URL(event.request.url);
	
	// load images from cache first to avoid flickering as much as possible
	if(event.request.destination === "image"){
		event.respondWith(
			caches.match(event.request).then((cached) => {
				return cached || fetch(event.request).then((response) => {
					const clone = response.clone();
					caches.open(CACHE).then(c => c.put(event.request, clone));
					return response;
				});
			})
		);
		return;
	}
	
	// load everything else from the network first
	event.respondWith(
		fetch(event.request).then((response) => {
			const clone = response.clone();
			caches.open(CACHE).then(c => c.put(event.request, clone));
			return response;
		}).catch(() => caches.match(event.request))
	);
});