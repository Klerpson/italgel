# Componentes e includes disponibles en ItalGel

Rutas reales de los archivos en `_includes/` para consultar antes de maquetar o reutilizar componentes.

## INCLUDES PRINCIPALES

| Componente | Ruta | Descripción |
|------------|------|-------------|
| Head | `_includes/head.html` | `<head>`: meta tags, CSS, schema |
| Navegación | `_includes/nav.html` | Menú principal |
| Header/Hero | `_includes/header.html` | Cabecera de página con imagen hero |
| Slider | `_includes/slider.html` | Carrusel de imágenes |
| Cards (3) | `_includes/3_cards.html` | Sección de 3 tarjetas |
| Galería | `_includes/gallery.html` | Galería de imágenes |
| FAQs | `_includes/faqs.html` | Sección de preguntas frecuentes |
| FAQ Schema | `_includes/faq-schema.html` | Schema FAQPage JSON-LD |
| Schema | `_includes/schema.html` | Schemas Organization / Article |
| Botón | `_includes/boton.html` | CTA botón reutilizable |
| Share | `_includes/share.html` | Botones compartir en redes |
| Related posts | `_includes/related-posts.html` | Posts relacionados al final |
| Floating btns | `_includes/floating-buttons.html` | Botones flotantes WhatsApp |
| Footer | `_includes/footer.html` | Pie de página |
| Breadcrumb | `_includes/breadcrumb.html` | Miga de pan |
| Credentials | `_includes/credentials.html` | Credenciales / certificaciones |
| Author info | `_includes/author-info.html` | Info del autor en posts |
| Trust signals | `_includes/trust-signals.html` | Señales de confianza |
| Testimonials | `_includes/testimonials.html` | Testimonios de clientes |
| Team | `_includes/team-experience.html` | Equipo y experiencia |
| PQR form | `_includes/pqr.html` | Formulario de contacto |
| Lordicon | `_includes/lordicon.html` | Iconos animados |

## CSS DE LOS MÓDULOS

| Módulo CSS | Ruta | Qué estiliza |
|------------|------|--------------|
| Critical | `_includes/css/critical.css` | CSS inline above-the-fold |
| Universal | `_includes/css/universal.css` | Reset, variables, tipografía base |
| Nav | `_includes/css/nav.css` | Navegación |
| Header | `_includes/css/header.css` | Hero / cabecera |
| Cards | `_includes/css/cards.css` | Tarjetas de productos/posts |
| Pages | `_includes/css/pages.css` | Estilos de páginas interiores |
| Botón | `_includes/css/boton.css` | Botones y CTAs |
| Slider | `_includes/css/slider.css` | Carrusel |
| Footer | `_includes/css/footer.css` | Footer |
| Floating | `_includes/css/floating-buttons.css` | Botones flotantes |
| Share | `_includes/css/share.css` | Botones compartir |
| PQR | `_includes/css/pqr.css` | Formulario de contacto |
| Media queries | `_includes/css/media-queries.css` | Responsive breakpoints |

## ARCHIVO PRINCIPAL CSS

`css/style.css` — concatena todos los módulos con `{% include %}`.
Para agregar un CSS nuevo: crear en `_includes/css/` y agregar `{% include css/nombre.css %}` en `css/style.css`.
