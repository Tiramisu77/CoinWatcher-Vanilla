/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.1.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.1.1"});

importScripts(
  "precache-manifest.d7a9a42d948bb6b247dfc903424ede64.js"
);

workbox.core.skipWaiting();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));

workbox.routing.registerRoute(/https:\/\/api.coingecko.com\/api\/v3\/coins\/list|https:\/\/api.coingecko.com\/api\/v3\/simple\/supported_vs_currencies/, new workbox.strategies.CacheFirst({ "cacheName":"coinwatcher-coingecko-v3-lists", plugins: [new workbox.expiration.Plugin({ maxAgeSeconds: 518400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/(https:\/\/api.coingecko.com\/api\/v3\/coins\/)(?!list)/, new workbox.strategies.NetworkFirst({ "cacheName":"coinwatcher-coingecko-v3-coins", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
