# Campaña visual de fichas — Italgel

| URL | Estado | Fecha | Intervención | Peso de medios | SEO/contenido |
|---|---|---|---|---|---|
| /insumos-heladeria-medellin/ | Corrección comercial publicada y verificada en vivo | 2026-11-05 | Fotos de empaques MEC3/Quella y GIF ilustrativo de preparación de chocolate | Fotos: 34.659 + 43.941 bytes; GIF: 565.298 bytes; alternativa fija: 10.449 bytes | Comparaciones local/pública sin diferencias protegidas frente al remoto actualizado; otras páginas HTML sin cambios |
| /maquinas-helado-soft/ | Publicado y verificado en vivo | 2026-11-05 | Fotografías reales conservadas; catálogo y servicio técnico en filas equilibradas; esquema GIF de mezcla → equipo → servicio | GIF: 20.158 bytes; alternativa SVG: 2.214 bytes | Comparaciones local/pública sin diferencias protegidas; otras páginas HTML sin cambios |

## Piloto Medellín

Se conserva la cabecera original. Las fotografías nuevas son recursos ya presentes en el catálogo y sus variantes responsive: vainilla, chocolate y frutos del bosque. Solo se añaden pies descriptivos; no se añaden enlaces o encabezados. El texto de la página, FAQs, títulos, enlaces, atributos de medición, metadatos, datos estructurados, fechas, alt existentes y front matter se mantienen.

El GIF real mide 400 × 300 px, dura dos segundos, contiene diez fotogramas y se repite en bucle. Se convierte en activo de producción la propuesta de playa elegida por Camilo. Autor, fuente, licencia y hash del video original en `_data/animacion_disfrute.json`. No representa una sede ni clientes reales de Italgel. No se ha añadido JavaScript.

El include existente de animación admite ahora datos por parámetro y conserva su comportamiento por defecto para la portada. Los estilos adicionales se activan mediante las clases de galería y CTA visual del piloto.

### Validación local

- Jekyll compila correctamente.
- Siete combinaciones de ancho/densidad en Medellín: 320/390/768/960/1440 px a densidad 1 y 390/1440 a densidad 2.
- Seis comprobaciones de regresión: portada, Cali y pasta de vainilla, a 390/1440 px.
- Sin imágenes rotas, errores propios HTTP/JavaScript, desbordamientos ni proporciones incorrectas en los nuevos medios.
- Dos contextos adicionales con JavaScript desactivado: teclado/control visual correctos; movimiento reducido selecciona AVIF y hace cero peticiones al GIF.
- Se inspeccionaron capturas temporales de galería y cierre en móvil y escritorio. No se guardan capturas en el proyecto.
- `comprobar_medellin.py` compara la referencia publicada previa y el HTML local: cero diferencias en elementos protegidos, y ninguna otra página HTML cambia. Los estilos compartidos sí reciben las reglas delimitadas del piloto.

Los JSON de navegador registran recursos de imágenes y sus bytes codificados antes y después del recorrido, en contextos nuevos. Son observaciones de la comprobación, no resultados de Core Web Vitals ni una promesa de descarga idéntica entre dispositivos.

### Publicación y validación pública

Publicado en `f45b3e1695f0e4b90df9cb4cb2085e1f32fe6308`, despliegue de GitHub Pages `42065696110` completado correctamente. URL: https://italgel.com.co/insumos-heladeria-medellin/.

Se repitieron las 13 combinaciones de navegador y los dos modos sin JavaScript en producción. La única alerta fue una respuesta 503 puntual de una miniatura preexistente del menú, ajena a los nuevos medios: `valmar-sweety-60-quick-160.avif`, a 960 px. Se conservó el resultado original y se repitió únicamente esa combinación: sin errores; petición directa posterior HTTP 200. No se modificó esa miniatura.

Se inspeccionaron los bloques publicados en móvil y escritorio. GIF y fotograma responden HTTP 200 y sus hashes coinciden con los archivos optimizados locales. Teclado y control visual correctos; movimiento reducido hace cero peticiones al GIF. La comparación pública con la referencia anterior da cero diferencias en SEO/contenido protegido. Los temporales de revisión se eliminan al terminar; _plans sigue sin imágenes.

### Ajuste solicitado de resumen y cobertura

Se conserva la tarjeta «En resumen». El párrafo inmediatamente inferior deja de usar la clase de tarjeta `intro-text`, sin modificar una palabra. Las cifras y los tres grupos de zonas comparten una rejilla de tres columnas iguales desde 768 px, y una sola columna en móvil. En cobertura se retira el centrado del contenedor que restringía la anchura de la rejilla.

La revisión local pasó las 13 combinaciones, incluyendo comprobaciones de posición de las seis tarjetas, además de los modos sin JavaScript. Se inspeccionaron resumen y cobertura en móvil y escritorio. La comparación de SEO/contenido continúa sin diferencias, y no cambia el HTML de otras páginas. No se añaden imágenes: la cobertura se presenta mediante listas legibles; la galería y el GIF existentes aportan el apoyo fotográfico.

Publicado en `6089462feae4f16429f2e57bda3ede9d53ddde63`, despliegue `42067077669` correcto. Se repitieron las 13 combinaciones y ambos modos sin JavaScript en vivo, sin fallos. Se inspeccionaron las secciones publicadas y se confirmó nuevamente la igualdad del contenido y SEO protegidos. Capturas temporales eliminadas al cerrar esta revisión.

### Corrección de coherencia comercial: insumos, no consumo final

Camilo aclaró que Italgel vende insumos y no helados al consumidor final. Se sustituye la galería del piloto por dos fotografías de empaques ya existentes en el catálogo: conjunto de productos MEC3 y envase Quella. Se reemplaza el GIF de playa por preparación de chocolate, identificada como escena ilustrativa, sin atribuirla a una receta o producto de MEC3/Quella.

Fuente de video: Anna Tarazevich en Pexels, https://www.pexels.com/video/person-mixing-chocolate-in-a-bowl-6112841/, licencia https://www.pexels.com/license/. Fuente, hash y parámetros de conversión en `_data/animacion_insumos.json`. GIF de 400 × 300 px, diez fotogramas, dos segundos, 565.298 bytes, sin JavaScript nuevo. Se retiraron del repositorio el GIF de playa, su imagen fija y sus datos, ya sin consumidores de producción.

Se actualiza la skill para priorizar insumos y preparación en esta campaña. Esta corrección solicitada cambia los alt y pies de los medios añadidos por el piloto; conserva los atributos de la imagen original y el resto del contenido protegido. No se reescribe el texto comercial ni el SEO.

Trece comprobaciones locales y ambos modos sin JavaScript correctos. Galería y cierre inspeccionados en móvil y escritorio; comparación protegida y HTML de otras páginas sin diferencias.

Antes de publicar se integraron los cambios remotos `7718722` (buscador) y `8869c4c` (codificación de Máquinas soft), sin conflictos ni sobrescrituras. Para no atribuir esos cambios a esta intervención visual, se compiló el remoto `8869c4c` en un temporal aislado y se guardó la referencia textual `medellin-antes-insumos.json`. La comparación contra esa referencia confirma cero cambios propios en SEO/contenido protegido y cero cambios de HTML en otras páginas. Se conserva la referencia original de la campaña.

Despliegue `42099296797` completado correctamente para `24dd5e405dbf7f8ff1daab4f4042511c7927a2b0` (corrección visual en `1ca43d7`). Las 13 combinaciones de navegador y los dos modos sin JavaScript pasaron en vivo; se inspeccionaron galería y cierre publicados. Comparación pública sin diferencias protegidas frente a la referencia `8869c4c`. Los activos GIF/AVIF responden HTTP 200 y coinciden en hash con los locales. Los originales descargados, la compilación de referencia y las capturas temporales se eliminan al terminar.

## Segunda URL: máquinas de helado soft

Se conservan todas las fotografías existentes de equipos, sus atributos y el contenido de la ficha. Las dos rejillas de catálogo y servicio técnico usan el patrón ya probado de tres columnas iguales desde tablet y una columna en móvil, sin CSS adicional ni cambios de enlaces/encabezados.

No se encontró entre las escenas de stock revisadas una toma adecuada de dispensado soft: se descartaron procesos de gelato, consumo final y una escena generada de helado derritiéndose. En lugar de atribuir a los modelos vendidos un video de otro proceso, se creó un **esquema conceptual original**, no una demostración física: mezcla → equipo soft → servicio. La máquina dibujada es un símbolo genérico, no una reproducción de un modelo concreto. Se comunica como esquema ilustrativo dentro de la imagen y en su pie.

GIF nativo de 480 × 360 px, doce fotogramas y 2,4 s; 20.158 bytes. El SVG original de 2.214 bytes se utiliza como alternativa fija, seleccionada por picture con movimiento reducido. No se añade JavaScript al sitio ni texto comercial o schema. Datos en `_data/animacion_soft.json`; activos GIF y SVG en `img/animaciones/`.

La compilación local pasó y la comparación con `soft-antes.json` no detecta diferencias de SEO/contenido protegido, front matter o HTML de otras páginas. Nueve comprobaciones de navegador: siete combinaciones de ancho/densidad en soft (320/390/768/960/1440 px y densidad 2 en 390/1440), más regresiones de Medellín y portada. Dos contextos extra con JavaScript desactivado verifican teclado/control y movimiento reducido sin solicitud del GIF. Se inspeccionaron catálogo y esquema en móvil y escritorio, corrigiendo una ampliación excesiva antes de publicar. Los scripts guardan únicamente JSON en esta carpeta y capturas en temporales.

Publicado en `7fffd327579f01eeb36260eeeeb2b9cfce91eb8d`, despliegue `42105540889` correcto. Se repitieron en producción las nueve comprobaciones y los dos modos sin JavaScript, sin fallos; se inspeccionaron las capturas temporales. La comparación pública de elementos protegidos pasó y los dos activos responden HTTP 200 con hashes iguales a los locales. Los candidatos de stock descartados y las capturas de trabajo se eliminan al terminar.

### Corrección solicitada de la cabecera soft

El montaje antiguo de 584 × 584 px se sustituye visualmente por una composición SVG de 1600 × 1600, con las fotos originales de fabricante de 1200 px de los modelos 301 INOX y 603 BIB, embebidas sin redibujar ni deformar los equipos. Archivo de 55.709 bytes; no añade solicitudes separadas a sus fotos. Se revisó a 390/1440 px con densidad 2.

El campo `hero_visual` cambia únicamente la imagen visible del layout de contenido. El campo hero, las imágenes sociales y sus dimensiones, el alt, title y todos los demás elementos de SEO/contenido se conservan. La comparación admite solo la sustitución visual explícita y sus dimensiones; el resto permanece idéntico. Se comprobó que ninguna otra página cambia su HTML. Los dos archivos fuente de fabricante ya eran activos de producción.
