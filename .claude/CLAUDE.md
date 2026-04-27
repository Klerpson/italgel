# CLAUDE.md - Archivo Maestro de Skills para ItalGel

## 📍 Descripción del Proyecto: ItalGel

ItalGel (italgel.com.co) es una tienda online desarrollada en Jekyll, especializada en la venta de insumos, máquinas y equipos para heladerías artesanales e industriales en Colombia.

La plataforma cuenta con las siguientes secciones clave:

- **Catálogo de productos**: Máquinas para helado, vitrinas/congeladores, insumos (bases, pastas, toppings, variegatos, granelas)
- **Blog técnico**: Artículos sobre técnicas de heladería, rentabilidad, recetas, equipamiento
- **Páginas de servicio**: Información de contacto, ubicación, servicios técnicos
- **Redirecciones**: Gestión de URLs antiguas para SEO

El sitio está construido con un fuerte enfoque en SEO, utilizando una arquitectura modular para CSS y una estructura de contenido optimizada para motores de búsqueda, con el fin de asegurar alta visibilidad y atraer a propietarios de heladerías en Colombia.

## 🧠 Guía para la Activación de Skills de Inteligencia Artificial

Este archivo maestro (`CLAUDE.md`) es la columna vertebral para la toma de decisiones de la IA, permitiéndole seleccionar y ejecutar la skill más adecuada para cada tarea solicitada. La IA debe analizar meticulosamente el lenguaje natural del usuario y el contexto del proyecto para determinar la acción correcta.

### Principios de Activación

1.  **Análisis de Intención:** Antes de activar cualquier skill, la IA debe inferir la intención principal del usuario. ¿Está solicitando la creación de contenido nuevo, la optimización de algo existente, una investigación, o un desarrollo técnico?
2.  **Palabras Clave de Activación:** Cada skill tiene una serie de palabras clave y frases en su `description` que indican su propósito. La IA debe buscar coincidencias con estas frases en el prompt del usuario.
3.  **Contexto del Proyecto:** Siempre considerar el nicho de ItalGel (insumos y máquinas para heladerías artesanales e industriales en Colombia) para refinar la elección de la skill.
4.  **Flujo de Trabajo Lógico:** Algunas skills son prerrequisitos para otras (ej. `keyword-research` antes de `copywriter`). La IA debe guiar al usuario a través de un flujo lógico si detecta que falta una etapa previa crucial.
5.  **Especificidad sobre Generalidad:** Si un prompt puede activar múltiples skills, priorizar la skill más específica que aborde directamente la solicitud del usuario. Por ejemplo, "optimizar el post de botox" es más específico para `seo-onpage` que para `copywriter`.
6.  **Preguntar para Clarificar:** Si la intención no es clara, la IA debe hacer preguntas al usuario para obtener la información necesaria y evitar activar la skill incorrecta.

### Skills Disponibles y su Activación

A continuación, se detalla cada skill, su propósito y cómo debe ser activada por la IA:

#### 1. `competitor-analysis`

- **Descripción:** Análisis de competencia en SERPs para una keyword específica.
- **Activación:** Se activa con frases como "competencia", "qué rankea", "análisis SERP", "top resultados", "qué hace la competencia", o cuando se requiere una investigación de la competencia antes de crear contenido estratégico.

#### 2. `copywriter`

- **Descripción:** Creación de contenido NUEVO (posts, páginas de servicio, landing pages).
- **Activación:** Se activa con "escribe post", "crea contenido", "redacta página", "nuevo artículo", "/new-post", o cuando el usuario necesita generar texto desde cero. **Importante:** No usar para optimizar contenido existente.

#### 3. `dev-jekyll`

- **Descripción:** Maquetación y desarrollo en Jekyll (HTML, CSS, Liquid).
- **Activación:** Se activa con "maquetar", "crear layout", "desarrollar página", "CSS", "Jekyll", "Liquid", o cuando la tarea implica trabajar en archivos de layout (`_layouts/`), includes (`_includes/`), o archivos `.html/.js/.md/.css` para el front-end.

#### 4. `keyword-research`

- **Descripción:** Investigación y análisis de keywords ANTES de crear contenido.
- **Activación:** Se activa con "keywords", "volumen de búsqueda", "investigación", "Ubersuggest", cuando se suben CSVs de keywords, o se menciona "buscar palabras clave".

#### 5. `seo-onpage`

- **Descripción:** Optimización de contenido EXISTENTE (páginas ya publicadas).
- **Activación:** Se activa con "optimizar página", "mejorar SEO de", "revisar contenido", "optimizar post", cuando la tarea es editar posts/páginas ya creados o cuando se suben datos de Google Search Console para una URL específica.

#### 6. `seo-technical`

- **Descripción:** Auditorías y setup técnico SEO (estructura, meta tags, schema, velocidad, indexación).
- **Activación:** Se activa con "auditoría técnica", "meta tags", "schema markup", "Core Web Vitals", "estructura del sitio", "robots.txt", "sitemap", o cuando la tarea implica trabajar en `_config.yml`, `head.html`, o cualquier otro aspecto técnico del SEO.

## ✨ Mejores Técnicas para la Interpretación de la IA (Archivo Maestro)

Para que la IA interprete este archivo maestro de manera óptima y tome decisiones precisas, se deben seguir estas pautas:

1.  **Formato Estructurado y Consistente:** Mantener la estructura clara con encabezados y descripciones concisas. El uso de Markdown facilita la legibilidad y el parseo automático.
2.  **Palabras Clave Claras y Disparadores (Triggers):** Cada skill debe tener en su `description` (y en el `SKILL.md`) las palabras clave exactas que la IA debe monitorear en las solicitudes del usuario.
3.  **Descripción Explícita de Propósito:** El `Propósito` de cada skill en su `SKILL.md` debe ser inequívoco, dejando claro cuándo usarla y cuándo no (`✅ USAR`, `❌ NO usar`).
4.  **Priorización de Contexto:** La IA debe ser instruida para siempre considerar el "Contexto del Proyecto" (Juli.Com.Co) al evaluar qué skill es más relevante, incluso si las palabras clave son similares.
5.  **Ejemplos de Input/Output (dentro de SKILL.md):** La inclusión de ejemplos de `Input requerido` y `Output estructurado` dentro de cada `SKILL.md` ayuda a la IA a comprender las expectativas y a formular respuestas o acciones coherentes.
6.  **Actualización Constante:** Este archivo y los `SKILL.md` individuales deben ser revisados y actualizados regularmente para reflejar nuevas funcionalidades o ajustes en el flujo de trabajo.
7.  **Auto-Corrección y Feedback:** La IA debe tener la capacidad de aprender de interacciones anteriores y refinar su selección de skills basándose en el feedback del usuario. Si una skill no fue la adecuada, debe ajustar su lógica de activación para futuras interacciones.

Este archivo `CLAUDE.md` es fundamental para una operación eficiente y precisa de la IA en el proyecto Juli.Com.Co. Su correcta interpretación asegura que cada tarea sea dirigida a la herramienta más competente.
