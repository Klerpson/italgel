---
name: copywriter
description: Creación de contenido (posts, páginas de servicio, landing pages). Se activa con "escribe post", "crea contenido", "redacta página", "nuevo artículo", "/new-post", o cuando necesitas generar o mejorar texto.
---

# Copywriter Skill

## Propósito

Crear contenido optimizado para SEO y persuasión. Esta skill genera contenido desde cero u optimiza contenido existente.

## Cuándo ejecutar

**✅ USAR esta skill para:**

- Crear nuevo post de blog
- Redactar página de servicio
- Escribir landing page
- Generar contenido para sección del sitio
- Optimizar contenido existente
- Investigar keywords
- Maquetación HTML

## Input requerido

**Obligatorio:**

- Keyword principal objetivo
- Tipo de contenido (blog post / página servicio / landing page)
- Cliente específico (leer `.claude/CLAUDE.md` del proyecto para contexto)

**Altamente recomendado:**

- Keywords secundarias (de keyword-research)
- Análisis de competencia (de competitor-analysis)
- Tono/voz del cliente (referencia `.claude/assets/ejemplos/tono-voz.md`)

**Opcional:**

- Longitud objetivo (si no se especifica, usar análisis de competencia)
- CTAs específicos
- Datos o estadísticas a incluir

## Assets del proyecto a consultar

**SIEMPRE revisar antes de escribir:** 2 o 3 ejemplos de la carpeta "\_/posts" de jekyll o de las páginas de servicio. Aprender del estilo de redacción ya utilizado.

## Proceso de creación

### 1. Investigación previa (antes de escribir)

**Checklist pre-escritura:**

```markdown
- [ ] ¿Ya se hizo keyword-research? (Si NO → hacer primero)
- [ ] ¿Ya se analizó competencia? (Recomendado para contenido estratégico)
- [ ] ¿Revisé ejemplos del cliente en .claude/assets/ejemplos/?
- [ ] ¿Leí el CLAUDE.md del proyecto para entender nicho?
- [ ] ¿Tengo claro el search intent de la keyword y su etapa en el embudo de conversiones en la web?
- [ ] ¿Necesita enlazar a otras páginas principales, posts o subpáginas?
```

**Si falta información crítica, PREGUNTAR antes de escribir:**

```
"Antes de escribir, necesito:
1. ¿Ya hiciste keyword research? Si no, ejecuta /keyword-research primero
2. ¿Quieres que analice la competencia? Puedo hacer /competitor-analysis
3. ¿Qué tono prefieres: profesional, cercano, educativo?"
4. ¿A qué público va dirigido el contenido?
```

---

### 2. Estructura del contenido

**Para BLOG POST:** Asegúrate de utilizar el frontmatter tal como se usa en otros posts. No debes pasar ninguna variable.

# [H1: Keyword Principal con Beneficio]

[INTRO: 150-200 palabras]

- Primeras 50 palabras: Respuesta DIRECTA a la búsqueda
- Hook emocional o dato sorprendente
- Preview de lo que encontrará en el artículo
- Keyword principal en primeras 100 palabras
- No uses títulos genéricos y aburridos. Usa títulos que llamen la atención y que sean relevantes para la keyword.

## [H2: Subtema Principal #1]

[Contenido 300-400 palabras]

- Párrafos cortos (1-3 líneas máx)
- Bullet points para listas
- Keyword principal o secundaria en H2 naturalmente
- Ejemplo o dato concreto

### [H3: Aspecto Específico]

[Contenido 150-200 palabras]

- Profundizar en punto específico
- Usar LSI keywords (relacionadas)

## [H2: Subtema Principal #2]

[Contenido 300-400 palabras]

- Continuar estructura lógica
- Internal link relevante insertado naturalmente
- Imagen ilustrativa

### [H3: Aspecto Específico]

[Contenido 150-200 palabras]

## [H2: Tabla Comparativa o Lista] ← DIFERENCIADOR

[Tabla HTML o lista numerada]

- Agregar valor con comparación visual
- Elemento que competencia no tiene

## [H2: Preguntas Frecuentes]

### ¿[Pregunta relacionada con keyword]?

[Respuesta 80-100 palabras concisa y directa]

### ¿[Pregunta relacionada con keyword]?

[Respuesta 80-100 palabras concisa y directa]

[Mínimo 5 FAQs, ideal 8-10 para schema FAQ]

## [H2: Conclusión]

[150-200 palabras]

- Resumen de puntos clave
- Beneficio principal reiterado
- **CTA claro**: Siguiente paso concreto
- No uses la palabra "Conclusión" como título.

[Enlace a servicio relevante o contacto]

---

**Longitud objetivo post:**

- Mínimo: 1,000 palabras (thin content)
- Ideal: 1,500-2,500 palabras (según competencia)
- Máximo: 3,500 palabras (más largo = mejor solo si agrega valor)

---

**Para PÁGINA DE SERVICIO:**

Estudia el frontmatter de las páginas de servicio y usa las variables requeridas.

# [H1: Servicio + Beneficio Único]

[INTRO: 100-150 palabras]

- Keyword principal en primeras 100 palabras
- Hook emocional o dato sorprendente
- Opcional: Qué es el servicio (50 palabras) o por qué elegir este profesional/empresa (beneficio diferencial). Lo principal es aportar valor.

## [H2: Necesidades o temores que se resuelve]

- Usar keywords principales en marcos reales del día a día
- Explicar cómo el servicio soluciona problemas reales
- Mencionar casos documentados de mis casos de éxito o de fuentes respetadas a nivel nacional

## [H2: Beneficios de contratar [Servicio] profesional]

[3-5 beneficios con H3]

### [H3: Beneficio #1]

[100 palabras explicando beneficio]

### [H3: Beneficio #2]

[100 palabras explicando beneficio]

## [H2: ¿Qué incluye nuestro servicio de [Keyword]?]

[Lista de características o paquetes]

- Bullet points concretos
- Evitar vaguedades ("servicio de calidad" NO, "atención en 24hrs" SÍ)
- Usar keyword principal o variantes siempre

## [H2: Precios de [Servicio] en [Ciudad]]

[Tabla de precios o rangos]

- Transparencia genera confianza
- Si no puede mostrar precios, explicar por qué ("depende de X factores")

## [H2: Proceso / ¿Cómo funciona?]

[Paso a paso numerado]

1. **Paso 1**: [Descripción]
2. **Paso 2**: [Descripción]
3. **Paso 3**: [Descripción]

## [H2: Preguntas Frecuentes]

[5-8 FAQs]

## [H2: Solicita tu cotización gratis]

[CTA FUERTE]

- Teléfono/WhatsApp visible
- Horario de atención
- Sesgos de urgencia o escacez

---

**Agregar schema LocalBusiness o Service:**

Los esquemas deben agregarse en el frontmatter y usar el folder "includes" con archivos schema para incluirlos en el head.

---

### 3. Estilo de redacción

**PRINCIPIOS FUNDAMENTALES (del userPreferences):**

**🚫 NUNCA ofrecer:**

- Descuentos o promociones
- Nada gratis (salvo cotización o consulta)
- "Primera sesión gratis", "50% off"
- No pongas mayúsculas en cada palabra de los títulos y subtítulos

**✅ SIEMPRE usar:**

- Técnicas de persuasión probadas
- Sesgos psicológicos (escasez, autoridad, prueba social)
- Ganchos emocionales
- Neuromarketing
- Mayúscula inicial solo en la primera de los títulos y subtítulos o según la gramática latinoamericana donde corresponde

**❌ EVITAR estilos comunes/repetidos:**

- "Queremos ayudarte a..." (muy genérico)
- "En [Empresa] nos enorgullece..." (corporativo aburrido)
- Frases hechas de SEO ("en este artículo aprenderás...")

**✅ PREFERIR:**

- Datos concretos sobre vagüedades
- Miedos y dolores del lector
- Soluciones a esos miedos y dolores
- Beneficios específicos sobre características genéricas
- Storytelling cuando aplique basado en los casos de éxito actuales
- Voz activa sobre pasiva
- Evitar ser redundante. Mejor al grano y aportar más de lo esperado
- Evitar canibalizar contenido. Usar bien el enlazado interno para distribuir la autoridad entre las páginas del sitio.
- Evitar repetir la misma idea en diferentes palabras.

---

### 4. Técnicas de persuasión a aplicar

**Según tipo de contenido:**

**Blog Post Informacional:**

- **Autoridad:** Citar estudios, estadísticas, expertos
- **Prueba social:** Mencionar "X personas ya han..." si aplica
- **Claridad:** Resolver la duda del lector RÁPIDO
- **Enlazado:** Citar y enlazar otros contenidos del blog
- **Comentarios directos**: generar opinión polémica en blockquotes con mi autoría

**Página de Servicio:**

- **Escasez:** "Agenda limitada", "Solo X cupos por mes"
- **Urgencia:** "Contáctanos hoy", "Agenda ahora una consultoría"
- **Prueba social:** Testimonios (si cliente los proporciona)
- **Autoridad:** Certificaciones, años de experiencia
- **Reciprocidad:** "Te regalo una auditoría básica de tu sitio web si agendás hoy"

**Landing Page:**

- **Beneficio > Característica:** "Recupera tu inversión en 3 meses" > "Posicionamiento SEO en Cali"
- **CTA específico:** "Agenda tu auditoría básica ahora" > "Escríbenos para superar tu competencia"
- **Eliminar fricción:** WhatsApp directo

---

### 5. Optimización SEO integrada

**Mientras escribes, asegurar:**

```markdown
✅ Keyword principal en:

- [ ] Title tag (front matter)
- [ ] H1
- [ ] Primeras 100 palabras con negrita
- [ ] URL (permalink)
- [ ] Meta description
- [ ] Alt de imagen hero
- [ ] Title de imágenes y enlaces
- [ ] Al menos 4 H2s (variaciones)

✅ Keywords secundarias en:

- [ ] H2s o H3s (naturalmente)
- [ ] Distribuidas en el texto (no forzadas) o con negrita
- [ ] Alt text de otras imágenes

✅ Enlaces:

- [ ] 3-5 enlaces internos a contenido relacionado
- [ ] 1-2 enlaces externos a fuentes autoritativas (si aplica)
- [ ] Anchor text descriptivo

✅ CTAs:

- [ ] Al menos 1 CTA intermedio (si artículo es largo)
- [ ] 1 CTA final claro y específico

✅ EEAT:

- [ ] Citar fuentes autoritativas
- [ ] Incluir datos concretos
- [ ] Mencionar experiencia del cliente
- [ ] Incluir testimonios (si cliente los proporciona)
- [ ] Mencionar mi experiencia si no es repetitivo y solo si aporta valor
- [ ] Usar los casos de éxito de la página con enlaces
- [ ] Usar página sobre mí con enlaces
```

---

### 6. Post-escritura: Validación

**Checklist antes de entregar:**

```markdown
## Validación de contenido

- [ ] Keyword research fue base de la redacción
- [ ] Intención de búsqueda resuelta en primeros 200 palabras
- [ ] Estructura pensada en humanos y LLMs o IA
- [ ] Longitud cumple objetivo (o supera promedio de competencia)
- [ ] Tono consistente con ejemplos del cliente
- [ ] Sin errores de ortografía o gramática
- [ ] Sin "alucinaciones" (datos inventados)
- [ ] FAQs incluidas con schema preparado
- [ ] Front matter completo y correcto
- [ ] CTAs claros y específicos
- [ ] Sin ofertas de descuentos o gratis (salvo cotización)
```

---

## Output format

**El contenido debe entregarse como:**

```markdown
1. **Archivo completo listo para publicar**
   - Front matter correcto
   - Contenido formateado en markdown
   - Includes de schema comentados
   - Nombre de archivo: `YYYY-MM-DD-titulo-del-post.md`

2. **Resumen ejecutivo:**
   - Longitud: [N palabras]
   - Keyword principal: [keyword]
   - Keywords secundarias: [lista]
   - Schema incluido: [Article / FAQ / ambos]
   - CTAs: [descripción de CTAs usados]

3. **Próximos pasos:**
   - Agregar imagen hero en `/assets/images/[nombre].webp`
   - Revisar y publicar en `_posts/`
   - (Opcional) Maquetar con `dev-jekyll` si necesita diseño custom
```

---

## Ejemplos de aplicación

### Ejemplo 1: Blog post informacional

**Input:**

```
Keyword: "consultor SEO colombia"
Cliente: "Consultor SEO de Colombia: supera por fin a tu competencia"
Intent: Transaccional
Competencia: Promedio 2,400 palabras
```

**Estructura generada:**

```markdown
---
title: "Consultor SEO Colombia: Supera por fin a tu competencia"
description: "Consultor SEO en Colombia con 8 años de experiencia. Posicionamiento web, auditorías SEO y más. Primera auditoría básica gratuita →"
---

# Consultor SEO en Colombia: Supera por fin a tu competencia

Cada **consultor SEO** que ha revisado tu página web te ha dicho lo mismo: "necesitas más contenido". Pero, ¿te hablaron de la **estrategia de contenido**? ¿Te explicaron cómo crear contenido que realmente posicione y atraiga clientes?

## ¿Qué es una estrategia de contenido?

[Contenido detallado...]

## ¿Cómo crear contenido que realmente posicione y atraiga clientes?

[Contenido detallado...]

## Preguntas Frecuentes sobre SEO en Colombia

### ¿En cuánto tiempo se ven resultados con SEO en Colombia?

[Respuesta concisa...]

[8 FAQs más]

## Hagamos una consultoría SEO profesional para tu empresa

Si estás listo para llevar tu negocio al siguiente nivel, agenda una consultoría SEO profesional. Analizaremos tu situación actual, identificaremos oportunidades y conseguiremos lo que tanto tiempo y dinero te ha costado.
```

---

### Ejemplo 2: Página de servicio

**Input:**

```
Servicio: "Páginas web profesionales para consultorios en Cali"
Cliente: Consultorios en Cali
Intent: Transaccional
```

**Estructura generada:**

```markdown
---
title: "Páginas web profesionales para consultorios en Cali | [Firma]"
description: "Páginas web profesionales para consultorios en Cali que no quieren desaparecer del mercado. Evita gastos innecesarios. Primera consulta sin costo →"
---

# Páginas web profesionales para consultorios en Cali: Atrae más pacientes y haz crecer tu práctica

¿Tu consultorio está perdiendo pacientes frente a la competencia? En [Firma], diseñamos páginas web profesionales para consultorios en Cali que atraen más pacientes y hacen crecer tu práctica.

## ¿Qué Incluye Nuestra Página Web Profesional para Consultorios en Cali?

- Diseño profesional y moderno
- Optimización para móviles
- Contenido persuasivo y profesional
- Optimización SEO para Google
- Integración con redes sociales
- Formulario de contacto
- Chat en vivo
- Llamada a la acción clara
- Diseño personalizado
- Optimización para móviles
- Contenido persuasivo y profesional
- Optimización SEO para Google
- Integración con redes sociales
- Formulario de contacto
- Chat en vivo
- Llamada a la acción clara

## ¿Qué hace que nuestra página web profesional para consultorios en Cali sea diferente?

- No usamos plantillas genéricas
- Diseño profesional y moderno
- Optimización para móviles
- Contenido persuasivo y profesional
- Optimización SEO para Google
- Integración con redes sociales
- Formulario de contacto
- Chat en vivo
- Llamada a la acción clara

## Proceso de Trabajo

1. **Consulta inicial gratuita**: Revisamos tu caso [...]
2. **Estrategia legal**: Diseñamos plan de acción [...]
3. **Ejecución**: Representamos tus intereses [...]

## Agenda tu Consulta Gratuita

[Formulario + WhatsApp + Teléfono]
```

---

## Reglas obligatorias

### ✅ SIEMPRE hacer:

- Leer assets de ejemplo del cliente antes de escribir
- Resolver intención de búsqueda en primeros 200 palabras
- Usar persuasión basada en psicología (no manipulación)
- Entregar contenido listo para publicar (front matter + markdown)
- Incluir CTAs específicos (no genéricos)

### ❌ NUNCA hacer:

- Ofrecer descuentos, promociones o "gratis" (salvo cotización)
- Copiar estructuras genéricas de IA (sonar a ChatGPT)
- Inventar datos o estadísticas (alucinaciones)
- Usar frases hechas ("en conclusión", "en este artículo")
- Ignorar el tono del cliente (revisar ejemplos)

### ⚠️ Advertencias:

- **Keyword research primero:** No escribir sin keywords objetivo
- **Competencia como guía:** Usar análisis para superar, no copiar
- **Tono del cliente > tono genérico:** Cada cliente es único
- **Persuasión ≠ Manipulación:** Sesgos psicológicos éticos

## Anti-patterns comunes

❌ **Escribir sin investigación previa**
✅ **Correcto:** "Basándome en keyword research (keyword X, 2,400 búsquedas/mes) y análisis de competencia (promedio 1,800 palabras), escribo 2,000 palabras..."

❌ **"En este artículo aprenderás..." (intro genérica de IA)**
✅ **Correcto:** "La rinoplastia en Cali tiene un costo promedio de $8M-$15M. Esta guía te mostrará..."

❌ **"¡Aprovecha nuestra promoción del 50%!"**
✅ **Correcto:** "Agenda tu valoración profesional. Disponibilidad limitada este mes."

❌ **Contenido genérico que aplica a cualquier cliente**
✅ **Correcto:** "Dr. [Nombre] ha realizado más de 300 rinoplastias en Cali, con certificación XYZ" (específico del cliente)
