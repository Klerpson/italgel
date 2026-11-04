# Fase 3 — Resolución, encuadre e identidad del catálogo

Completada localmente el 4 de noviembre de 2026. Pendiente de publicación. No se realizó commit, push ni despliegue.

## Resultado principal

Se integró una entrega responsiva para **111 referencias de imagen, correspondientes a 104 fuentes distintas**, en las páginas de contenido del catálogo y otros usos compartidos. Se corrigieron las prioridades de Stevia, Amarena y Fiordiarancio, además de Quella White, Yogomec y la ilustración de fresa. Las cabeceras de ciudades ahora utilizan una foto de un stand de MEC3 que ya existía en el proyecto, en lugar de la selfie de stock.

En 32 rutas revisadas, con 111 combinaciones de ancho y densidad de pantalla, no se encontraron imágenes sin cargar, errores propios de JavaScript ni respuestas locales HTTP de error. En las comprobaciones a densidad 1, **los usos con ampliación efectiva superior a 1,10× bajaron de 65 a cero**. Es un recuento de apariciones por página y pantalla, no de 65 archivos diferentes.

La mejora combina fuentes de mayor resolución donde se consiguieron, variantes ligeras y límites de tamaño fieles a los píxeles disponibles. No se generaron fotografías ni se aumentó artificialmente la resolución de los archivos.

## Correcciones de identidad y fuentes

| Uso | Cambio y fuente |
|---|---|
| Cabecera de Stevia y tarjeta Base G Crema | Se retiró el vaso de Quella White del hero. Se utiliza la fotografía de la [ficha Base G Cream de MEC3](https://www.mec3.com/en/products/gelato/bases/cream-bases/base-g-cream), de 492 × 492 px. |
| Base G Fruta | Fotografía de la [ficha Base G Frutte de MEC3](https://www.mec3.com/it/prodotti/gelato/basi/basi-frutta/base-g-frutte), 492 × 492 px. |
| Yogomec | Se sustituyó la imagen de chocolate por la presentación de helado suave que muestra la [ficha Yogomec Greco G de MEC3](https://www.mec3.com/it/prodotti/gelato/gelato-soft/soft-ice-international/yogomec-greco-g). La ficha identifica el código 08154. El alt describe la fotografía de esa ficha, sin añadir promesas nuevas sobre el producto. |
| Fiordiarancio | Se sustituyó la cubeta con limón por la fotografía de naranja publicada en la [ficha Fiordiarancio de MEC3](https://www.mec3.com/en/products/gelato/ripple-sauces/fruit-ripples/fiordiarancio), 472 × 472 px. Las variantes se usan tanto en inicio como en el catálogo. |
| Quella White | La foto de cacao en polvo se sustituyó por la fotografía de la [ficha Quella White de MEC3](https://www.mec3.com/it/prodotti/gelato/variegati/quella-white), 492 × 492 px. |
| Amarena | Se sustituyó la paleta rosada por la imagen de helado con cerezas y almíbar de la [página profesional de Amarena Fabbri](https://en.fabbri1905.com/professionals/gelato/products/amarena-fabbri.kl). Fuente de 1920 × 800 px; exportación máxima de 1080 × 450, sin recortar la escena. |
| Base 50, imagen interior | Se recuperó del historial del proyecto una imagen de vitrina de 560 × 700, frente a los 440 × 550 del archivo actual. Se describe como una vitrina, no como el empaque de Base 50. Procedencia en `historial.json`. |
| Páginas de ciudades | Reutilizan `img/contacto-italgel-colombia.avif`, de 1080 × 720, que muestra un stand con la marca MEC3. El alt describe esa exhibición; no se presenta como bodega, tienda u oficina en las ciudades mencionadas. |
| Ilustración de fresa | Se usa una imagen de helado con fresa ya existente en el proyecto, con el alt explícito «imagen ilustrativa del sabor». No se atribuye a la fabricación de un producto concreto. |
| Imágenes de dos artículos | El alt de medición de overrun ahora describe las presentaciones de helado de la foto, sin afirmar que hay una balanza. El de control de porciones describe los recipientes de toppings, sin afirmar que aparecen dosificadores. |

Los JPEG oficiales descargados, sus páginas de referencia, estado HTTP y hashes están en `fuentes/`. Los derechos y marcas siguen perteneciendo a sus respectivos titulares; estas fuentes no se presentan como fotografías propias de Italgel.

## Implementación

- Datos de fuentes y variantes en `_data/imagenes_catalogo.json`; componente compartido `mercato/imagen-catalogo.html`.
- **207 AVIF nuevos, 3.200.344 bytes almacenados.** Los visitantes seleccionan una variante por uso, no descargan todo el conjunto. Se conservan los archivos anteriores para mantener sus rutas e historial; la limpieza definitiva sigue en la fase 4.
- Exportaciones con calidad 66 y muestreo 4:4:4, sin ampliar los píxeles de las fuentes. Se conservan los archivos existentes cuando la reexportación a tamaño completo no ahorra al menos un 10 %.
- Transparencias compuestas sobre blanco antes de exportar, para evitar fondos negros. Revisión visual de las 104 fuentes distintas mediante las cuatro hojas `catalogo-*.jpg` y de las capturas finales de catálogo.
- Las imágenes de las cabeceras se centran y conservan su proporción. El componente limita su ancho a la resolución del archivo máximo disponible. No se fuerza a una foto de 300 px a cubrir una caja de 707 px.
- Las tarjetas heredadas conservan su regla compartida de ajuste, con máximos del 84 % de la caja en lugar de ampliar todas las imágenes al 100 %. Los archivos de 280 px pueden verse algo menores: es el compromiso correcto mientras no exista una fuente mejor.
- Un solo ajuste CSS compartido, `.foto-fiel`, y modificación de la regla de imagen existente en `.product-img`. No hay selectores por referencia de producto. El límite de ancho se obtiene automáticamente de la dimensión de la fuente en el componente.
- Precarga responsiva de las cabeceras del catálogo. Se conservaron las mejoras del blog de la fase 2.
- Las imágenes sociales y el schema de producto del catálogo apuntan a la fotografía corregida, con dimensiones sociales coherentes con el archivo seleccionado a tamaño máximo. El resto de metadatos sociales sigue pendiente de la fase 4.

## Peso en contextos representativos

Comparación local antes/después, recorriendo las páginas para cargar las imágenes diferidas. Se suman los bytes de respuestas de imágenes propias; no es el peso completo de la página ni una medición de Core Web Vitals.

| Ruta, móvil de 390 px y densidad 1 | Antes | Después | Cambio |
|---|---:|---:|---:|
| Inicio | 221.178 B | 193.190 B | −12,7 % |
| Máquinas soft | 58.618 B | 41.251 B | −29,6 % |
| Stevia | 42.632 B | 41.029 B | −3,8 % |
| Amarena | 15.313 B | 9.994 B | −34,7 % |
| Insumos Medellín | 22.330 B | 22.560 B | +230 B, por usar la fotografía pertinente de mayor resolución |

No se buscó reducir peso sacrificando correspondencia o nitidez. El balance completo por contexto está en `comparacion.json`.

## Verificación

- Compilación Jekyll correcta.
- 32 rutas: inicio, páginas de contenido del catálogo y dos guías afectadas por correcciones de alt. Tres tamaños a densidad 1: 390/768/1440 px. Cinco rutas prioritarias también en densidad 2: total de 111 combinaciones antes y 111 después.
- Cero imágenes sin cargar, excepciones JavaScript del sitio, respuestas HTTP propias de error, H1 incorrectos o desbordamientos horizontales de página en las combinaciones finales.
- Cero usos con ampliación efectiva superior al 10 % a densidad 1, frente a 65 apariciones anteriores. La proporción se calcula sobre las dimensiones del archivo seleccionado, considerando el ajuste y el espacio interior.
- Sin cambios de texto visible de las páginas en las 111 comparaciones. Las correcciones de alt y title están descritas arriba.
- Fuentes y variantes verificadas por hash, dimensiones y decodificación; sin referencias internas inexistentes en el rastreo de los 85 HTML generados.
- Las comprobaciones estáticas de la fase 2 siguen pasando después de estos cambios.
- `git diff --check` correcto.

Las pruebas son locales en Edge, con terceros bloqueados para evitar eventos de analítica. La publicación y la comprobación real del hosting siguen pendientes. No se afirma compatibilidad probada en Safari/Firefox ni resultados de métricas de usuarios reales.

## Fuentes pendientes y límites

El historial no contiene originales mayores para la mayoría de las tarjetas de 280 px. Se conservó su detalle disponible y se limita el tamaño de presentación; no se ha «recuperado» resolución mediante interpolación. Para ampliar esas tarjetas con nitidez en pantallas grandes o de densidad 2 hacen falta fotos originales del fabricante o del equipo.

Casos prioritarios para conseguir fuentes adicionales: Valmar/Pastomaster/Labotronic, Coldelite 301 y 603 BIB, Pasmo S121 y varias fotografías pequeñas de ingredientes. Las marcas y modelos concretos de las fotos heredadas requieren cotejo con una ficha o fotografía del equipo; esta fase no convierte una foto genérica en prueba de identidad del modelo. Se mantiene ese límite explícito, sin atribuir una referencia nueva por parecido visual.

Las fichas de café y su desbordamiento de comparativas pertenecen a la fase 4 y no forman parte de las 32 rutas de esta comprobación. Las fases 4 y 5 siguen pendientes.

## Evidencia y reproducción

- `procedencia.json`: las 111 referencias, sus archivos de partida, hashes y variantes.
- `fuentes/descargas.json` y páginas HTML guardadas: procedencia oficial de las seis fotografías descargadas.
- `historial.json`: búsqueda y tamaños de los recursos recuperados de git. El PNG recuperado de Valmar no se usó como sustitución automática, porque no se verificó que fuera la misma fotografía/equipo que el archivo actual.
- `alcance.json`: rutas y fuentes del inventario inicial de esta fase.
- `antes/` y `despues/`: mediciones y capturas. Las barras fijas pueden superponerse al encuadre de una captura de sección al desplazar la página; no forman parte de las imágenes.
- `comparacion.json`: integridad, peso y cálculo de ampliaciones por uso.
- `catalogo-1.jpg` a `catalogo-4.jpg`: revisión visual del conjunto de fuentes distintas, con los fondos transparentes tratados correctamente.
- `recuperar.cjs`, `descargar.cjs`, `historial.py`, `preparar.py`, `integrar.py`, `verificar.cjs`, `comparar.py` y `galeria.py`: proceso y comprobaciones reproducibles. Runtimes específicos del equipo.

La fuente de cada variante permanece estable: no volver a comprimir una exportación como si fuera un original. `_plans/` conserva la evidencia y queda excluido del sitio generado.
