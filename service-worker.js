const CACHE_NAME = 'lamic-apoiados-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'https://raw.githubusercontent.com/LaboratorioLamic/Dados/refs/heads/main/assents/logo.png',
    'https://raw.githubusercontent.com/LaboratorioLamic/Dados/refs/heads/main/assents/icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
