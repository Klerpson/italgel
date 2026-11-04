# Pendiente: service worker para cachear imágenes, CSS y JS en italgel

Anotado el 2026-11-02. Sin implementar.

**Estado en este proyecto:** falta versionar 5 archivo(s) CSS/JS antes de implementar (lista abajo).

hermesgamba.com ya usa un `sw.js` en la raíz (referencia: `C:\dev\sitios\hermes-gamba\sw.js`). Guarda en el navegador las imágenes, CSS, JS, fuentes y MP4 del propio dominio, así que las visitas repetidas los cargan sin red. El HTML nunca se cachea. No recoge datos de visitantes, Googlebot no lo instala y no toca GA/GTM (otro dominio).

## Requisito: todo CSS y JS local con `?v=` del build

Sin versión, tras cada deploy quien ya visitó el sitio recibe HTML nuevo con CSS/JS viejo durante una visita (diseño descuadrado o `canales.js` desactualizado). Cada `<link>` y `<script>` local lleva `?v={{ site.time | date: '%s' }}`:

```liquid
<script defer src="{{ '/js/main.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
```

Referencias sin versión encontradas el 2026-11-02 (archivo <- dónde se carga):

- `/css/style.css` <- _includes/head.html
- `/js/app.js` <- _layouts/default.html
- `/js/canales.js` <- _layouts/default.html
- `/js/lordicon-lazy.js` <- _layouts/default.html
- `/js/search.js` <- _layouts/default.html

Las imágenes y videos no llevan versión: si se reemplaza uno con el mismo nombre, el visitante recurrente ve el viejo una vez. Para cambiar una imagen, mejor publicarla con nombre nuevo.

## Paso 1: crear `sw.js` en la raíz del proyecto

Debe estar en la raíz: un service worker solo controla las URLs de su carpeta hacia abajo. El front matter vacío hace que Jekyll lo procese y la caché cambie de nombre en cada build.

```js
---
# Procesado por Liquid: la caché cambia de nombre en cada build y el activate borra la vieja
---
/* Service Worker: cache-first con revalidación para assets estáticos.
   El HTML nunca se cachea aquí. */
const PREFIX = "italgel-static-";
const CACHE = PREFIX + "{{ site.time | date: '%s' }}";
const STATIC_RE = /\.(avif|webp|png|jpg|jpeg|svg|gif|ico|css|js|woff2?|mp4)$/;

self.addEventListener("install", () => self.skipWaiting());

// Solo borra cachés propias: otros sitios del mismo dominio quedan intactos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  // Las peticiones por partes (video) van directo a la red: la caché no admite respuestas 206
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !STATIC_RE.test(url.pathname)) return;

  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
```

## Paso 2: registrarlo en todas las páginas

Al final del JS principal que cargan todas las páginas (en Hermes es `js/main.js`):

```js
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}
```

## Paso 3: comprobar antes de darlo por terminado

- Build local y abrir `_site/sw.js`: la línea `CACHE` debe tener un número, no `{{ ... }}`.
- En producción (solo funciona con HTTPS), DevTools > Application > Service workers: activo. En Cache storage aparece `italgel-static-<número>`.
- Segunda carga: en Network, imágenes, CSS y JS salen "(ServiceWorker)".
- Los videos se reproducen y la consola queda sin errores.
- `curl -I https://italgel.com.co/sw.js` devuelve `content-type: application/javascript`.

## Para retirarlo: publicar un `sw.js` que se desinstale, nunca borrarlo

Si se borra `sw.js`, los navegadores que ya lo tienen lo siguen usando (un 404 no lo desinstala). Para retirarlo, reemplazar su contenido por esto, quitar el registro del paso 2 en el mismo deploy y dejarlo publicado unas semanas antes de borrarlo:

```js
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("italgel-static-")).map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
```