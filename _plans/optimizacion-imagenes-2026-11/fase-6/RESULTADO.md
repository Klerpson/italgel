# Segunda ronda fotográfica — originales de fabricante

4 de noviembre de 2026. Tanda prioritaria de máquinas y dos ingredientes. Implementada y validada localmente; publicación en comprobación.

## Fotografías integradas

| Fotografía | Fuente de identidad | Uso |
|---|---|---|
| Promag Stargel 4 | [Iceteam 1927](https://www.iceteam1927.it/fr/products/patisserie-gastronomie/machines-a-glace-de-comptoir/stargel-4) | Tarjeta Stargel 4; sustituye una foto rotulada Labotronic. |
| Valmar Snowy 7 M | [Valmar Global](https://valmar.eu/snowy-m/) | Tarjeta Snowy y fotografía de mantecadora en portada/contenido. |
| Valmar Sweety 60 Quick | [Valmar Global](https://valmar.eu/sweety-quick/) | Pasteurizador de 60 L y categorías; elimina la atribución errónea «Valmar Pastomaster». |
| 301 BIB Inox | [Iceteam 1927](https://www.iceteam1927.it/en/products/soft-ice-cream/bib/301-inox) | Tarjeta del modelo y categoría de máquinas soft. |
| 603 BIB | [Iceteam 1927](https://www.iceteam1927.it/en/products/soft-ice-cream/bib/603-bib) | Tarjeta del modelo, categoría, inicio y recomendaciones del blog. |
| Coldelite Compacta VariO 12 | [Iceteam 1927](https://www.iceteam1927.it/prodotti/macchine-gelato-artigianale/combinate/compacta-vario) | Imagen representativa de la categoría de mantecadoras, inicio y blog. No sustituye la ficha de otro modelo. |
| Pasmo S121 Gravity | [Pasmo](https://www.pasmochina.com/product/soft-ice-machine/double-cylinder/114.html) | Tarjeta de la máquina de mesa de dos sabores más combinado. |
| Quella Dark | [MEC3](https://www.mec3.com/en/products/gelato/quella-dark) | Foto de la presentación publicada por MEC3, de 492 × 492 px. |
| Quella Pistacchio | [MEC3](https://www.mec3.com/en/products/gelato/ripple-sauces/quella-pistachio) | Foto de la presentación publicada por MEC3, de 492 × 492 px. |

Son imágenes oficiales descargadas de las fichas de producto, no fotos de instalaciones propias de Italgel. No fue necesario utilizar stock ni generar equipos. Los derechos y marcas permanecen con sus titulares; no se clasifican como stock libre. URLs de descarga, SHA-256, dimensiones físicas y variantes en `procedencia.json` y `fuentes/descargas.json`.

## Preparación y peso

**9 fotografías, 44 AVIF, 395.634 bytes en conjunto.** Los máximos por fotografía pesan entre 9,6 y 32,9 KiB; el navegador selecciona una variante mediante `srcset`. El conjunto de variantes no es el peso de una página.

Se compusieron transparencias sobre blanco, retiraron márgenes vacíos y normalizó el espacio alrededor de la máquina, conservando su silueta completa. El lienzo cuadrado no aumenta el detalle del equipo: Snowy, por ejemplo, parte de 271 × 500 píxeles y conserva ese límite. Los tamaños menores se exportan desde el original y no desde otro AVIF. Calidad 68 y muestreo 4:4:4; los originales públicos anteriores se conservan.

No se modificó CSS. Las imágenes usan el componente compartido existente y datos en `_data/imagenes_fabricantes.json`, independientes del generador de la fase 3. Los pequeños iconos del menú usan la variante de 160 px; las recomendaciones del blog ahora reciben variantes responsivas para estas nuevas fotografías.

## Correspondencia y enlaces

Se corrigieron textos alternativos y títulos de Stargel, Snowy, Sweety y Pasmo. Se retiró el «3» sobrante del nombre Pasmo S121. La 301 es monogusto según el fabricante: se corrigió el «1 + twist». Se retiró el botón de ficha de la 603 que enviaba a Compacta 3; sigue disponible su CTA de cotización. No se modificaron los precios ni se validaron en esta tanda todas las especificaciones o proyecciones comerciales heredadas.

## Verificación

- Jekyll compila correctamente y `git diff --check` pasa.
- 24 combinaciones anteriores; 54 comprobaciones posteriores a densidad 1 (48 de ocho rutas más seis de coberturas) y 18 a densidad 2. Anchos 320/390/640/768/960/1440 según la ejecución. Sin imágenes rotas, errores propios de JavaScript/HTTP ni desbordamiento de página.
- Revisión visual de los nueve archivos finales y de las tarjetas renderizadas de máquinas artesanales y soft.
- Rastreo completo de 85 HTML: cero referencias internas, anclas, recursos CSS o dimensiones sociales incorrectas; cero imágenes indecodificables. Se mantiene la validación de las 24 fuentes y 90 referencias responsivas del blog.

## Límites y siguientes fuentes

Los originales de Snowy y Stargel también tienen un límite de resolución: se ajustaron a sus píxeles disponibles. Las fotos de las restantes pastas y variegatos mantienen su entrega optimizada anterior y necesitan fuentes exactas antes de reemplazarlas. La ficha Fiordilampone de MEC3 devolvió una foto genérica `prodotti.jpg`; se descartó. No se presentó esa imagen genérica como foto de Fiordilampone.

## Reproducción

1. `buscar.cjs` y `descargar.cjs` recuperan fichas y originales; sus descargas se guardan localmente en `fuentes/`.
2. `preparar.py` genera las 44 variantes desde los originales y valida sus hashes.
3. `integrar.py` integra las rutas en los ocho archivos de contenido/datos. Los componentes compartidos están versionados con el cambio.
4. Compilar Jekyll y ejecutar `verificar.cjs integral`, `verificar.cjs integral retina` y la auditoría estática de `../publicacion/`.

`_plans/` y sus capturas/originales de trabajo quedan fuera del sitio generado. Solo se añadieron al sitio los 44 AVIF ligeros y los datos/componentes necesarios.
