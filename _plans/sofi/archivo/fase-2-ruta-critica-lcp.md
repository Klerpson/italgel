# Fase 2 — Ruta crítica de renderizado (LCP sitewide)

**Objetivo:** atacar el problema de mayor volumen de la auditoría — LCP "malo" en 39 de 50 URLs (78%) — interviniendo la ruta crítica compartida por todas las plantillas (`head.html`, fuentes, navegación).
**Duración estimada:** 1–2 semanas.
**Prioridad:** Alta — depende de que la Fase 1 (GTM diferido) ya esté aplicada, porque estas acciones se construyen sobre esa base.
**Por qué después de la Fase 1 y no antes:** la Fase 1 ya resuelve la parte de mayor impacto individual (GTM). Esta fase afina el resto de la ruta crítica compartida, con cambios que tocan archivos más sensibles (fuentes, navegación) y conviene validar de a uno.

---

## ✅ Estado: EJECUTADA (21 sep 2026)

**Resumen:** de los 5 puntos planeados, 3 se implementaron (2.1, 2.2, 2.5), 1 se investigó y se descartó por evidencia empírica en vivo (2.3), y 1 se revisó y se concluyó que no requiere cambios (2.4). El punto 2.5 se amplió más allá del alcance original: el mismo patrón de bug se encontró en 11 páginas de producto/categoría que no estaban en el plan original, y se detectó una imagen de blog faltante (hallazgo nuevo, no corregido — no se puede fabricar una foto que no existe).

Verificación en vivo: sitio corriendo en `http://127.0.0.1:4000/` (Jekyll local del usuario) vía Claude en Chrome — no se pudo usar PageSpeed Insights API (bloqueada/con rate-limit desde este entorno), así que la validación fue por inspección directa de red, DOM y capturas de pantalla en el navegador real.

### 2.1 — Preload de imagen LCP en `<head>` — ✅ Hecho

Implementado en `_includes/head.html`, con lógica condicional por `page.layout` (categories/products con `page.hero_s` en breakpoint mobile vía `media=`, main/general con preload simple, blog sin preload propio porque el listado no tiene hero, y un fallback genérico para el resto de layouts con la misma lógica de `hero`/`hero_s`). Verificado que el `<link rel="preload">` aparece antes que `nav.html`/`header.html` en el `<head>`, por lo que el preload scanner lo encuentra sin tener que atravesar el mega-menú.

**Nota respecto al plan original:** el plan proponía `imagesrcset`/`imagesizes` en un solo `<link>`; en la práctica se implementó con dos `<link rel="preload" media="...">` separados (uno por breakpoint), que logra el mismo resultado (el navegador solo descarga el que aplica a su viewport) con una sintaxis más simple y coherente con el propio `<picture><source media="">` que ya usa `header.html`.

### 2.2 — Reducir el peso de Google Fonts — ✅ Hecho (parcial, sin autohospedaje)

Se auditaron los `font-family` realmente usados en `_includes/css/*.css` (`--fuenteTitulos: Fraunces`, `--fuenteCuerpo: DM Sans`, `--fuenteMono: DM Mono`) y se confirmó por grep exhaustivo en todo el repositorio que **`--fuenteMono` (DM Mono) nunca se aplica en ningún selector CSS real** — su única otra aparición en todo el código es la propia URL de Google Fonts en `head.html`. Se eliminó por completo la familia DM Mono (normal + cursiva, pesos 300–500) de las dos URLs de Google Fonts (`preload` y `noscript`) en `_includes/head.html`.

Verificado en vivo: tras el cambio, la petición a `fonts.googleapis.com/css2?...` solo incluye `DM+Sans` y `Fraunces`; ya no se descarga ningún `.woff2` de DM Mono (confirmado revisando las peticiones de red tras recargar la portada). Sin regresión visual — DM Sans y Fraunces se ven igual que antes porque nunca dependieron de DM Mono.

**Lo que no se hizo:** no se recortó el rango de pesos de DM Sans/Fraunces (400–900 están genuinamente en uso, con poco margen seguro de recorte) ni se autohospedaron las fuentes. El autohospedaje sigue siendo una mejora válida a futuro (elimina 2 orígenes externos y da control sobre `font-display`/`size-adjust`), pero es un cambio de mayor alcance que se deja para una fase posterior si se decide abordarlo — no se ejecutó en esta fase para no mezclar un cambio estructural grande con la limpieza de bajo riesgo ya validada.

### 2.3 — `content-visibility: auto` en el mega-menú — ❌ Descartado (no aporta beneficio real)

Se midió en vivo la posición del `.megamenu` con `getBoundingClientRect()`: su caja ocupa aproximadamente `top:82, bottom:418`, completamente dentro del viewport inicial (alto ~649px en desktop). El mecanismo de `content-visibility: auto` decide si "saltarse" el renderizado de un elemento según si está **fuera del viewport** (intersección geométrica) — no según si está oculto por `opacity:0`/`visibility:hidden`/`pointer-events:none`, que es como el mega-menú permanece invisible por defecto. Como el elemento sí está geométricamente dentro del viewport aunque no se vea, el navegador no lo trataría como "off-screen" y `content-visibility: auto` no reduciría ningún trabajo de renderizado real.

**Decisión:** no se implementa. Aplicar este cambio hubiera sido un fix cosmético sin efecto medible — se documenta la razón en vez de sumar código que no mejora nada. Si en el futuro se quiere atacar el peso del mega-menú, la vía correcta sería reducir el propio HTML/CSS que se genera (13.5 KB) o cargar las columnas del menú de forma diferida con JS, no `content-visibility`.

### 2.4 — Revisar arranque de `lead-whatsapp.js` — ⚪ Sin cambios (no había nada que optimizar)

Se leyó el archivo completo. El código que se ejecuta de inmediato al cargar la página ya es mínimo — dos líneas de registro de listeners de clic hacia WhatsApp. Toda la lógica más pesada (detección de "lead recuperado", el cuadro flotante) ya está condicionada a eventos posteriores (interacción del usuario o el propio flujo de retorno desde WhatsApp), no a la carga inicial.

**Decisión:** no se requiere ningún cambio — el script ya sigue el patrón que el plan proponía introducir. Se deja documentado para no repetir este análisis en el futuro.

### 2.5 — `srcset` no-funcional y desajuste de aspecto — ✅ Hecho (alcance ampliado)

**Blog posts (alcance original):** corregido en `_includes/header.html` (bloque `{% else %}`, usado por `layout: post` y páginas sueltas como `nosotros.html`/`legal.md`). El `srcset` ya no repite la misma imagen para desktop/mobile: ahora usa `page.hero_s` (con fallback a `page.hero` si no existe) para el breakpoint mobile, y `width`/`height` se toman de nuevas variables de front matter (`hero_w`/`hero_h`) en vez de estar hardcodeados a 1080×720.

Se generaron variantes mobile reales (`-mobile.avif`, ImageMagick `convert -resize 600x -quality 62`) para las 20 entradas de `_posts/*.md` más `nosotros.html` y `legal.md` (22 archivos), y se añadieron `hero_w`/`hero_h`/`hero_s` a cada front matter con las dimensiones reales medidas por archivo (1080×720, 1080×820 o 920×420 según el post). Reducción de peso de 5% a 74% según la imagen (los heroes de blog más pesados, 350-430 KB, bajaron a ~28-40 KB en su variante mobile).

**Hallazgo excluido del fix:** `_posts/2026-08-13-caso-exito-heladeria-gurcoff.md` referencia `/img/blog/caso-exito-gurcoff.avif`, que **no existe en el repositorio**. No se generó ninguna variante ni se tocó su front matter — es una imagen rota preexistente, no algo que este trabajo de performance pueda resolver sin la foto real. **Se reporta como hallazgo pendiente para el equipo de contenido**, no como acción completada.

**Extensión no planeada — páginas de producto/categoría:** al verificar en vivo se encontró el mismo patrón de bug (un `page.hero_s` referenciado en los bloques `layout: categories`/`layout: products` de `header.html` que ninguna página definía) en 11 páginas más: `bases-helado-colombia/{index,base-50-mec3,neutralin-plus,supergelmix}.html`, `coberturas-salsas-helado/index.html`, `equipos.html`, `insumos.html`, `maquinas-helado-soft/coldelite-compacta-3.html`, `pastas-sabores-helado/{index,pasta-pistacho,pasta-vainilla}.html`. Es decir, el `srcset` mobile de estas páginas estaba vacío/roto desde siempre, no solo en el blog. Se generaron variantes `-mobile.avif` (420×420) para cada una y se añadió `hero_s` a su front matter.

**Verificado en vivo:** capturas de pantalla y revisión de red en `/`, `/equipos/`, `/contacto/` y una entrada de blog — imágenes hero cargan correctamente, sin errores de consola, sin regresión visual.

---

## 2.1 Precargar explícitamente la imagen LCP en `<head>`

**Problema:** el `fetchpriority="high"` en el `<img>` del `<body>` solo se aplica una vez el parser HTML llega hasta ahí — y antes tiene que atravesar `_includes/nav.html` (13.5 KB de mega-menú, siempre presente en el HTML aunque esté oculto visualmente) más `_includes/header.html`.

**Acción:** agregar en `_includes/head.html` un `<link rel="preload" as="image" fetchpriority="high" href="...">` apuntando a la imagen hero de cada página, usando la misma variable Liquid `page.hero` que ya usa `header.html`. El preload scanner del navegador encuentra este hint en el `<head>`, antes de llegar al `<body>`, y empieza a descargar la imagen mucho antes.

**Detalle técnico:** como varias plantillas usan `<picture>` con distintas fuentes AVIF según el breakpoint (`page.hero` en desktop, `page.hero_s` en mobile), el `preload` debe usar `imagesrcset`/`imagesizes` para que el navegador elija la variante correcta según el viewport, igual que ya hace el `<picture>` del body — de lo contrario se precargaría la imagen equivocada en mobile.

**Archivo a tocar:** `_includes/head.html`

**Resultado esperado:** reducción de LCP en todas las plantillas que usan `page.hero` (home, categorías, productos, general) — el grueso de las 32 URLs "no-blog" del sitio (LCP promedio actual 4.09s).

**Cómo validar:** PageSpeed Insights, confirmar en el "Network waterfall" que la petición de la imagen LCP arranca mucho antes (idealmente entre las primeras 3-5 peticiones de la página).

---

## 2.2 Reducir el peso de Google Fonts

**Problema:** las 3 familias cargadas (DM Mono, DM Sans, Fraunces) son variable fonts con rangos de peso muy amplios (`100..1000`, con eje óptico y cursiva incluidos) — más peso del que el sitio realmente usa en su CSS.

**Acción:**
1. Auditar en `_includes/css/*.css` qué pesos y estilos (normal/cursiva) se usan realmente de cada familia (probablemente un subconjunto de `100..1000`).
2. Recortar la URL de Google Fonts en `head.html` a solo esos pesos/ejes, en vez de traer el rango variable completo.
3. Evaluar autohospedar las 3 familias (`.woff2` servidos desde el propio dominio) en vez de depender de `fonts.googleapis.com` / `fonts.gstatic.com` — elimina dos orígenes externos adicionales (aunque ya tengan `preconnect`) y da control total sobre `font-display` y los descriptores `size-adjust`/`ascent-override` que necesita el fix de CLS de la Fase 1 (punto 1.5).

**Archivos a tocar:** `_includes/head.html` (URL de Google Fonts o `@font-face` si se autohospeda), posiblemente nuevos archivos `.woff2` en `/fonts/` si se autohospeda.

**Resultado esperado:** menos bytes en la ruta crítica de fuentes, FCP más consistente entre páginas (hoy varía entre 1.6s y 3.7s sin una razón de contenido que lo explique).

**Cómo validar:** comparar el peso total de fuentes descargadas (pestaña Network, filtro Font) antes/después en PageSpeed Insights.

---

## 2.3 Reducir el costo de renderizado del mega-menú (`nav.html`)

**Problema:** `_includes/nav.html` pesa 13.5 KB de HTML y se renderiza completo en **cada** página, incluyendo todas las columnas del mega-menú de "Insumos" y "Equipos" que solo son visibles al hacer hover/click. Ese HTML compite por tiempo de parseo y cálculo de estilos antes de que el navegador llegue al contenido principal.

**Acción:** aplicar `content-visibility: auto` (con un `contain-intrinsic-size` razonable) a los contenedores `.megamenu` que están ocultos por defecto. Esto le dice al navegador que puede saltarse el cálculo de layout/estilo de ese contenido hasta que sea visible, sin cambiar nada del comportamiho ni del HTML.

**Archivo a tocar:** `_includes/css/nav.css`

**Resultado esperado:** menos trabajo de estilo/layout antes del primer paint, beneficio en las 51 URLs por igual (el nav es compartido).

**Cómo validar:** Lighthouse → "Minimize main-thread work", comparar el tiempo de "Style & Layout" antes/después.

---

## 2.4 Revisar el punto de arranque de `lead-whatsapp.js`

**Problema:** es el script propio más pesado del sitio (28 KB) y se ejecuta con `defer` en las 51 páginas, incluyendo toda la lógica de detección de "lead recuperado" (el usuario vuelve de WhatsApp sin haber escrito) desde el primer momento, aunque esa lógica solo importa después de que el usuario interactúe con un botón de WhatsApp.

**Acción:** separar la inicialización en dos momentos — (a) el listener de clics hacia WhatsApp, que si debe estar activo desde el inicio para no perder ningún clic (esto es intencional, según el propio comentario del archivo, y no se debe tocar), y (b) la lógica de "recuperación de lead" (el cuadro flotante que aparece si el usuario vuelve del navegador), que puede inicializarse de forma diferida (por ejemplo, en el evento `load` o con `requestIdleCallback`) sin afectar la medición de clics.

**Archivo a tocar:** `js/lead-whatsapp.js`

**Nota de cuidado:** este script mide conversión real (clics a WhatsApp) — cualquier cambio acá se prueba primero en un entorno de staging y se valida con `LeadWhatsApp.diagnostico()` (función que el propio script ya expone en consola) antes de publicar, para no perder tracking.

**Resultado esperado:** menos trabajo de JS en el hilo principal durante la carga inicial, contribuye a bajar el TBT "mejorable" (14 URLs entre 210–290ms) hacia el rango "bueno".

**Cómo validar:** Lighthouse → "Reduce JavaScript execution time", confirmar que el tiempo atribuido a `lead-whatsapp.js` baja en la fase de carga inicial.

---

## 2.5 Corregir el `srcset` no-funcional y el desajuste de aspecto en imágenes de blog posts

**Problema:** en `_includes/header.html` (bloque `{% else %}`, usado por `layout: post`), el `srcset` de la imagen hero repite la misma URL para los descriptores `1080w` y `720w` — no hay ninguna variante real más liviana para pantallas chicas. Además, el HTML declara `width="1080" height="720"` pero el archivo real mide `1080×820` px (confirmado con `identify` sobre `rentabilidad-heladeria-colombia-margenes.avif` y `blog-itagel.avif`).

**Acción:**
1. Generar una variante real más liviana para el breakpoint mobile (por ejemplo 600px de ancho) y usarla en el `srcset`, en vez de repetir el mismo archivo.
2. Corregir los atributos `width`/`height` del `<img>` para que coincidan con las dimensiones reales del archivo (1080×820), o generar los archivos hero con el aspecto 1080×720 si esa es la relación de aspecto deseada de forma consistente.

**Archivo a tocar:** `_includes/header.html` (bloque `{% else %}`)

**Resultado esperado:** menor peso de imagen en mobile para los 17 posts de blog del sitio, y cero riesgo de CLS futuro por desajuste de aspecto.

**Cómo validar:** revisar en PageSpeed Insights (mobile) que la imagen servida corresponde al tamaño real del viewport, y confirmar `width`/`height` correctos con `identify` o el inspector del navegador.

---

## Checklist de cierre de Fase 2

- [x] 2.1 Preload de imagen LCP en `<head>` — implementado con lógica condicional por `layout` (categories/products/main/general/fallback), verificado en vivo que el `<link>` precede a `nav.html`/`header.html`. Falta: confirmar mejora real de LCP con PSI una vez en producción.
- [x] 2.2 Peso de Google Fonts reducido — eliminada la familia DM Mono completa (no usada en ningún CSS real), verificado en vivo que ya no se descarga. No se autohospedaron las fuentes (mejora futura, fuera de alcance de esta fase).
- [x] 2.3 `content-visibility: auto` en el mega-menú — **descartado**, no implementado: medición en vivo confirmó que el `.megamenu` está geométricamente dentro del viewport inicial, por lo que el mecanismo de off-screen skip de `content-visibility` no aplicaría ningún ahorro real.
- [x] 2.4 `lead-whatsapp.js` — **sin cambios**: revisión completa del archivo confirmó que la inicialización inmediata ya es mínima y la lógica pesada ya está diferida a eventos; no había nada que optimizar.
- [x] 2.5 `srcset` de blog posts con variante real + `width`/`height` corregidos — hecho para los 22 archivos de blog/páginas sueltas, y ampliado a 11 páginas de producto/categoría adicionales con el mismo bug. Hallazgo sin corregir: imagen faltante `caso-exito-gurcoff.avif` (reportar a contenido).
