# Variables de front matter para head y schema — ItalGel

Referencia de las variables que utilizan `_includes/head.html` y los includes de schema en ItalGel (`italgel.com.co`).

---

## 1. head.html (meta tags y Open Graph)

| Variable | Uso | Obligatorio | Notas |
|----------|-----|-------------|--------|
| **title** | `<title>`, og:title | Sí (o site.title) | Sin HTML. 50-60 caracteres para CTR. |
| **description** | meta description, og:description | Sí (o site.description) | 150-160 caracteres, única, con CTA. |
| **noindex** | meta robots noindex, nofollow | No | `true` en 404, páginas privadas. |
| **author** | meta author, article:author (posts) | No (fallback site.author) | En posts se busca en `site.data.authors[author_id]`. |
| **hero** | Imagen OG (prioridad 1), header, schema | Recomendado | Ruta relativa. Ej: `/img/blog/mi-imagen.avif` |
| **jpg** | Imagen OG (prioridad 2) | No | Para redes; si no hay, se usa hero/social_image/logo. |
| **alt** | og:image:alt, alt de imagen en header | Recomendado si hay imagen | Descripción breve de la imagen. |
| **date** | article:published_time (posts) | Sí en posts | Formato Jekyll: `YYYY-MM-DD`. |
| **last_modified_at** | article:modified_time (posts) | No | Si no hay, usa `date`. |
| **update_date** | dateModified en schema Article | No | Alternativa a last_modified_at. |

**Prioridad imagen OG (en head.html):**
```liquid
{% assign og_image = page.hero | default: page.jpg | default: site.social_image | default: site.logo | absolute_url %}
```

**Config (_config.yml) relevante:**
- `site.description`: fallback de meta description global.
- `site.social_image`: imagen OG por defecto (`img/contacto-italgel-colombia.jpg`).
- `site.logo`: fallback final (`img/logo.avif`).
- `site.telefono`: teléfono en schemas (NOT `site.phone`).
- `site.author`: autor por defecto (`Sebastián Rios`).

---

## 2. Schema: schema.html (incluido en head.html)

ItalGel usa un único `_includes/schema.html` que contiene:
- **Organization** schema: siempre presente (datos de Italgel Colombia como distribuidor MEC3).
- **Article** schema: se activa cuando `page.layout == 'post'` o `page.collection == 'posts'`.
- **BreadcrumbList**, **FAQPage**, **Product**: incluidos según variables de front matter.

Para posts, el schema Article usa:
| Variable | Uso |
|----------|-----|
| **title** | headline |
| **description** | description |
| **date** | datePublished |
| **update_date** | dateModified (fallback: date) |
| **author** | author.name (busca en `site.data.authors[author_id]`) |
| **hero** o **image** | image.url |
| **image_alt** | image.caption |
| **structured_data** | datos extra (HowTo, FoodAnalysis, etc.) |
| **excerpt** | description alternativa |

---

## 3. Layouts disponibles en ItalGel

| Layout | Descripción | Páginas típicas |
|--------|-------------|-----------------|
| **post** | Artículos del blog | `_posts/*.md` |
| **products** | Páginas de colección de productos | `maquinas-helado-artesanal/`, `bases-helado-colombia/`, etc. |
| **main** | Home y landing pages | `index.html` |
| **general** | Páginas corporativas genéricas | `nosotros.html`, `contacto.html` |
| **blog** | Listado del blog | `blog.html` |
| **categories** | Páginas de categorías | `categories.html` |
| **default** | Fallback general | `legal.md` |
| **redirections** | Páginas de redirección | `_redirects/*.html` |
| **compress** | Wrapper de compresión HTML | Interno, no usar directamente |

---

## 4. CSS: arquitectura de ItalGel

ItalGel usa **un único archivo CSS** compilado por Jekyll con `{% include %}`:

```
css/
└── style.css   ← Archivo principal (usa {% include %} para importar módulos)

_includes/css/
├── critical.css          ← CSS inline en <head> (above-the-fold)
├── universal.css         ← Reset y estilos base globales
├── nav.css               ← Navegación
├── header.css            ← Hero/header
├── cards.css             ← Cards de productos/posts
├── pages.css             ← Estilos de páginas interiores
├── boton.css             ← Botones y CTAs
├── slider.css            ← Slider/carrusel
├── footer.css            ← Footer
├── floating-buttons.css  ← Botones flotantes (WhatsApp, etc.)
├── share.css             ← Botones de compartir
├── pqr.css               ← Formulario de contacto/PQR
└── media-queries.css     ← Responsive breakpoints
```

**IMPORTANTE:** En Jekyll estándar (GitHub Pages) se usa `{% include %}`, NO `{% render %}`. El tag `{% render %}` es exclusivo de Shopify Liquid y causará errores en Jekyll.

---

## 5. Resumen por tipo de contenido

### Posts de blog (layout: post)
Variables obligatorias: `title`, `description`, `date`, `author`, `category`.
Recomendadas: `hero` (o `image`), `image_alt`, `excerpt`, `tags`.
Opcionales: `update_date`, `structured_data`, `permalink`.

### Páginas de productos (layout: products)
Variables obligatorias: `title`, `description`, `h1` (si difiere del title).
Recomendadas: `hero`, `alt`, `excerpt`.

### Páginas corporativas (layout: general)
Variables obligatorias: `title`, `description`.
Recomendadas: `h1`, `hero`, `alt`, `excerpt`.

### Redirects (layout: redirections)
No usan variables de contenido. Solo gestión de URL antigua → nueva.
