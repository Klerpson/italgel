# Plantillas de referencia — ItalGel

Rutas de archivos reales del proyecto para consultar antes de maquetar o crear contenido.

## LAYOUTS

| Layout | Ruta | Uso |
|--------|------|-----|
| Post de blog | `_layouts/post.html` | Artículos del blog |
| Colección de productos | `_layouts/products.html` | Páginas como `maquinas-helado-artesanal/` |
| Home / landing | `_layouts/main.html` | `index.html` y landing pages |
| Corporativas | `_layouts/general.html` | `nosotros.html`, `contacto.html` |
| Listado blog | `_layouts/blog.html` | `blog.html` |
| Default | `_layouts/default.html` | `legal.md` y páginas simples |
| Redirect | `_layouts/redirections.html` | `_redirects/*.html` |

## PÁGINAS DE REFERENCIA

### Páginas de productos (layout: products)
Ver cualquier carpeta de colección:
- `maquinas-helado-artesanal/index.html`
- `bases-helado-colombia/index.html`
- `vitrinas-congeladores/index.html`
- `insumos.html`

### Páginas corporativas (layout: general)
- `nosotros.html`
- `contacto.html`
- `equipos.html`

### Home (layout: main)
- `index.html`

### Blog
- `blog.html` (listado)
- `_posts/2026-04-08-rentabilidad-heladeria-colombia.md` (ejemplo de post)

## POSTS DE REFERENCIA

Revisar 2-3 posts recientes antes de escribir nuevo contenido:

```
_posts/
├── 2026-04-08-rentabilidad-heladeria-colombia.md
├── 2026-04-08-como-abrir-una-heladeria-en-colombia.md
├── 2026-04-08-base-50-mec3-vs-supergelmix-comparativa.md
└── 2025-10-01-como-calcular-overrun-helado-artesanal.md
```

## FRONTMATTER MÍNIMO POR TIPO

### Post de blog
```yaml
---
layout: post
title: ""
description: ""
date: YYYY-MM-DD
author: "Sebastián Rios"
category: ""
hero: /img/blog/nombre-imagen.avif
image_alt: ""
permalink: /blog/slug-del-post/
excerpt: ""
---
```

### Página de producto (colección)
```yaml
---
layout: products
title: ""
description: ""
h1: ""
hero: /img/nombre-imagen.avif
alt: ""
excerpt: ""
permalink: /slug-pagina/
---
```
