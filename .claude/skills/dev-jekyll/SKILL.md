---
name: dev-jekyll
description: Maquetación y desarrollo en Jekyll (HTML, CSS, Liquid). Se activa con "maquetar", "crear layout", "desarrollar página", "CSS", "Jekyll", "Liquid", cuando trabajas en _layouts/, _includes/, o archivos .html/.scss/.css.
---

# Dev Jekyll Skill

## Propósito
Maquetación profesional y desarrollo front-end en Jekyll usando HTML moderno, CSS optimizado (Grid/Flex) y Liquid templating. Código limpio, performante y mantenible.

## Cuándo ejecutar

**✅ USAR esta skill para:**
- Crear o modificar layouts (_layouts/)
- Crear o modificar includes (_includes/)
- Maquetar páginas HTML
- Escribir/optimizar CSS (arquitectura modular)
- Programar lógica con Liquid
- Desarrollar componentes reutilizables

**❌ NO usar para:**
- Redactar contenido → eso es `copywriter` skill
- Optimizar SEO on-page → eso es `seo-onpage` skill
- Auditorías técnicas SEO → eso es `seo-technical` skill

## Arquitectura CSS de ItalGel

**Estructura real del proyecto (respetar siempre):**

```
_includes/
└── css/
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

css/
└── style.css   ← Archivo principal compilado (cargado en todas las páginas)
```

**Propósito de la arquitectura:**
- **Separación por componente:** Cada módulo CSS tiene su propio archivo en `_includes/css/`
- **Un solo CSS compilado:** `css/style.css` concatena todos los módulos con `{% include %}`
- **Critical CSS inline:** `_includes/css/critical.css` se inyecta directo en `<head>` con `<style>`
- **Mantenibilidad:** Cambios en header solo afectan `header.css`

---

### Estructura de css/style.css:

**IMPORTANTE: En Jekyll estándar (GitHub Pages) se usa `{% include %}`, NO `{% render %}`.**
El tag `{% render %}` es exclusivo de Shopify Liquid y causará errores en Jekyll.

```css
---
layout: compress
noindex: true
---
{% include css/universal.css %}
{% include css/nav.css %}
{% include css/floating-buttons.css %}
{% include css/boton.css %}
{% include css/header.css %}
{% include css/cards.css %}
{% include css/pages.css %}
{% include css/share.css %}
{% include css/slider.css %}
{% include css/media-queries.css %}
{% include css/footer.css %}
{% include css/pqr.css %}
```

**Cómo se carga en head.html:**

```html
<!-- CSS crítico inline (above-the-fold, no bloquea render) -->
<style>
  {% include css/critical.css %}
</style>

<!-- CSS principal compilado -->
<link rel="stylesheet" href="{{ '/css/style.css' | relative_url }}">
```

**REGLA DE ORO para este proyecto:** Un solo `style.css` para todas las páginas. Si necesitas un componente nuevo, crea su módulo en `_includes/css/` y agrégalo en `css/style.css`.

---

## Estándares de código

### 1. HTML moderno y semántico

**✅ USAR etiquetas semánticas:**

```html
<header>
  <nav>
    <ul>
      <li><a href="/">Inicio</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Título del artículo</h1>
    <section>
      <h2>Sección</h2>
      <p>Contenido...</p>
    </section>
  </article>
  
  <aside>
    <h2>Relacionado</h2>
    <!-- Contenido sidebar -->
  </aside>
</main>

<footer>
  <p>&copy; 2026 Cliente</p>
</footer>
```

**❌ NO usar divs genéricos cuando existe etiqueta semántica:**

```html
<!-- ❌ MAL -->
<div class="header">
  <div class="nav">
    
<!-- ✅ BIEN -->
<header>
  <nav>
```

---

### 2. CSS moderno (Grid y Flex prioritarios)

**FILOSOFÍA:** Usar Grid y Flex con propiedades modernas para evitar media queries obsoletos. Diseño responsive sin necesidad de @media cuando es posible.

**✅ Grid para layouts complejos:**

```css
/* Layout principal con Grid */
.layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Grid con áreas nombradas */
.page-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .page-layout {
    grid-template-areas:
      "header"
      "content"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

**✅ Flex para componentes:**

```css
/* Card responsivo con Flex */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card {
  /* Clave: flex con base mínima y max-width para responsive natural */
  flex: 1 0 350px;  /* Crece, no encoge, base 350px */
  max-width: 100%;  /* No desborda en móviles */
}

/* Header con flex y alineación moderna */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav {
  display: flex;
  gap: 2rem;  /* Espaciado entre items con gap, no margin */
}
```

**✅ Propiedades modernas para responsive sin media queries:**

```css
/* Texto fluido sin media queries */
.title {
  font-size: clamp(1.5rem, 4vw, 3rem);  /* Min 1.5rem, ideal 4vw, max 3rem */
}

/* Padding responsive */
.container {
  padding: clamp(1rem, 5vw, 3rem);
}

/* Width responsive */
.content {
  width: min(90%, 1200px);  /* 90% del viewport o 1200px, lo que sea menor */
  margin-inline: auto;
}

/* Aspect ratio moderno (no necesita padding-bottom hack) */
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.image {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

**✅ Selectores modernos:**

```css
/* :is() para agrupar selectores */
:is(h1, h2, h3, h4, h5, h6) {
  font-family: var(--font-heading);
  line-height: 1.2;
}

/* :not() para excepciones */
.button:not(.button--ghost) {
  background-color: var(--color-primary);
}

/* :where() para selectores sin especificidad */
:where(ul, ol) {
  padding-left: 1.5rem;
}

/* Selectores de atributo modernos */
[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #f0f0f0;
}

/* :has() para parent selector (Safari 15.4+, Chrome 105+) */
.card:has(img) {
  display: grid;
  grid-template-rows: auto 1fr;
}
```

**✅ Custom properties (CSS variables):**

```css
:root {
  /* Colores */
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --color-text: #333;
  --color-bg: #fff;
  
  /* Tipografía */
  --font-body: system-ui, -apple-system, sans-serif;
  --font-heading: 'Georgia', serif;
  
  /* Espaciado */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  
  /* Breakpoints (para usar en JS o container queries) */
  --bp-mobile: 768px;
  --bp-tablet: 1024px;
}

/* Uso en componentes */
.button {
  background-color: var(--color-primary);
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-body);
}
```

**✅ Anidación de CSS (nativo en navegadores modernos):**

```css
/* Anidación nativa CSS (Chrome 112+, Safari 16.5+) */
.card {
  padding: 1rem;
  border-radius: 8px;
  
  & .card__title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  & .card__body {
    color: var(--color-text);
  }
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}
```

**❌ EVITAR CSS obsoleto:**

```css
/* ❌ NO usar float para layouts */
.sidebar {
  float: left;
  width: 25%;
}

/* ❌ NO usar clearfix hacks */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

/* ❌ NO usar padding-bottom para aspect ratio */
.video-wrapper {
  padding-bottom: 56.25%; /* Obsoleto, usar aspect-ratio */
}

/* ❌ NO usar position para centrar */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Obsoleto, usar flex o grid */
}

/* ✅ MEJOR con Flex */
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

### 3. Minimizar JavaScript (solo cuando sea estrictamente necesario)

**PRINCIPIO:** CSS moderno puede reemplazar 80% de JavaScript UI común.

**✅ CSS en lugar de JS cuando sea posible:**

```css
/* Accordion sin JavaScript */
.accordion {
  border: 1px solid #ccc;
}

.accordion__title {
  padding: 1rem;
  cursor: pointer;
  user-select: none;
}

.accordion__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion:has(input:checked) .accordion__content {
  max-height: 500px;
}

/* Toggle switch sin JS */
.toggle {
  display: none;
}

.toggle + label {
  /* Estilos del switch */
}

.toggle:checked + label {
  /* Estilos activo */
}
```

**✅ Intersection Observer en lugar de scroll events:**

```html
<script>
// Lazy loading de imágenes
const images = document.querySelectorAll('img[loading="lazy"]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
</script>
```

**❌ NO usar jQuery (está obsoleto):**

```javascript
// ❌ jQuery (obsoleto)
$(document).ready(function() {
  $('.button').click(function() {
    $(this).toggleClass('active');
  });
});

// ✅ JavaScript nativo moderno
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
    });
  });
});
```

**REGLA:** Solo usar JS para:
- Interacciones complejas (formularios con validación)
- Peticiones AJAX/fetch
- Funcionalidad que CSS no puede hacer
- Integraciones con APIs de terceros

---

### 4. Liquid templating avanzado

**✅ Loops con filtros:**

```liquid
<!-- Posts ordenados por fecha -->
{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts limit:5 %}
  <article>
    <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <time datetime="{{ post.date | date_to_xmlschema }}">
      {{ post.date | date: "%B %d, %Y" }}
    </time>
  </article>
{% endfor %}

<!-- Filtrar posts por categoría -->
{% assign category_posts = site.posts | where: "categories", "blog" %}
```

**✅ Condicionales complejos:**

```liquid
{% if page.layout == "post" %}
  {% if page.featured %}
    <span class="badge">Destacado</span>
  {% endif %}
  
  {% unless page.nodate %}
    <time>{{ page.date | date: "%B %d, %Y" }}</time>
  {% endunless %}
{% endif %}

<!-- Case/when para múltiples opciones -->
{% case page.tipo %}
  {% when "servicio" %}
    {% render "cta-servicio.html" %}
  {% when "blog" %}
    {% render "share-buttons.html" %}
  {% else %}
    {% render "cta-general.html" %}
{% endcase %}
```

**✅ Template rendering con `{% include %}` (estándar Jekyll):**

**IMPORTANTE:** En Jekyll estándar (GitHub Pages), se usa `{% include %}`. El tag `{% render %}` es exclusivo de Shopify Liquid y **no existe en Jekyll** — úsarlo causará errores de build.

```liquid
<!-- ✅ CORRECTO en Jekyll: usar include -->
{% include header.html %}
{% include components/cta-contacto.html %}

<!-- Pasar variables con include -->
{% include components/card.html title="Título" image="/img/foto.avif" link="/pagina" %}
```

**Acceder a variables en el include:**

```liquid
<!-- En _includes/components/card.html -->
<div class="card">
  {% if include.image %}
    <img src="{{ include.image }}" alt="{{ include.title }}">
  {% endif %}
  <h3>{{ include.title }}</h3>
  <a href="{{ include.link }}" class="btn">{{ include.cta | default: "Ver más" }}</a>
</div>
```

**✅ Include con variables del front matter:**

```liquid
<!-- Includes de ItalGel existentes -->
{% include schema.html %}
{% include nav.html %}
{% include header.html %}
{% include footer.html %}
{% include floating-buttons.html %}
{% include related-posts.html %}
{% include faq-schema.html %}

<!-- Include con parámetros -->
{% include boton.html texto="Ver catálogo" url="/insumos/" clase="btn-primary" %}
```

**✅ Casos de uso en ItalGel:**

```liquid
<!-- Schema por tipo de página -->
{% if page.layout == "post" or page.collection == "posts" %}
  {% include schema.html %}
{% endif %}

<!-- Cards de productos en un loop -->
{% for producto in site.data.productos %}
  {% include components/product-card.html
     nombre=producto.nombre
     imagen=producto.imagen
     url=producto.url
  %}
{% endfor %}

<!-- FAQs con schema -->
{% if page.faqs %}
  {% include faq-schema.html faqs=page.faqs %}
{% endif %}
```

**REGLA DE ORO para ItalGel:**
- Usar siempre `{% include %}` (estándar Jekyll)
- Las variables del include se acceden como `{{ include.nombre_variable }}`
- Para CSS: `{% include css/nombre.css %}` dentro de `css/style.css`

**✅ Filtros útiles:**

```liquid
<!-- Fechas -->
{{ page.date | date: "%Y-%m-%d" }}
{{ page.date | date_to_xmlschema }}  <!-- Para schema -->
{{ page.date | date: "%B %d, %Y" }}  <!-- Diciembre 05, 2026 -->

<!-- URLs -->
{{ page.url | absolute_url }}
{{ page.url | relative_url }}

<!-- Strings -->
{{ page.title | slugify }}
{{ page.title | upcase }}
{{ page.title | downcase }}
{{ page.title | capitalize }}

<!-- Arrays -->
{{ site.posts | size }}
{{ site.posts | first }}
{{ site.posts | sort: 'title' }}

<!-- Markdown a HTML -->
{{ page.content | markdownify }}

<!-- Strip HTML -->
{{ page.content | strip_html | truncate: 155 }}
```

---

## Plantillas base a referenciar

**SIEMPRE consultar antes de maquetar:**

```
_layouts/
├── post.html         ← Layout de posts del blog
├── products.html     ← Layout de páginas de colección de productos
├── main.html         ← Layout del home y landing pages
├── general.html      ← Layout de páginas corporativas (nosotros, contacto)
├── blog.html         ← Layout del listado de blog
└── default.html      ← Layout base fallback

_includes/
├── head.html         ← <head> con CSS, meta tags y schema
├── nav.html          ← Navegación principal
├── header.html       ← Hero/cabecera de página
├── footer.html       ← Footer
├── schema.html       ← Schemas JSON-LD (Organization, Article, etc.)
├── faq-schema.html   ← Schema FAQPage
└── floating-buttons.html ← Botones flotantes WhatsApp
```

**Propósito:** Mantener consistencia con el diseño existente de ItalGel. Leer `.claude/assets/ejemplos/ejemplos.md` para las rutas de componentes disponibles.

---

## Proceso de desarrollo

### 1. Análisis de requerimiento

**Antes de codificar:**

```markdown
- [ ] ¿Qué tipo de página/componente es? (layout, include, página)
- [ ] ¿Ya existe plantilla similar en .claude/assets/plantillas/?
- [ ] ¿Qué layout usará? (define qué CSS se cargará)
- [ ] ¿Necesita CSS nuevo o puedo usar existente?
- [ ] ¿Requiere JavaScript? (intentar evitar)
```

---

### 2. Crear estructura HTML

**Orden de creación:**

1. **Estructura semántica base**
2. **Contenido con Liquid**
3. **CSS en módulo apropiado**
4. **JS solo si es necesario**

**Ejemplo: Crear página de servicio**

```html
---
layout: page
title: "Rinoplastia en Cali"
description: "Cirugía de rinoplastia profesional en Cali"
permalink: /servicios/rinoplastia-cali/
---

<article class="service">
  <header class="service__header">
    <h1>{{ page.title }}</h1>
    {% if page.subtitle %}
      <p class="service__subtitle">{{ page.subtitle }}</p>
    {% endif %}
  </header>
  
  <section class="service__intro">
    {{ content }}
  </section>
  
  <section class="service__features">
    <h2>¿Qué incluye el servicio?</h2>
    <div class="features-grid">
      {% for feature in page.features %}
        <div class="feature-card">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      {% endfor %}
    </div>
  </section>
  
  <section class="service__cta">
    {% render "components/cta-contacto.html" %}
  </section>
</article>
```

---

### 3. Escribir CSS en módulo apropiado

**Para estilos de un componente nuevo, agregar en el módulo correspondiente:**

```css
/* Ejemplo: estilos de tarjeta de producto en _includes/css/cards.css */
.product-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.product-card__image {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  width: 100%;
}

.product-card__body {
  padding: var(--space-md);
}

.product-card__cta {
  padding: var(--space-sm) var(--space-md);
  text-align: center;
}
```

**Si el componente es nuevo y no encaja en ningún módulo existente:**
1. Crear `_includes/css/nombre-componente.css`
2. Agregarlo al final de `css/style.css` con `{% include css/nombre-componente.css %}`

```css
/* En css/style.css — agregar al final */
{% include css/nombre-componente.css %}
```

---

### 4. Crear include reutilizable (si aplica)

**Archivo: _includes/components/cta-contacto.html**

```html
<div class="cta-contacto">
  <h2>{{ include.title | default: "¿Listo para comenzar?" }}</h2>
  <p>{{ include.subtitle | default: "Agenda tu consulta profesional" }}</p>
  
  <div class="cta-contacto__actions">
    <a href="{{ site.url }}/contacto" class="button button--primary">
      {{ include.cta | default: "Contactar ahora" }}
    </a>
    
    {% if site.whatsapp %}
      <a href="https://wa.me/{{ site.whatsapp }}" class="button button--whatsapp" target="_blank">
        WhatsApp
      </a>
    {% endif %}
  </div>
</div>
```

---

## Performance y optimización

### 1. Imágenes

```html
<!-- Lazy loading nativo -->
<img src="imagen.avif" 
     alt="Descripción" 
     width="800" 
     height="600"
     loading="lazy">

<!-- Responsive con picture -->
<picture>
  <source srcset="imagen-large.avif" media="(min-width: 1024px)" type="image/avif">
  <source srcset="imagen-medium.avif" media="(min-width: 768px)" type="image/avif">
  <source srcset="imagen-small.avif" type="image/avif">
  <img src="imagen-medium.jpg" alt="Descripción" width="800" height="600" loading="lazy">
</picture>
```

### 2. CSS crítico inline

```html
<!-- En head.html (ya implementado en ItalGel) -->
<style>
  {% include css/critical.css %}
</style>
```

**critical.css debe contener SOLO:**
- Reset básico
- Estilos above-the-fold
- Tipografía base
- Layout principal

### 3. Defer/Async scripts

```html
<!-- Analytics (defer) -->
<script src="/assets/js/analytics.js" defer></script>

<!-- Scripts de terceros (async) -->
<script src="https://widget.com/script.js" async></script>
```

---

## Debugging y validación

### Checklist pre-publicación:

```markdown
- [ ] HTML valida en https://validator.w3.org
- [ ] CSS no tiene errores de sintaxis
- [ ] Responsive funciona en móvil, tablet, desktop
- [ ] Imágenes tienen width/height (prevenir CLS)
- [ ] Links internos funcionan
- [ ] No hay console errors en navegador
- [ ] Performance > 90 en PageSpeed Insights
```

---

## Reglas obligatorias

### ✅ SIEMPRE hacer:
- Usar Grid/Flex para layouts
- Minimizar CSS con arquitectura modular
- Cargar CSS condicionalmente según layout
- HTML semántico (header, nav, main, article, etc.)
- Lazy loading en imágenes
- Width/height en todas las imágenes

### ❌ NUNCA hacer:
- Float para layouts
- jQuery (obsoleto)
- Cargar todo el CSS en todas las páginas
- Divs genéricos cuando existe etiqueta semántica
- JavaScript para efectos que CSS puede hacer
- Media queries cuando Grid/Flex con propiedades modernas funcionan

### ⚠️ Advertencias:
- **GitHub Pages solo soporta plugins whitelist:** No instalar plugins custom
- **CSS anidado:** Verificar compatibilidad de navegador si usas anidación nativa
- **:has() selector:** Safari 15.4+, Chrome 105+ (considerar fallback)

## Anti-patterns comunes

❌ **Mega archivo CSS global**
✅ **Correcto:** Módulos CSS pequeños cargados condicionalmente

❌ **Media queries para todo**
✅ **Correcto:** Grid con auto-fit/minmax + Flex con flex: 1 0 300px

❌ **JavaScript para todo**
✅ **Correcto:** CSS primero, JS solo cuando sea necesario

❌ **Divs sin sentido semántico**
✅ **Correcto:** header, nav, main, article, section, aside, footer
