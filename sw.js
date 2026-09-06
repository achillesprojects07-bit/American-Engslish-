const CACHE='american-accent-v1';
const ASSETS=['./','./index.html','./css/app.css','./manifest.json','./content/curriculum.js','./content/day0.js','./content/day1.js','./content/stress-bank.js','./content/reduction-bank.js','./js/storage.js','./js/recording-engine.js','./js/lesson-engine.js','./js/app.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('fetch',event=>event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request))));