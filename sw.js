const CACHE_NAME = 'diy-pro-assistant-v1';
// List of all files that make up the app shell
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/services/geminiService.ts',
  '/hooks/useFavorites.ts',
  '/components/common/PwaInstallBanner.tsx',
  '/components/common/Spinner.tsx',
  '/components/common/Card.tsx',
  '/components/Header.tsx',
  '/components/FormattedResponse.tsx',
  '/components/Footer.tsx',
  '/components/views/GuideDetailView.tsx',
  '/components/views/GuidesView.tsx',
  '/components/views/FavoritesView.tsx',
  '/components/views/HomeView.tsx',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/@google/genai@^1.10.0',
  'https://esm.sh/react-dom@^19.1.0/client',
  'https://esm.sh/react@^19.1.0',
  'https://esm.sh/lucide-react@^0.525.0'
];

// On install, cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch(err => console.error("Cache addAll failed. Some assets might not be available offline.", err))
  );
});

// On fetch, use a network-first strategy for API calls, and cache-first for everything else.
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Always go to the network for API calls to our serverless function.
  // This ensures we always get fresh data and don't cache API responses.
  if (requestUrl.pathname.startsWith('/.netlify/functions/')) {
    return event.respondWith(fetch(event.request));
  }

  // For all other requests (app shell, static assets), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If we have a match in the cache, return it.
        if (response) {
          return response;
        }
        // If no match, fetch from the network.
        return fetch(event.request);
      })
  );
});


// On activate, remove old caches to free up space
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
