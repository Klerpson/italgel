# Equipos de café: revisión local

Fecha: 26 de octubre de 2026. Implementación local autorizada por Camilo; sin publicación.

Ruta: `/equipos-cafe/`. Accesos desde inicio, Equipos y menús de escritorio y móvil.

## Fuentes

- `C:/Users/Camilo/Downloads/Catalogo Hambach.pdf`: páginas 2 a 7, seis cafeteras.
- `C:/Users/Camilo/Downloads/Catalogo Molinos.pdf`: páginas 2 a 5, cuatro molinos.
- La frase «Importadores exclusivos de Hambach para Colombia» procede del mensaje del dueño compartido por Camilo. Los PDFs no documentan la exclusividad.
- Los molinos se presentan sin atribuirles una marca que no esté identificada en su catálogo.
- Se conservan las referencias tal como aparecen en los encabezados de las fichas, incluso DR 7209A para Tank 2.
- Dimensiones en el orden del catálogo; únicamente se identifica la última como altura. No se deducen ancho y fondo.
- Sin precios, inventario, garantía, productividad ni país de fabricación añadidos.

## Implementación

Datos editables en `_data/cafe.yml`. Diez fotos reales extraídas de los documentos, convertidas a AVIF (153.309 bytes en total). Fichas HTML desplegables y enlaces de WhatsApp con referencia de cada modelo y teléfono de `_config.yml`. PDFs originales descargables en `catalogos/`.

## Validación

`bundle exec jekyll build` completó correctamente después de instalar las cuatro dependencias ausentes del lockfile, sin modificar Gemfile ni Gemfile.lock.

Revisión real en Edge sin ventana: escritorio de 1440 px y móvil de 390 px; un H1, diez tarjetas, todas las imágenes cargadas, sin desbordamiento horizontal, ficha desplegable operativa y enlace móvil accesible. Canonical correcto, sección incluida en sitemap y búsqueda interna; los dos PDFs responden 200 localmente. La medición de recepción de eventos de analítica queda fuera de esta comprobación.

Capturas y resultado detallado en `C:/Users/Camilo/.codex/visualizations/2026/10/26/01a17952-c6f3-7341-9635-824b4183d88a/`.
