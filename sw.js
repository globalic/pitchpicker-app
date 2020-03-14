const cacheName = 'v1';

const cacheAssets	= [
	'/',
	'/manifest/manifest.json',
	'/css/styles.css',
	'/images/applogo.jpg',
	'/images/equipment.jpg',
	'/images/football.jpg',
	'/images/footballpitch.jpg',
	'/images/logo.png',
	'/images/playingfootball.jpg',
	'/js/fbase.js',
	'/js/main.js',
	'/js/map.js'
];

//call install event
self.addEventListener('install', event => {
	console.log('Service Worker: Installed');
	event.waitUntil(
	caches.open(cacheName).then(function(cache) {
		console.log('Service Worker: Caching App');
		cache.addAll(cacheAssets);
	})
	.catch(err => console.log('Caching Error:', err))
	);
});

//call activate event
self.addEventListener('activate', event => {
	console.log('Service Worker: Activated');
	//remove unwanted caches
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cache => {
					if(cache !== cacheName) {
						console.log('Service Worker: Clearing Old Cache');
						return caches.delete(cache);
					}
				})
			)
		})
	);
});

//Call Fetch event
self.addEventListener('fetch', event => {
	console.log('Service Worker: Fetching');
	event.respondWith(
			fetch(event.request).catch(() => caches.match(event.request)));
});