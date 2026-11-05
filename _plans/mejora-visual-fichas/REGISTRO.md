# Campaña visual de fichas — Italgel

| URL | Estado | Fecha | Intervención | Peso de medios | SEO/contenido |
|---|---|---|---|---|---|
| /insumos-heladeria-medellin/ | Validado local; publicación en curso | 2026-11-05 | Tres fotos de aplicación después de la introducción; GIF aprobado de disfrute junto al CTA final | Fotos máximas: 24.237 + 44.972 + 18.100 bytes; GIF: 583.741 bytes; alternativa fija: 16.414 bytes | Comparación local sin diferencias protegidas; otras páginas HTML sin cambios |

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
