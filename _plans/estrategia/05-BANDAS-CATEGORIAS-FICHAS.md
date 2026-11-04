# Bandas a todo el ancho en categorías, productos y fichas (2026-11-04)

Reglas del usuario para todo el sitio:
- cada sección es una banda a todo el ancho con su propio fondo;
- nada de tarjetas que floten en el espacio blanco;
- nada de "párrafo + borde";
- componentes con fondo, aire y las bolas del logo.

## El encabezado ya es una banda en 5 plantillas

`.portada` (en `critico.css`) es una banda de papel a todo el ancho que cierra con la franja tricolor. El texto se alinea con el contenido de la página (`--lado` = el margen del `.wrapper`) y la foto llega al borde derecho de la pantalla. En móvil, la foto va debajo y también a todo el ancho. En escritorio la altura la marcan el texto y un mínimo de `clamp(30rem, 68vh, 42rem)`, no la foto.

Ya lo usan:
- `index.html`, con el selector "¿Qué vas a cotizar?" (firma del jurado);
- `_layouts/contenido.html` (todas las categorías y páginas heredadas);
- `blog.html`, `equipos-cafe/index.html` y `404.html`.

Interacciones elegidas por el jurado (`_plans/animaciones.md`):
- **c01 (firma):** el selector de familia cambia la foto con CSS y el mensaje de WhatsApp con JS. Mide `interaccion_hero_familia` y `hero-<familia>`.
- **c13 (apoyo):** el flotante hereda la familia elegida (`flotante-<familia>`).
- **c05 (apoyo, pendiente):** View Transitions de la foto de la familia al hero de su categoría. Va con el paso 1.

## Paso 1: categorías (`_layouts/contenido.html` + `legado.css`)

Hoy el contenido heredado se ve como cajas de papel dentro del ancho del `.wrapper`, igual que el hero anterior.

1. **Bandas.** Cada bloque de primer nivel de `.contenido-legado` pasa a ser una banda a todo el ancho: el fondo va en la sección y el ancho de lectura en un relleno interior con `--lado`. Los fondos se alternan en orden blanco, papel y mantequilla, y nunca hay dos iguales seguidos.
2. **Familia por categoría.** `familia:` en el front matter (`familia-maquinas`, `familia-vitrinas`, `familia-variegatos`) colorea las bolas, las líneas de tabla, los sellos y el índice.
3. **Orden de bandas por categoría**, el mismo que la home:
   1. hero;
   2. modelos (baldosas con página propia);
   3. "para qué negocio" (tipos);
   4. comparativa;
   5. preguntas;
   6. guías del blog;
   7. cierre verde.
4. **Guías del blog en cada categoría.** La banda sale de `_data/blog.yml` (los posts cuyo `producto` apunta a esa categoría) y da enlazado interno de la categoría hacia los posts y de vuelta.
5. **Sin borde.** Se quitan las cajas `.datos`, `bg_grey_light` y `borders` heredadas. Los datos clave van en `.datos` (valor en serif) sobre la banda, y las listas en `.lista-check` con la bola de la familia.
6. **c05.** `@view-transition { navigation: auto }` en origen y destino, y un nombre por página en una clase:
   - en la home: `.vt-vitrinas`, `.vt-cafe` y `.vt-maquinas` sobre la foto de cada banda;
   - en cada categoría: el mismo nombre sobre la foto del hero (`transicion:` en el front matter).

   Se mide el LCP antes y después y se revierte si sube.

Lo que se mide en cada categoría migrada:
- `auditoria.py`;
- desborde a 320 y 390 px;
- LCP sin cambios;
- el CTA en la primera pantalla del móvil.

## Paso 2: fichas de producto (`_layouts/producto.html`)

La ficha ya va en bandas (ficha, instalar, características, preguntas, comparar y cierre). Falta el encabezado:
- **`.producto` como banda.** La galería sobre papel llega al borde izquierdo de la pantalla, en espejo con la portada, y la información queda alineada con el contenido. En móvil, la foto va arriba a todo el ancho.
- **`.producto__foto`.** Sale de la tarjeta con franja y la foto se funde sobre la banda de papel (`mix-blend-mode: multiply`, como ya hace).
- **Fondos de la ficha.** Se revisan para no repetir dos iguales seguidos. El orden actual es banda blanca, mantequilla, blanca, papel, blanca y verde; queda bien y solo cambia el hero.

## Paso 3: categorías de café e insumos

`equipos-cafe/index.html` ya usa la portada nueva (variante `--producto`, foto recortada con `contain`). Las categorías de bases, pastas y coberturas siguen el paso 1.

## CSS crítico: presupuesto de 5120 B gzip en la home

El CSS crítico ya pasaba el presupuesto antes de este cambio (5174 B), y el selector lo subía a 5643 B. Quedó en 5022 B porque se separó por plantilla:
- `critico-portada-familias.css`: solo `/`;
- `critico-articulo.css`: solo el layout `post`;
- `critico-producto.css`: solo el layout `producto`.

El submenú (solo con cursor) y el brillo y el timbre del botón pasaron a `componentes.css`. Cualquier CSS nuevo encima del pliegue que sea de una sola plantilla va en su archivo crítico propio.
