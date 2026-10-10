# Auditoría de imágenes: title y alt (24 sep 2026)

Skill aplicada: `image-title-attribute-audit`. Solo se tocaron atributos `alt`/`title` y sus fuentes de datos. No se cambió CSS, JS ni estructura, salvo 3 excepciones justificadas (ver "Cambios de plantilla"). **Nada está commiteado.**

## Diagnóstico inicial

| | Fuente | HTML generado (`_site`) |
|---|---|---|
| `<img>` totales | 169 | 382 |
| Con `title` | 7 (4 %) | 23 (6 %) |
| `alt=""` | 1 | 34 (18 decorativas del slider + 14 heros + legal + 404) |

Hallazgos graves (más importantes que el `title`):
1. **14 heros con `alt=""`.** Eran páginas `main` sin `alt:` en el front matter y además el contenedor `.hero_visual` tenía `aria-hidden="true"`.
2. **`maquinas-helado-soft`** tenía el alt del hero de la página industrial (texto copiado y pegado; cruzaba keywords).
3. **Alts repetidos en imágenes distintas:** pistacho (4 imágenes), vainilla (4), variegato (4), Supergelmix (3), Quella (3), las 3 tarjetas de proveedor de la home (con el mismo alt **y** el mismo title) y 3 heros de categoría con el alt por defecto.
4. **Carrusel de ciudades de la home:** las 7 copias con `aria-hidden` tenían alt con texto.
5. **404:** se renderizaba un `<img src="">` vacío.
6. **Logos del slider** con alts genéricos y con errores ("Proveedor toppings" para Valmar, que vende máquinas).

## Qué se hizo

**Fase 1: alt**
- Se agregó `alt:` a 17 páginas y a `legal.md`.
- Se corrigió el alt de soft.
- Se reescribieron 30 alts del cuerpo de las páginas y los 6 de la galería de la home, que estaban duplicados o no coincidían con la foto. Cada alt nuevo describe lo que se ve en la imagen (revisé las 140 imágenes, las hojas están en `Claude outputs/revision-imagenes/`).
- Las copias del carrusel quedaron con `alt=""`.
- Resultado: **0 alts duplicados entre imágenes distintas.**

**Fase 2: plantillas compartidas**
- `_includes/header.html`: las 5 variantes de hero tienen ahora `{% if page.hero_title %}title="…"{% endif %}` (con la condición nunca sale un `title=""`). Se agregó `hero_title:` a 52 páginas y posts. Se omitió en pastas-clásicas y bases-stevia porque la foto no coincide con el tema.
- `_includes/slider.html` usa ahora `_data/marcas.yml`. Antes el mismo bloque estaba copiado en el front matter de index, nosotros y contacto. Ahora cada logo lleva `alt="Logo <marca>"` y un `title` con la línea de producto.
- `_includes/gallery.html`: la galería de la home ahora usa `alt`, `img` y `title` por imagen, con `relative_url`.

**Fase 3: páginas sueltas**
- 128 etiquetas editadas con un title corto (2–6 palabras), distinto del alt y basado en el producto o la sección, sin usar la keyword foco de otra URL.

## Cambios de plantilla (fuera de "solo atributo")
- Se quitó `aria-hidden="true"` de `.hero_visual`. Decisión de Sofi: las fotos son informativas. Ningún CSS usa ese atributo.
- Se agregó `{% if page.hero %}` en la rama `else` de `header.html`, para eliminar el `<img src="">` de la 404.
- La migración de slider y galería a datos, descrita arriba.

## Resultado (fuente)
169 `<img>` en total: **132 con title (78 %)**. Las 37 sin title son intencionales:
- **8 decorativas:** 7 copias del carrusel y el set duplicado del slider.
- **6 donde el title sería ruido:** tarjetas de `blog.html` (3), `related-posts`, avatar de autor y logo del menú. Su alt ya repite el texto del enlace o el nombre visible.
- **7 en includes que hoy no se renderizan:** `credentials.html` no se incluye en ninguna página (4) y `team-experience` se llama sin fotos (3).
- **3 en páginas con `published: false`:** la comparativa Base 50 vs 100 y la de diferencia entre variegato y salsa.
- **13 imágenes que no coinciden con su contenido.** No se les puso title para no reforzar un error (ver abajo).

## Hallazgos de contenido (para decidir, no se tocaron)
| Página | Problema |
|---|---|
| 4 páginas de ciudad | El hero es **la misma foto de stock** (mujer tomándose una selfie). La sección "Pastas concentradas" usa `granelas-crujientes-helado.avif` (se ven toppings, no pastas). Sugerencia: usar `pastas-concentradas-mec3.avif`. |
| maquinas-helado-soft | La foto de la "3 sabores" se reutiliza para la 603 BIB. |
| pastas (índice y clásicas) | `pasta-fresa-helado-natural.avif` muestra helado de crema con nueces, no fresa. |
| coberturas | `fiordiarancio-naranja-variegato.avif` muestra rodajas de limón. `quella-white-chocolate-blanco.avif` muestra cacao en polvo. |
| bases (índice y stevia) | `yogo-greco-stevia.avif` muestra tabletas de chocolate (es la misma foto que Quella Dark). El hero de `bases-stevia` es un vaso de Quella White. |
| base-50-mec3 | `base-50-mec3-empaque.avif` muestra una vitrina de helados, no el empaque. |
| maquinas-helado-industrial | `produccion-helado.avif` es una vitrina, no una línea de producción. |
| pastas-clásicas / premium | Usan heros casi idénticos, con sabores premium (pistacho, avellana). |
| amarena-fabbri | El alt anterior describía "amarena sobre fiordilatte en copa", pero la foto es una paleta rosada. Se corrigió el alt. |

## Verificación
- Recuento en fuente con el mismo script de la auditoría: 37 sin title, todas clasificadas arriba.
- YAML de todos los front matter y de `_data/`: sin errores.
- Liquid: `header.html`, `slider.html` y `gallery.html` se renderizaron con python-liquid usando el front matter real (home, ciudad, categoría, producto, general, post, legal y 404). Salida correcta, sin `title=""`.
- **Pendiente:** `jekyll build` real. No fue posible desde este entorno (rubygems bloqueado). Correr `bundle exec jekyll serve` y revisar la home (slider y galería), una página de ciudad y la 404.
