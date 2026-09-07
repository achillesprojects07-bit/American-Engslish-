const CACHE='american-accent-v3';
const ASSETS=['./','./index.html','./css/app.css','./manifest.json','./content/curriculum.js','./content/day0.js','./content/day1.js','./content/stress-bank.js','./content/reduction-bank.js','./js/storage.js','./js/recording-engine.js','./js/lesson-engine.js','./js/app.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});