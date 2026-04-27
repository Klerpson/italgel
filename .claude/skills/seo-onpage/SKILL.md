---
name: seo-onpage
description: Optimización de contenido EXISTENTE (páginas ya publicadas). Se activa con "optimizar página", "mejorar SEO de", "revisar contenido", "optimizar post", cuando trabajas editando posts/páginas ya creados, o cuando subes datos de Google Search Console.
---

# SEO On-Page Skill

## Propósito
Optimizar contenido YA PUBLICADO para mejor posicionamiento en buscadores. Esta skill NO crea contenido nuevo, solo mejora el existente.

## Cuándo ejecutar

**✅ USAR esta skill para:**
- Página ya existe pero rankea mal o no rankea
- Contenido antiguo que necesita refresh/actualización
- Página con tráfico que queremos mejorar CTR o posición
- Análisis de contenido basado en datos de GSC

**❌ NO usar para:**
- Crear contenido nuevo → eso es `copywriter` skill
- Setup técnico del sitio → eso es `seo-technical` skill
- Investigar keywords → eso es `keyword-research` skill

## Input requerido

**Obligatorio:**
- URL o ruta del archivo a optimizar (ej: `_posts/2024-01-15-titulo.md`)
- Keyword objetivo principal

**Opcional pero recomendado:**
- Datos de Google Search Console si están disponibles (clicks, impresiones, CTR, posición)
- Keywords secundarias relacionadas
- URLs de competencia en top 3 de Google para esa keyword

## Proceso de optimización

### 1. Análisis del contenido actual

**Leer el archivo y evaluar contra checklist:**

```markdown
## CHECKLIST DE EVALUACIÓN ON-PAGE

### 📄 Front Matter (Jekyll)
- [ ] `title:` contiene keyword principal
- [ ] `title:` tiene 50-60 caracteres (no más de 60)
- [ ] `description:` contiene keyword principal
- [ ] `description:` tiene 150-155 caracteres
- [ ] `description:` incluye CTA o beneficio claro
- [ ] `date:` está actualizado si es contenido refreshed
- [ ] `image:` existe y está optimizada

### 📌 Title Tag (H1)
- [ ] Es único en la página (solo 1 H1)
- [ ] Contiene keyword principal
- [ ] Máximo 60 caracteres para no truncarse
- [ ] Incluye beneficio o año si aplica
- [ ] Formato recomendado: "Keyword: Beneficio | Año" (Año es opcional si aporta valor)

### 🏗️ Estructura de Headers
- [ ] Jerarquía lógica (H1 → H2 → H3, no saltar niveles)
- [ ] H2s contienen variaciones de keyword principal
- [ ] Mínimo 3 H2s para estructura sólida
- [ ] H3s como sub-puntos de H2s (no standalone)

### ✍️ Primer Párrafo (Crítico)
- [ ] Keyword principal en primeras 100 palabras
- [ ] Responde la intención de búsqueda directamente
- [ ] Hook que enganche al lector
- [ ] Longitud: 100-150 palabras (no más largo)

### 🔤 Densidad de Keyword
- [ ] Keyword principal: 1-3% del texto total
- [ ] Variaciones semánticas naturales (no stuffing)
- [ ] LSI keywords (relacionadas) presentes
- [ ] No más de 3% o Google penaliza

### 🖼️ Imágenes
- [ ] TODAS tienen alt text descriptivo
- [ ] Alt text NO es genérico ("imagen1", "foto")
- [ ] Imagen hero contiene keyword en alt
- [ ] Formato WebP o comprimido (<100KB por imagen)
- [ ] Width y height especificados (prevenir CLS)

### 🔗 Enlaces Internos
- [ ] Mínimo 3-5 links internos relevantes
- [ ] Anchor text descriptivo (no "click aquí" o "leer más")
- [ ] Links a contenido relacionado del mismo sitio
- [ ] Distribución natural en el texto (no todos al final)

### 📋 Schema Markup
- [ ] Presente y apropiado al tipo de contenido
- [ ] Article schema para posts de blog
- [ ] FAQ schema si tiene preguntas frecuentes
- [ ] Sin errores en validador de schema.org

### 📊 Longitud de Contenido
- [ ] Mínimo 800 palabras (ideal: 1500-2500 según competencia)
- [ ] No es "thin content"
- [ ] Cubre la intención de búsqueda completamente

### 🎯 Call to Action
- [ ] Al menos 1 CTA claro en el contenido
- [ ] CTA al final invitando a siguiente paso
- [ ] Links a servicios o contacto si aplica
```

---

### 2. Análisis de datos de GSC (si disponibles)

**Si hay datos de Google Search Console:**

```javascript
// Obtener métricas de la página
mcp.gsc.get_page_analytics({
  page_url: "url-de-la-pagina",
  start_date: "YYYY-MM-DD",
  end_date: "YYYY-MM-DD"
})

// Analizar:
// - ¿Qué keywords ya rankean? (mejorar posición)
// - CTR vs posición promedio (oportunidad de optimizar title/description)
// - Queries con impresiones altas pero clicks bajos (CTR bajo = mal title)
// - Posiciones 11-20 (oportunidad de llegar a página 1)
```

**Análisis de oportunidades:**

```markdown
## Datos de Google Search Console

**Período:** [Fecha inicio - Fecha fin]

### Keywords con oportunidad (Posición 11-20)
Estas keywords están cerca de página 1, pequeñas mejoras pueden dar grandes resultados:

| Query | Impresiones | Clicks | CTR | Posición | Acción |
|-------|-------------|--------|-----|----------|--------|
| [query] | 1,200 | 15 | 1.2% | 14 | Mejorar title con esta keyword |
| [query] | 850 | 8 | 0.9% | 18 | Agregar sección H2 específica |

### Keywords con bajo CTR (Posición 1-10 pero CTR <5%)
Estas keywords rankean bien pero nadie hace click, optimizar title/description:

| Query | Impresiones | Clicks | CTR | Posición | Acción |
|-------|-------------|--------|-----|----------|--------|
| [query] | 3,400 | 120 | 3.5% | 5 | Title no es atractivo, reescribir |
| [query] | 2,100 | 40 | 1.9% | 7 | Description genérica, agregar beneficio |

### Keywords rankeando que NO son objetivo
Tráfico bonus que podemos capitalizar:

| Query | Impresiones | Clicks | Posición | Acción |
|-------|-------------|--------|----------|--------|
| [query inesperada] | 800 | 25 | 12 | Expandir contenido para cubrir esto |
```

---

### 3. Generar recomendaciones específicas

**Formato de output:**

```markdown
# Optimización On-Page: [Título de la Página]

**URL:** [URL de la página]
**Keyword principal:** [keyword]
**Posición actual:** [#N o "No rankea en top 100"]
**Fecha de análisis:** [YYYY-MM-DD]

---

## 🔴 ERRORES CRÍTICOS (Impacto Alto - Arreglar AHORA)

### 1. Title tag demasiado largo (68 caracteres)
**Problema:** Se trunca en Google, pierde impacto

**Actual:**
```yaml
title: "Rinoplastia en Cali: Todo lo que Necesitas Saber Sobre la Cirugía Estética"
```

**Sugerido:**
```yaml
title: "Rinoplastia Cali: Precios y Cirujanos 2026"
```

**Impacto esperado:** +2-3% CTR en SERPs (más visible y directo)

---

### 2. Keyword NO está en H1
**Problema:** H1 no incluye keyword principal, Google no ve relevancia inmediata

**Actual:**
```markdown
# Todo sobre la cirugía nasal
```

**Sugerido:**
```markdown
# Rinoplastia en Cali: Guía Completa 2026
```

**Impacto esperado:** Mejora relevancia para algoritmo, puede subir 3-5 posiciones

---

### 3. Meta description sin CTA y muy corta (98 caracteres)
**Problema:** No aprovecha espacio completo y no tiene llamado a la acción

**Actual:**
```yaml
description: "Información sobre rinoplastia en Cali"
```

**Sugerido:**
```yaml
description: "Rinoplastia en Cali desde $8M. Compara cirujanos certificados, revisa resultados reales y cotiza gratis. Guía actualizada 2026 →"
```

**Impacto esperado:** +1-2% CTR por ser más específico y tener precio

---

## 🟡 MEJORAS IMPORTANTES (Impacto Medio)

### 4. Keyword ausente en primer párrafo
**Problema:** Google da mucho peso a primeras 100 palabras

**Actual:**
```markdown
La cirugía nasal es un procedimiento estético común que ayuda a...
```

**Sugerido:**
```markdown
La rinoplastia en Cali se ha convertido en uno de los procedimientos más solicitados, con precios desde $8M y cirujanos certificados. Esta guía te ayudará a...
```

**Impacto esperado:** Mejora relevancia inicial de la página

---

### 5. Solo 2 enlaces internos (mínimo: 4-6)
**Problema:** Pierde oportunidad de distribución de autoridad interna

**Acción:** Agregar enlaces naturales a:
```markdown
- [Precios de cirugía plástica en Cali](/servicios/precios-cirugia-plastica-cali "Incluir un título según la keyword aquí")
- [Recuperación de rinoplastia: cronograma completo](/blog/recuperacion-rinoplastia "Incluir un título según la keyword aquí")
- [Antes y después de rinoplastia: galería](/antes-despues/rinoplastia "Incluir un título según la keyword aquí")
- [Contactar cirujanos certificados](/contacto "Incluir un título según la keyword aquí")
```

**Dónde insertarlos:**
- Párrafo 3: Link a precios
- Sección "Proceso de recuperación": Link a guía de recuperación
- Antes del CTA final: Link a antes/después
- CTA final: Link a contacto

---

### 6. Densidad de keyword: 0.8% (objetivo: 1.5-2%)
**Problema:** Keyword aparece solo 6 veces en 750 palabras

**Acción:** Agregar 3-4 menciones naturales de "rinoplastia en Cali" en:
- H2 de sección "Precios"
- Párrafo de conclusión
- En descripción de proceso
- En FAQ si existe

**Importante:** NO forzar, debe ser natural

---

## 🟢 OPTIMIZACIONES FINAS (Impacto Bajo - Nice to Have)

### 7. Alt text de imágenes es genérico
**Problema:** 3 imágenes tienen alt="imagen1", "imagen2", "imagen3"

**Acción:**
```html
<!-- Antes -->
<img src="foto1.jpg" alt="imagen1">

<!-- Después -->
<img src="foto1.jpg" alt="Resultado de rinoplastia en Cali - antes y después" width="800" height="600">
```

---

### 8. Estructura de H2s no incluye keywords secundarias
**Actual:**
```markdown
## Introducción
## Beneficios
## Conclusión
```

**Sugerido (No utilizar siempre la misma estructura. Es mejor ser disruptivo al redactar, pero siempre utilizando keywords):**
```markdown
## ¿Qué es la rinoplastia y cuándo considerarla?
## Beneficios de la rinoplastia en Cali
## Precios de rinoplastia en Cali 2026
## Proceso de recuperación
## Preguntas frecuentes
## Conclusión: Tu próximo paso
```

---

### 9. Falta FAQ schema para featured snippets
**Acción:** Si tienes sección de preguntas frecuentes, agregar schema FAQ

Referencia: `.claude/assets/schemas/faq.json`

---

## ✅ ELEMENTOS CORRECTOS (Mantener)

Estos elementos están bien optimizados, no cambiar:

- ✅ Schema Article presente y sin errores
- ✅ Todas las imágenes tienen dimensiones especificadas
- ✅ HTTPS activo con canonical correcto
- ✅ Longitud de contenido adecuada (1,800 palabras)
- ✅ Estructura de H2-H3 lógica

---

## 📝 CÓDIGO A MODIFICAR

### Front Matter:

```yaml
---
# ANTES
title: "Todo sobre la cirugía nasal"
description: "Información sobre rinoplastia en Cali"
date: 2024-01-15
image: /assets/img/cirugia-nasal.jpg

# DESPUÉS (optimizado)
title: "Rinoplastia Cali: Precios y Cirujanos 2026"
description: "Rinoplastia en Cali desde $8M. Compara cirujanos certificados, revisa resultados reales y cotiza gratis. Guía actualizada 2026 →"
og_title: "Rinoplastia en Cali 👃"
og_description: "Hora de mejorar tu perfil: Rinoplastia en Cali desde $8M. Cirujanos certificados."
date: 2026-02-05  # Fecha de actualización
last_modified_at: 2026-02-05
image: /assets/img/rinoplastia-cali-precios.webp
---
```

### Contenido:

```markdown
# ANTES
# Todo sobre la cirugía nasal

La cirugía nasal es un procedimiento estético común...

# DESPUÉS (optimizado)
# Rinoplastia en Cali: Precios y recomendaciones 2026

La rinoplastia en Cali se ha convertido en uno de los procedimientos más solicitados, con precios desde $8M y cirujanos certificados que realizan más de 200 procedimientos anuales...
```

---

## 📊 MÉTRICAS DE ÉXITO (KPIs a monitorear)

### Google Search Console (próximos 30-60 días):

**Posiciones:**
- Keyword principal: [Posición actual] → Target: [Posición actual - 5]
- Keywords secundarias: Monitorear aparición en SERPs

**CTR:**
- Actual: [X]% → Target: [X + 2]% (mejora de title/description atractivos)

**Tráfico:**
- Clicks orgánicos: [N actual] → Target: [N + 20%]

### Métricas on-page (Google Analytics):

**Engagement:**
- Bounce rate: Monitorear si baja (mejor contenido = menos rebote)
- Tiempo promedio en página: Target > 2 minutos
- Scroll depth: Target > 75% de usuarios llegan al final

**Conversiones:**
- Clicks en CTAs: Monitorear incremento
- Formularios enviados: Si aplica

---

## 🔄 PRÓXIMA REVISIÓN

**Fecha recomendada:** [Fecha + 60 días]

**Acción en próxima revisión:**
1. Comparar posiciones antes/después
2. Analizar nuevas keywords rankeando
3. Evaluar si necesita más optimización o está bien
4. Decidir si crear contenido complementario

---

## 💡 RECOMENDACIONES ADICIONALES

### Si la página rankea pero no convierte:
- Revisar calidad de leads (¿es la audiencia correcta?)
- Mejorar CTAs (más visibles, más claros)
- Agregar formulario o chat en vivo

### Si la página sigue sin rankear después de optimización:
- Considerar backlinks (link building)
- Crear cluster de contenido relacionado
- Actualizar con más frecuencia (freshness signal)

```

---

## Reglas obligatorias

### ✅ SIEMPRE hacer:
- Analizar el contenido completo antes de recomendar cambios
- Priorizar cambios por impacto (crítico > importante > fino)
- Mostrar código específico a modificar (antes/después)
- Establecer KPIs medibles con fechas
- Preservar lo que ya funciona bien

### ❌ NUNCA hacer:
- Optimizar sin keyword objetivo clara (primero keyword research)
- Hacer keyword stuffing (densidad >3% es spam)
- Cambiar URLs de páginas que ya rankean (solo si es crítico y con redirect 301)
- Recomendar "copiar competencia" (aprender, no plagiar)
- Ignorar datos de GSC si están disponibles

### ⚠️ Advertencias críticas:
- **No cambiar lo que funciona:** Si una página ya rankea bien (#1-3), optimizar con cuidado
- **Keyword stuffing es contraproducente:** Natural > forzado siempre
- **Title/description perfectos no garantizan ranking:** Contenido de calidad es la base
- **Datos de GSC > intuición:** Si GSC dice que una keyword funciona, capitalizarla

## Anti-patterns comunes

❌ **"Agreguemos la keyword 20 veces más"**
✅ **Correcto:** "Densidad actual 0.8%, agregar 3-4 menciones naturales para llegar a 1.5%"

❌ **"Cambiar todo el contenido"**
✅ **Correcto:** "Mantener estructura que funciona, mejorar title, description y primer párrafo"

❌ **Optimizar sin datos**
✅ **Correcto:** "Según GSC, esta keyword en posición 14 tiene 1,200 impresiones. Pequeños cambios pueden llevarla a página 1"

❌ **Enfocarse solo en densidad de keyword**
✅ **Correcto:** "Contenido útil + keyword en lugares estratégicos (H1, primeras 100 palabras, H2s) + experiencia de usuario"
