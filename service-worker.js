// service-worker.js - Versão mínima para PWA instalável
const CACHE_NAME = 'lamic-apoiados-v1';
const urlsToCache = [
  '/',  // Página principal
  '/manifest.json',  // Manifest
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',  // CSS externo
  'https://raw.githubusercontent.com/LaboratorioLamic/L2L/refs/heads/main/assents/logo.png',  // Logo
  'https://raw.githubusercontent.com/LaboratorioLamic/L2L/refs/heads/main/assents/icon.png'  // Ícone
  // Adicione mais URLs se quiser cachear (ex: info.json)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});