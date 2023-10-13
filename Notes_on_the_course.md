## Scope and Display

- The scope will set the scope of the PWA, but if you have several domains you can't include them in the scope as of now
- The other domains will be treated like external sources.
- Keep everything under one domains

- For others you can integrate a webview to let people login with google for instance

- The start URL must be of the same URL as the web manifest
- Another start URL will be ignored and you won't pass the PWA criteria

- The theme color in the manifest will be the fallback if we don't have a color specified in the meta tag

- The most important property in the manifest is the display tag. If we say
"display": "browser" - we explicitly say we don't want a PWA
- Another option is "display": "standalone" (9 out of 10 PWAs use that)

- And we also have the option "minimal-ui" - squoosh uses standalone but youtube music uses minimal ui
- iOS does not support minimal-ui, so it will fallback to browser

Finally we have "fullscreen" - that is only suitable for Android

## Icons 
- Icon must be at least 512 by 512, square and png as pngs are the only ones wildly supported.
- SVG is not fully supported yet but maybe in the future - still need a fallback png 
- Icons can also come from a CDN
- Apple ignores the icons provided in the manifest (just uses a screenshot)
- So alternatively we need to add a tag in the header 
<link rel="apple-touch-icon" href="icons/icon-512.png">

For icons make sure that they are maskable and have a safe space area padding

Summary:
- Format: PNG, sRGB
- Used on android and desktop OS
- if not icon is provided it will pick the closest one
- Recommended sizes
	at least 192 x 192, 512 x 512
	possinly but not necessarly 384 x 384, 1024x1024
	depracted sizes are 72x72 and 152x152
	Simple versions 96x96 and 144x144

- We can't refresh the app tho - gotta delete and download again.

## Shortcut VS WebAPK

Shortcuts on Android
- Creates a shortcut to browser's engine 
- Browser's badge (Android 8+)
- Is installed only in the homescreen (does not appear in the app list)
- No icon in the launcher
- All browsers use that by default

To make it look better, we have to make a WebAPK
- and we only get that if we pass the PWA criteria
- full native android package
contains only the apps name, icon and url
APK is installed silently, no warnings, no messages
Icon goes to the home screen
- This works only with google chrome on devices with play services
(not huawai with chrome then its gonna make a shortcut
- Samsung Internet on Samsung device

## App Shell UI Spacing
- We don't want the user to be able to copy everything in our app.
- Disable user select on some parts with css
  user-select: none;
  -webkit-user-select: none;
  
- How can we work around the unsafe area in the PWA?
One option is to use the media query

@media (display-mode: standalone) {
	body>#toolbar {
		padding-bottom: 32px;
	}
}

This is not the best idea yet because there are some iPhones or Androids that don't have the unsafe areas...
There is this other solution to add variable margin depending on the environmental safe area
with

padding: env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom, 5px) // we can add default margin if no safe area detected
env(safe-area-inset-left) !important

For the landscape mode, in order to take up all the available space, we need to add a meta tag for the content that is:
<meta name="viewport" content="width=device-width,viewport-fit=cover">
- but take care that you have enough paddingn left and right.

## Service Worker Overview
- Js file that is running on its own thread and acts as a middleware, including resources and api calls
- like a mini server that is installed on the client side, that can react to http requests even if we are offline

- Runs in the browsers engine
- https is required
- installed by a web page
- own thread and lifecycle
- act as a network proxy or local web server in the name of the real server 
- can work in the background
- no need for user's permission
- every service worker has their Scope (whole domain or only scope) and will manage those pages in that Scope
- after installed it can serve the files requested from the scope
- only one service worker is allowed
- WebKit adds partition management

On this page we can look at all the service workers that are currently running or just installed
chrome://serviceworker-internals/
Some are paused. But if you open the app, it will run, and keep running after closing the app for usually 40 more seconds

## Caching and Resources with Service workers
- Service worker has a local cache, where we can cache all or some resources
- Lots of js promises and prefetch on installation
- Or cache on request
- App shell pattern


Serving the resources
- The service worker will respond for the PWA
- Can serve from cache
- Can forward requests to the network
- Can synthesize a response
- any mixed algorithm is possible
- Very low level

- In theory we could remove the real server but we never wanna do that because something can always happen to the cached data (deleted, removed etc).

- When you make changes to the service worker.tick the "Update on reload" option to enable updates, else it will always take the old service worker.
- The cached resources will be available offline - there is a testing option for offline
- You always need to cache your html of course - to make it available offline
- Icons and manifest don't need to be cached, cause they are happening around our PWA not inside of our PWA

### Can we cache assets that don't come from our scope? 
- Cross domain source 
- We can cache, but we can only serve it for our PWA.

## Serving Resources with a ServiceWorker
- we can use workbox for the service workers
- The cache store api is a dictionary where the key is the http request and the value the http response
- If you mess up the service worker file, in can take up to one day to get it refreshed on safari (in chrome and firefox it should take a few seconds) but that's bad 

## How to update the resources of the service Worker
- Problem: We have no simple way to check which assets had changed