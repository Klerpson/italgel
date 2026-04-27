# Plan de enlazado interno — ItalGel

Objetivo: distribuir autoridad, mejorar UX y SEO mediante enlaces internos entre **posts**, **páginas de productos** y **páginas principales** de la tienda.

---

## 0. Convenciones de enlaces (SEO y accesibilidad)

Al añadir enlaces en el contenido (Markdown o HTML) hay que cumplir:

- **URLs internas**: Usar Liquid para que la URL sea correcta con aseurl:
  - En Markdown: [texto]({{ "/ruta/" | relative_url }} "Título descriptivo")
  - En HTML/Liquid: <a href="{{ '/ruta/' | relative_url }}" title="Título descriptivo">texto</a>
- **Atributo 	itle**: Incluir en todos los enlaces un 	itle descriptivo (qué encontrará el usuario y, si aplica, mención de ItalGel / Colombia). Mejora SEO y accesibilidad.
- **Enlaces externos** (p. ej. WhatsApp): Añadir 	arget="_blank" y el="noopener noreferrer". En Kramdown: [texto](https://... "Título"){: target="_blank" rel="noopener noreferrer" }.
- **Texto del enlace**: Descriptivo (evitar "clic aquí"). Preferir anclas que describan el destino (ej. "bases para helado en Bogotá", "máquinas para heladería artesanal").
- **Imágenes**: Usar elative_url en src cuando se use Liquid, y lt descriptivo siempre.

---

## 1. Inventario de URLs

### 1.1 Páginas principales (hub / corporativas)

| URL | Título / rol |
|-----|----------------|
| / | Inicio |
| /blog/ | Blog (hub de contenido) |
| /insumos/ | Catálogo de insumos |
| /equipos/ | Máquinas y equipos |
| /contacto/ | Contacto |
| /nosotros/ | Nosotros |

### 1.2 Páginas de productos (por tema)

**Máquinas para helado**

| URL | Enlazar desde |
|-----|----------------|
| /maquinas-helado-artesanal/ | Blog, insumos, equipos |
| /maquinas-helado-industrial/ | Blog, insumos, equipos |
| /maquinas-helado-soft/ | Blog, insumos, equipos |

**Vitrinas y congeladores**

| URL | Enlazar desde |
|-----|----------------|
| /vitrinas-congeladores/ | Blog, equipos |

**Insumos**

| URL | Enlazar desde |
|-----|----------------|
| /bases-helado-colombia/ | Blog, máquinas, equipos |
| /pastas-sabores-helado/ | Blog, bases, equipos |
| /variegatos-helado/ | Blog, bases, toppings |
| /granelas-decoracion/ | Blog, toppings, variegatos |
| /coberturas-salsas-helado/ | Blog, toppings, variegatos |

### 1.3 Posts del blog

| URL | Tema principal | Productos y páginas a enlazar |
|-----|----------------|-------------------------------|
| /blog/como-calcular-overrun-helado-artesanal/ | Overrun | /bases-helado-colombia/, /maquinas-helado-artesanal/ |
| /blog/que-es-gelato-vs-helado-diferencias/ | Gelato vs Helado | /bases-helado-colombia/, /pastas-sabores-helado/ |
| /blog/toppings-para-helado-mas-rentables/ | Toppings | /granelas-decoracion/, /coberturas-salsas-helado/ |
| /blog/pasteurizacion-mezcla-helado-correcta/ | Pasteurización | /bases-helado-colombia/, /maquinas-helado-artesanal/ |
| /blog/rentabilidad-heladeria-colombia/ | Rentabilidad | /equipos/, /insumos/ |
| /blog/como-abrir-una-heladeria-en-colombia/ | Abrir heladería | /equipos/, /insumos/, /contacto/ |

---

## 2. Reglas de enlazado

### 2.1 Desde el sitio hacia el blog

- **Inicio**: enlace a "Blog" (ya en nav) y opcionalmente 1–2 posts destacados o "Últimos artículos".
- **Equipos / Insumos**: en la intro o al final, bloque "Lee en el blog" con posts relacionados (técnicas, recetas, rentabilidad).
- **Cada página de producto**: al menos 1 enlace contextual a un post relacionado (si existe) + "Más en el blog" ? /blog/.

### 2.2 Desde el blog hacia productos y principales

- **Cada post**: mínimo 2–3 enlaces internos a productos o páginas principales (no solo "contacto").
- **Anchor text**: variado y descriptivo (ej. "bases para helado artesanal en Colombia", "máquinas para heladería profesional").
- **Al final del post**: CTA a contacto/WhatsApp y, si aplica, a la página de producto principal del tema.

### 2.3 Entre productos (misma categoría o complementarios)

- **Máquinas**: en máquinas artesanales enlazar a industriales, soft, vitrinas.
- **Insumos**: en bases enlazar a pastas, variegatos; en toppings enlazar a granelas, coberturas.
- **Equipos**: en vitrinas enlazar a máquinas; en máquinas enlazar a vitrinas.

### 2.4 Hub ? productos

- **Equipos** (/equipos/): ya enlaza a productos vía datos. Revisar que cada url sea la URL real del producto.
- **Insumos** (/insumos/): ya enlaza a productos vía datos. Revisar que cada url sea la URL real del producto.
- Añadir en la página, si no existe, un párrafo con enlace a "Blog" y a "Contacto".

### 2.5 Páginas principales entre sí

- **Nosotros**: enlace a equipos, insumos, blog, contacto.
- **Contacto**: enlace a equipos, insumos, blog.
- **Blog**: en sidebar o al final, enlaces a equipos, insumos, contacto.

---

## 3. Matriz de enlaces por tipo de página

### 3.1 Posts ? Dónde enlazar (mínimo recomendado)

| Post | Productos a enlazar | Otras páginas |
|------|---------------------|----------------|
| Cómo calcular overrun | bases-helado-colombia, maquinas-helado-artesanal | equipos, blog, contacto |
| Gelato vs Helado | bases-helado-colombia, pastas-sabores-helado | insumos, blog, contacto |
| Toppings rentables | granelas-decoracion, coberturas-salsas-helado | insumos, blog, contacto |
| Pasteurización | bases-helado-colombia, maquinas-helado-artesanal | equipos, blog, contacto |
| Rentabilidad heladería | equipos, insumos | blog, contacto |
| Abrir heladería | equipos, insumos | blog, contacto |

### 3.2 Productos ? Dónde enlazar (mínimo recomendado)

- **Todas**: Inicio (/), Catálogo correspondiente (/equipos/ o /insumos/), Contacto (o CTA).
- **Por tema**: ver tabla de 1.2; además cada producto enlaza a 1–2 productos relacionados y, si hay post, al post.

### 3.3 Principales ? Dónde enlazar

- **Inicio**: Blog, Equipos, Insumos, Contacto.
- **Equipos**: Blog (bloque "Lee más"), cada producto vía datos, Contacto.
- **Insumos**: Blog (bloque "Lee más"), cada producto vía datos, Contacto.
- **Blog**: Equipos, Insumos, Contacto.

---

## 4. Implementación técnica (Jekyll)

### 4.1 Posts

- Mantener en el contenido del post enlaces manuales en el cuerpo del texto (Markdown) a productos y a /equipos/, /insumos/, /blog/, /contacto/.
- El layout post.html ya muestra "Artículos relacionados" por category; asegurar que cada post tenga category (singular) coherente para que ese bloque sea útil.
- Opcional: en post.html, añadir sección "Productos relacionados" que lea desde front matter, por ejemplo:
  - elated_products: [bases-helado-colombia, maquinas-helado-artesanal]
  - y se generen enlaces a /bases-helado-colombia/, etc.

### 4.2 Productos

- En cada página de producto, en el HTML de contenido, añadir un bloque tipo "Productos relacionados" o "Lee en el blog" con enlaces a 1–2 productos y 0–1 post, ya sea con include parametrizado o con variables en front matter (ej. elated_products, elated_posts).

### 4.3 Hubs (Equipos / Insumos)

- Comprobar que los datos usen URLs correctas (ej. url: /maquinas-helado-artesanal/).
- Añadir sección "Artículos del blog" con enlaces a los 3–5 últimos posts o a posts con tag/categoría relacionada.

### 4.4 Navegación

- El menú (
av.html) ya enlaza a Blog, Equipos, Insumos, Contacto, Nosotros. Mantener y no duplicar enlaces en el mismo bloque.

---

## 5. Checklist por nuevo contenido

- [ ] **Nuevo post**: Añadir 2–3 enlaces a productos/páginas principales en el cuerpo; revisar category para "Artículos relacionados".
- [ ] **Nueva página de producto**: Añadir enlaces a Inicio, Catálogo correspondiente, 1–2 productos relacionados, 0–1 post relacionado, Contacto/CTA.
- [ ] **Nueva página principal**: Enlazar a Blog, Equipos, Insumos, Contacto y a la sección que corresponda.

---

## 6. Resumen de prioridades

1. **Alta**: Posts con enlaces a productos y a /equipos/, /insumos/ y /contacto/.
2. **Alta**: Productos con enlace a hub correspondiente y a 1–2 productos relacionados.
3. **Media**: Bloque "Blog" / "Artículos relacionados" en Equipos, Insumos y en productos clave.
4. **Media**: Coherencia de category en posts para el bloque "Artículos relacionados" del layout.
5. **Baja**: Enlaces desde Nosotros / FAQ a productos y blog.

Documento de referencia. Para aplicar enlaces concretos en cada post o producto, usar este plan como guía y editar el contenido o el front matter según la tabla correspondiente.
