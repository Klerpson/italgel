# Auditoría técnica de performance — italgel.com.co

**Fecha del análisis:** 21 de septiembre de 2026
**Fuente de datos:** `lighthouse-report-italgel.com.co.csv` (51 URLs, 0 enlaces rotos detectados)
**Alcance de este plan:** SEO técnico enfocado exclusivamente en **performance / Core Web Vitals**. Meta tags (title, description) quedan fuera a propósito, por indicación explícita — no se tocan en ninguna fase.
**Metodología:** no me quedé en los números del CSV. Entré al repositorio real del sitio (Jekyll, GitHub Pages) y revisé el código fuente (`_layouts`, `_includes`, `css`, `js`, páginas de producto) para encontrar la causa raíz de cada síntoma, no solo describir el síntoma. Cada hallazgo de este documento está respaldado por una línea de código o un archivo real, citado con su ruta.

---

## 1. Lo que ya está bien hecho (no tocar)

El sitio parte de una base técnica sólida. Antes de listar problemas, esto es lo que ya funciona correctamente y que cualquier cambio de las fases siguientes debe **preservar**:

- Stack Jekyll (Static Site Generator) sobre GitHub Pages: no hay framework de JS en cliente, todo el HTML nace ya renderizado en build. Esto ya cumple con el lineamiento del proyecto de que "el JS debe ser renderizado".
- CSS crítico inline en `<head>` (`_includes/css/critical.css`) + hoja de estilos completa minificada vía `layout: compress`.
- `preconnect` / `dns-prefetch` ya declarados para Google Fonts, GTM y Lordicon.
- Los 4 scripts propios (`app.js`, `search.js`, `lead-whatsapp.js`, `lordicon.js`) cargan con `defer`.
- Patrón `preload as="style" + onload swap` para no bloquear el render con Google Fonts.
- Imágenes en AVIF, ya livianas (la mayoría entre 40–90 KB) y con `width`/`height` explícitos en casi todas las plantillas.
- HTML minificado (`layout: compress`) y 0 links rotos en las 51 URLs auditadas.
- Best Practices y SEO en 100/100 en las 51 URLs. Accesibilidad estable en 96/100 en todo el sitio (no forma parte de este plan, que es solo performance, pero al ser un número idéntico en las 51 URLs sugiere una única causa sitewide fácil de resolver — queda anotado para una futura auditoría de accesibilidad, fuera de este documento).

**Conclusión clave:** el cuello de botella del sitio **no son las imágenes** (ya están optimizadas) ni la arquitectura general (ya es rápida por ser estática). El problema está concentrado en la **ruta crítica de renderizado** (qué se ejecuta y en qué orden antes de que el navegador pueda pintar el contenido principal) y en **una plantilla específica** que afecta a un grupo aislado de páginas.

---

## 2. Panorama general (50 URLs de contenido, sin contar la fila de links rotos vacía)

| Métrica | Promedio | Mediana | Mínimo | Máximo | Objetivo Google |
|---|---|---|---|---|---|
| Performance score | 74.5 | — | 54 | 93 | ≥ 90 |
| LCP | 4.31 s | 4.3 s | 2.7 s | 7.8 s | < 2.5 s |
| TBT | 205 ms | 180 ms | 110 ms | 780 ms | < 200 ms |
| CLS | 0.064 | 0.017 | 0 | 0.41 | < 0.1 |
| FCP | 2.94 s | 3.4 s | 1.1 s | 3.7 s | < 1.8 s |

**Distribución por umbral de Google (Core Web Vitals):**

| Métrica | Malo | Mejorable | Bueno |
|---|---|---|---|
| LCP | 39/50 (78%) | 11/50 (22%) | 0/50 |
| CLS | 6/50 (12%) | 0/50 | 44/50 (88%) |
| TBT | 1/50 (2%) | 14/50 (28%) | 35/50 (70%) |

**Lectura:** el problema #1 en volumen es **LCP** — casi ninguna URL pasa el umbral "bueno" de Google, así que es el que más impacto tiene sobre el ranking (Core Web Vitals es señal de ranking de Google desde 2021). El problema #2 en severidad (aunque acotado) es **CLS**, concentrado en solo 6 URLs pero con valores muy altos (0.36–0.41, "malo" según el umbral 0.25). El problema #3 es **TBT**, con un único caso extremo y un grupo de 14 URLs "mejorable".

---

## 3. Hallazgos de causa raíz (con evidencia de código)

### 3.1 LCP generalizado — la ruta crítica, no el peso de las imágenes

Todas las plantillas usan imágenes AVIF livianas con `fetchpriority="high"` y dimensiones explícitas — eso ya está bien. El problema está en lo que se ejecuta **antes** de que el navegador llegue a esa imagen:

- **Google Tag Manager (GTM-TH788DQN)** se inyecta en `_includes/head.html`, al final del `<head>`, con un `<script>` inline que dispara la carga de `gtm.js` de forma inmediata en cuanto el parser llega a esa línea — antes de que el navegador siquiera empiece a parsear el `<body>` donde está la imagen LCP. Aunque el script en sí es `async`, GTM consume ancho de banda y CPU en el momento más crítico de la carga, y desde ahí puede disparar más tags (GA4, píxeles) que compiten por el mismo hilo principal.
- No hay `<link rel="preload" as="image">` para la imagen hero en `<head>`. El `fetchpriority="high"` en el `<img>` ayuda, pero el navegador solo lo puede aplicar una vez el parser llega hasta ese punto del `<body>` — y antes tiene que atravesar `_includes/nav.html` (13.5 KB, el mega-menú completo se renderiza siempre, aunque esté oculto) + `_includes/header.html`.
- Las 3 familias de Google Fonts cargadas (DM Mono, DM Sans, Fraunces) son **variable fonts** con rangos de peso muy amplios (`100..1000`, con eje óptico y cursivas incluidas). Aunque ya usan el patrón no-bloqueante, siguen siendo descargas pesadas desde un origen externo adicional.

**Patrón real que confirma esto:** las páginas con **mejor** LCP del sitio (`/insumos/` 2.7s, `/insumos-heladeria-cali/` 3.0s, `/vitrinas-congeladores/` 2.9s) no tienen menos peso de imagen que el resto — tienen el mismo patrón de imagen que las demás. Lo que sí comparten es una FCP baja (1.6s vs 3.1–3.4s del resto), lo que apunta a variabilidad en cuánto tarda en liberarse el hilo principal antes del primer paint, coherente con contención de GTM/fuentes, no con el peso de la imagen.

### 3.2 CLS crítico (0.36–0.41) — aislado a 6 URLs, y las 6 comparten una sola causa estructural

Las 6 URLs con CLS "malo" son:

| URL | CLS |
|---|---|
| `/pastas-sabores-helado/pasta-vainilla/` | 0.41 |
| `/maquinas-helado-soft/coldelite-compacta-3/` | 0.409 |
| `/bases-helado-colombia/base-50-mec3/` | 0.407 |
| `/pastas-sabores-helado/pasta-pistacho/` | 0.366 |
| `/bases-helado-colombia/supergelmix/` | 0.363 |
| `/bases-helado-colombia/neutralin-plus/` | 0.361 |

Revisé el front matter de las 6 y de un control de páginas con CLS bueno (`amarena-fabbri`, `bases-stevia`, `pastas-clasicas`, `salsas-especiales`): **las 6 URLs con CLS malo, y solo ellas, usan `layout: products`.** Las páginas de control usan `layout: main` y tienen CLS entre 0 y 0.011.

Verifiqué que no es un problema de dimensiones de imagen: las imágenes hero de estas 6 páginas (`base-50-mec3-italgel.avif`, `pasta-pistacho-siciliano-mec3.avif`, `coldelite-compacta-3-soft.avif`, `pasta-vainilla-bourbon-mec3.avif`) miden exactamente 584×584 px real, igual a los atributos `width="584" height="584"` declarados en `_includes/header.html` (bloque `{% when "products" %}`) — coinciden perfectamente, así que **no** es ahí donde se genera el shift.

El sospechoso más fuerte que encontré por código es el bloque específico de ese layout en `_includes/header.html`:

```
.hero_products .hero_title {
  color: var(--color-brand-pink);
  max-width: 20ch;
}
```

Ningún otro layout (`categories`, `general`) restringe el `<h1>` a un ancho tan estrecho (20 caracteres). Combinado con el intercambio de fuente (Fraunces, variable font, cargada con `swap`), un título encajonado en 20ch es mucho más propenso a recalcular su número de líneas cuando la fuente real reemplaza a la de respaldo — y eso sí genera CLS real. Es una hipótesis sólida y consistente con la evidencia, pero **no la voy a dar por confirmada sin verla en la herramienta que sí apunta al nodo exacto que se mueve** (el CSV de Lighthouse no lo dice, solo da el número). Por eso la Fase 1 empieza con un paso de diagnóstico puntual antes de tocar código.

Adicionalmente, en `bases-helado-colombia/base-50-mec3.html` encontré un **error real de HTML mal formado**: en la sección "Proceso paso a paso" hay un `</div>` de cierre sin su `<div>` de apertura correspondiente (el conteo de la página da 17 aperturas contra 19 cierres). No es la causa del CLS masivo del grupo, pero es un defecto de HTML semántico real que corresponde arreglar en este plan.

### 3.3 TBT — un caso extremo y un patrón de "third-party" pesado

- **`/equipos/` → 780 ms (el único "malo" del sitio).** Esta página incluye 3 veces `{% include lordicon.html %}`, que carga `lordicon.js` desde CDN — una librería de iconos animados (Lottie) conocida por su costo de CPU en el hilo principal. Es la única variable que distingue a `/equipos/` de páginas de tamaño similar.
- Lordicon también se usa en `/coberturas-salsas-helado/` (270 ms TBT, la 2ª más alta entre categorías) y `/bases-helado-colombia/neutralin-plus/` (240 ms) — el patrón se repite, aunque con menor intensidad.
- **`/blog/rentabilidad-heladeria-colombia/` → 500 ms TBT, LCP 5.1s, pero la FCP más rápida de todo el sitio (1.1s).** Revisé el post completo (`_posts/2026-04-08-rentabilidad-heladeria-colombia.md`): no tiene tablas, gráficos, embeds ni lordicon — nada en el contenido explica un TBT tan alto. Esta combinación (FCP excelente + LCP y TBT malos) es más compatible con **ruido de medición de una sola corrida de Lighthouse** que con un problema de código. Se re-mide en la Fase 3 antes de invertir esfuerzo en "arreglar" algo que puede no estar roto.

### 3.4 Anomalía de `/blog/` — LCP 7.8s (el peor de todo el sitio, muy por encima de cualquier post individual)

Los posts individuales del blog están entre 3.6–5.6s de LCP. El índice `/blog/` (`blog.html`) se dispara a 7.8s. Revisé el archivo y encontré la causa: la sección "Artículos más leídos" itera sobre **todos** los posts marcados `featured: true` y les pone `loading="eager"` a cada imagen, **sin `fetchpriority`** — a diferencia de cualquier otra plantilla del sitio, que siempre marca una sola imagen como prioritaria. Si hay más de un post destacado (lo normal), el navegador intenta cargar varias imágenes "eager" a la vez, compitiendo entre ellas y con el resto de la página por prioridad de red, y ninguna gana claramente la carrera por ser el elemento LCP rápido.

### 3.5 Detalle menor de imágenes responsive en posts de blog

En `_includes/header.html`, el bloque `{% else %}` (el que usan los posts individuales, `layout: post`) genera:

```
srcset="{{ page.hero }} 1080w, {{ page.hero }} 720w"
```

Las dos entradas del `srcset` apuntan al **mismo archivo**, solo con distinto descriptor de ancho — no hay ninguna variante real más liviana para pantallas chicas. Es inofensivo para el peso (el archivo ya es liviano) pero no cumple su propósito de imágenes responsive.

También verifiqué las dimensiones reales de la imagen hero de estos posts contra lo declarado en HTML: el archivo real mide **1080×820 px**, pero el HTML declara `width="1080" height="720"` — un desajuste de relación de aspecto real (1.317:1 declarado como 1.5:1). Hoy no genera CLS visible (todos los posts están en el rango "bueno"), pero es un descuido técnico que vale la pena corregir por higiene y para no depender de que la diferencia siga siendo tolerable.

---

## 4. Cómo se organizaron las fases

Prioricé por **impacto real (cuántas URLs toca y cuán grave es) dividido por esfuerzo (cuántos archivos hay que tocar)**:

- **Fase 1** — arreglos puntuales de alto impacto y bajo esfuerzo: 1 archivo cada uno, resuelven los casos más extremos.
- **Fase 2** — la ruta crítica del LCP, que es el problema de mayor volumen (39/50 URLs) y requiere cambios un poco más cuidadosos en `head.html` y fuentes.
- **Fase 3** — consolidar el fix de CLS validado en Fase 1 sobre las 6 URLs, y cerrar el TBT residual.
- **Fase 4** — validación y monitoreo, para confirmar que las fases anteriores movieron los números y no rompieron nada.

Cada fase tiene su propio archivo en esta misma carpeta. Ningún archivo de este plan toca meta tags, títulos ni descriptions — eso queda completamente fuera, como se pidió.
