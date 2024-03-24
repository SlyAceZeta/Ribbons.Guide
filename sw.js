/* https://github.com/codepo8/github-page-pwa */
var CACHE_PREFIX = "ribbonsguide_";
var VERSION = "2024-03-24--0";
var CACHE_NAME = CACHE_PREFIX + VERSION;

self.addEventListener("fetch", function(e){
	e.respondWith(
		caches.match(e.request).then(function(request){
			if(request){
				return request;
			} else {
				return fetch(e.request);
			}
		});
	);
});

self.addEventListener("install", function(e){
	e.waitUntil(
		caches.open(CACHE_NAME).then(function(cache){
			return cache.addAll("/*");
		});
	);
});

self.addEventListener("activate", function(e){
	e.waitUntil(
		caches.keys().then(function(keyList){
			var cacheWhitelist = keyList.filter(function(key){
				return key.indexOf(CACHE_PREFIX);
			});
			cacheWhitelist.push(CACHE_NAME);
			return Promise.all(keyList.map(function(key, i){
				if(cacheWhitelist.indexOf(key) === -1){
					return caches.delete(keyList[i]);
				}
			}));
		});
	);
});