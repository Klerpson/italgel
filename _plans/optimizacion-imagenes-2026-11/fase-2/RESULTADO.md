# Fase 2 — Imágenes del blog ligeras y responsivas

Completada localmente el 4 de noviembre de 2026. Pendiente de publicación. Esta fase no realizó commit, push ni despliegue.

## Resultado

Se optimizaron las doce referencias activas de más de 150 KiB y se integraron variantes para las 24 imágenes que utilizan las 15 guías publicadas y la portada del blog. Incluye cabeceras, tarjetas de inicio/listado/relacionados y ocho fotografías de contenido.

Las 24 referencias corresponden a 23 fotografías distintas: Base 50 y pasta de pistacho ya utilizaban archivos idénticos. Sus nuevas variantes se comparten, conservando los archivos y rutas anteriores.

Las doce referencias pesadas, comparadas a su resolución máxima original, pasan de **3.039.484 a 666.439 bytes**, aproximadamente **78,1 % menos**. La comparación cuenta las dos referencias idénticas por separado, igual que el inventario original; no representa dos descargas cuando el navegador reutiliza un mismo archivo.

## Descarga medida en páginas

Medición local equivalente antes/después, en Edge. Se recorrió todo el contenido para cargar también las imágenes diferidas. Las cifras suman bytes de las respuestas de imágenes del sitio, incluidos los recursos ajenos al blog que se cargaron en esas páginas; no son el peso del HTML, CSS o JavaScript, ni una medición de tiempo de carga o Core Web Vitals. Densidad 1 significa una pantalla con un píxel físico por píxel CSS; en densidad 2 se seleccionan variantes mayores.

| Página | Pantalla | Antes | Después | Reducción |
|---|---|---:|---:|---:|
| Listado del blog | 390 px, densidad 1 | 2.796.755 B | 265.020 B | 90,5 % |
| Listado del blog | 1440 px, densidad 1 | 3.125.468 B | 700.518 B | 77,6 % |
| Listado del blog | 390 px, densidad 2 | 2.796.755 B | 578.073 B | 79,3 % |
| Listado del blog | 1440 px, densidad 2 | 3.125.468 B | 955.519 B | 69,4 % |
| Inicio | 390 px, densidad 1 | 1.096.714 B | 221.178 B | 79,8 % |
| Inicio | 1440 px, densidad 1 | 1.384.376 B | 547.515 B | 60,5 % |
| Guía de pasteurización | 390 px, densidad 1 | 943.453 B | 100.640 B | 89,3 % |
| Guía de toppings | 390 px, densidad 1 | 432.210 B | 100.383 B | 76,8 % |

No hubo aumento del peso de imágenes en ninguna de las 66 combinaciones comparadas. El ahorro completo por página y pantalla se conserva en `ahorro.json`.

## Qué se implementó

- **80 nuevos AVIF**, con un total de 2.123.070 bytes almacenados, con anchos de 400/600/800 px y el tamaño máximo disponible cuando aporta valor. Se evita ampliar píxeles y se omiten variantes con peso prácticamente igual o superior al archivo mayor.
- Compresión de calidad 62 a 66, según la fotografía, con muestreo 4:4:4. Se revisaron once comparaciones de fotografías pesadas distintas, con la vista completa y un recorte al 100 %. La elección de calidad preserva texturas de helado, ingredientes, bordes y el logo presente en la foto de whisky, sin una degradación evidente que invalide los candidatos a su tamaño de presentación.
- Las seis fuentes cuya resolución máxima ya estaba ligera conservan ese archivo, porque recomprimirlo no aportaba al menos un 10 % de ahorro. Pueden utilizar versiones menores cuando la pantalla lo permite.
- Componente compartido `mercato/imagen-blog.html`, con selección por `srcset` y `sizes`; datos editables y trazables en `_data/imagenes_blog.json`.
- Adaptación de cabeceras de artículo y portada del blog, tarjetas y los ocho usos de imagen dentro de tres artículos. Se conservaron los textos, `alt` y `title` de los usos anteriores; los atributos de dimensiones ahora proceden de la imagen real.
- Precarga responsiva en `head.html`, compartiendo exactamente los candidatos y tamaños de la cabecera visible. En las pruebas, cada imagen de cabecera se solicitó una sola vez.
- La selección tiene en cuenta la ampliación efectiva causada por `object-fit: cover`: las tres cabeceras panorámicas piden más píxeles que su ancho visible, y la portada del blog considera su marco cuadrado. Así se evita elegir una variante demasiado pequeña para el recorte.
- **Ningún archivo CSS modificado y ninguna regla CSS añadida.** Tampoco se recortaron ni generaron fotografías nuevas.

Los archivos de partida y las rutas antiguas se conservan intactos. Los 2,12 MB nuevos son el conjunto de variantes almacenadas, no una descarga adicional completa para cada visitante. La limpieza de archivos históricos sigue reservada a la fase 4.

## Verificación

- Compilación Jekyll correcta.
- 66 combinaciones antes y 66 después: inicio, listado y las 15 guías a 390/768/1440 px con densidad 1; inicio, listado y tres guías representativas a los mismos tamaños con densidad 2.
- Sin respuestas locales HTTP de error, imágenes sin cargar, excepciones JavaScript, H1 incorrectos ni desbordamiento horizontal de página en esas rutas y tamaños.
- Las 66 comparaciones conservaron el texto visible y la secuencia de textos alternativos/títulos de imagen.
- Comprobación de resolución efectiva: ningún archivo seleccionado quedó por debajo del tamaño requerido —con tolerancia del 5 % de selección del navegador— cuando la fuente ofrecía una resolución suficiente. Los casos limitados por la resolución del archivo de partida se registraron aparte.
- Las 16 cabeceras responsivas tienen candidatos y tamaños de precarga idénticos a los de la imagen del cuerpo.
- Rastreo estático de los 85 HTML generados, sin referencias internas o recursos inexistentes. Las 90 referencias de variantes de la tabla de datos —contando los alias— se decodificaron y sus dimensiones coinciden con los descriptores. Ninguna supera las dimensiones de su fuente.
- Hashes de las 24 fuentes conservados y comprobados contra `procedencia.json`.
- `git diff --check` correcto.

La navegación de prueba bloquea terceros y analítica; no valida sus eventos ni servicios. No se ha comprobado esta fase en producción, Safari o Firefox.

## Límites y trabajo siguiente

La optimización parte de los AVIF existentes del proyecto, no de supuestos originales de cámara. Se conservaron como fuentes estables para evitar recomprimir los derivados en futuras ejecuciones. Las limitaciones de detalle de esos archivos permanecen: en algunas pantallas de densidad 2 y encuadres panorámicos el archivo disponible no cubre todos los píxeles deseables. En esos casos se entrega su mayor variante útil, sin inflarla artificialmente. Detalle en `comparacion.json`, campo `source_resolution_limits`.

Durante la revisión visual se observó que `medicion-peso-helado-overrun.avif` muestra una composición de postres, mientras su texto alternativo describe una balanza. `control-porciones-toppings-heladeria.avif` muestra recipientes de toppings, aunque su texto alternativo describe un dosificador y una cuchara medidora. Estas correspondencias ya existían antes. Esta fase conserva la fotografía y el texto para no introducir una sustitución editorial sin una fuente adecuada; se añadieron a la revisión de identidad y fuentes de la fase 3.

El desbordamiento de comparativas de café sigue pendiente de la fase 4. Esta fase no altera esas tablas ni da por terminadas las fases restantes.

## Evidencia y reproducción

- `procedencia.json` y `pesos.csv`: fuentes, hashes, dimensiones, calidad, variantes, pesos y alias.
- `comparaciones/`: once vistas de comparación de las imágenes pesadas distintas; no se incluyen en el sitio generado.
- `antes/` y `despues/`: mediciones y capturas de las cabeceras.
- `ahorro.json`: comparación de bytes de imágenes por ruta, ancho y densidad.
- `comparacion.json`: integridad de texto/atributos, selección suficiente de resolución y precarga.
- `estatico.json`: integridad de archivos y recursos de la compilación.
- `preparar.py`: exportación reproducible desde las fuentes conservadas. Requiere Pillow; conserva las fuentes y regenera únicamente `img/blog/optimizadas/` y `_data/imagenes_blog.json`.
- `verificar.cjs antes|despues`: comprobación y medición con Playwright/Edge sobre la compilación actual. Ejecutar la medición anterior antes de integrar los cambios; no sobrescribirla después con el sitio optimizado.
- `validar_estatico.py` y `comparar.py`: comprobaciones de integridad y comparación. Rutas de runtime específicas del equipo.

Para publicar deben incluirse los 80 AVIF, `_data/imagenes_blog.json`, los dos includes nuevos y las modificaciones de `head.html`, `baldosa.html`, `post.html`, `blog.html` y los tres artículos. `_plans/` conserva evidencia y queda fuera del sitio generado.
