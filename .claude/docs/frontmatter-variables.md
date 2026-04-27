# Variables de front matter para head y schema

Referencia de las variables que utilizan `_includes/head.html` y los includes de schema para aprovechar al máximo el SEO y los datos estructurados.

---

## 1. head.html (meta tags y Open Graph)

| Variable | Uso | Obligatorio | Notas |
|----------|-----|-------------|--------|
| **title** | `<title>`, fallback og:title | Sí (o site.title) | Sin HTML. 50-60 caracteres para CTR. |
| **title_append_site_name** | Añade " \| {{ site.name }}" al title | No | `true` cuando quieras marca en el title. |
| **description** | meta description, og:description | Sí (o site.description) | 150-160 caracteres, única, con CTA. |
| **h1** | og:title cuando existe; H1 en header (main/landing/corporate/service) | Recomendado | Coherente con title. |
| **noindex** | meta robots noindex, nofollow | No | `true` en 404, páginas privadas. |
| **author** / **autor** | meta author, article:author (posts) | No (fallback site.author) | Preferir `author`. |
| **copyright** | meta copyright | No | Fallback site.name. |
| **jpg** | Imagen OG (prioridad 1). 1200×630 px | No | Para redes; si no hay, se usa hero/image/site.logo. |
| **hero** | Imagen OG (prioridad 2), header, schema | Según layout | Ruta relativa o absoluta. |
| **image** | Imagen OG (prioridad 3); posts: schema y featured | No | En posts puede sustituir a hero. |
| **alt** | og:image:alt, alt de imagen en header | Recomendado si hay imagen | Descripción breve de la imagen. |
| **breadcrumb** | JSON-LD BreadcrumbList | No | Array: `[{ name: "...", url: "/ruta/" }, ...]`. |
| **date** | article:published_time (posts) | Sí en posts | Formato Jekyll. |
| **last_modified_at** / **update_date** | article:modified_time (posts) | No | update_date lo usa schema/article. |

**Config (_config.yml):**  
- **site.description**: fallback cuando la página no tiene description.  
- **site.logo**: imagen OG por defecto si la página no define jpg/hero/image (opcional, 1200×630 px).

---

## 2. Schema: article.html (layout: post)

| Variable | Uso | Obligatorio |
|----------|-----|-------------|
| **title** | name | Sí |
| **description** | description | Sí |
| **date** | datePublished | Sí |
| **update_date** | dateModified | No (fallback date) |
| **author** | author.name | No (fallback "Dra. Stefania Rincón") |
| **hero** o **image** | image.url | Recomendado |
| **image_alt** | image.caption | No (fallback title) |
| **structured_data.about** | about (MedicalProcedure, etc.) | No |

---

## 3. Schema: medical-procedure.html (layout: service)

| Variable | Uso | Obligatorio |
|----------|-----|-------------|
| **title** | name | Sí |
| **description** | description | Sí |
| **hero** | image | Sí |
| **excerpt** | offers.description | Sí |
| **faqs** | mainEntity (FAQPage) | No | Array: `[{ pregunta: "...", respuesta: "..." }, ...]` |

---

## 4. Schema: medical-business.html

Solo se incluye en **layout: service** o **url == '/'** (home).  
No usa variables de página; todo sale de `site` y del propio include.

---

## 5. Header (_includes/header.html)

| Layout | Variables que usa el header |
|--------|-----------------------------|
| **main** / **landing** | **h1** (opcional; si no hay, usa el title del sitio). |
| **corporate** | **h1**, **excerpt**, **hero**, **alt**. |
| **service** | **h1**, **excerpt**, **hero**, **alt**. |
| **default** (resto) | **h1**, **excerpt** (opcional), **hero**, **alt**. |

---

## 6. Resumen por tipo de contenido

### Páginas con layout **main** o **landing** (home, landing)
- title, description, **h1** (para alinear H1 con title).

### Páginas con layout **corporate** (contacto, sobre-nosotros, blog)
- title, description, **h1**, **excerpt**, **hero**, **alt**.

### Páginas con layout **service** (servicios, tratamientos-esteticos, medicina-funcional)
- title, description, **h1**, **excerpt**, **hero**, **alt**.  
- Opcional: **jpg** (OG), **faqs** (schema FAQ en MedicalProcedure), **breadcrumb** (recomendado: Inicio → Tratamientos estéticos → [Servicio]; ya implementado en todos).

### Páginas con layout **default** (legales, preguntas-frecuentes, testimonios)
- title, description, **h1**.  
- Recomendado: **excerpt**, **hero**, **alt** (el header las usa si existen), **breadcrumb** (ya en legales, preguntas-frecuentes, testimonios).

### Posts (layout **post**)
- title, description, **date**, **author**.  
- **hero** o **image** (uno u otro), **image_alt**.  
- Opcional: **update_date**, **structured_data**, **excerpt**.

### Colección **redirects**
Solo redirecciones; no usan head ni schema de contenido. Sin requisitos de estas variables.
