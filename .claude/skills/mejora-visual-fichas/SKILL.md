---
name: mejora-visual-fichas
description: Mejorar imágenes, GIF y presentación de páginas comerciales y fichas de producto de Italgel, conservando su SEO y contenido existente. Usar para ejecutar por páginas la mejora visual de servicios, categorías, ciudades y productos; no para reescritura, nuevas páginas o campañas SEO.
---

# Mejora visual de fichas de Italgel

## Objetivo y alcance

Mejorar el atractivo visual con fotografías nítidas, GIF reales livianos y una maquetación coherente con Italgel. Trabajar página por página, conservar el contenido y el SEO existentes y registrar qué está preparado, comprobado o publicado.

La instrucción de Camilo para esta campaña es **mejorar únicamente lo visual, sin modificar SEO**. No activar copywriter, keyword-research o seo-onpage para ampliar esta tarea. Leer la skill dev-jekyll cuando se necesite implementar HTML, Liquid o CSS, respetando el sistema real del repositorio.

Crear esta skill no inicia la implementación. Empezar las fichas cuando el usuario indique continuar. Durante su ejecución, respetar la autorización vigente y la modalidad solicitada (propuesta local o publicación); esta skill no concede permisos de publicación ni exige pedirlos de nuevo si ya existen.

## Límites que deben conservarse

Antes de editar, obtener una referencia textual del archivo fuente y del HTML renderizado de la página. No sobrescribir cambios ajenos. Conservar:

- URL, permalink, canonical, redirecciones, indexación, robots, sitemap y arquitectura de navegación.
- Title, description, etiquetas Open Graph/Twitter e imágenes sociales; no añadir VideoObject u otro schema por incorporar un GIF.
- H1, H2–H6, sus niveles, IDs y orden; textos, FAQs, tablas, especificaciones, precios y afirmaciones comerciales.
- Enlaces existentes, anclas, textos de enlace, destinos y atributos de los CTA, incluidos los de medición.
- Datos estructurados y front matter SEO, incluidas fechas editoriales. No actualizar last_modified_at automáticamente.
- Alt y title de imágenes existentes y nombres/rutas de archivos ya usados. No sustituir una foto por otra que vuelva inexacto su alt; elegir otra ubicación o una imagen compatible.

Sí se permite añadir imágenes/GIF con alt nuevo descriptivo y dimensiones correctas, un pie breve si la escena requiere contexto y el texto funcional del control de movimiento. Eso no autoriza reescribir contenido, insertar nuevos encabezados o añadir párrafos de posicionamiento. No ocultar texto existente ni cambiar su orden de lectura para acomodar una imagen.

No editar _config.yml, head, schema, sitemap, robots o redirecciones como parte de esta campaña. Si se detecta un problema de SEO, anotarlo por separado y continuar con lo visual que sea independiente. Si una modificación visual implica cambiar un elemento protegido, buscar una solución que lo conserve y dejar pendiente solo esa modificación si no existe una alternativa válida.

## Punto de partida y orden

Leer el [inventario y auditoría](../../../_plans/auditoria-visuales-servicios-2026-11-05/AUDITORIA.md) y su inventario.csv al organizar la primera tanda. Es una referencia del 5 de noviembre de 2026, no prueba del estado actual: comprobar la página y el código antes de actuar.

- 21 páginas objetivo: 12 categorías, 5 subcategorías y 4 ciudades.
- 17 fichas de producto adicionales. No contar artículos o redirecciones como servicios.
- Orden inicial propuesto: pilotos de Medellín, Máquinas soft y Variegatos; después las otras 18 páginas, comenzando por Industrial, Vitrinas y Quella; finalmente las 17 fichas. Ajustar si Camilo cambia la prioridad.
- Cerrar cada página antes de pasar a la siguiente. Un componente compartido se prepara una vez y se activa explícitamente en las páginas de la tanda, sin insertar GIF por defecto en todo el sitio.

## Paso a paso por página

### 1. Revisar el punto de partida

Identificar URL, archivo, layout, includes y activos actuales. Revisar la página local y la publicada cuando esté disponible; distinguir divergencias antes de editar. Contar fotos únicas de contenido, no variantes srcset, imágenes duplicadas o logotipos del menú.

Guardar en texto los elementos protegidos y el peso de los recursos actuales. Identificar si faltan imágenes, si hay grandes tramos de texto sin apoyo visual o si el problema es de tamaño/encuadre. Una página con 16 fotos puede necesitar mejor distribución, no más fotografías.

### 2. Definir una intervención concreta

Decidir qué mostrar, dónde y para qué: producto real, detalle, aplicación o resultado. Mantener una foto estática en cabecera y reservar el GIF para después de la explicación inicial o junto a un bloque de aplicación existente.

- Categorías/servicios: orientar a 3–5 fotos útiles en páginas pobres en imágenes, sin imponer esa cantidad a catálogos extensos.
- Ciudades: mostrar familias de insumos, preparación o disfrute. No representar una foto de stock como sede, cliente o entrega local de Italgel.
- Producto: priorizar vistas reales, detalles e identificación del modelo; conservar especificaciones y relaciones entre imagen y producto.
- Incluir un GIF pertinente por página. Si falta una fuente adecuada, registrar el GIF pendiente y resolver las fotos mientras se consigue; no marcar la página completa ni insertar un sustituto engañoso.

### 3. Elegir y documentar el material

Buscar primero activos existentes de calidad y material autorizado del fabricante. Usar stock con licencia comprobada para aplicaciones o escenas ilustrativas; guardar URL, autor, licencia y transformaciones en texto. No copiar medios de una referencia estética, como YouTube Premium.

Para movimiento, convertir un fragmento de video real a GIF; no animar una foto con zoom como sustituto de la acción solicitada. Italgel vende insumos y equipos, no helados al consumidor final: priorizar preparación/aplicación y productos reales. Camilo corrigió el uso de la escena de playa en Medellín; no repetir escenas de personas consumiendo helado como recurso principal de las fichas de insumos.

No generar ni redibujar equipos, envases o modelos comerciales para reemplazar fotografías reales. No atribuir una demostración de otra máquina al modelo vendido, ni presentar personas de stock como clientes que recomiendan Italgel. En insumos/ciudades, destacar empaques e ingredientes y su preparación; en equipos, una acción pertinente al modelo o aplicación. Las fotos de helado terminado pueden apoyar como resultado de uso, sin desplazar a los productos que se venden.

### 4. Preparar imágenes y GIF

Recortar márgenes vacíos innecesarios, conservar proporciones y preparar resolución suficiente para el tamaño real de presentación. No ampliar un archivo pequeño para aparentar nitidez. Si el fondo blanco resulta inadecuado, valorar recorte con transparencia o integración visual; una mezcla CSS no crea transparencia en el archivo. Revisar que los colores y detalles del producto no se alteren.

Usar AVIF/WebP para fotos y variantes responsive cuando corresponda. Mantener intactos originales/rutas existentes que tengan otros consumidores. Para imágenes nuevas, usar nombres descriptivos y carpetas de activos del proyecto.

El movimiento debe ser **GIF real, sin JavaScript nuevo**, con imagen fija de alternativa:

- Un GIF por página como estándar inicial. Bucle orientativo de 1,5–2,5 s, dimensiones según su espacio y cadencia inicial de 5–8 fps, ajustable tras revisar el movimiento.
- Objetivo de 300–700 KB; si se acerca o supera 800 KB, probar otro fragmento, encuadre o resolución antes de seguir reduciendo colores. Estos valores son presupuestos, no una garantía de peso ni una justificación para perder calidad.
- Revisar la secuencia completa: gesto natural, reinicio del bucle, piel sin manchas/bandas fuertes, producto reconocible y ausencia de deformaciones. No aceptar un GIF por peso sin verlo animado.
- Ajustar paleta y dithering según la escena. El archivo más liviano no siempre es el que debe elegirse.

### 5. Integrar con los componentes existentes

El sistema actual es Mercato: revisar _layouts/contenido.html, _includes/mercato/ y css/mercato.css antes de tocar estilos. Partir de _includes/mercato/helado-animado.html y sus datos para un componente reutilizable parametrizado, en lugar de duplicar HTML/CSS por ficha. Revisar consumidores antes de cambiar una pieza compartida.

Priorizar un archivo bien preparado frente a capas de CSS correctivo. Conservar width/height físicos y proporción efectiva: sizes="auto" con contención puede volver a producir imágenes de 150 px de alto si una regla elimina su proporción. No resolverlo con alturas fijas arbitrarias ni object-fit que corte el equipo.

Añadir loading="lazy" al GIF fuera de cabecera, dimensiones y decoding="async". Mantener un control HTML/CSS que alterne animación e imagen fija; describirlo como pausa visual, no como congelación/reanudación exacta. Con prefers-reduced-motion, seleccionar la imagen fija mediante picture para evitar solicitar el GIF. No añadir librerías, carruseles o scripts de animación.

### 6. Validar antes de cerrar

- Compilar Jekyll y revisar en navegador al menos 390 y 1440 px; incluir 320 px si hay controles o filas estrechas y densidad 2 cuando importe la nitidez.
- Ver en movimiento el GIF y comprobar foto, encuadre, proporción, legibilidad, ausencia de recortes del producto y desbordamientos.
- Comprobar imágenes cargadas, enlaces/CTA conservados, control con teclado, funcionamiento con JavaScript desactivado y movimiento reducido sin petición del GIF.
- Medir archivos y transferencia de la página en un contexto limpio; distinguir carga inicial, carga al desplazarse y caché. Comparar con la referencia, sin afirmar mejoras de Core Web Vitals sin medición.
- Comparar fuente y HTML antes/después: igualdad de todos los elementos protegidos, no solo de los títulos. Excluir de la comparación únicamente los nuevos controles, alt/pies de medios y wrappers visuales permitidos. Si aparece una diferencia de SEO o contenido, corregirla antes de dar la página por terminada.
- Si se tocó un componente compartido, comprobar además páginas consumidoras representativas fuera de la tanda. No repetir una batería completa sin una razón concreta.

### 7. Registrar y entregar

Mantener un único registro textual de campaña en _plans con una fila por URL: estado, activos, fuente/licencia, peso del GIF/fotos, verificación visual y de SEO, fecha y publicación si corresponde. Estados útiles: pendiente, preparación, revisión local, validado local, publicado, verificado en vivo. Un piloto o una imagen preparada no equivale a publicación.

Mostrar la página o vista previa concreta. Si la tarea vigente incluye publicación, publicar solo los archivos de la tanda y comprobar en vivo la misma URL, carga, proporciones, GIF, CTA y conservación de elementos protegidos. Respetar cualquier revisión pendiente solicitada por el usuario; no crear un trámite de aprobación nuevo.

Cerrar con qué cambió, pesos medidos, verificaciones realizadas, dónde se ve y qué queda pendiente. Afirmar que el SEO se conservó únicamente si la comparación pasó. No afirmar que el SEO o el rendimiento mejoraron por haber cambiado imágenes.

## Archivos de trabajo

Nunca guardar imágenes, capturas, originales de stock, comparativas o galerías en _plans, aunque estén ignorados por Git. Usar memoria o temporal del sistema para procesamiento y revisión; eliminar los temporales propios al terminar, verificando la ruta antes de borrar. No borrar archivos aportados por Camilo.

En el repositorio conservar únicamente medios que usa la web, en carpetas de activos, y documentación textual. Las propuestas locales pueden vivir en el espacio de vistas previas fuera del repositorio; no publicarlas ni confundirlas con la web activa.
