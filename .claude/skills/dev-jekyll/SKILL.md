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

## Arquitectura CSS modular del proyecto

**Estructura obligatoria (respetar siempre):**

```
_includes/
└── css/
    ├── critical.css      ← CSS crítico above-the-fold (inline en head)
    ├── header.css        ← Estilos del header
    ├── footer.css        ← Estilos del footer
    ├── nav.css           ← Navegación
    ├── universal.css     ← Estilos globales base
    ├── blog.css          ← Estilos específicos de blog
    ├── styles-home.css   ← Estilos específicos del home
    ├── styles-landing.css     ← Estilos de landing pages
    ├── styles-services.css    ← Estilos de páginas de servicios
    └── styles-corporate.css   ← Estilos corporativos/institucionales

assets/
└── css/
    ├── styles-blog.css        ← Importa blog.css + dependencias
    ├── styles-home.css        ← Importa home.css + dependencias
    ├── styles-landing.css     ← Importa landing.css + dependencias
    ├── styles-services.css    ← Importa services.css + dependencias
    └── styles-corporate.css   ← Importa corporate.css + dependencias
```

**Propósito de la arquitectura:**
- **Separación por componente:** Cada CSS es un módulo (header, footer, nav, etc.)
- **Carga condicional:** Solo se carga el CSS necesario según el layout
- **Performance:** Archivos pequeños y específicos, no un mega CSS global
- **Mantenibilidad:** Cambios en header solo afectan header.css

---

### Ejemplo de assets/css/styles-blog.css:

**IMPORTANTE: NO usar @import (falla en Jekyll). Usar {% render %} con front matter.**

```css
---
---
{% render "css/universal.css" %}
{% render "css/header.css" %}
{% render "css/nav.css" %}
{% render "css/footer.css" %}
{% render "css/blog.css" %}
```

**Explicación:**
- Las `---` al inicio activan el procesamiento de Liquid
- `{% render "path/archivo" %}` inserta el contenido del archivo (sin necesidad de .css)
- Jekyll procesa todo y genera un solo archivo CSS compilado
- **NUNCA usar `@import`** de CSS nativo (no funciona correctamente)
- **`{% include %}` está DEPRECATED**, usar `{% render %}` siempre

### Carga condicional en _includes/head.html:

```html
<!-- CSS crítico inline -->
<style>
  {% render "css/critical.css" %}
</style>

<!-- CSS específico según layout -->
{% if page.layout == "post" or page.layout == "blog" %}
  <link rel="stylesheet" href="{{ '/assets/css/styles-blog.css' | relative_url }}">
{% elsif page.layout == "home" %}
  <link rel="stylesheet" href="{{ '/assets/css/styles-home.css' | relative_url }}">
{% elsif page.layout == "landing" %}
  <link rel="stylesheet" href="{{ '/assets/css/styles-landing.css' | relative_url }}">
{% elsif page.layout == "service" %}
  <link rel="stylesheet" href="{{ '/assets/css/styles-services.css' | relative_url }}">
{% else %}
  <link rel="stylesheet" href="{{ '/assets/css/styles-corporate.css' | relative_url }}">
{% endif %}
```

**REGLA DE ORO:** Nunca cargar todo el CSS en todas las páginas. Solo lo necesario.

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

**✅ Template rendering: `{% render %}` (USAR) vs `{% include %}` (DEPRECATED):**

**IMPORTANTE:** Liquid ha deprecado `{% include %}`. Usar siempre `{% render %}`.

```liquid
<!-- ❌ DEPRECATED: NO usar include -->
{% include "header.html" %}
{% include cta-servicio.html %}

<!-- ✅ CORRECTO: Usar render -->
{% render "header.html" %}
{% render "cta-servicio.html" %}
```

**Diferencias clave:**

| Característica | `{% include %}` (deprecated) | `{% render %}` (usar) |
|----------------|------------------------------|----------------------|
| **Estado** | Deprecated | Recomendado |
| **Scope de variables** | Compartido (puede modificar variables del parent) | Aislado (no comparte variables) |
| **Performance** | Más lento | Más rápido |
| **Predecibilidad** | Menos predecible | Más predecible |
| **Extensión** | No requiere .liquid | No requiere .liquid |

**Por qué render es mejor:**
- Variables aisladas = código más seguro y predecible
- No hay efectos secundarios inesperados
- Mejor para mantenimiento a largo plazo
- Recomendación oficial de Liquid

**✅ Render con parámetros (passing variables):**

```liquid
<!-- En layout o página: pasar variables explícitamente -->
{% render "components/card.html", 
   title: "Título del card",
   image: "/assets/img/foto.jpg",
   link: "/pagina",
   cta: "Leer más"
%}

<!-- Pasar variables existentes -->
{% assign producto = site.data.productos.first %}
{% render "components/product-card.html", 
   product: producto,
   show_price: true
%}

<!-- En _includes/components/card.html: acceder con nombre de parámetro -->
<div class="card">
  {% if image %}
    <img src="{{ image }}" alt="{{ title }}">
  {% endif %}
  <h3>{{ title }}</h3>
  <a href="{{ link }}" class="button">{{ cta | default: "Ver más" }}</a>
</div>
```

**Diferencia crítica en el componente:**

```liquid
<!-- ❌ CON INCLUDE (deprecated): usar include.variable -->
<h3>{{ include.title }}</h3>

<!-- ✅ CON RENDER: usar directamente el nombre del parámetro -->
<h3>{{ title }}</h3>
```

**✅ Render con objetos (with/for):**

```liquid
<!-- Render con un objeto usando "with" -->
{% assign featured = site.posts.first %}
{% render "post-card.html" with featured as post %}

<!-- Render para cada item de un array usando "for" -->
{% render "post-card.html" for site.posts as post %}

<!-- En el componente post-card.html -->
<article>
  <h2>{{ post.title }}</h2>
  <time>{{ post.date | date: "%B %d, %Y" }}</time>
  
  <!-- forloop está disponible cuando usas "for" -->
  {% if forloop.first %}
    <span class="badge">Más reciente</span>
  {% endif %}
</article>
```

**✅ Casos de uso comunes:**

```liquid
<!-- CTAs condicionales -->
{% case page.tipo %}
  {% when "servicio" %}
    {% render "cta-servicio.html", title: page.title %}
  {% when "blog" %}
    {% render "share-buttons.html", url: page.url %}
  {% else %}
    {% render "cta-general.html" %}
{% endcase %}

<!-- Cards con datos del front matter -->
{% for servicio in page.servicios %}
  {% render "service-card.html",
     title: servicio.nombre,
     icon: servicio.icono,
     description: servicio.descripcion,
     link: servicio.url
  %}
{% endfor %}

<!-- Hero section con variables -->
{% render "hero-section.html",
   heading: page.hero_title,
   subheading: page.hero_subtitle,
   cta_text: "Agendar cita",
   cta_link: "/contacto",
   background_image: page.hero_image
%}
```

**Para archivos CSS (sin variables):**

```css
---
---
{% render "css/universal.css" %}
{% render "css/header.css" %}
```

**REGLA DE ORO:** 
- Siempre usar `{% render %}`, nunca `{% include %}`
- Pasar variables explícitamente con parámetros
- En el componente, acceder directamente por nombre (no `include.variable`)

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
.claude/assets/plantillas/
├── post.html         ← Layout actual de posts del cliente
├── page.html         ← Layout actual de páginas del cliente
└── head.html         ← Include del head con CSS condicional
```

**Propósito:** Mantener consistencia con el diseño existente del cliente.

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

**Archivo: _includes/css/styles-services.css**

```css
/* Servicio: Estructura principal */
.service {
  max-width: min(90%, 1200px);
  margin-inline: auto;
  padding: var(--space-lg) 0;
}

.service__header {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.service__subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: var(--color-secondary);
  margin-top: var(--space-sm);
}

/* Features Grid - Responsive con Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.feature-card {
  padding: var(--space-md);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  
  & h3 {
    margin-bottom: var(--space-sm);
    color: var(--color-primary);
  }
}

/* CTA Section */
.service__cta {
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 12px;
  text-align: center;
}
```

**Agregar render en assets/css/styles-services.css:**

```css
---
---
{% render "css/universal.css" %}
{% render "css/header.css" %}
{% render "css/nav.css" %}
{% render "css/styles-services.css" %}
{% render "css/footer.css" %}
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
<!-- En head.html -->
<style>
  {% render "css/critical.css" %}
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
