# Pastas y variegatos: segunda tanda de ingredientes

4 de noviembre de 2026. Publicada y verificada en producción. Commit funcional `87bf274`; [GitHub Pages 41919553359](https://github.com/Klerpson/italgel/actions/runs/41919553359) completado correctamente.

## Alcance y fuentes

Se atendieron los cinco sabores acordados: frutos del bosque, frambuesa, vainilla, coco y caramelo. **Seis fotografías cubren siete referencias** porque la imagen de frutos del bosque se comparte y caramelo tiene usos de pasta y de variegato.

| Uso | Fuente y criterio |
|---|---|
| Pasta de frutos del bosque | [Ficha Wild Berries Paste de MEC3](https://www.mec3.com/en/products/gelato/flavouring-pastes/fruit-flavours/wild-berries-paste), código 18085A. La misma escena de helado que el archivo heredado, ahora desde el original de 492 × 492 px. |
| Fiordibosco | Comparte la fotografía de helado de frutos del bosque; leyenda y alt indican que es ilustrativa del sabor. La fotografía no demuestra el envase ni la referencia de ese variegato. |
| Vainilla | [Ficha Vanilla Bourbon de MEC3](https://www.mec3.com/en/products/gelato/flavouring-pastes/milk-gelato-flavours/bourbon), código 14039. Se describe la presentación de helado, sin llamarla envase de pasta. |
| Coco | [Ficha Cocco Fine Pasta de MEC3](https://www.mec3.com/it/prodotti/gelato/paste-e-polveri-aromatizzanti/gusti-creme/cocco-fine-pasta). Fotografía de helado de coco publicada por el fabricante. |
| Pasta de caramelo | [Ficha Pasta Caramel de MEC3](https://www.mec3.com/it/prodotti/gelato/paste-e-polveri-aromatizzanti/gusti-creme/caramel). Fotografía de la preparación publicada en esa ficha. |
| Caramelo salado | [Ficha Popcorn Salty Caramel de MEC3](https://www.mec3.com/it/prodotti/gelato/variegati/variegati-creme/variegato-popcorn-salty-caramel). Conserva la escena reconocible de caramelo con palomitas, ahora desde el original; leyenda visible como preparación ilustrativa. No identifica un SKU concreto del catálogo de Italgel. |
| Frambuesa | [Fotografía de Mockup Graphics en Unsplash](https://unsplash.com/photos/red-raspberry-on-white-background-jHcKq383ibg). La ficha Fiordilampone devolvía `prodotti.jpg`, una foto genérica que se descartó. Se usa la fruta como imagen ilustrativa, con aclaración y crédito enlazado visibles. |

La ficha de Unsplash identifica la fotografía como utilizable bajo la [licencia Unsplash](https://unsplash.com/license), que permite descarga, adaptación y uso comercial. Autor, enlace, licencia, URL del archivo y SHA-256 quedan en `fuentes/stock.json` y `procedencia.json`. Las fotografías de MEC3 se registran como fuentes de fabricante, con sus derechos correspondientes; no se presentan como stock libre ni como fotografías propias de Italgel.

## Preparación e integración

- **26 variantes AVIF, 297.077 bytes en conjunto.** Los máximos por fotografía pesan entre 8,3 y 34,1 KiB. El visitante selecciona una variante por imagen, no todo el conjunto.
- Cinco originales de MEC3 de 492 × 492 px, frente a los archivos anteriores de 280 × 280. Se conserva el detalle real disponible; no se aumenta su resolución.
- La fotografía de frambuesa parte de una descarga de 1600 × 2134 px. Se reduce conservando el fruto y el tallo completos y se centra en un lienzo blanco de 1000 × 1000; no se deforma ni se recorta el fruto.
- Calidad 68, muestreo 4:4:4 y transparencia compuesta sobre blanco. Cada variante procede de la fuente descargada, no de otro AVIF.
- Datos independientes en `_data/imagenes_ingredientes.json` y carpeta `img/catalogo/ingredientes/`. El componente compartido resuelve esas variantes manteniendo las claves de origen anteriores.
- El menú usa las miniaturas de 160 px. Las tarjetas de portada, catálogo y recomendaciones del blog usan selección responsiva.
- No se modificó CSS ni se eliminaron originales. No se cambiaron especificaciones, precios, dosificaciones o afirmaciones comerciales heredadas.

## Verificación local

Jekyll compila correctamente. Se revisaron ocho rutas a 320/390/640/768/960/1440 px (48 combinaciones) y a densidad 2 en 390/1440 px (16 adicionales): cero imágenes rotas, errores propios de JavaScript o HTTP, H1 incorrectos o desbordamiento de página. Se conservaron 24 comprobaciones previas a la integración.

El rastreo de los 85 HTML terminó sin referencias internas ni anclas rotas, identificadores duplicados, recursos CSS inexistentes, imágenes indecodificables o dimensiones sociales incorrectas. Las 708 imágenes del inventario incluyen variantes nuevas y originales históricos. Esta es una verificación funcional y de recursos; no una medición de Core Web Vitals de usuarios reales.

Se inspeccionaron las seis exportaciones máximas y la tarjeta renderizada de frambuesa, incluida su leyenda. Evidencia en `local-integral/`, `local-integral-retina/`, `resumen.json` y `resultado.jpg`.

## Reproducción

`descargar.cjs` recupera las fuentes MEC3, `stock.cjs` la fotografía de Unsplash, `preparar.py` comprueba hashes y exporta variantes, e `integrar.py` actualiza los textos alternativos y leyendas. `verificar.cjs [vivo] [integral] [retina]` revisa páginas y `archivos-vivo.cjs` verifica por hash los 26 AVIF publicados. `auditoria.py` rastrea la compilación completa. Los runtimes usados por los scripts de navegador están vinculados a este equipo.

Los originales de trabajo, HTML de fuente y capturas permanecen en `_plans/`, excluido de Jekyll; no aumentan las descargas del sitio. Las demás imágenes del catálogo conservan la optimización de las tandas anteriores.

## Verificación pública final

Los 26 AVIF públicos coinciden por SHA-256 con los locales (297.077 bytes). Las ocho rutas publicadas pasaron 48 combinaciones de página/ancho, sin imágenes rotas, errores propios de JavaScript o HTTP, H1 incorrectos o desbordamiento horizontal. La revisión incluye portada, pastas, fruta, clásicas, vainilla, coberturas, salsas especiales y variegatos. Las comprobaciones de densidad 2 fueron locales. Recibos en `vivo/archivos-resumen.json` y `vivo-integral/resumen.json`. Esta tanda de los cinco sabores acordados queda cerrada.
