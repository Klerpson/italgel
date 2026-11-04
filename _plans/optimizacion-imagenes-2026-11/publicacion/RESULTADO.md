# Publicación y cierre técnico — 4 de noviembre de 2026

## Imágenes: fases 2 y 3 publicadas

Publicación autorizada por Camilo el 4 de noviembre. Commit de imágenes `12e9e0b`, integrado con los cambios recientes del remoto en `61f78d5`. Se conservaron la nueva tipografía Libre Bodoni, la maquetación y el selector de familias de la portada. GitHub Pages finalizó correctamente la ejecución [41911223539](https://github.com/Klerpson/italgel/actions/runs/41911223539).

Se comprobaron en producción los 287 AVIF nuevos del blog y catálogo (5.323.414 bytes en conjunto): respuesta correcta y SHA-256 idéntico al archivo local en todos los casos. Esta cifra representa el conjunto de variantes, no el peso descargado por una página. El ahorro por página está en los resultados de cada fase; el listado del blog móvil bajó de 2,80 MB a 265 KB en la medición comparable de la fase 2.

## Continuación: fases 4 y 5

- Se añadió `position: relative` al contenedor compartido de comparativas. Contiene los elementos accesibles posicionados y elimina el desbordamiento de página en tablet, conservando el desplazamiento interno de la tabla. No se añadieron reglas por modelo.
- Se sustituyeron las dimensiones sociales fijas 1200 × 640 por las dimensiones físicas de cada archivo usado. `dimensiones.py` genera `_data/dimensiones_sociales.json` desde la compilación. Si una imagen nueva carece de registro se omiten las dimensiones, evitando inventarlas; regenerar el inventario al añadir o sustituir imágenes sociales.
- Compilación correcta. Rastreo de 85 páginas: cero referencias internas rotas, anclas rotas, identificadores duplicados, recursos CSS rotos, imágenes indecodificables o dimensiones sociales incorrectas.
- Comprobación local de 17 rutas, incluidas las diez fichas de café: 102 combinaciones a 320/390/640/768/960/1440 px, y 34 combinaciones adicionales a densidad 2. Sin errores de JavaScript, recursos propios fallidos, imágenes rotas ni desbordamiento horizontal. El selector de portada y los destinos de sus botones se verifican en cada ancho. Las tablas que requieren desplazamiento conservan su capacidad de desplazarse.
- No se eliminaron originales ni imágenes recién incorporadas por Camilo. Los derivados comparten recursos cuando corresponde; una coincidencia de archivo o ausencia en el HTML actual no basta para borrar una URL histórica o una fuente necesaria para regenerar variantes.

## Referencias externas

Las seis referencias de la Universidad de Guelph permanecen enlazadas por el propio índice del editor. La revisión web permitió leer [Ageing of Mix](https://books.lib.uoguelph.ca/icecreamtechnologyebook/chapter/ageing-of-mix/), [Stabilizers](https://books.lib.uoguelph.ca/icecreamtechnologyebook/chapter/stabilizers/) y [Pasteurization of Mix](https://books.lib.uoguelph.ca/icecreamtechnologyebook/chapter/pasteurization-of-mix/). Las rutas de Overrun calculations, Emulsifiers y Homogenization of Mix devolvieron 403 en esta comprobación, también al seguir los enlaces del editor. Se conservan las referencias: no hay evidencia de que sean páginas eliminadas, pero su acceso no se pudo confirmar. No se sustituyen por otra fuente sin equivalencia comprobada.

## Límites de calidad pendientes

La nitidez máxima sigue dependiendo de las fuentes disponibles. Para aumentar el tamaño de varias fotos pequeñas de Valmar, Coldelite, Pasmo e ingredientes hacen falta originales de mayor resolución y cotejar modelos con el fabricante. No se fabricó detalle ni se atribuyeron modelos por parecido. Detalle en `../fase-3/RESULTADO.md`.

## Evidencia

`verificar.cjs [vivo] [integral] [retina]` comprueba navegación y presentación; `archivos-vivo.cjs` verifica las 287 variantes públicas; `auditoria-final.py` revisa enlaces, imágenes y metadatos de la compilación. Los JSON de resumen documentan cada ejecución. Rutas de runtime específicas del equipo; `_plans/` está excluido del sitio publicado.

## Verificación final en producción

Continuación publicada en `fe898d5`; [GitHub Pages 41911826190](https://github.com/Klerpson/italgel/actions/runs/41911826190) finalizó correctamente. La comprobación pública posterior completó 102 combinaciones de página/ancho sin errores ni desbordamiento, incluidas las diez fichas de café y el desplazamiento interno de las tablas.

Se consultaron las 85 rutas públicas: todas respondieron 200. Las 60 páginas con Open Graph muestran dimensiones correctas; las 24 redirecciones HTML conservan su destino y la tarjeta de contacto independiente conserva su título. Ver `vivo-integral/resumen.json`, `vivo/paginas-resumen.json` y `vivo/archivos-resumen.json`.

Fases 1–5 completadas dentro del alcance verificable. Los límites de fuentes fotográficas y de acceso externo descritos arriba siguen documentados; no equivalen a afirmar que todos los originales tengan resolución suficiente para ampliaciones futuras.
