# Frutas pendientes y chocolates — Tanda finalizada el 5 de noviembre de 2026

Preparación iniciada el 4 de noviembre y retomada el 5 tras la interrupción del servicio de revisión de permisos. Siete fotografías publicadas y verificadas en tres páginas. Commit funcional `ff88bf3`; [GitHub Pages 42035586159](https://github.com/Klerpson/italgel/actions/runs/42035586159) completado correctamente.

## Correspondencia y procedencia

| Uso | Fuente y tratamiento |
|---|---|
| Chocolate | Foto de [Chocolate Cream, MEC3](https://www.mec3.com/en/products/gelato/flavouring-pastes/milk-gelato-flavours/chocolate-cream), código 14073A. Se describe la textura de helado publicada en la ficha. |
| Stracciatella | Foto de [Stracciatella, MEC3](https://www.mec3.com/en/products/gelato/ripple-sauces/creamy-ripples/stracciatella), código 14028. Sustituye una fotografía heredada de otro sabor; ahora se reconocen la cobertura y las virutas de chocolate. |
| Chocolate blanco | Foto de [Biancocioc, MEC3](https://www.mec3.com/en/products/gelato/flavouring-pastes/milk-gelato-flavours/biancocioc), código 14092A. Presentación del sabor, sin atribuir un envase o lote de Italgel. |
| Arándano | [Alina Vilchenko / Pexels](https://www.pexels.com/photo/blueberries-on-white-surface-12716480/). La ficha actual Blueberry Paste devolvía una imagen genérica que se descartó. Foto de fruta identificada como ilustrativa. |
| Limón | [Hanna Pad / Pexels](https://www.pexels.com/photo/sliced-lemon-on-white-table-7214594/). Encuadre cuadrado que conserva la porción de limón completa. La fotografía no demuestra procedencia siciliana ni un producto MEC3 concreto. |
| Mandarina | [Paolo Neo / Pixnio](https://pixnio.com/flora-plants/fruits/mandarin-oranges-fruit-pictures/mandarin-fruit-on-white-background), identificada por su página como CC0. Foto de la fruta completa, con margen blanco normalizado. |
| Dragon Summer / pitaya | [Bermix Studio / Unsplash](https://unsplash.com/photos/a-dragon-fruit-cut-in-half-on-a-white-background-IbRkYrIgrWo). Fruta entera y cortada como ilustración del sabor. Se retira la composición heredada que incluía un envase de identificación dudosa. No se representa como resultado concreto del producto. |

Los cuatro usos de stock tienen leyenda visible y crédito enlazado en las tarjetas de las dos páginas donde aparecen. Las licencias se registran en `fuentes/stock.json`: [Pexels](https://www.pexels.com/license/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/) y [Unsplash](https://unsplash.com/license). Las fotos de MEC3 son fuentes de fabricante con los derechos de sus titulares; no se clasifican como stock libre.

Las fichas y el buscador público del fabricante se consultaron para localizar imágenes, nombres y códigos. `fuentes/descargas.json` documenta las descargas y el rechazo de la imagen genérica. Los archivos de origen y sus SHA-256, encuadres, calidad y variantes están en `procedencia.json`.

## Implementación y peso

- **7 fotografías, 32 variantes AVIF, 651.708 bytes en conjunto.** Los archivos máximos por fotografía pesan de 28.451 a 59.325 bytes. Cada visitante selecciona una variante por imagen; no descarga todo el conjunto.
- Fuentes MEC3 de 492 × 492 o 540 × 540 px. Fotografías de stock preparadas a 800 × 800 px desde fuentes mayores, sin ampliar su detalle.
- Calidad ajustada a cada fotografía: 62 o 66, muestreo 4:4:4. Cada variante procede del original y se compone cualquier transparencia sobre blanco.
- Recorte central para el patrón de arándanos; encuadre del limón que conserva el fruto; retirada de márgenes blancos y centrado de mandarina/pitaya. Las decisiones quedan registradas por coordenadas.
- Datos independientes en `_data/imagenes_ingredientes_extra.json` y variantes en `img/catalogo/ingredientes-2/`. El componente existente de catálogo resuelve estas imágenes mediante las claves de origen conservadas.
- **Sin cambios CSS.** Se mantienen los originales históricos y las optimizaciones de las tandas previas. Se actualizan textos alternativos y títulos; especificaciones, dosificaciones y afirmaciones comerciales heredadas quedan fuera de esta tanda fotográfica.

## Alcance de la revisión

Páginas: `/pastas-sabores-helado/`, `/pastas-sabores-helado/pastas-fruta/` y `/pastas-sabores-helado/pastas-clasicas/`. Matriz local: 320/390/640/768/960/1440 px y densidad 2 a 390/1440 px. Se conservan nueve comprobaciones anteriores a la integración.

La validación comprueba carga de imágenes, JavaScript propio, respuestas HTTP propias, un H1 y desbordamiento horizontal; además del rastreo de las 85 páginas generadas y sus recursos. Se inspeccionan los archivos exportados y las tarjetas renderizadas. Las comprobaciones se realizan en Edge; no acreditan revisión de Safari/Firefox ni métricas de usuarios reales.

## Reproducción

`buscar.cjs` y `catalogo.cjs` consultan las categorías y el buscador público de MEC3; `descargar.cjs` obtiene las tres fotos oficiales aceptadas y registra la foto genérica rechazada. `stock.cjs` obtiene las cuatro fotos de fruta. `preparar.py` valida hashes y exporta los 32 AVIF; `integrar.py` actualiza los textos y créditos. Compilar Jekyll y ejecutar `verificar.cjs integral`, `verificar.cjs integral retina` y `auditoria.py`. Después del despliegue, `archivos-vivo.cjs` contrasta los 32 archivos públicos y `verificar.cjs vivo integral` revisa las páginas.

`_plans/` conserva las fuentes y capturas fuera del sitio compilado. Los scripts tienen rutas de runtime específicas de este equipo.

## Resultado local final

Compilación del 5 de noviembre correcta. Las 18 combinaciones a densidad 1 y seis a densidad 2 pasaron sin fallos ni desbordamientos. El rastreo de los 85 HTML terminó con cero enlaces internos, anclas, recursos CSS, imágenes indecodificables o dimensiones sociales incorrectas. Las capturas se inspeccionaron; la cabecera fija puede aparecer superpuesta al capturar una sección larga mientras la página está desplazada. No forma parte de las imágenes de producto.

## Cierre en producción

Verificación del 5 de noviembre: los 32 archivos públicos respondieron correctamente y sus SHA-256 coinciden con los locales (651.708 bytes). Las tres páginas pasaron 18 combinaciones de ancho sin imágenes rotas, errores propios de JavaScript/HTTP ni desbordamiento. Se inspeccionó también una captura renderizada del catálogo clásico publicado. Los recibos están en `vivo/archivos-resumen.json` y `vivo-integral/resumen.json`. Las pruebas de densidad 2 fueron locales. Tanda cerrada.
