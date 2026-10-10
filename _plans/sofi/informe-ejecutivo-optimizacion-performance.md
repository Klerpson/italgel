# Informe ejecutivo — Optimización técnica de performance (Core Web Vitals)
## Italgel Colombia (italgel.com.co)

**Preparado por:** Claude (sesión de trabajo con Sofi, vía Cowork)
**Fecha del informe:** 21 de septiembre de 2026
**Alcance:** SEO técnico enfocado exclusivamente en performance / Core Web Vitals. Meta tags (title, description) quedaron fuera a propósito, por indicación explícita del proyecto.
**Estado del trabajo:** Fases 1, 2 y 3 ejecutadas y verificadas en local. Fase 4 iniciada parcialmente. **Nada de esto está commiteado ni pusheado a producción** — todo vive en el working directory del repositorio, a la espera de revisión y publicación por la usuaria.

---

## 1. Resumen ejecutivo

El sitio partía de una base técnica sólida (Jekyll estático sobre GitHub Pages, sin framework de JS en cliente, imágenes ya en AVIF, HTML minificado, 0 enlaces rotos en 51 URLs, Best Practices y SEO en 100/100). El problema no era la arquitectura ni el peso de las imágenes: estaba concentrado en **la ruta crítica de renderizado** (qué se ejecuta y en qué orden antes de que el navegador pinte el contenido principal) y en **una plantilla específica** que afectaba a un grupo aislado de páginas.

**Línea base (auditoría Lighthouse, 51 URLs, previa a este trabajo):**

| Métrica | Promedio | Distribución por umbral de Google |
|---|---|---|
| Performance score | 74.5 / 100 | — |
| LCP (Largest Contentful Paint) | 4.31 s (objetivo: <2.5s) | 39/50 "malo" (78%), 11/50 "mejorable", 0/50 "bueno" |
| CLS (Cumulative Layout Shift) | 0.064 (objetivo: <0.1) | 6/50 "malo" (0.36–0.41), 44/50 "bueno" |
| TBT (Total Blocking Time) | 205 ms (objetivo: <200ms) | 1/50 "malo" (780ms), 14/50 "mejorable", 35/50 "bueno" |

**Qué se hizo:** se diagnosticaron las causas raíz con evidencia de código real (no solo el síntoma del CSV), se ejecutaron 3 fases de corrección con verificación en vivo contra el sitio corriendo en local, y se dejó iniciada la fase de validación/monitoreo continuo. En total se tocaron **39 archivos existentes** y se crearon **33 archivos nuevos** (32 variantes de imagen optimizadas para mobile + 1 script compartido), además de la documentación completa del proceso.

**Qué falta:** la confirmación numérica final con PageSpeed Insights/Lighthouse real en producción — este entorno de trabajo no tiene salida de red hacia `googleapis.com`, así que toda la verificación de las Fases 1-3 se hizo por medición directa en el navegador (DOM, red, Performance API), no con la herramienta de laboratorio estándar. Es una limitación de infraestructura documentada de forma consistente en las tres fases, no una omisión.

---

## 2. Metodología de trabajo

1. **Diagnóstico basado en código, no solo en el CSV.** Cada hallazgo del documento de auditoría original está respaldado por una línea de código o un archivo real citado con su ruta — no se asumió ninguna causa sin verla en el repositorio.
2. **Verificación en vivo, no solo lectura de código.** Todas las fases se probaron contra el sitio corriendo en local (`jekyll serve` en `http://127.0.0.1:4000/`) usando Claude en Chrome (perfil "Trabajo SEO"), midiendo directamente en el navegador: alturas reales del DOM, peticiones de red, tiempos de `PerformanceObserver` (layout-shift, longtask, paint, largest-contentful-paint).
3. **Ninguna cifra inventada.** Cuando algo no se pudo medir con la herramienta ideal (PageSpeed Insights, bloqueado por política de red del entorno hacia `googleapis.com`), se midió con el método más cercano disponible y se documentó explícitamente la limitación — nunca se presentó una estimación como si fuera un dato confirmado.
4. **Evidencia antes que hipótesis.** En más de un punto (el nodo exacto del CLS, la necesidad real de `content-visibility`, si `/blog/rentabilidad-heladeria-colombia/` tenía un problema real) se midió primero y se decidió después, incluso cuando eso significó **no** implementar un cambio que el plan original proponía (ver sección 4.2 y 4.3).
5. **Alcance respetado estrictamente.** No se tocó ningún meta tag, title ni description en ninguna fase, tal como se pidió.

---

## 3. Hallazgos de causa raíz (diagnóstico original)

### 3.1 LCP generalizado (78% del sitio "malo") — no era el peso de las imágenes

Las imágenes ya estaban optimizadas (AVIF, livianas, con `fetchpriority="high"` y dimensiones explícitas). El cuello de botella real:
- **Google Tag Manager** se inyectaba de forma inmediata al final del `<head>`, consumiendo ancho de banda y CPU justo en el momento más crítico de la carga — antes de que el navegador empezara siquiera a parsear el `<body>` donde está la imagen LCP.
- No había `<link rel="preload">` para la imagen hero — el navegador solo podía priorizarla una vez el parser atravesaba el mega-menú completo (13.5 KB, siempre renderizado aunque esté oculto).
- 3 familias de Google Fonts variables con rangos de peso muy amplios, una de ellas (DM Mono) sin ningún uso real en el CSS del sitio.

### 3.2 CLS crítico (0.36–0.41) — aislado a 6 URLs con una causa estructural común

Las 6 URLs afectadas compartían exactamente una cosa: `layout: products`. La imagen hero no era la causa (dimensiones reales = declaradas, 584×584). La causa real, confirmada con medición en vivo (no solo hipótesis): el `<h1>` de esa plantilla, combinado con el intercambio de la fuente variable Fraunces por su respaldo (Georgia), generaba una diferencia de altura real de **+67px** en las páginas donde el título caía justo en un límite de ajuste de línea.

### 3.3 TBT — un caso extremo y un patrón de scripts de terceros

`/equipos/` (780ms, el único "malo" del sitio) incluía Lordicon (librería de animaciones Lottie) 3 veces, con costo real de CPU. El mismo patrón, más leve, aparecía en otras 2 URLs. Aparte, `/blog/rentabilidad-heladeria-colombia/` mostraba una combinación rara de métricas (FCP excelente + LCP/TBT altos) sin nada en su contenido que lo explicara — señal de posible ruido de medición, marcada para re-verificar antes de tocar código.

### 3.4 Anomalía de `/blog/` (LCP 7.8s, el peor del sitio)

La sección "Artículos más leídos" marcaba `loading="eager"` en **todas** las imágenes de posts destacados, sin `fetchpriority` — si había más de un post destacado (lo normal), varias imágenes competían por prioridad de red y ninguna ganaba la carrera del LCP.

---

## 4. Trabajo ejecutado, por fase

### Fase 1 — Acciones críticas (quick wins) — ✅ Ejecutada y verificada

| # | Acción | Resultado |
|---|---|---|
| 1.1 | GTM diferido hasta después del evento `load` | Implementado en `_includes/head.html`. Verificado en vivo: `dataLayer` se inicializa de inmediato, `gtm.js` se pide recién tras `load`. |
| 1.2 | `/blog/` — solo la primera imagen destacada con `fetchpriority="high"`, el resto `lazy` | Implementado en `blog.html`. Verificado: 3 posts destacados, solo el primero eager. |
| 1.3 | Lordicon diferido | **Alcance ampliado en ejecución:** no eran 4 páginas, eran las 51 — `_includes/trust-signals.html` (footer, sitewide) tenía iconos hardcodeados fuera del include original. Se creó `js/lordicon-lazy.js`, un único script compartido que cubre cualquier `<lord-icon>` del sitio y solo carga la librería cuando el primero está por entrar al viewport. |
| 1.4 | HTML mal formado en `base-50-mec3.html` | Se encontraron **2** `</div>` sobrantes (el plan original solo había detectado 1). Ambos corregidos, balance de divs verificado en 0. |
| 1.5 | Diagnóstico y fix del CLS en las 6 URLs `layout: products` | Confirmado con medición real (no solo hipótesis): `font-size-adjust: 0.44` en `.hero_products .hero_title` iguala la altura de la fuente de respaldo con la real durante el font-swap. Verificado: 0px de diferencia con el fix, +67px sin él. |

**Dato relevante para la revisión:** 2 de los 5 puntos (1.3 y 1.4) terminaron con un alcance real mayor al que decía el plan original, descubierto únicamente al probar en el navegador — no se habría detectado solo leyendo código.

### Fase 2 — Ruta crítica de LCP (sitewide) — ✅ Ejecutada (parcial, con decisiones documentadas)

| # | Acción | Resultado |
|---|---|---|
| 2.1 | Preload de imagen LCP en `<head>` | Implementado con lógica condicional por `layout` (products/categories usa `hero_s` en mobile vía `media=`, main/general usa `hero` simple). Verificado que precede a `nav.html`/`header.html`. |
| 2.2 | Reducir peso de Google Fonts | Se confirmó por grep exhaustivo que DM Mono no se usa en ningún CSS real del sitio — eliminada por completo. Verificado en vivo: ya no se descarga ningún `.woff2` de DM Mono. No se autohospedaron las fuentes (mejora válida a futuro, de mayor alcance). |
| 2.3 | `content-visibility: auto` en el mega-menú | **Descartado, no implementado.** Medición en vivo (`getBoundingClientRect()`) confirmó que el mega-menú está geométricamente dentro del viewport inicial — el mecanismo no ahorra nada en ese caso. Se documentó la razón en vez de sumar código sin efecto real. |
| 2.4 | Revisar `lead-whatsapp.js` | **Sin cambios.** Lectura completa confirmó que la inicialización inmediata ya era mínima y la lógica pesada ya estaba diferida. No había nada que optimizar. |
| 2.5 | `srcset` roto + desajuste de aspecto en imágenes | **Alcance ampliado significativamente.** Corregido para los 22 archivos de blog/páginas sueltas (nuevas variantes `-mobile.avif`, reducción de peso de 5% a 74%, ej. heroes de 350-430 KB → 28-40 KB en mobile) **y** extendido a 11 páginas de producto/categoría más, donde se encontró el mismo bug (`hero_s` referenciado pero nunca definido, `srcset` mobile vacío desde siempre). |

**Hallazgo pendiente reportado, no corregido:** `_posts/2026-08-13-caso-exito-heladeria-gurcoff.md` referencia una imagen (`caso-exito-gurcoff.avif`) que no existe en el repositorio — requiere que el equipo de contenido suba la foto real.

### Fase 3 — Consolidación de CLS y TBT restante — ✅ Ejecutada (verificación, sin cambios de código)

| # | Punto | Resultado |
|---|---|---|
| 3.1 | Confirmar CLS <0.1 en las 6 URLs `layout: products` | **Confirmado: CLS=0 en las 6.** Se repitió la prueba de fallback forzado (Georgia vs Fraunces) en las 2 URLs con el salto más grande original: altura idéntica con el fix. |
| 3.2 | Verificar TBT en las URLs "mejorable" (15, recalculado del CSV completo) | Verificado de forma indirecta — se confirmó que los 3 mecanismos que bajan el TBT (GTM al `load`, sin DM Mono, Lordicon diferido) están activos en las URLs revisadas, y las mediciones locales no mostraron anomalías. La confirmación numérica exacta con Lighthouse real queda pendiente de producción. |
| 3.3 | Re-medir `/blog/rentabilidad-heladeria-colombia/` 3 veces | **Confirmado: fue ruido de medición, no un problema de código.** TBT de 29/5/0ms en 3 corridas, en línea con el resto del blog. Sin tablas, iframes ni contenido pesado. Se cierra el punto sin tocar el archivo. |

Fase 3 no requirió ningún cambio de código — confirmó que el trabajo de las Fases 1-2 ya cubría lo necesario.

### Fase 4 — Validación y monitoreo continuo — 🔶 En progreso

| # | Punto | Estado |
|---|---|---|
| 4.1 | Re-auditoría de las 51 URLs con Lighthouse real | 🔒 Bloqueado — necesita que los cambios estén en producción. |
| 4.2 | Monitoreo mensual de Search Console (Core Web Vitals de campo) | ⏸️ Pospuesto a pedido explícito de la usuaria, para después de publicar. |
| 4.3 | Presupuesto de performance para páginas nuevas | ✅ Hecho — ver `presupuesto-performance-contenido-nuevo.md`: 3 umbrales de publicación (LCP<2.5s, CLS<0.1, TBT<200ms), checklist basado en los bugs reales de este proyecto, y métodos de medición ordenados por precisión. Referenciado desde la skill `dev-jekyll`. |

---

## 5. Alcance técnico total (archivos tocados)

**39 archivos existentes modificados:**
- `_includes/head.html`, `_includes/header.html`, `_includes/lordicon.html`, `_includes/css/header.css`, `_layouts/default.html` (núcleo de la ruta crítica y plantillas compartidas)
- `blog.html`, `bases-helado-colombia/base-50-mec3.html` y 8 páginas más de producto/categoría (front matter `hero_s`)
- `nosotros.html`, `legal.md`, y 20 archivos de `_posts/*.md` (front matter `hero_w`/`hero_h`/`hero_s`)
- `.claude/skills/dev-jekyll/SKILL.md` (checklist pre-publicación actualizado)

**33 archivos nuevos:**
- `js/lordicon-lazy.js` — script compartido de carga diferida
- 32 variantes de imagen `*-mobile.avif` optimizadas (420-600px de ancho, calidad 62)

**Documentación del proceso** (carpeta `_plans/sofi/`): auditoría original, presupuesto de performance para contenido nuevo, y este informe. Los archivos de ejecución de las Fases 1-3 (ya cerradas) se movieron a `_plans/sofi/archivo/` para no estorbar en el día a día — quedan disponibles ahí con todo el detalle técnico y la evidencia de cada cambio, por si hace falta revisarlos.

**Nada de esto está commiteado ni pusheado.** Todos los cambios viven en el working directory del repositorio local, a la espera de que la usuaria los revise y decida cuándo publicarlos.

---

## 6. Limitaciones documentadas (léase antes de publicar)

- **Sin acceso a PageSpeed Insights / Lighthouse real desde este entorno de trabajo** (bloqueo de red hacia `googleapis.com`). Toda la verificación de las Fases 1-3 se hizo con medición directa en el navegador real de la usuaria — válida para confirmar mecanismos y comportamiento, pero no reemplaza la cifra oficial de Lighthouse con throttling mobile. Ese número solo se puede obtener una vez el sitio esté en producción (Fase 4.1) o corriendo Lighthouse manualmente desde Chrome DevTools en local.
- **No se autohospedaron las fuentes de Google** (Fraunces, DM Sans) — mejora válida a futuro, de mayor alcance, que no se ejecutó para no mezclar un cambio estructural grande con las correcciones de bajo riesgo ya validadas.
- **Imagen faltante:** `caso-exito-gurcoff.avif`, referenciada en un post de blog, no existe en el repositorio — pendiente de que el equipo de contenido suba la foto real.
- **`content-visibility: auto` en el mega-menú se evaluó y se descartó** con evidencia real — no aporta ahorro porque el elemento está geométricamente dentro del viewport inicial. No se debe reabrir este punto sin volver a medir la posición real del elemento.
- **No se corrió `bundle exec jekyll build`** desde este entorno (no se pudieron instalar las gems de Jekyll, egress de red restringido) — la validación de sintaxis Liquid/HTML se hizo sirviendo el sitio con el `jekyll serve` que la usuaria ya tenía corriendo, no con un build limpio desde cero. Se recomienda correr un build local antes de publicar, como último chequeo de forma.

---

## 7. Recomendaciones y próximos pasos

1. **Revisar el diff completo antes de publicar** (`git diff` / `git status` en el repositorio) — todos los cambios están documentados por archivo en las secciones anteriores, pero conviene una revisión visual final antes del push.
2. **Publicar a producción** cuando la revisión esté conforme.
3. **Retomar la Fase 4** una vez publicado:
   - 4.1: correr Lighthouse/PSI real sobre las 51 URLs y comparar contra la línea base de este informe.
   - 4.2: montar el monitoreo mensual de Search Console (Core Web Vitals de campo) — la usuaria decidirá si automatizado o manual, se dejó pendiente a propósito.
4. **Avisar al equipo de contenido** sobre la imagen faltante del post de Gurcoff.
5. **Usar el presupuesto de performance** (`presupuesto-performance-contenido-nuevo.md`) como criterio de publicación para cualquier página nueva de aquí en adelante, para no repetir los patrones de bug que se corrigieron en este trabajo (front matter incompleto, scripts de terceros sin diferir).
6. **Evaluar autohospedar las fuentes de Google** como mejora futura, fuera de este ciclo de trabajo.

---

## 8. Checklist consolidado

- [x] Fase 1 — Acciones críticas (5/5 puntos ejecutados y verificados en vivo)
- [x] Fase 2 — Ruta crítica de LCP (3/5 implementados, 1 descartado con evidencia, 1 sin cambios necesarios)
- [x] Fase 3 — Consolidación CLS/TBT (3/3 puntos verificados, 0 cambios de código requeridos)
- [ ] Fase 4.1 — Re-auditoría real de las 51 URLs (bloqueado, esperando producción)
- [ ] Fase 4.2 — Monitoreo mensual de Search Console (pospuesto a pedido de la usuaria)
- [x] Fase 4.3 — Presupuesto de performance para contenido nuevo

---

*Documentación técnica detallada de cada fase disponible en `_plans/sofi/archivo/` (Fases 1-3, cerradas) y `_plans/sofi/fase-4-monitoreo-validacion.md` (Fase 4, activa). Contexto completo del proyecto en `memoria-proyecto-italgel-seo-tecnico.md`.*
