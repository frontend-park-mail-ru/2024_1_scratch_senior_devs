const CACHE_NAME = "app-cache"

const assetUrls = [
    "/",
    "/index.html",
    "/main.css",
    "/main.js",
    "/assets/"
]

self.addEventListener("install", async () => {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(assetUrls)
})

self.addEventListener("activate", async () => {
    const cacheNames = await caches.keys()
    await Promise.all(
        cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
    )
});

const tryNetwork = (request) => {
    return new Promise((fulfill, reject) => {
        fetch(request).then((response) => {
            fulfill(response);
            if (request.method === "GET") {
                update(request, response.clone());
            }
        }, reject);
    });
}

const fromCache = async (request) => {
    const cache = await caches.open(CACHE_NAME)
    return cache.match(request)
}

const update = async (request, response) => {
    const cache = await caches.open(CACHE_NAME)
    await cache.put(request, response)
}

self.addEventListener("fetch", (event) => {
    event.respondWith(
        tryNetwork(event.request).catch(() => fromCache(event.request)),
    );
});