---
name: keyword-research
description: Investigación de keywords ANTES de crear contenido. Se activa con "keywords", "volumen de búsqueda", "investigación", "Ubersuggest", cuando subes CSVs de keywords, o mencionas "buscar palabras clave".
---

# Keyword Research Skill

## Propósito
Encontrar y priorizar keywords ANTES de crear contenido nuevo para posicionamiento SEO.

## Input esperado
- Tema o servicio del cliente (ej: "cirugía plástica Cali", "abogado laboral Bogotá")
- CSV de Ubersuggest (columnas: Keyword, Vol, CPC, PD, SD)
- Nicho del cliente (referencia .claude/CLAUDE.md del proyecto)

## Proceso de análisis

### 1. Procesar datos de Ubersuggest

**Si el usuario sube CSV de Ubersuggest:**

```
Columnas esperadas:
- Keyword: La palabra clave
- Vol: Volumen de búsqueda mensual
- CPC: Costo por clic (indicador de valor comercial)
- PD: Paid Difficulty (dificultad en paid ads)
- SD: SEO Difficulty (dificultad orgánica 0-100)

Categorización automática:
┌─────────────────┬──────────────┬──────────────┬─────────────────┐
│ Categoría       │ Volumen      │ Dificultad   │ Estrategia      │
├─────────────────┼──────────────┼──────────────┼─────────────────┤
│ Quick Wins      │ >500         │ SD < 35      │ Atacar primero  │
│ Medio Plazo     │ 300-1000     │ SD 35-55     │ 3-6 meses       │
│ Long-tail       │ <300         │ SD < 30      │ Contenido apoyo │
│ Head Terms      │ >2000        │ SD > 60      │ Objetivo largo  │
└─────────────────┴──────────────┴──────────────┴─────────────────┘
```

**Si NO hay CSV disponible:**

```
"Para resultados precisos necesito el CSV de Ubersuggest con estas columnas: 
Keyword, Vol, CPC, PD, SD

Alternativa básica: Puedo hacer scraping de Google Autocomplete usando 
Playwright MCP pero NO tendré datos de volumen ni dificultad.

¿Prefieres esperar el CSV o proceder con scraping básico?"
```

### 2. Categorización por Search Intent

Inferir intent automáticamente según patrones en la keyword:

```markdown
┌────────────────────────┬──────────────────┬─────────────────────────┐
│ Patrón de Keyword      │ Intent           │ Tipo de Contenido       │
├────────────────────────┼──────────────────┼─────────────────────────┤
│ "qué es", "cómo",      │ Informacional    │ Blog post educativo     │
│ "guía", "tutorial"     │                  │ Tutorial paso a paso    │
├────────────────────────┼──────────────────┼─────────────────────────┤
│ "precio", "costo",     │ Comercial        │ Comparativa/Landing     │
│ "cuánto", "mejor"      │                  │ Página con pricing      │
├────────────────────────┼──────────────────┼─────────────────────────┤
│ "comprar", "contratar",│ Transaccional    │ Landing de servicio     │
│ "agendar", "reservar"  │                  │ Página de conversión    │
├────────────────────────┼──────────────────┼─────────────────────────┤
│ [marca], [nombre],     │ Navegacional     │ Página institucional    │
│ [profesional]          │                  │ About/Contacto          │
└────────────────────────┴──────────────────┴─────────────────────────┘
```

**Indicadores de intent comercial alto:**
- CPC > $2 USD (en Ubersuggest)
- Contiene: "precio", "costo", "mejor", "vs", "comparación"
- Usuario está evaluando opciones = alta conversión potencial

### 3. Análisis de oportunidades

**Priorización por ROI potencial:**

```
Score = (Volumen / 100) × (100 - Dificultad) × Multiplicador_Intent

Multiplicador_Intent:
- Transaccional: 2.0
- Comercial: 1.5
- Informacional: 1.0
- Navegacional: 0.5
```

**Filtros automáticos:**
- ❌ Excluir: SD > 70 (demasiado competitivas para empezar)
- ❌ Excluir: Vol < 30 (demasiado bajo, salvo ultra long-tail estratégicas)
- ✅ Priorizar: Balance volumen/dificultad con intent comercial

### 4. Output: Tabla priorizada

```markdown
## Keyword Research: [TEMA DEL CLIENTE]
**Fecha:** [YYYY-MM-DD]
**Total keywords analizadas:** [N]
**Keywords recomendadas:** [N seleccionadas]

---

### 🎯 QUICK WINS (Atacar primeros 30 días)
Estas keywords tienen el mejor balance volumen/dificultad para resultados rápidos.

| Keyword | Vol | SD | Intent | CPC | Acción Recomendada |
|---------|-----|----|----|-----|-------------------|
| [keyword] | 480 | 28 | Comercial | $3.20 | Landing: "Precios Rinoplastia Cali 2026" |
| [keyword] | 350 | 22 | Informacional | $1.80 | Post: "Recuperación Rinoplastia: Guía 2026" |

**Estrategia Quick Wins:**
- Crear contenido en los próximos 7-14 días
- Optimizar on-page al 100%
- Enlazar internamente entre estos posts

---

### 📈 MEDIO PLAZO (Siguiente 3-6 meses)
Keywords más competitivas que requieren autoridad de dominio.

| Keyword | Vol | SD | Intent | CPC | Acción Recomendada |
|---------|-----|----|----|-----|-------------------|
| [keyword] | 2400 | 58 | Transaccional | $8.50 | Landing principal de servicio |
| [keyword] | 1200 | 52 | Comercial | $5.20 | Comparativa con competencia |

**Estrategia Medio Plazo:**
- Construir autoridad con Quick Wins primero
- Crear contenido más extenso (2000+ palabras)
- Conseguir backlinks de calidad

---

### 🎁 LONG-TAIL (Contenido de soporte)
Alto potencial de conversión por especificidad, bajo volumen.

| Keyword | Vol | SD | Intent | Acción Recomendada |
|---------|-----|----|----|-------------------|
| [keyword long-tail específica] | 90 | 15 | Informacional | FAQ / Sección en post principal |
| [keyword long-tail específica] | 60 | 12 | Comercial | Landing micro-nicho |

**Estrategia Long-Tail:**
- Usar como H2/H3 en contenido principal
- Crear FAQs con schema markup
- Páginas micro-nicho si muy rentables

---

## 🎯 ESTRATEGIA RECOMENDADA

**Keyword Principal:** [la más estratégica según análisis]

**Keywords Secundarias (incluir naturalmente):**
1. [keyword secundaria 1]
2. [keyword secundaria 2]
3. [keyword secundaria 3]
4. [keyword secundaria 4]
5. [keyword secundaria 5]

**Cluster de contenido sugerido:**
```
[Keyword Principal] (Landing/Post principal)
    ├── [Long-tail 1] (H2 dentro del principal)
    ├── [Long-tail 2] (H2 dentro del principal)
    ├── [Keyword relacionada] → Post separado + internal link
    └── [Keyword relacionada] → Post separado + internal link
```

---

## 📊 SIGUIENTE PASO

**Opción A - Analizar competencia primero:**
```
/competitor-analysis "[keyword principal elegida]"
```
Esto te dirá QUÉ hace la competencia en top 5 de Google.

**Opción B - Crear contenido directamente:**
```
/new-post "[keyword principal]"
```
Si ya tienes claridad de la estrategia de contenido.

**Opción C - Crear brief detallado:**
```
"Crea un content brief para '[keyword principal]' basado en este keyword research"
```
```

## Reglas obligatorias

### ✅ SIEMPRE hacer:
- Incluir mínimo 10 keywords categorizadas (si hay datos suficientes)
- Priorizar por score de oportunidad (volumen × facilidad × intent)
- Indicar tipo de contenido ESPECÍFICO para cada keyword
- Agrupar keywords relacionadas en clusters semánticos
- Destacar keywords con CPC alto (alto valor comercial)

### ❌ NUNCA hacer:
- Recomendar keywords con SD > 70 (muy competitivas sin autoridad)
- Recomendar keywords con Vol < 30 (salvo caso estratégico justificado)
- Mezclar keyword research con redacción de contenido (eso es skill copywriter)
- Dar recomendaciones genéricas sin datos concretos de volumen/dificultad
- Ignorar el search intent al categorizar

### ⚠️ Advertencias críticas:
- **No confundir volumen con oportunidad:** Una keyword de 5000/mes con SD 85 es peor que una de 400/mes con SD 25
- **Intent > Volumen:** Una keyword transaccional de 200/mes vale más que una informacional de 2000/mes
- **Contexto del cliente importa:** Revisa .claude/CLAUDE.md para entender nicho y objetivos antes de recomendar

## Formato de datos esperado (CSV Ubersuggest)

```csv
Keyword,Vol,CPC,PD,SD
precio rinoplastia cali,480,3.20,45,28
rinoplastia cali,2400,8.50,78,58
recuperacion rinoplastia cuantos dias,90,1.80,12,15
```

Si el CSV tiene columnas diferentes, adaptar el parsing automáticamente e informar al usuario.

## Anti-patterns comunes

❌ **"Esta keyword tiene mucho volumen, vamos con esa"**
✅ **Correcto:** "Esta keyword tiene SD 75, necesitamos más autoridad primero. Ataquemos esta de SD 25 para construir momentum."

❌ **Listar 100 keywords sin priorización**
✅ **Correcto:** "Top 10 keywords priorizadas por ROI, categorizadas en Quick Wins / Medio Plazo / Long-Tail"

❌ **Ignorar el CPC**
✅ **Correcto:** "CPC de $8.50 indica alto valor comercial, priorizar aunque sea más difícil"
