# Auditoría visual de páginas comerciales de Italgel

Fecha: 5 de noviembre de 2026. Estado: diagnóstico y propuesta; sin modificaciones de la web pública.

## Alcance y conteo

Italgel vende equipos e insumos. Para esta auditoría, «páginas de servicio» significa páginas comerciales que captan una necesidad por categoría, subcategoría o ciudad. No se cuentan como servicios separados los artículos, contactos, evento, institucionales, redirecciones ni la portada.

- **21 páginas objetivo:** 12 categorías principales + 5 subcategorías + 4 páginas de cobertura local.
- **17 fichas de producto adicionales:** 10 cafeteras/molinos Hambach, Coldelite Compacta 3, Base 50, Neutralin Plus, Supergelmix, pasta de pistacho, pasta de vainilla y Amarena Fabbri. Se consideran una segunda etapa si se desea extender el estándar visual a todo el catálogo.
- **38 páginas comerciales en total**, más la portada como referencia.

Se contrastaron con el sitemap publicado: 59 URLs de páginas (sin contar referencias de imágenes). Las 38 URLs comerciales y la portada están en ese sitemap. Se revisó el HTML público de las 39: todas respondieron HTTP 200 y sus rutas de imágenes de contenido coinciden con la compilación local disponible.

## Hallazgos

- **0 de 21 páginas objetivo tienen GIF.** Las 17 fichas adicionales tampoco tienen GIF. La portada sí tiene uno; la propuesta de playa aprobada permanece local y no se cuenta como publicada.
- Las 21 páginas ya tienen una imagen de cabecera. Medellín tiene únicamente esa imagen: **cero imágenes en el cuerpo**.
- Industrial y Vitrinas tienen tres imágenes cada una, incluida la cabecera. Quella, Stevia, Premium y Salsas especiales tienen cuatro; son candidatas para revisar presentación y demostración visual.
- Pastas tiene 16 imágenes y Coberturas 13. La solución allí no es aumentar el número por defecto: conviene ordenar fotos, evitar una galería excesiva y sumar una demostración breve.
- En estas 39 páginas no se detectaron atributos alt vacíos ni dimensiones width/height ausentes en las imágenes de main. Las rutas de archivos de imágenes detectadas existen en el proyecto.
- Algunos recursos se repiten dentro de una misma página. Por ejemplo, Artesanal tiene seis elementos img pero cuatro archivos distintos; el inventario separa ambos conteos para no presentarlos como seis fotos diferentes.

Esto es un inventario estructural y editorial del HTML publicado, no una certificación individual de nitidez, una prueba de carga visual de cada archivo ni una medición de Core Web Vitals. Los pesos reales se medirán por página y dispositivo al implementar cada tanda.

## Inventario de las 21 páginas

Imágenes = elementos img dentro de main, incluida la cabecera y tarjetas. No incluye logotipos de navegación o pie. «Únicas» deduplica src; los srcset son variantes responsive de esa imagen, no fotos adicionales. GIF es un conteo de recursos GIF referenciados, separado del de imágenes fijas.

| Página | Imágenes | Únicas | GIF | Propuesta visual |
|---|---:|---:|---:|---|
| [equipos](https://italgel.com.co/equipos/) | 6 | 6 | 0 | Servicio de helado: mostrar resultado; fotos reales de las familias de equipos. |
| [maquinas-helado-artesanal](https://italgel.com.co/maquinas-helado-artesanal/) | 6 | 4 | 0 | Extracción o servicio de gelato; identificar como ilustrativo si la máquina del video no es la ofertada. |
| [maquinas-helado-soft](https://italgel.com.co/maquinas-helado-soft/) | 6 | 5 | 0 | Helado suave formando una espiral en un cono. |
| [maquinas-helado-industrial](https://italgel.com.co/maquinas-helado-industrial/) | 3 | 3 | 0 | Proceso real autorizado de mezcla/pasteurización; conseguir material del fabricante antes de atribuir operación a una máquina. |
| [vitrinas-congeladores](https://italgel.com.co/vitrinas-congeladores/) | 3 | 3 | 0 | Servir una porción desde una cubeta; combinar con fotos reales del equipo y del interior. |
| [equipos-cafe](https://italgel.com.co/equipos-cafe/) | 11 | 11 | 0 | Extracción de espresso en una taza, junto a las fotografías originales de Hambach. |
| [insumos](https://italgel.com.co/insumos/) | 5 | 5 | 0 | Preparación o servicio de helado; el GIF de disfrute aprobado puede acompañar el cierre. |
| [bases-helado-colombia](https://italgel.com.co/bases-helado-colombia/) | 8 | 8 | 0 | Mezcla de ingredientes para helado, sin presentar una dosificación de stock como receta MEC3. |
| [pastas-sabores-helado](https://italgel.com.co/pastas-sabores-helado/) | 16 | 16 | 0 | Incorporación de pasta o textura de helado; separar cada familia de sabor visualmente. |
| [variegatos-helado](https://italgel.com.co/variegatos-helado/) | 5 | 5 | 0 | Veteado al plegar una salsa sobre gelato. |
| [coberturas-salsas-helado](https://italgel.com.co/coberturas-salsas-helado/) | 13 | 13 | 0 | Vertido de salsa sobre una copa o cono. |
| [productos-quella](https://italgel.com.co/productos-quella/) | 4 | 4 | 0 | Textura y aplicación de cobertura; fotografías originales de producto. |
| [bases-helado-colombia/bases-stevia](https://italgel.com.co/bases-helado-colombia/bases-stevia/) | 4 | 3 | 0 | Servicio de helado; no atribuir propiedades sin azúcar al helado de stock. |
| [pastas-sabores-helado/pastas-clasicas](https://italgel.com.co/pastas-sabores-helado/pastas-clasicas/) | 7 | 7 | 0 | Servicio de chocolate o vainilla. |
| [pastas-sabores-helado/pastas-fruta](https://italgel.com.co/pastas-sabores-helado/pastas-fruta/) | 7 | 7 | 0 | Servicio de sorbete o helado de fruta. |
| [pastas-sabores-helado/pastas-premium](https://italgel.com.co/pastas-sabores-helado/pastas-premium/) | 4 | 4 | 0 | Textura o servicio de pistacho/avellana, con identificación prudente del sabor. |
| [coberturas-salsas-helado/salsas-especiales](https://italgel.com.co/coberturas-salsas-helado/salsas-especiales/) | 4 | 4 | 0 | Aplicación de salsa en una copa. |
| [insumos-heladeria-medellin](https://italgel.com.co/insumos-heladeria-medellin/) | 1 | 1 | 0 | Preparación o disfrute de helado. Añadir fotos de familias de insumos; el stock no representa una sede ni entregas de esa ciudad. |
| [insumos-heladeria-cali](https://italgel.com.co/insumos-heladeria-cali/) | 5 | 5 | 0 | Preparación o disfrute de helado. Añadir fotos de familias de insumos; el stock no representa una sede ni entregas de esa ciudad. |
| [insumos-heladeria-barranquilla](https://italgel.com.co/insumos-heladeria-barranquilla/) | 4 | 4 | 0 | Preparación o disfrute de helado. Añadir fotos de familias de insumos; el stock no representa una sede ni entregas de esa ciudad. |
| [insumos-heladeria-bucaramanga](https://italgel.com.co/insumos-heladeria-bucaramanga/) | 4 | 4 | 0 | Preparación o disfrute de helado. Añadir fotos de familias de insumos; el stock no representa una sede ni entregas de esa ciudad. |

## Estándar recomendado por página

1. **Cabecera estática:** foto relevante de producto, aplicación o resultado; dimensiones correctas y versiones responsive. Mantener el GIF fuera de la primera pantalla para cuidar el peso inicial.
2. **Contenido repartido:** en las páginas pobres en imágenes, llegar a unas tres a cinco fotografías útiles, incluida la cabecera. Alternar explicación con imágenes de producto, detalle y resultado; es una orientación, no una cuota para añadir más a páginas que ya están bien ilustradas.
3. **Un GIF nativo por página:** colocarlo después de la primera explicación o antes de la cotización, con una frase que explique lo que se ve. Elegir movimiento propio del tema; la escena de playa aprobada encaja como cierre emocional en Insumos o cobertura local, mientras una página de máquinas necesita mostrar principalmente equipos y servicio de helado.
4. **Cierre:** CTA para cotizar después de mostrar el resultado o la aplicación; no sustituir las fichas técnicas por animaciones.

## Peso y comportamiento

- GIF real, sin JavaScript nuevo; aprovechar un componente compartido parametrizable basado en el actual.
- Un solo GIF por página como punto de partida. Bucle de aproximadamente 1,5–2,5 segundos y dimensiones según su espacio. Probar cadencias de 5–8 fps; ajustar tras revisar el movimiento y el peso.
- Objetivo orientativo de 300–700 KB por GIF. Si supera unos 800 KB o exige deformar/empobrecer demasiado la cara o el producto, cambiar de fragmento/escena antes de seguir comprimiendo. Son presupuestos propuestos, no resultados medidos de futuras piezas.
- Imágenes fijas AVIF/WebP con dimensiones intrínsecas y variantes responsive. Corregir los archivos y el encuadre antes de agregar reglas CSS por página.
- Carga diferida para el GIF, fotograma fijo y prefers-reduced-motion; control visual de movimiento mediante HTML/CSS. La sustitución por una foto no congela el GIF en un fotograma concreto.
- Reutilizar por familia entre páginas cuando sea pertinente: un recurso puede servir a varias rutas y aprovechar la caché. No producir 21 archivos diferentes sin necesidad ni usar la misma escena indiscriminadamente.
- Conservar fuentes/licencias en texto. Material de fabricante para equipos y producto real; stock para escenas ilustrativas. No presentar modelos como clientes reales, una escena como sede local ni una máquina distinta como prueba del rendimiento del modelo vendido.

## Fases propuestas

**Fase 1: tres pilotos.** Medellín (falta de imágenes en el cuerpo), Máquinas soft (demostración de servicio) y Variegatos (textura/aplicación). Cada una con fotos relevantes y un GIF. Revisar móvil/escritorio, encuadre, nitidez, peso descargado, proporciones, pausa visual, movimiento reducido y enlaces de cotización. Mostrar las tres antes de extender el patrón.

**Fase 2: las otras 18 páginas objetivo.** Empezar por Industrial, Vitrinas y Quella; continuar con las otras categorías/subcategorías y ciudades. Las páginas con catálogos visuales abundantes reciben una mejora de distribución y un GIF, sin engrosar innecesariamente sus galerías. Completar las 21 con animación pertinente y alternativa fija.

**Fase 3: las 17 fichas.** Incorporar animación específica cuando haya un recurso fiel al producto o una aplicación identificada como ilustrativa. Evitar asignar a un equipo real un video genérico de otra máquina. El CSV incluye las 17 para planificar este trabajo sin mezclarlas con las 21 páginas objetivo.

No se ha descargado material nuevo ni implementado ninguna de estas fases durante esta auditoría. No se crearon imágenes o capturas en _plans. Evidencia reproducible: auditar.py, inventario.csv e inventario.json, todos en esta carpeta.
