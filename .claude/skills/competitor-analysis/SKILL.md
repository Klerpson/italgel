---
name: competitor-analysis
description: Análisis de competencia en SERPs para una keyword específica. Se activa con "competencia", "qué rankea", "análisis SERP", "top resultados", "qué hace la competencia", o antes de crear contenido estratégico.
---

# Competitor Analysis Skill

## Propósito

Analizar qué está rankeando en top 10 de Google para una keyword específica y encontrar gaps de oportunidad para superarlos.

## Input requerido

- **Keyword específica** a analizar (ej: "desarrollo web Cali", "posicionamiento web Bogotá")
- **Ubicación geográfica** si es búsqueda local (ej: "co" para Colombia, "us" para USA)
- _(Opcional)_ Número de resultados a analizar (default: top 10, máximo: top 10)

## Proceso de análisis

### 1. Scraping de SERPs con Playwright MCP

**Paso 1: Buscar en Google**

```javascript
// Construir URL de búsqueda con parámetros de localización
const searchURL = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&gl=${countryCode}&hl=${languageCode}`;

// Extraer resultados orgánicos (ignorar ads y featured snippets para análisis de competencia)
Resultados a extraer de cada posición:
- Posición en SERP (1-10)
- Título (H1 del snippet)
- URL completa
- Meta description (descripción mostrada)
- Tipo de resultado (página, video, imagen, etc.)
```

**Paso 2: Visitar cada URL top 5-10**

```javascript
Para cada resultado, extraer:

ESTRUCTURA:
- H1 principal
- Todos los H2s (estructura de contenido)
- Todos los H3s (subtemas)
- Jerarquía de headers completa

MÉTRICAS:
- Word count total (aproximado)
- Número de imágenes
- Número de enlaces internos
- Número de enlaces externos

SEO TÉCNICO:
- ¿Tiene schema markup? (buscar script type="application/ld+json")
- Tipo de schema si existe (Article, FAQ, HowTo, LocalBusiness, etc.)
- ¿Tiene FAQ visible?
- ¿Tiene tabla de contenidos?

CONTENIDO:
- Primeras 200 palabras (para analizar hook)
- Menciones de precios (¿habla de costos?)
- CTAs identificados
- Tipo de medio (imágenes, videos embebidos, infografías)
```

**Paso 3: Capturar screenshots (opcional)**

```javascript
// Si necesitas mostrar visualmente
await page.screenshot({
  path: "competitor-{posicion}.png",
  fullPage: false, // Solo above the fold
});
```

### 2. Análisis comparativo

**Output estructurado:**

```markdown
## Análisis de Competencia: "[Keyword]"

**Ubicación:** [País/Ciudad]
**Fecha:** [YYYY-MM-DD]
**Posición actual cliente:** [Si conocida, sino "No rankea en top 100"]

---

### 📊 TOP 5 RESULTADOS

| Pos | Dominio      | Title Tag            | Palabras | H2s | Imgs | Schema     | Insights Clave                               |
| --- | ------------ | -------------------- | -------- | --- | ---- | ---------- | -------------------------------------------- |
| 1   | ejemplo1.com | "Título completo..." | 2,400    | 8   | 12   | ✅ FAQ     | Schema FAQ + muchas imágenes                 |
| 2   | ejemplo2.com | "Título completo..." | 1,800    | 6   | 8    | ❌         | Contenido más corto pero imágenes de calidad |
| 3   | ejemplo3.com | "Título completo..." | 3,200    | 12  | 15   | ✅ Article | El más extenso, muy detallado                |
| 4   | ejemplo4.com | "Título completo..." | 2,100    | 7   | 10   | ✅ HowTo   | Formato tutorial paso a paso                 |
| 5   | ejemplo5.com | "Título completo..." | 1,950    | 9   | 6    | ❌         | Menos imágenes pero bien estructurado        |

---

### 📈 PATRONES IDENTIFICADOS

**Promedio del Top 5:**

- **Longitud:** 2,290 palabras
- **Número de H2s:** 8.4
- **Imágenes:** 10.2 por página
- **Schema markup:** 3/5 tienen (60%)
- **Menciona precios:** 2/5 (40%)
- **Tiene FAQ visible:** 3/5 (60%)

**Rango de variación:**

- Mínimo: 1,800 palabras (#2)
- Máximo: 3,200 palabras (#3)
- Diferencia: 1,400 palabras (variación alta)

---

### 🎯 GAPS DE OPORTUNIDAD

Elementos que la competencia NO está haciendo (o hace mal):

#### 1. **Schema FAQ - Oportunidad Alta**

**Situación:** Solo 3/5 tienen FAQ schema
**Acción:** Agregar 6-8 preguntas frecuentes con schema markup
**Impacto esperado:** Featured snippet potencial en "People Also Ask"

#### 2. **Información de Precios - Oportunidad Media**

**Situación:** Solo 2/5 mencionan rangos de precios
**Acción:** Incluir sección transparente con rangos de precios (si aplica al negocio)
**Impacto esperado:** Capturar intent comercial, mejor CTR

#### 3. **Comparativas - Oportunidad Alta**

**Situación:** Ninguno tiene tabla comparativa clara
**Acción:** Crear tabla comparando opciones/métodos/enfoques
**Impacto esperado:** Contenido más útil, mayor tiempo en página

#### 4. **Multimedia - Oportunidad Baja**

**Situación:** Promedio de 10 imágenes, nadie usa video embebido
**Acción:** Considerar agregar video explicativo si el cliente lo tiene
**Impacto esperado:** Diferenciación visual, mayor engagement

---

### 🏗️ ANÁLISIS DE ESTRUCTURA

**Competidor #1 (Mejor posicionado):**
```

H1: [Keyword Principal] - Guía Completa 2026

Intro: 150 palabras respondiendo qué es
├── H2: ¿Qué es [tema]?
│ └── H3: Definición técnica
│ └── H3: ¿Para quién es?
├── H2: Beneficios de [tema]
│ └── H3: Beneficio 1
│ └── H3: Beneficio 2
├── H2: Cómo funciona [tema]
│ └── H3: Paso 1
│ └── H3: Paso 2
│ └── H3: Paso 3
├── H2: Precios de [tema] en [Ciudad]
├── H2: Preguntas Frecuentes
│ └── 5 FAQs con schema
└── H2: Conclusión + CTA

Schema: FAQ + Article
Word count: 2,400
Internal links: 7
External links: 3 (fuentes médicas)

```

**Análisis:**
- ✅ Estructura lógica y clara
- ✅ Responde intent desde el inicio
- ✅ Cubre precios (intent comercial)
- ⚠️ FAQs podrían ser más (solo 5)
- ❌ No hay tabla comparativa

---

### ✨ ESTRUCTURA RECOMENDADA (Mejorada)

Basada en análisis de competencia + gaps identificados:

```

H1: [Keyword] en [Ciudad]: [Beneficio Único] | [Año]

Intro: 200 palabras

- Respuesta directa a la búsqueda (primeras 50 palabras)
- Hook emocional o dato sorprendente
- Preview de lo que encontrará en el artículo

├── H2: [Subtema más buscado según data] ← Priorizar por intent
│ └── H3: Aspecto específico 1
│ └── H3: Aspecto específico 2
│
├── H2: Comparativa / Tabla de Opciones ← DIFERENCIADOR #1
│ └── Tabla HTML con comparación clara
│
├── H2: Proceso Paso a Paso
│ └── H3: Paso 1 (con número visible)
│ └── H3: Paso 2
│ └── H3: Paso 3
│ └── [Considerar schema HowTo aquí]
│
├── H2: Precios y Opciones de Financiamiento ← DIFERENCIADOR #2
│ └── Rangos de precios transparentes
│ └── Tabla comparativa de paquetes
│
├── H2: Preguntas Frecuentes (8-10 preguntas) ← DIFERENCIADOR #3
│ └── Con schema FAQ para featured snippets
│
└── H2: [CTA] + Siguiente Paso Claro

Target word count: 2,500 palabras (110% del promedio)
Schema: Article + FAQ + (HowTo si aplica)
Internal links: 8-10 (más que competencia)
External links: 2-3 (solo fuentes autoritativas)
Imágenes: 12-15 (más que promedio)

```

---

### 💡 INSIGHTS CLAVE PARA CONTENIDO

**✅ HACER:**
1. **Superar longitud promedio en 10-15%** → Target: 2,500 palabras vs 2,290 promedio
2. **Agregar elementos diferenciadores:**
   - Tabla comparativa (ninguno lo hace)
   - Sección de precios detallada (solo 2/5)
   - 8+ FAQs con schema (promedio: 5)
3. **Cubrir subtemas que competencia ignora:**
   - [Identificar en el análisis específico]
4. **Optimizar para Featured Snippets:**
   - FAQ schema obligatorio
   - Respuesta directa en primeros 50 palabras
   - Listas numeradas para "pasos"

**❌ EVITAR:**
1. **NO copiar estructura exacta** → Necesitamos diferenciarnos
2. **NO solo ser "más largo"** → Agregar valor real, no relleno
3. **NO ignorar intent comercial** → Si buscan precios, incluirlos

---

### 🔍 ANÁLISIS DE TÍTULOS (CTR Optimization)

**Patrón dominante en Top 5:**
```

#1: "[Keyword]: Guía Completa + Precios 2026"
#2: "[Keyword] en [Ciudad] - Lo que Debes Saber"
#3: "Guía de [Keyword]: Todo sobre [Tema]"
#4: "[Keyword]: Beneficios, Proceso y Costos"
#5: "¿Qué es [Keyword]? Guía 2026"

```

**Elementos comunes:**
- 3/5 incluyen año (2026)
- 2/5 mencionan "precios" o "costos"
- 4/5 usan "guía" o "completa"
- Todos tienen keyword al inicio

**Oportunidad de diferenciación:**
```

Propuesta: "[Keyword] [Ciudad]: [Beneficio Específico] + Precios 2026"

Ejemplo: "Páginas web profesionales: Desarrollo web profesional, de código y posicionamiento web"
vs genérico: "Páginas web profesionales: Desarrollo web profesional, de código y posicionamiento web"

Diferenciador: Menciona "Desarrollo web profesional, de código y posicionamiento web" (credibilidad) + mantiene precios

```

---

### 📱 ANÁLISIS DE META DESCRIPTIONS

**Patrón dominante:**
```

#1: "[keyword]: Te explico porqué pierdes dinero si..."
#2: "[keyword] en [ciudad]. Te doy los mejores..."
#3: "¿Necesitas [keyword]? Te doy información sobre costos..."

```

**Elementos comunes:**
- Todos usan pregunta o imperativo
- 3/5 mencionan "precios" o "costos"
- Longitud: 145-158 caracteres

**Oportunidad de diferenciación:**
```

Propuesta: "[Beneficio] + [Datos concretos] + [CTA claro]"

Ejemplo: "Páginas web profesionales desde 2 millones de pesos: Desarrollo con código a la medida"

vs genérico: "Descubre todo sobre páginas web profesionales en Cali. Precios, métodos y más información aquí."

```

---

## 🎯 SIGUIENTE PASO RECOMENDADO

Basado en este análisis, la acción recomendada es:

**Opción A - Crear contenido superior:**
```

/new-post "[keyword principal]"

```
Con estos elementos diferenciadores ya identificados.

**Opción B - Crear brief detallado primero:**
```

"Crea un content brief para '[keyword]' basado en este análisis
de competencia, incluyendo los gaps de oportunidad identificados"

```

**Opción C - Profundizar en un competidor específico:**
```

"Analiza en detalle la estructura de contenido del resultado #1"

```

```

## Reglas obligatorias

### ✅ SIEMPRE hacer:

- Analizar mínimo top 5 resultados (ideal: top 10)
- Identificar patrones cuantitativos (promedios, rangos)
- Encontrar gaps específicos de oportunidad
- Proponer estructura mejorada, no copiar
- Capturar insights accionables, no solo descriptivos

### ❌ NUNCA hacer:

- Analizar solo 1-2 resultados (insuficiente para patrones)
- Recomendar "copiar" estructura de competencia
- Hacer scraping sin usar Playwright MCP (resultados inconsistentes)
- Ignorar el schema markup en análisis técnico
- Dar recomendaciones genéricas sin datos del scraping

### ⚠️ Advertencias:

- **Resultados de Google varían por ubicación:** Siempre especificar gl= y hl= en búsqueda
- **Ads vs orgánico:** Filtrar paid results, solo analizar resultados orgánicos
- **Featured snippets:** Son oportunidad, pero analiza contenido de la página origen
- **Análisis ≠ plagio:** Aprender de estructura, no copiar contenido

## Anti-patterns comunes

❌ **"El #1 tiene 2,400 palabras, hagamos 2,400"**
✅ **Correcto:** "Promedio es 2,290, haremos 2,500 con estos 3 elementos diferenciadores que nadie tiene"

❌ **"Todos tienen la misma estructura, copiémosla"**
✅ **Correcto:** "Estructura común funciona, pero agregaremos [X] y [Y] que nadie hace para destacar"

❌ **Listar competencia sin análisis**
✅ **Correcto:** "3/5 tienen FAQ schema, es el gap más fácil de atacar para featured snippets"
