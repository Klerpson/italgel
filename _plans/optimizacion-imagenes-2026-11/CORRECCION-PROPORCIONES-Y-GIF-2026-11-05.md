# Corrección de proporciones y GIF de servicio de helado

5 de noviembre de 2026. Corrección solicitada a partir de las capturas de Camilo. Revisión local terminada; publicación en comprobación.

## Fallo detectado y corrección

Las fotografías independientes de máquinas y vitrinas se mostraban con 150 px de alto. En Edge, `sizes="auto"` activa contención de tamaño (`contain: size` y tamaño intrínseco de reserva 300 × 150). La regla `.foto-fiel img { aspect-ratio: auto }` dejaba esas imágenes sin una proporción efectiva al calcular su altura.

Se declaró la proporción física de cada imagen en el componente compartido `mercato/imagen-catalogo.html`, usando las dimensiones de sus datos. No se aplicaron alturas fijas ni excepciones por modelo. En escritorio de 1440 px, la máquina pasó de 517 × 150 a 517 × 517 px. La corrección medida para la vitrina original daba 517 × 646; su espacio en la portada ahora contiene el GIF elegido por Camilo.

La figura del equipo aislado usa fondo transparente de contenedor y mezcla `multiply` de la fotografía sobre el papel gris. Así desaparece visualmente el rectángulo blanco sin redibujar el equipo ni cambiar su identidad. El archivo original conserva su fondo; no se presenta como un recorte con canal alfa.

## GIF nativo, sin JavaScript añadido

Camilo eligió un bucle de helado sirviéndose junto al bloque de vitrinas y exigió formato GIF y bajo peso. Se integró **un GIF real de 480 × 360 px, 9 fotogramas, 1,8 segundos y 489.810 bytes**, repetido en bucle. Se compararon varias conversiones temporales; se eligió una paleta de 128 colores para conservar mejor los tonos del helado. Se carga de forma diferida al acercarse a la sección.

El interruptor «Ver animación» alterna entre GIF y fotografía fija mediante HTML y CSS (`:has`), sin añadir o modificar JavaScript. Se verificó con JavaScript desactivado. La pausa es visual: oculta la animación y muestra un fotograma fijo; no permite reanudar desde el mismo instante del GIF.

Con `prefers-reduced-motion: reduce`, `<picture>` selecciona el fotograma AVIF y oculta el interruptor. La comprobación de red confirmó **cero solicitudes al GIF** en ese modo. La animación se identifica como imagen ilustrativa de servicio, sin atribuir la escena a Italgel.

Fuente: [Pixabay en Pexels, Video Of Scooping Icecream](https://www.pexels.com/video/video-of-scooping-icecream-855128/), marcado CC0 en su ficha; [información de Pexels sobre CC0](https://www.pexels.com/creative-commons-images/). URL de descarga, SHA-256 y parámetros de conversión están en `_data/animacion_helado.json`. Solo se guardan en el proyecto los dos activos usados por la web: GIF y fotograma AVIF. El video original, conversiones descartadas y capturas de revisión son temporales del sistema y se eliminan al terminar.

Se inspeccionó la [referencia de YouTube Premium](https://www.youtube.com/premium?ybp=Sg0IBhIJdW5saW1pdGVk4AEBoAIB). Dos recursos animados analizados eran WebP: 144 y 88 fotogramas, de 2.136.352 y 1.253.134 bytes. No se copiaron sus recursos; el piloto de Italgel respeta el formato GIF solicitado.

## Validación local

48 combinaciones de página, ancho y densidad en Edge: ocho rutas a 320/390/768/960/1440 px y cuatro de ellas también a densidad 2 en 390/1440 px. Sin imágenes rotas, errores propios de JavaScript/HTTP, H1 incorrectos ni desbordamientos. Comprobación explícita de proporción de la máquina, fondo del contenedor, mezcla de la imagen y cambio entre GIF y fotograma.

Se inspeccionaron capturas temporales de los dos bloques corregidos. El rastreo de los 85 HTML generados terminó sin enlaces internos, anclas, recursos CSS, imágenes indecodificables o dimensiones sociales incorrectas. `_plans/` conserva cero imágenes.
