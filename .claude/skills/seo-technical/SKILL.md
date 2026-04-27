---
name: seo-technical
description: Auditorías y setup técnico SEO (estructura, meta tags, schema, velocidad, indexación). Se activa con "auditoría técnica", "meta tags", "schema markup", "Core Web Vitals", "estructura del sitio", "robots.txt", "sitemap", cuando trabajas en _config.yml, head.html, o mencionas temas técnicos de SEO.
---

# SEO Technical Skill

## Propósito
Setup técnico del sitio y auditorías de infraestructura SEO. Garantizar que el sitio está correctamente configurado para indexación y rastreo.

## Cuándo ejecutar

**✅ USAR esta skill para:**
- Setup inicial de sitio nuevo
- Auditoría mensual/trimestral de infraestructura
- Después de cambios mayores en estructura del sitio
- Problemas de indexación en Google Search Console
- Migración de dominio o cambios de URLs
- Implementación de schema markup

**❌ NO usar para:**
- Optimizar contenido existente → eso es `seo-onpage` skill
- Crear contenido nuevo → eso es `copywriter` skill
- Investigar keywords → eso es `keyword-research` skill

## Checklist técnico completo

### 1. Configuración _config.yml (Jekyll)

```yaml
# === CONFIGURACIÓN BÁSICA OBLIGATORIA ===

# URLs (CRÍTICO - sin esto no funcionan canonicals ni sitemaps)
url: "https://sitiodelcliente.com"  # URL completa CON protocolo
baseurl: ""  # Vacío si es dominio principal, "/subdir" si es subdirectorio

# Permalinks (URLs limpias sin .html)
permalink: /:categories/:title/  # Ejemplo: /blog/titulo-del-post/
# Alternativas:
# permalink: /:year/:month/:day/:title/  # Para blogs con fecha
# permalink: pretty  # Similar a /:categories/:year/:month/:day/:title/

# === SEO ESENCIAL ===

title: "Marca del Cliente - Descripción Breve del Negocio"
description: "Meta description del sitio general (máx 155 caracteres)"
author: "Nombre del Profesional o Empresa"
logo: "/assets/images/logo.png"  # Path al logo para schema Organization

# === SOCIAL MEDIA ===

twitter:
  username: handle_sin_arroba  # sin @
  card: summary_large_image  # Mostrar imagen grande en tweets

facebook:
  app_id: 123456789  # Si tiene Facebook App ID
  publisher: https://www.facebook.com/paginadelcliente  # URL página de Facebook

# === PLUGINS (Jekyll en GitHub Pages) ===

plugins:
  - jekyll-sitemap  # Genera sitemap.xml automático
  - jekyll-seo-tag  # Meta tags automáticos (opcional si usas includes/seo.html manual)
  - jekyll-feed  # RSS feed (opcional)

# Nota: GitHub Pages solo soporta plugins whitelist
# Ver: https://pages.github.com/versions/

# === DEFAULTS (Front Matter automático) ===

defaults:
  # Posts
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      author: "Nombre Default"
      comments: false
      
  # Páginas
  - scope:
      path: ""
      type: "pages"
    values:
      layout: "page"

# === CONFIGURACIÓN DE BUILD ===

exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules/
  - vendor/
  - .sass-cache/
  - .jekyll-cache/
  - README.md

# Timezone (importante para fechas de posts)
timezone: America/Bogota  # Ajustar según ubicación del cliente
```

**Validación obligatoria:**
- [ ] `url` tiene protocolo https:// y NO termina en /
- [ ] `baseurl` está vacío o sin / al final
- [ ] `permalink` no tiene .html al final
- [ ] `title` y `description` están completos
- [ ] `logo` existe en la ruta especificada

---

### 2. Meta Tags (en _includes/head.html o _includes/seo.html)

**Estructura recomendada para _includes/seo.html:**

```html
<!-- SEO Meta Tags -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Title dinámico -->
{% if page.title %}
  <title>{{ page.title }} | {{ site.title }}</title>
{% else %}
  <title>{{ site.title }} - {{ site.description }}</title>
{% endif %}

<!-- Meta Description -->
{% if page.description %}
  <meta name="description" content="{{ page.description }}">
{% elsif page.excerpt %}
  <meta name="description" content="{{ page.excerpt | strip_html | truncate: 155 }}">
{% else %}
  <meta name="description" content="{{ site.description }}">
{% endif %}

<!-- Canonical URL (CRÍTICO) -->
<link rel="canonical" href="{{ page.url | absolute_url }}">

<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:type" content="{% if page.layout == 'post' %}article{% else %}website{% endif %}">
<meta property="og:title" content="{% if page.title %}{{ page.title }}{% else %}{{ site.title }}{% endif %}">
<meta property="og:description" content="{% if page.description %}{{ page.description }}{% elsif page.excerpt %}{{ page.excerpt | strip_html | truncate: 155 }}{% else %}{{ site.description }}{% endif %}">
<meta property="og:url" content="{{ page.url | absolute_url }}">
<meta property="og:site_name" content="{{ site.title }}">
<meta property="og:image" content="{% if page.image %}{{ page.image | absolute_url }}{% else %}{{ site.logo | absolute_url }}{% endif %}">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@{{ site.twitter.username }}">
<meta name="twitter:title" content="{% if page.title %}{{ page.title }}{% else %}{{ site.title }}{% endif %}">
<meta name="twitter:description" content="{% if page.description %}{{ page.description }}{% elsif page.excerpt %}{{ page.excerpt | strip_html | truncate: 155 }}{% else %}{{ site.description }}{% endif %}">
<meta name="twitter:image" content="{% if page.image %}{{ page.image | absolute_url }}{% else %}{{ site.logo | absolute_url }}{% endif %}">

<!-- Author -->
{% if page.author %}
  <meta name="author" content="{{ page.author }}">
{% elsif site.author %}
  <meta name="author" content="{{ site.author }}">
{% endif %}

<!-- Robots (solo si necesitas bloquear algo) -->
{% if page.noindex %}
  <meta name="robots" content="noindex, follow">
{% endif %}
```

**Validación obligatoria:**
- [ ] Canonical tag presente en TODAS las páginas
- [ ] Meta description nunca supera 155 caracteres
- [ ] Open Graph image tiene mínimo 1200×630 px
- [ ] Twitter card configurado correctamente
- [ ] No hay meta tags duplicados

---

### 3. Schema Markup (JSON-LD)

**Schema Organization (OBLIGATORIO en todas las páginas)**

Crear en _includes/schema-organization.html:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{ site.title }}",
  "url": "{{ site.url }}",
  "logo": {
    "@type": "ImageObject",
    "url": "{{ site.logo | absolute_url }}",
    "width": "600",
    "height": "60"
  },
  "description": "{{ site.description }}",
  "sameAs": [
    {% if site.facebook.publisher %}"{{ site.facebook.publisher }}",{% endif %}
    {% if site.twitter.username %}"https://twitter.com/{{ site.twitter.username }}",{% endif %}
    "https://instagram.com/{{ site.instagram.username }}"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "{{ site.phone }}",
    "contactType": "Customer Service",
    "areaServed": "{{ site.country }}"
  }
}
</script>
```

**Schema Article (para posts de blog)**

Crear en _includes/schema-article.html:

```html
{% if page.layout == "post" %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ page.title }}",
  "description": "{% if page.description %}{{ page.description }}{% else %}{{ page.excerpt | strip_html | truncate: 155 }}{% endif %}",
  "image": "{{ page.image | absolute_url }}",
  "author": {
    "@type": "Person",
    "name": "{% if page.author %}{{ page.author }}{% else %}{{ site.author }}{% endif %}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{ site.title }}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ site.logo | absolute_url }}"
    }
  },
  "datePublished": "{{ page.date | date_to_xmlschema }}",
  "dateModified": "{% if page.last_modified_at %}{{ page.last_modified_at | date_to_xmlschema }}{% else %}{{ page.date | date_to_xmlschema }}{% endif %}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ page.url | absolute_url }}"
  }
}
</script>
{% endif %}
```

**Schema LocalBusiness (para páginas de servicios locales)**

Referencia en .claude/assets/schemas/local-business.json del proyecto.

**Schema FAQ (para preguntas frecuentes)**

Referencia en .claude/assets/schemas/faq.json del proyecto.

**Validación obligatoria:**
- [ ] Organization schema en todas las páginas
- [ ] Article schema en todos los posts
- [ ] Validar en https://validator.schema.org
- [ ] Sin errores críticos en Google Rich Results Test

---

### 4. Archivos técnicos requeridos

**robots.txt** (crear en raíz del proyecto):

```txt
User-agent: *
Allow: /

# Bloquear directorios que no queremos indexar
Disallow: /admin/
Disallow: /gracias/
Disallow: /404.html

# Crawl-delay (opcional, solo si el servidor tiene problemas)
# Crawl-delay: 10

# Sitemap
Sitemap: {{ site.url }}/sitemap.xml
```

**Validación:**
- [ ] Sitemap URL es absoluta (con https://)
- [ ] No está bloqueando páginas importantes por error
- [ ] Accesible en https://sitio.com/robots.txt

---

**sitemap.xml** (auto-generado por jekyll-sitemap plugin)

Verificar en _config.yml:

```yaml
plugins:
  - jekyll-sitemap

# Opcional: excluir páginas específicas del sitemap
defaults:
  - scope:
      path: "gracias.html"
    values:
      sitemap: false
```

**Validación:**
- [ ] Sitemap accesible en https://sitio.com/sitemap.xml
- [ ] Todas las páginas importantes están incluidas
- [ ] URLs son absolutas (con https://)
- [ ] Enviado a Google Search Console

---

**404.html** (crear en raíz):

```html
---
layout: default
permalink: /404.html
title: Página no encontrada
noindex: true
---

<div class="error-404">
  <h1>Página no encontrada</h1>
  <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
  
  <h2>Te sugerimos:</h2>
  <ul>
    <li><a href="{{ site.url }}">Volver al inicio</a></li>
    <li><a href="{{ site.url }}/blog">Ver nuestro blog</a></li>
    <li><a href="{{ site.url }}/servicios">Ver nuestros servicios</a></li>
    <li><a href="{{ site.url }}/contacto">Contactarnos</a></li>
  </ul>
  
  <div class="search">
    <!-- Opcional: agregar buscador interno -->
  </div>
</div>
```

**Validación:**
- [ ] Devuelve código HTTP 404 (no 200)
- [ ] Tiene `noindex: true` en front matter
- [ ] Links de navegación funcionan
- [ ] Diseño consistente con el sitio

---

### 5. Performance (Core Web Vitals)

**LCP (Largest Contentful Paint) < 2.5s**

```html
<!-- Preload recursos críticos above the fold -->
<link rel="preload" as="image" href="/assets/images/hero.webp">
<link rel="preload" as="font" href="/assets/fonts/font.woff2" type="font/woff2" crossorigin>

<!-- Lazy load imágenes below the fold -->
<img src="imagen.webp" loading="lazy" width="800" height="600" alt="Descripción">

<!-- Usar formato WebP para imágenes -->
<picture>
  <source srcset="imagen.webp" type="image/webp">
  <source srcset="imagen.jpg" type="image/jpeg">
  <img src="imagen.jpg" alt="Descripción" width="800" height="600">
</picture>
```

**CLS (Cumulative Layout Shift) < 0.1**

```html
<!-- SIEMPRE especificar width y height de imágenes -->
<img src="foto.jpg" width="800" height="600" alt="...">

<!-- Para responsive, usar aspect-ratio en CSS -->
<style>
img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}
</style>

<!-- Reservar espacio para ads o contenido dinámico -->
<div style="min-height: 250px;">
  <!-- Contenido que carga dinámicamente -->
</div>
```

**FID (First Input Delay) < 100ms / INP (Interaction to Next Paint) < 200ms**

```html
<!-- Defer JavaScript no crítico -->
<script src="analytics.js" defer></script>

<!-- Async para scripts de terceros -->
<script src="https://widget-externo.com/script.js" async></script>

<!-- Minimizar JavaScript inline -->
<!-- Usar event delegation en lugar de múltiples listeners -->
```

**Validación obligatoria:**
- [ ] Pasar Core Web Vitals en PageSpeed Insights
- [ ] LCP < 2.5s en móvil
- [ ] CLS < 0.1
- [ ] Todas las imágenes tienen dimensiones explícitas

---

### 6. Seguridad y canonización

**HTTPS obligatorio**

```yaml
# En _config.yml
url: "https://sitiodelcliente.com"  # Siempre HTTPS

# Verificar:
# - Certificado SSL válido y activo
# - Redirect HTTP → HTTPS (en configuración de GitHub Pages automático)
# - Mixed content warnings = 0 (verificar en consola del navegador)
```

**Canonical tags (evitar contenido duplicado)**

```html
<!-- Ya incluido en _includes/seo.html -->
<link rel="canonical" href="{{ page.url | absolute_url }}">
```

**Paginación (evitar duplicados)**

```yaml
# En _config.yml
paginate: 10
paginate_path: "/blog/page/:num/"  # NO usar solo /:num

# Evitar:
# - /blog y /blog/page/1 duplicados
# - Paginación sin canonical
```

---

## Output de auditoría técnica

**Formato de reporte:**

```markdown
# Auditoría Técnica SEO - [Nombre del Cliente]
**Fecha:** [YYYY-MM-DD]
**URL:** https://sitiodelcliente.com
**Auditor:** Claude SEO Technical

---

## ✅ ELEMENTOS CORRECTOS

**Configuración básica:**
- [x] _config.yml configurado correctamente
- [x] URL y baseurl correctos
- [x] Permalinks limpios sin .html

**Meta tags:**
- [x] Title tags únicos en todas las páginas
- [x] Meta descriptions completas
- [x] Canonical tags presentes
- [x] Open Graph implementado

**Schema markup:**
- [x] Organization schema en todas las páginas
- [x] Article schema en posts
- [x] Sin errores en validador de schema

**Archivos técnicos:**
- [x] robots.txt presente y correcto
- [x] sitemap.xml generado
- [x] 404.html personalizado

**Performance:**
- [x] HTTPS activo
- [x] Imágenes con width/height

---

## ⚠️ ADVERTENCIAS (Prioridad Media)

**Performance:**
- [ ] LCP: 3.2s (objetivo: <2.5s)
  - **Acción:** Preload imagen hero, optimizar a WebP
  
- [ ] CLS: 0.15 (objetivo: <0.1)
  - **Acción:** Agregar width/height a imágenes del blog

**Contenido:**
- [ ] 3 páginas sin meta description personalizada
  - **Acción:** Agregar description en front matter

---

## ❌ ERRORES CRÍTICOS (Prioridad Alta)

**Meta tags:**
- [ ] Falta canonical tag en 15 páginas
  - **Impacto:** Riesgo de contenido duplicado
  - **Acción:** Incluir {% raw %}{% include seo.html %}{% endraw %} en todos los layouts

**Schema:**
- [ ] FAQ schema con errores de sintaxis
  - **Impacto:** No aparece en Rich Snippets
  - **Acción:** Validar y corregir JSON-LD

**Indexación:**
- [ ] 8 páginas bloqueadas en robots.txt por error
  - **Impacto:** Páginas importantes no indexadas
  - **Acción:** Revisar y actualizar robots.txt

---

## 🎯 PLAN DE ACCIÓN (Priorizado)

### Alta prioridad (esta semana):
1. ✅ Agregar canonical tags en layouts faltantes
2. ✅ Corregir FAQ schema
3. ✅ Actualizar robots.txt

### Media prioridad (este mes):
4. ⚠️ Optimizar imágenes a WebP con dimensiones explícitas
5. ⚠️ Agregar meta descriptions faltantes
6. ⚠️ Implementar lazy loading

### Baja prioridad (cuando haya tiempo):
7. 🔵 Implementar preload de recursos críticos
8. 🔵 Agregar LocalBusiness schema en página de contacto
9. 🔵 Mejorar 404.html con búsqueda interna

---

## 📊 MÉTRICAS A MONITOREAR

**Google Search Console (próximos 30 días):**
- Errores de indexación: Objetivo 0
- Cobertura válida: Objetivo 100%
- Core Web Vitals: Verde en todas las métricas

**PageSpeed Insights (mensual):**
- Performance Score: >90 (móvil y escritorio)
- LCP: <2.5s
- CLS: <0.1
- FID/INP: <100ms / <200ms

**Próxima auditoría:** [Fecha +60 días]
```

---

## Integración con Google Search Console (si MCP disponible)

```javascript
// Verificar errores de indexación
mcp.gsc.check_indexing_issues({
  site_url: "https://sitiodelcliente.com",
  category: "all"
})

// Identificar:
// - Páginas bloqueadas por robots.txt
// - Errores de servidor (5xx)
// - Páginas no encontradas (404)
// - Problemas de redirect
```

---

## Anti-patterns técnicos

❌ **Canonical apuntando a página diferente sin razón**
✅ **Correcto:** Canonical siempre apunta a la URL actual (salvo duplicados intencionales)

❌ **Schema con errores de sintaxis**
✅ **Correcto:** Validar SIEMPRE en https://validator.schema.org antes de publicar

❌ **Optimizar para bots ignorando UX**
✅ **Correcto:** SEO técnico debe mejorar experiencia de usuario también

❌ **Microoptimizaciones antes de basics**
✅ **Correcto:** Primero: meta tags, schema, estructura. Después: lazy loading, preload, etc.
