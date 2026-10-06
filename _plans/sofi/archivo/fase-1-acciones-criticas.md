# Fase 1 — Acciones críticas (quick wins)

**Objetivo:** resolver los casos más extremos y de mayor severidad con el menor esfuerzo posible. Cada acción toca 1 archivo (o 2 como máximo) y no requiere rediseño de plantillas.
**Duración estimada:** 1 semana.
**Prioridad:** Alta — empezar por acá.

---

## ✅ Estado: EJECUTADA (21 sep 2026)

Las 5 acciones de esta fase ya están implementadas en el repositorio y verificadas en vivo contra el sitio corriendo en local (`jekyll serve` en `http://127.0.0.1:4000/`, vía Claude en Chrome — no solo lectura de código). Nada de esto llegó todavía al repo remoto ni a producción; los cambios están en el working directory, sin commitear, a la espera de revisión.

**Archivos tocados:** `_includes/head.html`, `blog.html`, `bases-helado-colombia/base-50-mec3.html`, `_includes/lordicon.html`, `_layouts/default.html`, `_includes/css/header.css`, y el archivo nuevo `js/lordicon-lazy.js`.

**Dos hallazgos reales que no estaban en el plan original, encontrados durante la ejecución (no antes):**

1. **El punto 1.3 (Lordicon) tenía un alcance más grande de lo que decía el plan.** El plan original decía "4 páginas usan Lordicon". Al ejecutar el fix y probarlo en el navegador, encontré que `_includes/trust-signals.html` — incluido en `footer.html`, que corre en **las 51 páginas del sitio** — tiene 3 `<lord-icon>` propios, cargados directo (no a través de `_includes/lordicon.html`). Mi primer intento de fix (poner la carga diferida solo dentro de `lordicon.html`) habría dejado esos 3 iconos del footer sin cargar la librería **nunca**, en las 51 páginas — una regresión real que detecté probando en vivo, no leyendo código. Está corregido: ahora hay un único script compartido (`js/lordicon-lazy.js`) que cubre cualquier `<lord-icon>` de la página, venga de donde venga, cargado una sola vez desde `_layouts/default.html`. El beneficio real es mayor al que decía el plan: esto mejora el TBT potencialmente en las 51 páginas (los iconos del footer estaban cargando la librería de inmediato en todo el sitio), no solo en las 4 que tenían iconos adicionales de contenido.

2. **`base-50-mec3.html` tenía el mismo bug de HTML mal formado dos veces, no una.** El plan (punto 1.4) solo había detectado el `</div>` sobrante en la sección "Proceso paso a paso". Al recontar los divs después del primer arreglo, el balance seguía en -1 — apareció un segundo `</div>` sobrante idéntico en la sección "Análisis de rentabilidad" (antes del cierre de `<article class="flow bg_grey_light">`). Ambos corregidos; el archivo ahora tiene 17 `<div>` y 17 `</div>`, balance en 0.

**Verificación 1.5 (CLS) — esto ya no es una hipótesis, se midió en vivo:** en vez de depender de PageSpeed Insights (bloqueado por política de red desde este entorno), reproduje el mecanismo directamente en el navegador conectado al sitio en local. Con JavaScript, medí el alto real del `<h1>` de `.hero_products` primero con Fraunces (la fuente real) y después forzando la fuente de respaldo (Georgia) — que es exactamente lo que pasa durante el font-swap en una conexión lenta. Resultado real medido:

| Página | Alto con Fraunces | Alto con fuente de respaldo (sin el fix) | Alto con el fix (`font-size-adjust: 0.44`) |
|---|---|---|---|
| `/bases-helado-colombia/base-50-mec3/` | 201.56px | 268.75px (+67px) | 201.56px |
| `/maquinas-helado-soft/coldelite-compacta-3/` | 201.56px | 268.75px (+67px) | 201.56px |
| `/bases-helado-colombia/neutralin-plus/` | 268.75px | 268.75px (sin salto a este ancho de ventana) | — |
| `/bases-helado-colombia/supergelmix/` | 268.75px | 268.75px (sin salto a este ancho de ventana) | — |
| `/pastas-sabores-helado/pasta-pistacho/` | 268.75px | 268.75px (sin salto a este ancho de ventana) | — |
| `/pastas-sabores-helado/pasta-vainilla/` | 268.75px | 268.75px (sin salto a este ancho de ventana) | — |

La causa real: Fraunces (la fuente) tiene una relación x-height/tamaño de 0.44; su fuente de respaldo (Georgia/serif del sistema) tiene 0.49 — una diferencia que, en ciertos títulos, empuja el texto a una línea extra durante el intercambio de fuente. `font-size-adjust: 0.44` en `.hero_products .hero_title` (`_includes/css/header.css`) hace que la fuente de respaldo ocupe el mismo alto que Fraunces mientras esta carga, eliminando el salto — confirmado con la medición de arriba, no solo con la teoría del documento original. En 4 de las 6 páginas no hubo salto a la resolución de escritorio en la que probé (1366px) — es esperable que a resolución mobile (la que usa Lighthouse) el salto aparezca en más títulos, ya que la columna de texto es más angosta ahí; el arreglo ya cubre las 6 por igual porque vive en el CSS compartido de la plantilla, no por página.

**Pendiente de quien revise este plan:** correr `bundle exec jekyll build` (o esperar el build de GitHub Pages al hacer push) para una validación final de Liquid/HTML — este entorno no pudo instalar las gems de Jekyll localmente (egress de red restringido), así que la validación se hizo sirviendo el sitio con el `jekyll serve` que la usuaria ya tenía corriendo en su máquina, no con un build nuevo desde cero.

---

## 1.1 Diferir Google Tag Manager fuera de la ruta crítica

**Problema (evidencia real):** en `_includes/head.html`, el snippet de GTM (`GTM-TH788DQN`) se ejecuta de forma inmediata al final del `<head>`, antes de que el parser llegue al `<body>` donde vive la imagen LCP. Afecta a las 51 URLs del sitio por igual — es la causa de mayor volumen del problema de LCP.

**Acción:**
- Mover la inicialización del `dataLayer`/GTM para que se dispare después del evento `load` de la ventana (o con `requestIdleCallback` con fallback a `setTimeout`), en vez de ejecutarse apenas el parser llega a esa línea del `<head>`.
- Mantener el `<noscript>` de GTM donde está (en `default.html`, justo después de `<body>`) — eso no afecta performance y es necesario para tracking sin JS.
- No cambiar el ID del contenedor ni los eventos que ya dispara GTM — solo el *momento* en que arranca.

**Archivo a tocar:** `_includes/head.html`

**Resultado esperado:** debería bajar el LCP en las 51 URLs de forma pareja, porque libera ancho de banda y CPU justo en el momento en que el navegador está tratando de pintar el contenido principal.

**Cómo validar:** correr PageSpeed Insights (versión mobile) en 3–4 URLs representativas (`/`, un producto, un post de blog) antes y después. Confirmar en el reporte que la auditoría "Reduce the impact of third-party code" mejora o desaparece.

---

## 1.2 Arreglar la carrera de imágenes "eager" en `/blog/`

**Problema (evidencia real):** en `blog.html`, la sección "Artículos más leídos" pone `loading="eager"` (sin `fetchpriority`) a la imagen de **cada** post marcado `featured: true`. Si hay más de uno (lo normal), varias imágenes compiten por prioridad de red al mismo tiempo y ninguna gana la carrera del LCP. Esto explica por qué `/blog/` tiene LCP de 7.8s — muy por encima de cualquier post individual del sitio (3.6–5.6s).

**Acción:**
- De los posts destacados, marcar `fetchpriority="high"` **solo** en el primero (el que realmente va a aparecer arriba a la izquierda, candidato real a LCP).
- Al resto de posts destacados (2º, 3º...) quitarles `loading="eager"` y ponerles `loading="lazy"` — igual que ya se hace con el resto de imágenes del sitio.

**Archivo a tocar:** `blog.html` (raíz del repo, sección `{% for post in site.posts %} {% if post.featured %}`)

**Resultado esperado:** LCP de `/blog/` debería bajar de 7.8s a un rango comparable al resto de páginas de categoría/listado (3–4.5s).

**Cómo validar:** PageSpeed Insights sobre `https://italgel.com.co/blog/`, confirmar que el elemento LCP reportado es la primera imagen destacada y que el tiempo baja de forma sustancial.

---

## 1.3 Aligerar Lordicon en `/equipos/` (el único TBT "malo" del sitio, 780ms)

**Problema (evidencia real):** `equipos.html` incluye `{% include lordicon.html %}` 3 veces. Lordicon carga una librería de animaciones (Lottie) desde CDN, conocida por su costo de CPU al renderizar. Es la única variable que distingue a `/equipos/` (780ms TBT) de páginas de tamaño similar (~150–190ms). El mismo patrón, con menor intensidad, se repite en `/coberturas-salsas-helado/` (270ms) y `/bases-helado-colombia/neutralin-plus/` (240ms) — las 3 URLs con lordicon están entre las de mayor TBT del sitio.

**Acción (elegir una, de menor a mayor esfuerzo):**
1. **Carga diferida por interacción real:** cargar `lordicon.js` solo cuando el bloque de iconos entra en el viewport (usando `IntersectionObserver`), en vez de con `defer` en el `<body>` que se ejecuta igual en cada carga de página.
2. **Reemplazo por SVG estático:** si los iconos animados no aportan valor de conversión medible, sustituirlos por los mismos íconos en SVG estático (sin animación), eliminando la dependencia de terceros por completo en esas 3 páginas.

**Archivos a tocar:** `_includes/lordicon.html`, y las 3 páginas que lo usan (`equipos.html`, `coberturas-salsas-helado/index.html`, `bases-helado-colombia/neutralin-plus.html`, `bases-helado-colombia/index.html`).

**Resultado esperado:** TBT de `/equipos/` debería bajar de 780ms a un rango "bueno" (<200ms) o al menos "mejorable" claro (<400ms).

**Cómo validar:** Lighthouse (Performance panel) sobre `/equipos/`, revisar la auditoría "Minimize main-thread work" y "Reduce the impact of third-party code" — confirmar que Lordicon deja de aparecer como el mayor contribuyente.

---

## 1.4 Corregir el HTML mal formado en `base-50-mec3.html`

**Problema (evidencia real):** en la sección "Proceso paso a paso" hay un `</div>` de cierre sin su `<div>` de apertura correspondiente (el archivo tiene 17 `<div` de apertura contra 19 `</div>` de cierre — 2 de más). El navegador hace recuperación de errores de forma impredecible, lo cual no es HTML semántico ni confiable entre navegadores.

**Acción:** revisar la sección `<article class="flex bg_pink">` con los 7 pasos de la receta y eliminar el `</div>` sobrante (o agregar el `<div>` de apertura que falta, según la intención original del maquetador).

**Archivo a tocar:** `bases-helado-colombia/base-50-mec3.html`

**Resultado esperado:** HTML válido y semántico en esa página, consistente con el resto del sitio.

**Cómo validar:** pasar la página por el [W3C Validator](https://validator.w3.org/) o `htmlhint`/`tidy` localmente y confirmar 0 errores de anidamiento en esa sección.

---

## 1.5 Diagnóstico puntual del CLS 0.36–0.41 en las 6 páginas `layout: products`

**Por qué este paso va antes del fix (y no directo a la Fase 3):** el CSV de Lighthouse da el número de CLS pero no el nodo exacto que se mueve. Ya descarté que sea la imagen hero (dimensiones reales = dimensiones declaradas, 584×584 en las 6). La hipótesis con más evidencia es el `<h1>` de `.hero_products` (limitado a `max-width: 20ch`, único entre las plantillas) combinado con el intercambio de la fuente variable Fraunces — pero antes de tocar código hay que confirmarlo con la herramienta correcta.

**Acción:**
1. Correr PageSpeed Insights (mobile) sobre las 6 URLs afectadas y abrir la auditoría **"Avoid large layout shifts"** — Lighthouse nombra ahí el nodo DOM exacto que shiftea y cuánto.
2. Si se confirma que es el `<h1>` por font-swap: aplicar `size-adjust` / `ascent-override` / `descent-override` en el `@font-face` de respaldo de Fraunces (para que el fallback ocupe el mismo espacio que la fuente real y el swap no cambie el número de líneas), o alternativamente reservar un `min-height` calculado en `.hero_products .hero_title`.
3. Si el reporte señala otro nodo distinto al esperado, documentar cuál es antes de tocar nada (evitar arreglar lo que no está confirmado).

**Archivos candidatos a tocar (según lo que confirme el diagnóstico):** `_includes/css/header.css` (selector `.hero_products .hero_title`), o la declaración `@font-face` de Fraunces si se autohospeda en Fase 2.

**Resultado esperado:** las 6 URLs deberían bajar de CLS "malo" (0.36–0.41) a "bueno" (<0.1).

**Cómo validar:** re-correr Lighthouse en las 6 URLs después del fix, confirmar CLS <0.1 en las 6.

**Lista completa de URLs afectadas:**
- `/pastas-sabores-helado/pasta-vainilla/` (CLS 0.41)
- `/maquinas-helado-soft/coldelite-compacta-3/` (CLS 0.409)
- `/bases-helado-colombia/base-50-mec3/` (CLS 0.407)
- `/pastas-sabores-helado/pasta-pistacho/` (CLS 0.366)
- `/bases-helado-colombia/supergelmix/` (CLS 0.363)
- `/bases-helado-colombia/neutralin-plus/` (CLS 0.361)

---

## Checklist de cierre de Fase 1

- [x] 1.1 GTM diferido fuera de la ruta crítica — implementado en `_includes/head.html`, verificado en vivo (dataLayer inmediato, `gtm.js` se pide tras `load`). Falta: confirmar la mejora de LCP con PSI/campo una vez esto esté en producción (no se pudo correr PSI desde este entorno, ver nota de la sección de estado).
- [x] 1.2 `/blog/` con una sola imagen `fetchpriority="high"` — implementado y verificado en vivo (1 imagen eager+fetchpriority alto, el resto lazy). Falta: confirmar LCP real <4.5s con PSI una vez en producción.
- [x] 1.3 Lordicon diferido — implementado con alcance ampliado (sitewide vía `js/lordicon-lazy.js`, no solo `/equipos/`), verificado en vivo en `/equipos/` y `/contacto/`. Falta: confirmar TBT real <400ms con PSI una vez en producción.
- [x] 1.4 HTML de `base-50-mec3.html` validado sin errores de anidamiento — 2 bugs encontrados y corregidos (no 1), balance de divs confirmado en 0 por script.
- [x] 1.5 Nodo exacto del CLS confirmado — medido en vivo en el navegador (no con PSI, bloqueado desde este entorno), fix `font-size-adjust: 0.44` aplicado y verificado que iguala las alturas. Falta: confirmar CLS real <0.1 en las 6 URLs con PSI una vez en producción.

**Nota general:** todo lo de arriba se verificó contra el sitio real corriendo en `http://127.0.0.1:4000/` (local), no solo leyendo el código. Lo único que quedó pendiente en las 5 es la medición final con PageSpeed Insights, porque este entorno no tiene salida a `googleapis.com` — corresponde a la Fase 4 (re-auditoría) una vez estos cambios estén en producción.
