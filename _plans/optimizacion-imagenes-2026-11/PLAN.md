# Optimización de imágenes y maquetación por fases

Inicio: 4 de noviembre de 2026. Base: auditoría local de la remodelación Mercato. Publicación autorizada el 4 de noviembre de 2026. Ver publicacion/RESULTADO.md.

## Criterios comunes

- Priorizar fotografía nítida, producto completo, proporción correcta y archivo ligero.
- Trabajar desde originales disponibles. No aumentar la resolución del archivo para simular detalle inexistente.
- Conservar originales; crear derivados cuando cambia el uso o el encuadre.
- Servir al navegador un tamaño adecuado mediante `srcset` y `sizes`.
- Reutilizar los componentes actuales y retirar compensaciones CSS que dejen de ser necesarias.
- Verificar móvil, tablet, escritorio y densidad de pantalla 2 donde afecte a la selección de archivo. Registrar bytes antes/después y límites de la fuente.
- No cambiar la identidad de un producto ni atribuir una foto dudosa sin evidencia del fabricante.

## Fase 1 — Fotografías de catálogo de café

Estado: completada y verificada en producción el 4 de noviembre de 2026, después de la publicación realizada por Camilo. Evidencia local y límites en `fase-1/RESULTADO.md`; comprobación pública en `fase-1/produccion-2026-11-04/VALIDACION.md`.

Alcance: seis cafeteras y cuatro molinos. Recuperar las fotografías de los catálogos originales, normalizar márgenes para tarjetas sin recortar el equipo y exportar AVIF con variantes de tamaño. Integrar en la categoría, inicio y productos relacionados. Retirar la ampliación general de 1,45× de esas tarjetas, conservando el comportamiento compartido de ajuste de imagen.

Cierre: fotografías completas, variantes existentes y seleccionadas correctamente, comparación visual antes/después, compilación correcta y navegación sin nuevos recursos rotos. Documentar cuando la fuente limita la nitidez en tarjetas grandes. No sustituir en esta fase las fotografías principales de las fichas ni los montajes de ambiente.

## Fase 2 — Peso y entrega de imágenes del blog

Estado: publicada y verificada el 4 de noviembre de 2026 (287 variantes de fases 2/3 comprobadas por SHA-256). Evidencia y límites en `fase-2/RESULTADO.md`.

Alcance: los 12 archivos activos de más de 150 KiB, empezando por los cinco ejemplos de la auditoría. Comparar compresión por fotografía, preparar tamaños para tarjetas, cabeceras y móviles, e integrar la selección en los componentes del blog. Mantener dimensiones y detalle suficientes en las imágenes de contenido. La implementación cubre las 24 imágenes utilizadas en las cabeceras y el contenido de las 15 guías publicadas y la portada del blog; las imágenes que ya estaban ligeras conservan su archivo de mayor resolución cuando otra compresión no aporta ahorro.

Cierre: ahorro medido por archivo y por página representativa; revisión de texturas y rótulos; selección correcta a densidades 1 y 2. No recomprimir sucesivamente un derivado ya optimizado.

## Fase 3 — Resolución, encuadre e identidad del resto del catálogo

Estado: publicada y verificada el 4 de noviembre de 2026, con límites de fuentes documentados. Evidencia en `fase-3/RESULTADO.md`.

Alcance: comenzar por Stevia y Amarena; seguir por heros de ciudades, pastas y salsas, y las tarjetas de 280 px que se muestran grandes. Buscar fuentes de mayor calidad antes de exportar variantes. Validar el archivo compartido por Fiordiarancio y limón con la fuente del producto. Revisar también la correspondencia entre fotografía y texto de las imágenes de medición de overrun y control de porciones del blog, detectada durante la fase 2.

Cierre: resolver primero las ampliaciones más graves; registrar los casos que necesitan una fuente adicional. Si no existe fuente suficiente, evaluar un tamaño visual apropiado usando las reglas compartidas, sin inventar detalle ni añadir excepciones por producto.

## Fase 4 — Maquetación, enlaces y limpieza

Estado: completada, publicada y verificada en producción el 4 de noviembre; límites y evidencia en publicacion/RESULTADO.md.

Alcance: corrección mínima del contenedor de comparativas de café y verificación de sus diez fichas; revisión de las seis referencias externas con respuesta 403; coherencia de dimensiones sociales. Consolidar duplicados solo después de comprobar todos sus usos.

Cierre: sin desbordamiento de página en los puntos de corte revisados; mantener scroll interno accesible en tablas; destinos internos válidos y referencias externas verificadas o registradas con su limitación.

## Fase 5 — Verificación integral y entrega para publicación

Estado: completada, publicada y verificada en producción el 4 de noviembre; límites y evidencia en publicacion/RESULTADO.md.

Alcance: recompilar y repetir el rastreo de contenido e imágenes, revisar páginas representativas a 320/390/640/768/960/1440 px y comprobar selección de variantes a densidad 2. Resumir ahorro real, cambios de CSS y pendientes de fuentes.

Cierre: resultado local revisable y lista precisa de archivos para publicar. Publicación autorizada; sin eliminación masiva de imágenes históricas.

## Segunda ronda — Fuentes fotográficas de fabricante

Estado: nueve fotografías oficiales publicadas y verificadas el 4 de noviembre; 44 archivos contrastados por hash y 54 comprobaciones visuales públicas correctas. Siete equipos y dos presentaciones de Quella, 44 AVIF y 395.634 bytes en conjunto, sin cambios CSS. Fuentes, correcciones de identidad, pruebas y límites de los ingredientes restantes en `fase-6/RESULTADO.md`.

## Tanda de pastas y variegatos — Cinco sabores

Estado: seis fotografías para siete referencias publicadas y verificadas el 4 de noviembre; 26 archivos correctos por hash y 48 comprobaciones visuales públicas sin errores. Frutos del bosque, frambuesa, vainilla, coco y caramelo; 26 AVIF (297.077 bytes en conjunto), sin CSS nuevo. Stock identificado como ilustrativo, fuentes y pruebas en `fase-7/RESULTADO.md`. Tanda cerrada.

## Frutas restantes y chocolates

Estado: siete imágenes publicadas y verificadas en tres páginas el 5 de noviembre; 24 comprobaciones locales, 18 públicas y 32 archivos correctos por hash. Arándano, limón, mandarina, pitaya, chocolate, stracciatella y chocolate blanco. 32 AVIF (651.708 bytes en conjunto), sin cambios CSS. Fuentes y evidencia en `fase-8/RESULTADO.md`.

## Evidencia

Auditoría inicial: `_plans/auditoria-visual-2026-11-04/INFORME.md`. Cada fase conserva sus fuentes, proceso y resultados en su propia carpeta dentro de este plan. El contenido de `_plans/` no se publica en la compilación de Jekyll.
