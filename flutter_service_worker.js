'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/assets/images/mobile_social_networks.png": "d38e52a49cb52c50dd1622ec16df43af",
"assets/assets/images/contact_us.png": "5e0df75b40d19d931dcc58e1d46b5d63",
"assets/assets/images/mobile_logo.png": "2b5567d92ef5cd8588e3ad98b1fa6154",
"assets/assets/images/mobile_background.png": "1646de85eea4a17100baa626ec185c11",
"assets/assets/images/mobile_footer_whatsapp.png": "27ab3cfb2d5c49b47be134c82b2d4b1c",
"assets/assets/images/drawer_instagram.png": "94733fa81eb21b250052093302fe9075",
"assets/assets/images/mobile_telecommunications.png": "cf20185c0b596afcceb1b8bffbe9df4f",
"assets/assets/images/mobile_about.png": "f450c0bc6810441f7785b12aaf691a7b",
"assets/assets/images/logo.png": "c1784da7de1446ad3505fc9a37230c8e",
"assets/assets/images/technical_visit_2.png": "623c921718a3b5db2c5b9c63038faac4",
"assets/assets/images/mobile-cost-section.png": "57b6ea9547fc7ed48c3212145ba9737e",
"assets/assets/images/technical_visit_1.png": "3d8860e9adbfe33eb4ed4e3b2884fc5c",
"assets/assets/images/technical_visit_3.png": "3a9faf75f02ee574e07a5dc37b229aee",
"assets/assets/images/mobile_contact_us.png": "2100b00b0aa77fdd15a3c06b3b2969a4",
"assets/assets/images/mobile_footer_instagram.png": "d2ffeda76c27dcc8104a88ea3295a9c1",
"assets/assets/images/whatsapp_drawer.png": "68b5a4297073b5e487eb136e0b8348b6",
"assets/assets/images/cost-image.png": "b483321008b276c2216a84484af39f8c",
"assets/assets/images/whatsapp_header.png": "13aeb1fe98be141385b76586e6b7fdf0",
"assets/assets/images/background.png": "fc17d9ba3dd1168d580f4ac09e6b2d3f",
"assets/assets/images/telecommunications.png": "c7c1782d96345286f428be9c6760ce13",
"assets/assets/images/instagram_header.png": "60f1d84b1fa6119437bbe8a76c6b5001",
"assets/NOTICES": "a30b7b1fa36957903d27fc4200f278cd",
"assets/FontManifest.json": "e506ab1e8dafd192b0dab9a6ba9c1c81",
"assets/fonts/Poppins-Medium.ttf": "f61a4eb27371b7453bf5b12ab3648b9e",
"assets/fonts/Poppins-Black.ttf": "0573b9231a8316427ad6e751b52e87a4",
"assets/fonts/Poppins-Bold.ttf": "a3e0b5f427803a187c1b62c5919196aa",
"assets/fonts/Poppins-SemiBold.ttf": "4cdacb8f89d588d69e8570edcbe49507",
"assets/fonts/Poppins-Regular.ttf": "8b6af8e5e8324edfd77af8b3b35d7f9c",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/AssetManifest.json": "f87a45aac45f5951033ac525158031f3",
"version.json": "59b34045ef8a10d14f81b962c1b142b2",
"manifest.json": "f8d15d5d07747ea6d65bc2b435c50217",
"img/tecnocable_favicon.png": "e82300edcad9c5dbf3a771c830359b83",
"img/splash-logo.png": "aeed4852f08c692a6aa41508651f5cdc",
"index.html": "498a482b56be78aede0ed1fb8b1c5d81",
"/": "498a482b56be78aede0ed1fb8b1c5d81",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"styles.css": "fbd63375b815e371c4d95cdfacad1a40",
"main.dart.js": "d1fcf3455617ff08fa912b92fc486346",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
