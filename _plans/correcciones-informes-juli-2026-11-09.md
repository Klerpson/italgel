# Correcciones del correo de Informes Juli — 9 nov 2026

Fuente: correo de Informes Juli (francojuliancho@gmail.com), 9 nov 2026, 07:34, asunto «[Equipo SEO] 3 urgentes: Since Colombia sin WhatsApp, Italgel sin page_view y kraft cae en Acttua».
Correo consultado en camilocuspianseo@gmail.com: https://mail.google.com/mail/u/0/?ogbl#inbox/FMfcgzQjgqMhgnnPzGxlrlSLBpXZccXx
Alcance: únicamente Italgel. Cifras semanales del correo, no una extracción nueva. Se incorporó primero el commit de Julián `2bd471a` (encabezados), cuyo despliegue estaba exitoso.

## 1. Medición: diagnóstico actualizado y corrección en código

- El sitio publicado carga `GTM-TH788DQN` desde el head compartido por las plantillas Mercato y heredadas.
- Configuración pública del contenedor consultada el 9 nov: versión 7; etiqueta Google `G-RZHEWMEGVK`, activador `gtm.init`, sin restricción por URL ni `send_page_view: false` en la configuración de esa etiqueta. Las otras etiquetas de eventos son `whatsapp_click` y `contact_click`.
- GA4: propiedad `526154693`, cuenta `385722227`, flujo `13673112857`, ID `G-RZHEWMEGVK`, coincide con el contenedor público. Recogida activa en las últimas 48 horas y medición mejorada de vistas activada.
- En Inicio, periodo 2–8 nov, se observan 381 vistas; entre las páginas con vistas están la portada (82), equipos (34), Tank 2 (31), soft (29), insumos (23), tipos de toppings (21) y vitrinas (19). Esto no permite afirmar que actualmente ninguna plantilla envíe page_view.
- El código sí aplazaba la descarga de GTM hasta `window.load`. Imágenes y terceros podían retrasar toda la medición y dejar visitas cortas sin registrar. Se eliminó esa espera y se conservó la carga asíncrona, el ID y una sola inicialización del dataLayer.
- No se añadió una segunda etiqueta GA4 ni un page_view manual: podrían duplicar las vistas automáticas existentes.
- Comprobación de ejecución con DOM simulado en estados `loading`, `interactive` y `complete`: una única inserción asíncrona de GTM y un único evento inicial, sin esperar `load`.

**Límite:** no hay acceso al contenedor GTM desde ninguna de las dos cuentas Google abiertas; no se ha ejecutado su vista previa ni certificado la recepción individual de page_view y de clics de contacto después del cambio. La espera a load es un riesgo confirmado del código, no una causa demostrada de todas las entradas históricas `(not set)`. El dato del correo incluye días anteriores al cambio. Los datos históricos no se recuperan con una corrección de etiquetas.

Documentación primaria: [entradas (not set)](https://support.google.com/analytics/answer/13504892?hl=en), [medición de pageviews y duplicados](https://developers.google.com/analytics/devguides/collection/ga4/views).

## 2. Portada: comparación antes/después de Mercato

Comparación con el padre de `35266c9` (rediseño):

| Elemento | Antes | Mercato anterior a esta corrección | Ajuste |
|---|---|---|---|
| Title | Insumos y Equipos para Heladería en Colombia | Máquinas de helado, cafeteras e insumos para heladería | Recuperar «Insumos y equipos para heladería en Colombia» |
| H1 | Italgel Colombia, insumos profesionales y rentabilidad | Máquinas de helado, cafeteras espresso e insumos | «Insumos y equipos para heladería en Colombia» |
| Introducción | Bases MEC3, pastas, coberturas y máquinas | Máquinas, vitrinas, cafeteras y variegatos | Recuperar bases MEC3, pastas y coberturas al inicio, conservando equipos y cafeteras |
| Enlaces | Insumos, equipos, vitrinas y productos | Se conservan y se amplían las familias del catálogo | Mantenerlos; sin cambios de URL |

No se recuperaron promesas antiguas sin confirmar (72 horas, porcentajes de ahorro o rendimiento). Se mantiene Mercato y el trabajo de encabezados de Julián. La caída del periodo 31 oct–6 nov no demuestra causalidad del rediseño del 4 nov: incluye cuatro días anteriores y una muestra pequeña.

Las URLs `/`, `/equipos/` y `/maquinas-helado-artesanal/` respondían 200 con canonical propio. No hay una regla de redirección que las desvíe.

## 3. Equipos: intención «máquinas para hacer helados»

El H1 ya incluía «Máquinas para hacer helado». Se conserva y se añade, antes del bloque de cafeteras, una sección inicial que explica las diferencias entre soft, artesanal e industrial y enlaza las tres categorías con anchors descriptivos. Se indican los datos necesarios para dimensionar la máquina, sin inventar precios ni capacidades nuevas.

## 4. Toppings: consolidación ya publicada

`/blog/toppings-para-helado-mas-rentables/` ya no es un artículo independiente: entrega HTML de redirección con meta refresh inmediato y `location.replace` hacia `/blog/tipos-de-toppings-para-helado/`. Su respuesta HTTP es 200, no 301; se documenta así, sin confundir el mecanismo. El destino tiene canonical propio y el title «Tipos de toppings para helado: guía para heladerías».

No se recreó el post retirado ni se cambió su title como si siguiera publicado. La guía específica de costo por porción está en borrador (`published: false`) y se mantiene así. No se cambia la consolidación existente con base en impresiones históricas de una URL retirada.

## Verificación y seguimiento

- Build Jekyll correcto; `git diff --check` correcto.
- Portada y equipos: un H1 y enlaces locales existentes en el build. HTML: portada 83.453 bytes (antes 83.675), equipos 70.219 (antes 68.765). No se añaden imágenes, fuentes, CSS ni bibliotecas; equipos suma aproximadamente 1,4 KiB de HTML. Esto no equivale a una medición de Core Web Vitals.
- Revisión en navegador: portada y equipos en escritorio (1366 px), portada e introducción de equipos en móvil (390 px), además de bloques de catálogo, tabla y cierre. Sin desbordamiento horizontal de documento en las comprobaciones móviles. Se revisaron los documentos completos en el DOM y las composiciones completas de escritorio; la pasada móvil no certifica cada sección heredada ni toda la interacción. Capturas únicamente en memoria; sin archivos gráficos de evidencia en el repositorio.
- Search Console, inspección de `/`: «La URL está en Google» y «La página está indexada». No se solicitó un nuevo rastreo porque los cambios siguen sin publicar.
- **Estado final de esta entrega: local, sin commit ni push.** La revisión automática rechazó la acción de commit/push a main porque requiere autorización explícita del usuario para el despliegue en producción. Falta esa autorización, publicar, repetir la revisión completa en vivo y solicitar indexación de la portada tras verificar la versión publicada. No se declara el trabajo publicado ni la medición resuelta integralmente.
- Pendiente de comprobación con datos nuevos: proporción de sesiones orgánicas con entrada `(not set)` y page_view por fecha, separando antes y después del despliegue. Primera revisión sugerida: 16 nov; no comparar sólo el acumulado histórico.
- Equipos: comparar consultas y landing en los 28 días siguientes; revisión sugerida 7 dic. Crear otra URL sólo si hay evidencia de intención distinta y bajo rendimiento persistente, no por un ranking aislado.
- Advertencia editorial previa detectada durante la lectura: equipos contiene cifras antiguas de ROI, precios y afirmaciones sobre otros fabricantes que requieren contraste con el propietario. Esta tarea no las valida ni las renueva.
