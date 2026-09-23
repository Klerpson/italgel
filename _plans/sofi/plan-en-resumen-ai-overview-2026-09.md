# Plan de acción — Extender y estandarizar "En resumen:" (AI Overview readiness)

**Fecha:** 2026-09-23
**Workstream:** DISTINTO del de `memoria-proyecto-italgel-content-freshness.md` (ese es fechas/dateModified/FAQ). Este plan es sobre el patrón "En resumen:" como respuesta directa para AI Overview y featured snippets.
**Metodología:** Check 1 de la skill `ai-overview-audit` (aportada por la usuaria, originalmente escrita para clínicas — el criterio se adapta aquí a fichas de producto, hubs y páginas core de e-commerce técnico en vez de páginas de servicio médico).
**Regla del proyecto:** no se ejecuta nada de este plan hasta aprobación explícita. Todo texto nuevo debe reusar solo datos ya publicados en cada página — cero cifras inventadas.

---

## 1. Criterio de auditoría (Check 1 adaptado)

Una página está **OK** si responde su query principal en 1-3 frases directas, con datos concretos, inmediatamente visible (para posts: primer bloque después del front matter; para páginas HTML: bloque `<strong>En resumen:</strong>` en el body).

Está **PARCIAL** si existe un resumen pero es genérico, tipo marketing, o sin cifras — no si es correcto pero deja fuera un dato menor.

Está **FALTA** si solo hay un `intro:` corto en el front matter (tagline de 1 línea, sin responder la query) o no hay nada.

---

## 2. Diagnóstico completo

### 2.1 Blog posts (21 total)

| Estado | Cantidad | Detalle |
|---|---|---|
| OK | 18 | Respuesta directa con cifras/fórmulas reales |
| PARCIAL | 2 | Ver 2.3 |
| N/A | 1 | `caso-exito-heladeria-gurcoff.md` — `published: false`, no aplica hasta que se publique |

### 2.2 Fichas de producto (14 total)

| Estado | Cantidad | Páginas |
|---|---|---|
| OK | 1 | `coberturas-salsas-helado/amarena-fabbri.html` |
| PARCIAL | 1 | `coberturas-salsas-helado/salsas-especiales.html` (ver 2.3) |
| FALTA | 10 | Ver Fase B |
| Fuera de alcance | 2 | Sin publicar, pendiente decisión de negocio (ya documentado en la memoria de freshness): `bases-helado-colombia/comparativa-base-50-vs-base-100-mec3.html`, `variegatos-helado/diferencia-entre-variegato-y-salsa.html` |

### 2.3 Hubs de categoría (10 total)

Todos **FALTA**. Solo tienen `intro:` tipo tagline (ej. "Bases MEC3 formuladas para overrun óptimo según tu tipo de helado") — no responde una query concreta con datos.

### 2.4 Páginas core (6) y páginas ciudad (4)

Todas **FALTA**, mismo patrón: `intro:` tagline corto, sin respuesta directa con datos.

---

## 3. Hallazgos PARCIAL — corregir primero (bajo riesgo, texto ya existe)

1. **`_posts/2025-10-02-que-es-gelato-vs-helado-diferencias.md`** — el resumen actual lista categorías de diferencia (overrun, temperatura, grasa, base) pero no da los valores concretos ahí mismo; esos valores sí existen más abajo en el cuerpo del post. Acción: reescribir el resumen incorporando las cifras reales que ya están en el artículo (rangos de overrun, temperatura de servicio), sin inventar ninguna.
2. **`coberturas-salsas-helado/salsas-especiales.html`** — el texto actual ("están diseñadas para diferenciar tu negocio... Distribuimos en Bogotá, Medellín y Cali, con asesoría técnica y envíos rápidos") es copy de venta, no una respuesta a "qué son las salsas especiales para helado". Acción: reescribir como definición + dato técnico (ej. qué las diferencia de una salsa genérica, temperatura de estabilidad, formato), reusando specs que ya están en el cuerpo de la ficha.

---

## 4. Fases de ejecución (priorizadas por impacto, mismo criterio de la skill: páginas de "producto/servicio" > hubs/core > blog ya cubierto)

### Fase A — Corregir los 2 PARCIAL
Los dos hallazgos de la sección 3. Impacto alto, esfuerzo mínimo.

### Fase B — 10 fichas de producto publicadas sin "En resumen"
- `bases-helado-colombia/base-50-mec3.html`
- `bases-helado-colombia/bases-stevia.html`
- `bases-helado-colombia/neutralin-plus.html`
- `bases-helado-colombia/supergelmix.html`
- `maquinas-helado-soft/coldelite-compacta-3.html`
- `pastas-sabores-helado/pasta-pistacho.html`
- `pastas-sabores-helado/pasta-vainilla.html`
- `pastas-sabores-helado/pastas-clasicas.html`
- `pastas-sabores-helado/pastas-fruta.html`
- `pastas-sabores-helado/pastas-premium.html`

Son las páginas de mayor intención de compra (MOFU/BOFU) — prioridad más alta que los hubs. Cada resumen se redacta con las specs (dosificación, overrun, rendimiento, temperatura) que ya están publicadas en esa misma ficha.

### Fase C — 10 hubs de categoría
`bases-helado-colombia`, `coberturas-salsas-helado`, `pastas-sabores-helado`, `maquinas-helado-artesanal`, `maquinas-helado-industrial`, `maquinas-helado-soft`, `variegatos-helado`, `vitrinas-congeladores`, `granelas-decoracion`, `productos-quella` (todos `index.html`).

Resumen de catálogo: qué hay en el hub y el dato diferenciador ya publicado (ej. "hasta 40% más rendimiento" que ya aparece en el H1/description de varios).

### Fase D — Páginas core
`index.html`, `equipos.html`, `insumos.html`, `nosotros.html`, `contacto.html`, `blog.html`. Requieren más cuidado porque son las de mayor tráfico de marca — conviene revisarlas una por una, no en lote.

### Fase E — 4 páginas ciudad
`insumos-heladeria-{barranquilla,bucaramanga,cali,medellin}.html`.

### Fuera de alcance por ahora
Las 2 fichas sin publicar (sección 2.2) — se abordan si/cuando la usuaria decida publicarlas.

---

## 5. Reglas de ejecución

- Reusar únicamente datos que ya están publicados en la página correspondiente. Nunca inventar cifras, precios ni especificaciones nuevas.
- Mismo patrón visual que ya funciona en el blog: `**En resumen:**` (posts) o `<strong>En resumen:</strong>` (HTML), 1-3 frases, con al menos un dato concreto.
- No tocar precios sin validación explícita de la usuaria.
- Verificar cada cambio en `jekyll serve` local antes de dar por cerrada una fase.

---

## 6. Siguiente paso opcional (no incluido en este plan)

La skill `ai-overview-audit` de la usuaria trae 5 checks adicionales no ejecutados todavía: intención real de las preguntas FAQ, cobertura de precio (páginas sin subpágina de precio ni FAQ de precio), schema `speakable` (no existe actualmente en el sitio), tablas en páginas comparativas, y señales E-E-A-T en el cuerpo del texto. Se puede correr como auditoría aparte si se quiere.

---

## 7. Estado

**Fase A ejecutada (2026-09-23).** Los 2 hallazgos PARCIAL fueron corregidos:
- `_posts/2025-10-02-que-es-gelato-vs-helado-diferencias.md`: resumen reescrito con cifras reales del cuerpo (overrun, temperatura, grasa, vida útil en vitrina).
- `coberturas-salsas-helado/salsas-especiales.html`: resumen reescrito como definición + dato técnico (temperatura de estabilidad, dosificación, duración en refrigeración), quitando el copy de venta.

Verificado contra el build de `_site` generado localmente (no se pudo levantar `jekyll serve` manualmente porque `bundle install` no tiene acceso de red en este entorno, pero un build existente en `_site/` se regeneró tras el cambio y confirma el render correcto de ambos párrafos). Cambios sin commit — pendiente de aprobación explícita de la usuaria para hacer commit/push.

**Fase B ejecutada (2026-09-23).** Las 10 fichas de producto quedaron con bloque "En resumen" (definición + specs reales tomadas de la misma ficha: overrun, dosificación, rendimiento, temperatura, capacidad):
- `bases-helado-colombia/base-50-mec3.html`, `neutralin-plus.html`, `supergelmix.html`, `bases-stevia.html`
- `maquinas-helado-soft/coldelite-compacta-3.html`
- `pastas-sabores-helado/pasta-pistacho.html`, `pasta-vainilla.html`, `pastas-clasicas.html`, `pastas-fruta.html`, `pastas-premium.html`

Verificado: front matter YAML válido en los 10, tags `<p>`/`<section>` balanceados, diff limpio (solo inserciones, 38 líneas en 10 archivos, nada más tocado). Igual que en Fase A, no se pudo correr `jekyll serve` manual por falta de red en el entorno local para `bundle install`; se validó estructura y balance de HTML/Liquid en su lugar.

Cambios sin commit — pendiente de que la usuaria los revise y haga commit/push.

Pendiente: Fase C (10 hubs de categoría), Fase D (páginas core) y Fase E (4 páginas ciudad), a confirmar con la usuaria.

---

## 8. Cómo retomar en un chat nuevo

1. Leer este archivo completo (secciones 1-7) — tiene el diagnóstico completo y las fases ya priorizadas, no hace falta repetir la auditoría.
2. Confirmar con la usuaria por cuál fase arrancar (por defecto: Fase A, los 2 PARCIAL, es la de menor esfuerzo y riesgo).
3. Este plan es independiente del workstream de `memoria-proyecto-italgel-content-freshness.md` (ese es fechas/dateModified/FAQ, ya cerrado en Fase 1 y 2). No mezclar ambos.
4. Regla del proyecto: reusar solo datos reales ya publicados en cada página, nunca inventar cifras. No hacer commit/push sin permiso explícito de la usuaria.
5. Para verificar cambios: `device_bash` para editar (Python read-modify-write con `assert` de una sola coincidencia, nunca reescribir a mano un archivo completo), y `jekyll serve` local (`http://127.0.0.1:4000/`) para confirmar el render antes de cerrar cada fase.
