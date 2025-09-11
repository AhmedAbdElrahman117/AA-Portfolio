'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "324cb8d5d789db6aeeebdd532c2ef0da",
"assets/AssetManifest.bin.json": "be71abca7983027a52f9a8a8e6395c5e",
"assets/AssetManifest.json": "cbd8f0dc03c634f6586d1bd70ddd9ea3",
"assets/assets/attend_sys/1.png": "ec41b15233630f3ee54494b777b633ab",
"assets/assets/attend_sys/2.png": "ad99ec2bb947bdfafa90b13f0745f7ce",
"assets/assets/attend_sys/3.png": "682294788bd8bed21eb6493109a7b7cf",
"assets/assets/attend_sys/4.png": "05670427dca8bab47509e8c7619ecd90",
"assets/assets/attend_sys/5.png": "8ecc9d61feeb2b23ad9f1023cbfa00f5",
"assets/assets/attend_sys/icon.png": "05ff0750b061899eb4971057612cd7f3",
"assets/assets/auth/1.png": "80d36cb6d40f3e84c1e76af5e43d81aa",
"assets/assets/auth/2.png": "d5978d7d9437190cd8c023fa5411ff59",
"assets/assets/auth/3.png": "fe9787f9b450e7b9419abcdb99265f4a",
"assets/assets/auth/logo.png": "83682a282e0b398aa8695c51b9ae7473",
"assets/assets/background.jpg": "75b5e31cb22747c501d9ff7539d4658f",
"assets/assets/background2.svg": "355668d54e575f924d8c38775fdb6adf",
"assets/assets/Certificates/beginner.jpg": "45e387f04056a0a88d680b15417ebc8f",
"assets/assets/Certificates/BlocAndMVVM.jpg": "522bbcd33abd8fdd67c2c9aeb97c5507",
"assets/assets/Certificates/CleanArchitecture.jpg": "6908d4884422ce4de8a426c19e0fd0a0",
"assets/assets/Certificates/gitAndGithub.jpg": "b36a19a9223d69e16cb509ac922f3636",
"assets/assets/Certificates/paymentIntegration.jpg": "0d1ab48b0db2066e95738219a5527ebb",
"assets/assets/Certificates/responsiveUI.jpg": "4fbd0618d2f7f7d07602faa869d65543",
"assets/assets/chat/1.png": "fa3ca58ff1d41437b0a7d099be9eabc7",
"assets/assets/chat/2.png": "131156af79d062a9d12e8c8dd2290b6e",
"assets/assets/chat/3.png": "37d809947840e10ba706ea20dd008d88",
"assets/assets/chat/4.png": "e08ce5577a555919fba5a95e1c839076",
"assets/assets/chat/5.png": "e6dffd34ab06f52fc0e323b433588f31",
"assets/assets/chat/6.png": "a2e1937a9719eb7a667e0171899c05a7",
"assets/assets/chat/7.png": "14554002e14afcf7c8a1d490cdefde7d",
"assets/assets/chat/8.png": "cdd6d73ebc5e8f5a36f4a3942f1736b4",
"assets/assets/chat/logo.png": "45d725b5a337320b08f9cf55fd96c96a",
"assets/assets/CV.pdf": "86930f37e1d43a111604fba7a394f00c",
"assets/assets/images.jpeg": "9e164449f1fe8e8c4b596099e17f7cd3",
"assets/assets/me.webp": "67717f0a43230b11d384992538bbc73f",
"assets/assets/my%2520news/1.png": "b271a0c3bf7f5ec507178fcbdb7a7f33",
"assets/assets/my%2520news/icon.png": "28ae1f25a6c35deadb4677fad3b3b61e",
"assets/assets/portfolio.png": "58b703ca0837ca9054e7479cb4aa9884",
"assets/assets/ProgrammingComputer.json": "7eed0f68676c339fe175a5c357c17682",
"assets/assets/qurany/1.png": "c4b4ea1516822a270ae2a1d9b69b77d7",
"assets/assets/qurany/10.png": "c425a4c3087ae4f99a2bd5bd97c456a7",
"assets/assets/qurany/11.png": "62123fcd0da8bc3a4f8c531f48ef6ded",
"assets/assets/qurany/2.png": "4fde41f505f743e0ff80d33039b2f6d5",
"assets/assets/qurany/3.png": "a7457bb7135f55532a9fc6e6266d4e18",
"assets/assets/qurany/4.png": "9fbca55f5a9e2bf8dc04557f42838e6b",
"assets/assets/qurany/5.png": "6187a8f736fc103d169a2b6666a71f67",
"assets/assets/qurany/6.png": "f101d0a05bd6a96bc395d74ca502c546",
"assets/assets/qurany/7.png": "047a4a0ca21ad1b720f370f874d2e87d",
"assets/assets/qurany/8.png": "48075ff42467367ec0c23018efe25b7f",
"assets/assets/qurany/9.png": "17d18960cd2aaf536fd18ebacb1cc0e5",
"assets/assets/qurany/Logo.png": "4d3d6407bd13970a3ac9e8331cacdc66",
"assets/assets/TechStack/android.png": "94d7ab9277da2dd25bb536454ab2a6eb",
"assets/assets/TechStack/API.png": "be15431e3e823c19b9ce0150394721eb",
"assets/assets/TechStack/Cpp.png": "689efd61dd8e4be98b895ae542f9be9c",
"assets/assets/TechStack/dart.png": "1aef77e06bc23c58240a192da2fb596f",
"assets/assets/TechStack/figma.png": "ab581cb31193f6c6cf87d442779399ee",
"assets/assets/TechStack/firebase.png": "9ed79d8d77f3aab27b935896f7258479",
"assets/assets/TechStack/Flutter.png": "fb205cfc040c90b28e00bdb8451e08b8",
"assets/assets/TechStack/getx.png": "a129413bae6a9c048b4fc24c277fa6f7",
"assets/assets/TechStack/github.png": "0577f0bd7cd32d6043472716478fba67",
"assets/assets/TechStack/githubActions.png": "b71c0a1893a84365b491affd86d6eed1",
"assets/assets/TechStack/google_maps.png": "d4985b0b3d9e332a656eb81639856039",
"assets/assets/TechStack/Kotlin.png": "3f3182e761cf45dcd05a2e745f917ce4",
"assets/assets/TechStack/Laravel.png": "f23db4528f0441f4b191d3d2d76cab70",
"assets/assets/TechStack/mySql.png": "0c96e3afcef940610f6317a792344f0e",
"assets/assets/TechStack/Postgresql.png": "f0dbae579751541dd568eab41880c285",
"assets/assets/TechStack/postman.png": "94e8970bcc6123741122b19a42dc5e47",
"assets/assets/TechStack/qt.png": "6958354410c37ea6d06178eed49fc878",
"assets/assets/TechStack/sdk.webp": "f52c72b2d0d2320ac93364d67f56b8b9",
"assets/assets/TechStack/sqlite.png": "f697ba0c9244a5495766983a27636ff4",
"assets/assets/TechStack/supabase.png": "31897aca639035129bcaa32db7d0edb4",
"assets/assets/uccd/1.jpg": "0797dea07ffe90bb1977e4f7e6e18550",
"assets/assets/uccd/10.jpg": "9d4b055b816952bf4527fce0bc9463b4",
"assets/assets/uccd/11.jpg": "f455992e5afcf6e14da12310d5f6cf48",
"assets/assets/uccd/12.jpg": "5a69cca321ac17dfbe304d484b4f9848",
"assets/assets/uccd/13.jpg": "0c1f5d33b5c78d3c9827f9c45baa0908",
"assets/assets/uccd/14.jpg": "4f48a3309710478246a94ca4a6fe9fff",
"assets/assets/uccd/15.jpg": "3a5364712b709e3d9afaa56e7cec12de",
"assets/assets/uccd/16.jpg": "78c0555f248d3a31c30caf6c32d0b756",
"assets/assets/uccd/17.jpg": "25759c3ff1b15976c69c4a5c173eaa87",
"assets/assets/uccd/18.jpg": "31431a4f8c693bed6ec7d87caf9e47a8",
"assets/assets/uccd/2.jpg": "9b9cbaf044c7db08fd1780a2349758cb",
"assets/assets/uccd/3.jpg": "7201ca77257015b14eacf5678d279230",
"assets/assets/uccd/4.jpg": "9f890a9d32f83a8f299b08f2705a68d0",
"assets/assets/uccd/5.jpg": "227a24e82d00a99dc5270152f44eee89",
"assets/assets/uccd/6.jpg": "7b97264ae854e8b57a5d5483061b98d7",
"assets/assets/uccd/7.jpg": "a9f931e3edd0577632c3db75796168dc",
"assets/assets/uccd/8.jpg": "668550b8701817bdffff20b5aa973ee6",
"assets/assets/uccd/9.jpg": "897976ffeb588ba2fed962101c976780",
"assets/assets/uccd/UCCDLOGO.png": "33c7baae667e68ef31e655459b59c43b",
"assets/FontManifest.json": "97c2528ecc2fbf4093965257fdba1854",
"assets/fonts/MaterialIcons-Regular.otf": "e5c176e637d8a4e12e3afabd44828602",
"assets/NOTICES": "e1790e376faae0b471826704cfbf3523",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Brands-Regular-400.otf": "524347b421b6cd442eff41f9a66d2517",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Free-Regular-400.otf": "df86a1976d76bd04cf3fcaf5add2dd0f",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Free-Solid-900.otf": "a480860273615ad7549db4649ac96f38",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"CV.pdf": "86930f37e1d43a111604fba7a394f00c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"flutter_bootstrap.js": "34c537bf5320752a5e5bbc2c4fc55429",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "06508cb269803cd116183356f53bbcfc",
"/": "06508cb269803cd116183356f53bbcfc",
"main.dart.js": "e50f9e9b535e8dc52da74abe272212b9",
"manifest.json": "b2e4121448cd084e02d443dd372f614e",
"portfolio.png": "58b703ca0837ca9054e7479cb4aa9884",
"version.json": "536dc42524442522d15a255b5eeebed3"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
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
        // Claim client to enable caching on first launch
        self.clients.claim();
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
      // Claim client to enable caching on first launch
      self.clients.claim();
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
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
