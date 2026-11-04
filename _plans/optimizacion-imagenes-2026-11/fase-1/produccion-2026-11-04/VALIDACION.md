# Verificación de la fase 1 en producción

4 de noviembre de 2026, 14:05, Colombia. Sitio: https://italgel.com.co/. Publicación realizada por Camilo; esta revisión no modificó producción.

**Resultado: la fase 1 de imágenes de café está completada y publicada correctamente.**

## Comprobaciones realizadas

- Las 44 variantes AVIF responden HTTP 200 con tipo `image/avif`. Sus hashes SHA-256 coinciden con los archivos locales, sin discrepancias. Detalle en `archivos.json`.
- 48 comprobaciones en Edge sobre HTTPS: inicio, categoría y diez fichas a 390/768/1440 px con densidad 1; inicio, categoría, Mini Neo y Cedar a esos mismos tamaños con densidad 2.
- Las 12 rutas responden HTTP 200. El inicio tiene las tres tarjetas nuevas; la categoría, las diez; cada ficha tiene el número esperado de tarjetas de otros modelos.
- Las tarjetas publicadas usan `srcset` y `sizes` y seleccionan las variantes nuevas. `object-fit: contain` y el ajuste sin ampliación de 1,45× están activos.
- Ninguna imagen de las tarjetas excede su caja. Los cuatro molinos se muestran completos en las capturas de escritorio y móvil.
- No se detectaron imágenes del contenido sin cargar, recursos propios con HTTP de error ni excepciones JavaScript del sitio durante estas pruebas.
- Cada página revisada tiene un H1 y carga la hoja de estilos.

Se bloquearon peticiones a servicios externos durante la navegación de comprobación para evitar enviar eventos de analítica. Esto no verifica recepción de eventos, formularios ni servicios de terceros. La comprobación cubre las rutas y tamaños anteriores; no es una nueva auditoría integral del sitio ni una medición de Core Web Vitals.

## Pendiente confirmado

Las diez fichas de café conservan el desbordamiento de las comparativas a 768 px: 781 px de ancho de documento en las seis cafeteras y 771 px en los cuatro molinos. No se detectó desbordamiento de página a 390 ni 1440 px en las rutas revisadas. El fallo ya estaba documentado antes de esta fase y sigue reservado a la fase 4.

La solución candidata de la auditoría consiste en añadir `position: relative` a la regla existente `.tabla-desplazable` y verificar las diez fichas y su scroll interno a 640/768 px. No se aplicó en esta revisión de publicación.

Las fuentes de Mini Neo y Swan siguen teniendo la resolución limitada de los catálogos; una fotografía original de mayor resolución podría mejorar las tarjetas grandes. No se inflaron los archivos para simular detalle.

## Próximo trabajo

La fase 2 del plan, optimización de imágenes pesadas del blog, continúa pendiente. Las fases 3 a 5 también conservan su alcance y estado pendientes. El cierre de esta fase de café no implica que toda la auditoría inicial esté resuelta.

## Evidencia

- `resumen.json`: resultado y lista de desbordamientos.
- `navegador.json`: mediciones por ruta, ancho y densidad.
- `archivos.json`: estados HTTP, tamaños, hashes y comparación con los archivos locales.
- `molinos-390.jpg`, `molinos-1440.jpg` e `inicio-cafe-1440.jpg`: capturas del sitio en vivo.
- `../verificar-vivo.cjs`: proceso reproducible utilizado para esta comprobación.
