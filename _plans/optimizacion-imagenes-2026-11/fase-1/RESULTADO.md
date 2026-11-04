# Fase 1 — Tarjetas de café completas y ligeras

Completada localmente el 4 de noviembre de 2026. Sin commit, push ni publicación.

## Cambios

- Diez fotografías reales recuperadas de los catálogos originales: seis cafeteras y cuatro molinos. Se seleccionaron las fotografías de producto, excluyendo el árbol decorativo del catálogo de molinos y las fotografías de detalle que no corresponden a la vista principal.
- Se conservaron los píxeles y las máscaras de las fotografías. Se retiraron únicamente pequeñas islas de la máscara de menos de 100 píxeles, como puntos del fondo o una línea ajena al equipo. Los detalles interiores de las máquinas permanecen intactos. Las máscaras originales están preservadas en `fuentes/`.
- Se normalizó el encuadre con proporción 8:7 y margen aproximado del 9 % por lado. El equipo queda completo y centrado. Las exportaciones no amplían los píxeles de la fuente.
- 44 variantes AVIF, calidad 68 con muestreo 4:4:4, desde 160 px hasta el límite útil de cada fuente; ninguna supera 800 px. Se evitan variantes casi idénticas entre sí. El conjunto añade 357.061 bytes al archivo del proyecto; el navegador selecciona una variante por uso, no descarga todas para cada tarjeta.
- Un componente de imagen compartido utiliza `srcset` y `sizes`, con tamaño automático para carga diferida y alternativas explícitas según el contexto de maquetación.
- Integración en las diez tarjetas de `/equipos-cafe/`, las tres tarjetas de café del inicio y las tarjetas de otros modelos de las diez fichas.
- Se retiró `scale: 1.45` de las tarjetas de catálogo y se renombró la clase de compensación a `baldosa--catalogo`. Se conserva `object-fit: contain`; no se añadieron selectores por producto ni nuevas reglas de ajuste de tamaño. El margen está en los archivos.

Las fotografías principales de las fichas, el hero de la categoría, las miniaturas del menú y los montajes de ambiente conservan sus archivos anteriores. Esta fase resuelve las tarjetas, sin mezclar los usos de imagen.

## Peso de los archivos seleccionados en tarjetas

Bytes sumados para las fotografías de esas tarjetas, una por modelo en su contexto. **No representan el total de descarga de la página**: excluyen otros recursos, y la caché puede compartir archivos originales entre hero, menú y tarjetas. Se comparan los archivos seleccionados por el navegador con los originales utilizados por las mismas tarjetas en la auditoría inicial.

| Página y pantalla | Antes | Después | Reducción |
|---|---:|---:|---:|
| Inicio, 390 px, densidad 1 | 53.449 B | 37.672 B | 29,5 % |
| Inicio, 1440 px, densidad 1 | 53.449 B | 21.241 B | 60,3 % |
| Categoría de café, 390 px, densidad 1 | 153.309 B | 102.434 B | 33,2 % |
| Categoría de café, 1440 px, densidad 1 | 153.309 B | 78.580 B | 48,7 % |
| Inicio, 390 px, densidad 2 | 53.449 B | 50.638 B | 5,3 % |
| Inicio, 1440 px, densidad 2 | 53.449 B | 37.672 B | 29,5 % |
| Categoría de café, 390 px, densidad 2 | 153.309 B | 144.685 B | 5,6 % |
| Categoría de café, 1440 px, densidad 2 | 153.309 B | 136.823 B | 10,8 % |

En densidad 2 se conserva más resolución y se reduce menos el peso. Es una decisión deliberada de calidad; no se fuerza a una pantalla nítida a utilizar la miniatura más pequeña.

## Validación

- `bundle exec jekyll build`: correcto.
- 48 combinaciones de ruta, ancho y densidad verificadas en Edge: inicio, categoría y diez fichas a 390/768/1440 px con densidad 1; inicio, categoría, Mini Neo y Cedar a los mismos tamaños con densidad 2.
- Cero fallos en la comprobación: sin respuestas HTTP locales de error, imágenes sin cargar, excepciones JavaScript, H1 incorrectos, ampliación CSS residual de las tarjetas o imágenes que excedan su caja.
- Los 44 archivos AVIF se decodificaron correctamente. El rastreo de los 85 HTML compilados confirmó que existen todos los destinos `src` y `srcset` de las imágenes.
- Revisión visual de los diez encuadres y de las capturas de inicio, cafeteras residenciales y molinos en escritorio, además de las capturas móviles de categoría y ficha. Se confirmó que los cuatro molinos muestran la tolva y la base completas.
- `git diff --check`: correcto.

El desbordamiento de las tablas a 768 px identificado en la auditoría sigue pendiente de la fase 4; no se cuenta como un fallo nuevo de esta fase ni se ha ocultado globalmente. La revisión no afirma ausencia de todos los defectos del proyecto.

## Límites de calidad

Los catálogos tienen una resolución finita. Las cafeteras tienen exportaciones máximas de 528–656 px de ancho de lienzo, según el modelo; los molinos llegan a 768–800 px. Esto evita inflar los archivos con píxeles interpolados. En las tarjetas residenciales grandes de escritorio, Mini Neo y Swan aún podrían ganar nitidez si se obtiene una fotografía original de mayor resolución. El producto ya se muestra completo y no se ha inventado detalle para simular esa mejora.

La siguiente fase es optimizar las fotografías pesadas del blog y sus variantes. Los archivos de esta fase no deben recomprimirse nuevamente como si fueran originales.

## Archivos y reproducción

- `procedencia.json`: catálogo, página, objeto PDF, hashes, resolución de la fuente, máscara, recorte, encuadre y variantes por modelo.
- `fuentes/`: fotografías con su máscara original; los catálogos siguen en `C:/Users/Camilo/Downloads/Catalogo Hambach.pdf` y `C:/Users/Camilo/Downloads/Catalogo Molinos.pdf`.
- `catalogo-normalizado.jpg`: resumen de los diez encuadres. Los PNG `*-normalizada.png` permiten revisar los lienzos sin otra compresión.
- `casa-390.jpg`, `casa-1440.jpg`, `molinos-390.jpg`, `molinos-1440.jpg`, `inicio-cafe-1440.jpg` y `mini-neo-390.jpg`: evidencia de integración. Las barras fijas del sitio pueden superponerse al inicio de una captura de sección al desplazar la página; no son parte de la fotografía.
- `validacion.json`: medidas, archivos seleccionados y comprobaciones por pantalla.
- `ahorro-pantallas.json`: cifras de peso por contexto y densidad.
- `preparar.py`: exportación reproducible; requiere Pillow, NumPy y pypdf. Escribe en `img/cafe/tarjetas/` y `_data/imagenes_cafe.json`.
- `verificar.cjs`: servidor local y comprobación con Playwright/Edge. Rutas de runtime específicas del equipo.

Para regenerar se deben utilizar los catálogos originales identificados por hash, conservar los archivos de foto principal y revisar de nuevo las capturas. `_plans/` queda fuera del sitio publicado.
