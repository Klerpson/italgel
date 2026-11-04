# Auditoría de imágenes, maquetación y enlaces — Italgel

Fecha: 4 de noviembre de 2026. Revisión del repositorio en `13abb13`, con compilación nueva de Jekyll. No se han modificado ni publicado plantillas, CSS, contenido ni imágenes de producción. Las muestras de compresión están en esta carpeta, excluida del sitio por Jekyll.

## Resultado principal

La prioridad es adaptar los archivos de imagen al nuevo diseño: recuperar resolución para las imágenes ampliadas, normalizar los márgenes de las fotos de catálogo y reducir el peso de determinadas fotografías del blog. No hace falta añadir una capa de CSS para corregir cada imagen.

Hay dos fallos visuales confirmados: los cuatro molinos de café aparecen recortados por la ampliación CSS de las tarjetas y las diez fichas de café desbordan horizontalmente en tablet. La compilación funciona y el rastreo local no encontró referencias HTML internas, recursos CSS ni anclas inexistentes.

## Cobertura y límites

| Comprobación | Resultado |
|---|---|
| HTML generado | 85 documentos: 61 páginas de contenido —incluida 404— y 24 redirecciones |
| Navegador | Edge sin ventana; 390, 768 y 1440 px para todas las rutas; 183 combinaciones únicas de contenido y tamaño |
| Comprobación adicional | Inicio, Mini Neo y Contacto a 320, 640 y 960 px |
| Inventario | 305 imágenes: 295 en `img/` y 10 iconos en `iconified/`; 18.515.021 bytes en disco |
| Formatos | 268 AVIF, 22 JPEG, 13 PNG, 1 ICO y 1 SVG |
| Revisión visual del archivo | Siete hojas de contacto con las 295 imágenes de `img/`; capturas de las principales familias de páginas |
| Imágenes efectivamente seleccionadas | 195 archivos distintos en navegador, contando variantes móviles |
| Archivos corruptos / imágenes sin cargar | 0 detectados |
| Referencias HTML internas inexistentes | 0 detectadas; incluye `href`, `src`, `srcset` y `poster` |
| Anclas inexistentes / IDs duplicados | 0 / 0 detectados |
| Imágenes sin atributos width/height o sin atributo alt | 0 / 0 detectadas |
| JavaScript del sitio | Sin excepciones detectadas; analítica y terceros bloqueados durante el rastreo local |
| Enlaces externos editoriales y de navegación | 38 URLs: 32 respuestas 200 y 6 respuestas 403; portada pública adicional: 200 |

Las imágenes decorativas del menú y los logos junto al nombre de marca tienen `alt=""`; esto no se considera un error automático. No se rellenaron con texto redundante.

La portada pública respondió con Mercato y el mismo título que la versión local. Esto confirma el rediseño en esa URL; no equivale a haber rastreado toda producción. Los enlaces internos se comprobaron contra la compilación local, no contra las reglas del hosting. Las redirecciones se siguieron en navegador y se identificaron por el HTML de origen para no contarlas dos veces como páginas de contenido.

No se midieron Core Web Vitals de usuarios reales, PageSpeed, Safari ni Firefox. Se verificaron carga y uso del CSS en Edge, sin una validación formal completa de sintaxis W3C. La nitidez se evaluó con dimensiones, escala de renderizado y revisión visual; no se asignó una puntuación estética automática a cada fotografía.

## 1. Resolución insuficiente para el nuevo tamaño — P1

Se detectaron **60 archivos que se amplían más de un 10 %** en al menos uno de los tamaños revisados, incluso a densidad de pantalla 1. El listado completo está en `prioridades-imagenes.csv`. Esto indica riesgo de falta de nitidez; no implica que los 60 deban sustituirse con la misma urgencia.

| Imagen | Archivo actual | Uso medido | Acción |
|---|---|---|---|
| `bases-stevia-helado.avif` | 300 × 300 | Hero de 707 × 707 a 768 px: 2,36× | Recuperar el original de mayor resolución; prioridad más alta |
| `fiordiamarena-variegato-cerezas.avif` | 584 × 396 | Hero cuadrado de 707 px; ampliación efectiva 1,79× por `cover` | Preparar un encuadre adecuado al hero, a partir del original |
| `pastas-fruta-helado.avif` y `salsas-especiales-helado.avif` | 520 × 520 | Hero de 707 px: 1,36× | Exportar una versión de mayor tamaño |
| Los cuatro `hero-insumos-heladeria-*.avif` de ciudades | 520 × 520 | Hero de 707 px: 1,36× | Exportar desde una fuente mayor; los cuatro archivos actuales son idénticos entre sí |
| `mantecadora-valmar-gelato.avif` | 540 × 810 | Sección de inicio de 707 px de ancho en tablet | Preparar variante mayor conservando la proporción y la máquina completa |
| `maquina-soft-301.avif`, `valmar.avif`, `valmar-pastomaster.avif` y otras tarjetas | 280 × 280 | Caja de aproximadamente 416 px, con imagen efectiva de unos 349 px | Recuperar fuentes suficientes para tarjetas grandes |

En tablet el diseño conserva una sola columna hasta 960 px, por lo que algunas fotos ocupan más ancho que en escritorio. Es el caso que más exige resolución al archivo. Además, las pantallas de densidad 2 requieren aproximadamente el doble de píxeles que su tamaño CSS; `prioridades-imagenes.csv` distingue los candidatos a revisar con ese criterio. No conviene aumentar todas las imágenes indiscriminadamente.

**Implementación recomendada:** obtener el original de buena calidad y exportar variantes acordes al uso. Como punto de partida, 400/800/1200 px para fotos editoriales y heros, y 320/640 px para tarjetas, ajustando esos valores a cada hueco real. Añadir `srcset` y `sizes` en los componentes compartidos. Actualmente hay 30 usos de `picture` con una fuente alternativa, pero ningún `img` tiene `srcset`; el archivo completo se usa también en miniaturas y tarjetas.

Ampliar un AVIF pequeño mediante reexportación no recupera detalle. Si no hay un original mejor, conservar el archivo y limitar su tamaño visual debe evaluarse como alternativa concreta de diseño.

## 2. Molinos cortados y ampliaciones compensatorias — P1

En `_includes/mercato/componentes.css:70`, `.ficha .baldosa__foto img` y `.baldosa--recorte` aplican `scale: 1.45` con `overflow: hidden` en la caja. Esta regla agranda también los molinos, que tienen una silueta vertical. Se cortan la parte superior de la tolva y, según el modelo, la base.

**Afectados visibles en `/equipos-cafe/`:** Cedar 63C, Oak 60, Ebony 64 y Sequoia 74WT. Evidencia: `molinos-detalle.jpg`. La ampliación también afecta a las tarjetas de café de inicio y a algunos productos relacionados: no debe asumirse que un único valor sirve para todos.

**Acción preferida:** preparar una exportación para tarjeta desde la foto original: fondo uniforme o transparente, equipo completo, centrado óptico y margen interior consistente. Guardar un archivo derivado cuando la ficha necesite conservar otro encuadre. Después, retirar la ampliación general de las tarjetas ya normalizadas. Mantener las reglas compartidas de `object-fit: contain`, sin excepciones de escala por producto.

También existe `scale: 1.15` en `.portada__foto--producto`, en `_includes/mercato/critico.css`. Conviene revisar la necesidad de esa compensación cuando se normalicen los archivos, sin eliminarla a ciegas.

### Coherencia entre imagen y producto — P1

`fiordiarancio-naranja-variegato.avif` y `pasta-limon-siciliano-sorbet.avif` son **el mismo archivo por SHA-256**, aunque se utilizan para productos de naranja y limón. La imagen muestra una cubeta acompañada de una rodaja que parece limón. Esto requiere validar la foto con el catálogo del fabricante: cambiar el nombre o el texto alternativo no resuelve una representación equivocada del producto. No se debe sustituir por otra foto sin confirmar qué producto representa.

## 3. Fotografías pesadas del blog — P2

**12 archivos utilizados por el sitio superan 150 KiB.** Algunos AVIF siguen siendo demasiado pesados para sus dimensiones y para las tarjetas donde se reutilizan. El formato por sí solo no garantiza un archivo ligero.

Se hicieron cinco pruebas con AVIF calidad 60, manteniendo las dimensiones y sin tocar los originales:

| Archivo de `img/blog/` | Original, KiB | Muestra, KiB | Reducción |
|---|---:|---:|---:|
| `tipos-toppings-para-helado-profesional.avif` | 419,7 | 83,6 | 80,1 % |
| `rentabilidad-heladeria-colombia-margenes.avif` | 343,2 | 64,4 | 81,2 % |
| `como-abrir-heladeria-colombia.avif` | 279,6 | 47,4 | 83,0 % |
| `variegato-para-helado-profesional.avif` | 278,1 | 54,8 | 80,3 % |
| `diferencia-gelato-helado-artesanal.avif` | 270,0 | 55,5 | 79,4 % |

Total: **1.628.685 → 313.083 bytes**, ahorro de aproximadamente 80,8 %. No es compresión sin pérdida. La comparación visual está en `comparacion-compresion.jpg` y los archivos candidatos en `muestras/`. La revisión comparativa a tamaño de presentación no mostró una degradación evidente que invalide estas muestras; las texturas finas deben aprobarse a tamaño real antes de reemplazar archivos.

**Acción:** usar un ajuste de calidad por imagen, no un valor universal; generar versiones ligeras para tarjetas y móviles y actualizar las referencias compartidas. Las muestras demuestran margen real de ahorro, sin alterar la maquetación.

No priorizar los PNG antiguos de 326–821 KiB solo por su peso: varios ya tienen AVIF y no se seleccionaron como `img` en el rastreo. Borrarlos o convertirlos de nuevo no reducirá necesariamente la descarga de las páginas actuales.

## 4. Desbordamiento de las comparativas de café — P2

Las diez fichas de `/equipos-cafe/<modelo>/` generan un ancho de documento superior a la pantalla a 768 px: 771 px en molinos y 781 px en cafeteras. En la prueba adicional de Mini Neo a 640 px, el documento llega a 775 px. A 390 y 1440 px no apareció este fallo en el rastreo general.

Se aisló el problema en `#comparar`: ocultar solo esa sección devolvió el documento a 768 px. El contenedor ya tiene `overflow-x: auto`, pero el contenido con posicionamiento absoluto de los textos ocultos puede quedar fuera de su contexto de posicionamiento. Añadir mínimos a los hijos del grid no corrigió el problema.

**Corrección mínima probada exclusivamente en navegador: agregar `position: relative` a la regla existente `.tabla-desplazable`** en `_includes/mercato/componentes.css:220`. En Mini Neo a 768 px, el ancho pasó de 781 a 768 px. Esta es evidencia de una solución candidata; antes de incorporarla, repetir la comprobación de las diez fichas a 640/768 px y del scroll interno de la tabla. No hace falta ocultar el desbordamiento de todo el `body`.

Evidencia: `foco.json`, `tablet-desbordamiento.jpg` y `navegador.json`. El comparador de la categoría se probó cambiando la selección a Tank 2 y activando el control de diferencias; ambos respondieron.

## 5. Enlaces — sin roturas internas detectadas; seis externos por revisar

Los destinos internos existentes y sus anclas pasaron el rastreo. No se detectaron imágenes, fuentes o recursos CSS inexistentes. Los 24 documentos de redirección apuntan a destinos locales presentes; su implementación es HTML/JavaScript, no se verificó que el hosting emita redirecciones HTTP equivalentes.

De los 38 enlaces externos editoriales y de navegación comprobados, **32 respondieron 200 y seis de University of Guelph respondieron 403**:

- `overrun-calculations/` y `ageing-of-mix/`, citados en el artículo de overrun.
- `emulsifiers/` y `stabilizers/`, citados en el artículo de emulsionantes.
- `pasteurization-of-mix/`, `homogenization-of-mix/` y también `ageing-of-mix/`, citados en el artículo de pasteurización.

Todos están bajo `https://books.lib.uoguelph.ca/icecreamtechnologyebook/chapter/`. Un 403 indica acceso denegado a la comprobación; **no prueba que el documento haya desaparecido**. Verificar la lectura en una sesión normal antes de sustituir referencias. No hubo respuestas 404 en esta muestra externa. Las respuestas 200 de redes sociales tampoco garantizan acceso al contenido sin iniciar sesión.

Se excluyeron de esta comprobación las URLs de acción de WhatsApp, preconexiones y recursos de analítica. No se enviaron mensajes ni formularios. Detalles por página en `externos-estados.json`.

## 6. Limpieza y coherencia de recursos — P3

- Se encontraron **16 grupos de archivos idénticos por SHA-256**; detalle en `duplicados-archivos.json`. Hay nombres distintos para la misma imagen. Consolidarlos puede simplificar mantenimiento, pero no eliminar archivos sin buscar también usos en metadatos, datos, JSON, CSS y enlaces externos históricos.
- El tamaño total del archivo de imágenes no es el peso descargado por una página. `imagenes.csv` y `navegador.json` permiten separar archivo almacenado de uso efectivo.
- `head.html` declara para todas las imágenes sociales 1200 × 640, aunque las fotos reales incluyen 584 × 584, 1080 × 720 y otras proporciones. Corregir esos metadatos al preparar las exportaciones de imagen social. Inventario: `og-imagenes.json`.
- El CSS actual de Mercato suma 54.170 bytes externos y 18.348 bytes de crítico de origen, antes de compresión HTTP. Carga correctamente en las páginas revisadas. No se justifica rehacerlo para compensar fotos mal preparadas. La skill local describe parte de la arquitectura anterior; en esta auditoría se siguió la implementación actual del rediseño.

## Orden recomendado de ejecución

1. Normalizar los cuatro molinos y las fotos de catálogo que dependen de ampliaciones; conservar una fuente de buena calidad y exportaciones específicas para tarjeta. Validar la foto compartida por Fiordiarancio y limón.
2. Sustituir el hero de Stevia y los demás archivos con mayor ampliación por exportaciones desde originales suficientes. Revisar tablet además de escritorio.
3. Optimizar los 12 archivos activos de más de 150 KiB, empezando por las cinco muestras. Incorporar variantes y `sizes` en los componentes compartidos.
4. Aplicar y verificar la declaración mínima de posicionamiento en la comparativa, sin reglas globales para ocultar overflow.
5. Revisar las seis referencias 403 y después consolidar duplicados y metadatos sociales.

## Archivos para ejecutar y revisar

- `prioridades-imagenes.csv`: decisión por cada uno de los 305 archivos, con tamaño, resolución, escala máxima observada y una página de ejemplo.
- `imagenes.csv`: inventario técnico completo; `usos-imagenes.csv`: usos del HTML y atributos.
- `navegador.json`: medidas por página, imagen y ancho de pantalla. Los factores comparan píxeles del archivo con el tamaño efectivo considerando ajuste y escala; no son puntuaciones de calidad.
- `resultados.json` y `resumen.json`: resumen de navegador y rastreo estático.
- `enlaces-rotos.json`, `anclas-rotas.json`, `ids-duplicados.json`, `css-recursos-rotos.json`: listas vacías tras las comprobaciones.
- `contacto-01.jpg` a `contacto-07.jpg`: archivo visual completo de `img/`.
- `muestras-compresion.json` y `muestras/`: pruebas locales de compresión.
- `audit.py`, `browser.cjs`, `external.cjs`, `analyze.py` y `focus.cjs`: procedimientos reproducibles. Requieren Pillow/lxml, Playwright y Edge disponibles en el entorno; las rutas de runtime son específicas de este equipo.

La dependencia `sass-embedded 1.106.1` que faltaba se instaló para compilar. `Gemfile` y `Gemfile.lock` quedaron sin cambios. Ninguna de las propuestas se ha publicado.
