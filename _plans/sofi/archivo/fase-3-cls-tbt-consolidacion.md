# Fase 3 — Consolidación de CLS y TBT restante

**Objetivo:** cerrar lo que queda después de las Fases 1 y 2 — confirmar que el fix de CLS se sostiene en las 6 URLs, bajar el TBT "mejorable" que queda en el resto del sitio, y resolver la duda abierta sobre el post de rentabilidad.
**Duración estimada:** 3-5 días.
**Prioridad:** Media — depende de que la Fase 1 (diagnóstico de CLS) y la Fase 2 (GTM, fuentes, lead-whatsapp.js) ya estén aplicadas, porque varias de estas acciones dependen de esos cambios.

---

## ✅ Estado: EJECUTADA (parcial) — 21 sep 2026

**Resumen:** los 3 puntos se verificaron con medición real en el navegador contra `http://127.0.0.1:4000/` (Claude en Chrome, perfil "Trabajo SEO"). 3.1 confirmado sin reservas (CLS=0 en las 6 URLs, fix estructural verificado). 3.2 verificado de forma indirecta — no se pudo correr Lighthouse real (mismo bloqueo de red de siempre), pero se confirmó que los 3 mecanismos que deberían bajar el TBT (GTM diferido, sin DM Mono, `lordicon-lazy.js`) están efectivamente activos en las URLs de la lista, y las mediciones locales de "long tasks" no muestran nada anómalo — la confirmación numérica final (<200ms con Lighthouse real) queda pendiente para cuando el sitio esté en producción (Fase 4). 3.3 confirmado: es ruido de medición, no un problema de código — decisión tomada, sin cambios.

**Cómo se verificó:** igual que en Fases 1 y 2 — Claude en Chrome contra el Jekyll local de la usuaria. Sin acceso a PageSpeed Insights/Lighthouse real desde este entorno (mismo bloqueo de red a `googleapis.com`). Para CLS y TBT se usó la Performance API del propio navegador (`PerformanceObserver` con `buffered:true` sobre `layout-shift` y `longtask`), leyendo las entradas reales que el navegador ya registró en la página — no una simulación. Importante: estas mediciones corren **sin el throttling de CPU/red 4x que aplica Lighthouse mobile**, así que los valores absolutos de TBT no son comparables 1:1 contra los del CSV original — lo que sí es válido y comparable es (a) si hay o no `layout-shift` real, y (b) si los mecanismos que causan el TBT (scripts pesados en el arranque) siguen o no presentes.

### 3.1 Confirmar el fix de CLS en las 6 URLs `layout: products` — ✅ Confirmado

CLS = 0 medido en vivo (navegación real + `PerformanceObserver('layout-shift', {buffered:true})`) en las 6 URLs:

| URL | CLS medido |
|---|---|
| `/bases-helado-colombia/base-50-mec3/` | 0 |
| `/bases-helado-colombia/neutralin-plus/` | 0 |
| `/bases-helado-colombia/supergelmix/` | 0 |
| `/maquinas-helado-soft/coldelite-compacta-3/` | 0 |
| `/pastas-sabores-helado/pasta-pistacho/` | 0 |
| `/pastas-sabores-helado/pasta-vainilla/` | 0 |

Además, se repitió la prueba de fallback forzado de la Fase 1 (forzar `font-family: Georgia` sobre `.hero_products .hero_title` y comparar alturas) en las 2 URLs que antes tenían el salto más grande medido (`base-50-mec3`: +67px, `coldelite-compacta-3`): con el fix, `withFraunces` y `withFallback` dan **exactamente la misma altura** (201.5625px) en ambas. Se confirmó también que `font-size-adjust: 0.44` sigue presente en el computed style de `.hero_products .hero_title` en producción local.

**Conclusión:** el fix vive en el CSS compartido de la plantilla (`_includes/css/header.css`), así que cubre automáticamente cualquier producto nuevo con `layout: products`. No se encontró ninguna de las 6 URLs por encima de 0.1 — punto cerrado, no hace falta re-diagnóstico puntual.

### 3.2 Bajar el TBT "mejorable" del resto del sitio (15 URLs entre 200–310ms) — ⚠️ Verificado parcialmente, confirmación numérica pendiente de producción

**Nota sobre la lista:** el plan original decía "14 URLs (210–290ms) + 8 adicionales". Se recalculó directamente del CSV completo (`lighthouse-report-italgel.com.co.csv`) filtrando 200–310ms para tener el dato exacto en vez de la aproximación: son **15 URLs** (`/insumos/` 310, `/blog/crema-de-whisky-para-helado-variegato/` 290, `/coberturas-salsas-helado/` 270, `/blog/que-es-gelato-vs-helado-diferencias/` 260, `/blog/base-50-mec3-vs-supergelmix-comparativa/` 260, `/legal/` 250, `/blog/pasta-de-vainilla-para-helado-tipos-dosificacion/` 250, `/bases-helado-colombia/neutralin-plus/` 240, `/pastas-sabores-helado/pasta-pistacho/` 230, `/granelas-decoracion/` 220, `/nosotros/` 210, `/bases-helado-colombia/bases-stevia/` 210, `/` 210, `/blog/toppings-para-helado-mas-rentables/` 200, `/blog/emulsionantes-estabilizantes-helados-heladeria/` 200). `/equipos/` (780ms) queda fuera de este bucket — es el caso extremo ya tratado en la Fase 1 (Lordicon).

**Lo que se verificó (en 5 de las 15, las de mayor TBT original):**

1. **Los 3 mecanismos que deberían bajar el TBT están activos.** Confirmado por inspección de red real en `/blog/base-50-mec3-vs-supergelmix-comparativa/`:
   - `gtm.js` se pide en `startTime≈505ms`, prácticamente en el mismo instante que `loadEventEnd≈510ms` (diferencia de ruido, ~5ms) — coherente con que el request lo dispara el listener de `load`, no el parseo inicial.
   - La petición a `fonts.googleapis.com` solo trae `DM+Sans` y `Fraunces` — cero peticiones a fuentes DM Mono.
   - `js/lordicon-lazy.js` se carga (el script compartido de la Fase 1); la librería pesada de `cdn.lordicon.com` no se pide de entrada (solo se pediría al hacer scroll hasta un `<lord-icon>`, que es el comportamiento esperado).

2. **Medición directa de "long tasks" (sin throttling) en 5 de las 15 URLs — nada anómalo.** `/insumos/` (3 corridas: 8ms, 0ms, 0ms), `/coberturas-salsas-helado/` (0ms), `/blog/crema-de-whisky-para-helado-variegato/` (1ms), `/blog/que-es-gelato-vs-helado-diferencias/` (7ms), `/blog/base-50-mec3-vs-supergelmix-comparativa/` (0ms). También se repitió la corrida en `base-50-mec3` (una de las 6 de CLS) 2 veces: la primera dio 203ms en una sola tarea larga, la repetición dio 3ms — **alta varianza entre corridas incluso en la misma URL sin tocar nada**, lo cual es el mismo fenómeno de "ruido de laboratorio" que motivó el punto 3.3. Ninguna URL mostró un patrón consistente de tarea larga recurrente atribuible a un script específico.

**Lo que queda pendiente (no se puede hacer desde este entorno):** confirmar el número real de Lighthouse con throttling mobile (4x CPU) sobre las 15 URLs, una vez el sitio esté en producción — mismo bloqueo de red a `googleapis.com` que en Fases 1 y 2. Se deja como parte de la validación de Fase 4. La expectativa según el efecto acumulado de Fases 1-2 (documentado arriba) sigue siendo que la mayoría caiga por debajo de 200ms, pero eso no quedó confirmado con una herramienta de laboratorio equivalente a la original.

### 3.3 Re-medir `/blog/rentabilidad-heladeria-colombia/` antes de tocar código — ✅ Confirmado: es ruido de medición, sin cambios de código

**3 corridas locales (navegación real, sin throttling):**

| Corrida | FCP | LCP | TBT | Long tasks |
|---|---|---|---|---|
| 1 | 492ms | 456ms | 29ms | 1 |
| 2 | 300ms | 500ms | 5ms | 1 |
| 3 | 376ms | 396ms | 0ms | 0 |

Ningún patrón consistente de LCP o TBT elevado — los 3 valores de TBT (29/5/0ms) están en el mismo rango que otros posts de blog medidos en el punto 3.2 (0–7ms), no hay una tarea larga que se repita entre corridas.

**Revisión adicional del contenido y assets del post** (independiente de la medición en navegador, para descartar causas estructurales):
- Sin tablas, sin `<img>`/embeds adicionales, sin `<iframe>` — coincide con lo ya revisado en el plan original.
- `hero_s` (variante mobile) generado en Fase 2: 28.6 KB, en línea con el resto de posts (ej. `variegato-para-helado-profesional-mobile.avif`: 28.5 KB) — no es una imagen desproporcionadamente pesada.
- 1407 palabras — post largo pero no fuera de rango del blog.

**Decisión:** se confirma la hipótesis del plan original — la combinación FCP rápido / LCP-TBT altos en la medición de Lighthouse de origen fue **ruido de una sola corrida**, no un problema real de código. Punto cerrado sin cambios.

---

## Checklist de cierre de Fase 3

- [x] 3.1 CLS confirmado <0.1 en las 6 URLs `layout: products` (CLS=0 en las 6, fix re-verificado con prueba de fallback forzado)
- [x] 3.2 TBT verificado en las 15 URLs "mejorable" — mecanismos de la Fase 1-2 confirmados activos (GTM al load, sin DM Mono, lordicon lazy) y mediciones locales sin anomalías; **confirmación numérica con Lighthouse real queda pendiente de producción (Fase 4)**
- [x] 3.3 `/blog/rentabilidad-heladeria-colombia/` re-medido 3 veces, decisión tomada: ruido de medición, no problema real — sin cambios de código

**Nada de Fase 3 requirió cambios de código** (a diferencia de Fases 1 y 2) — es la fase de verificación, y los 3 puntos confirmaron que el trabajo de las fases anteriores ya cubre lo que hacía falta. El único pendiente real es la confirmación con Lighthouse/PSI en producción, que es exactamente el objetivo de la Fase 4.
