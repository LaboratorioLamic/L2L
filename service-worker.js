// Service Worker for Lamic Apoiados PWA
const CACHE_NAME = 'lamic-apoiados-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assents/icon.png',
    '/assents/logo.png',
    '/offline.html',
    'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Cache addAll failed:', error);
            })
    );
    // Force the Service Worker to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('Service Worker activated');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    // Skip caching for external URLs not in urlsToCache
    const isExternalUrl = !urlsToCache.includes(event.request.url) && event.request.url.startsWith('http');
    if (isExternalUrl && !event.request.url.includes('LaboratorioLamic')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return new Response('Offline: Unable to fetch resource.', { status: 503 });
                })
        );
        return;
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(networkResponse => {
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline page for HTML requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                        return new Response(
                            '<html><body><h1>Offline</h1><p>Você está offline. Por favor, conecte-se à internet para acessar este conteúdo.</p></body></html>',
                            {
                                headers: { 'Content-Type': 'text/html' },
                                status: 503
                            }
                        );
                    });
            })
    );
});
