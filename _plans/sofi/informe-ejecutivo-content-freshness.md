# Informe Ejecutivo — Auditoría y Ejecución de Content Freshness
## Italgel Colombia (italgel.com.co)

**Fecha:** 23 de septiembre de 2026
**Alcance:** Sitio completo — blog (17 posts publicados), 24 páginas de producto/categoría, 6 páginas core (home, equipos, insumos, nosotros, contacto, legal) y 4 páginas de ciudad.
**Fuentes de datos:** Google Search Console (propiedad `https://italgel.com.co/`, 16 meses de histórico: 2025-05-23 a 2026-09-20) e historial real de Git del repositorio. No se utilizó ningún dato estimado o inventado.
**Estado de este informe:** Documenta trabajo **ejecutado y verificado en el entorno de desarrollo local del sitio**. Los cambios están listos para revisión final y despliegue a producción (commit + push), que quedan a criterio del equipo técnico.

---

## 1. Resumen ejecutivo

Se realizó una auditoría de *content freshness* (frescura de contenido) sobre italgel.com.co, con el objetivo de identificar por qué el sitio no estaba comunicando correctamente a Google qué tan actualizado está su contenido, y de corregir esas fallas sin tocar precios ni reescribir el trabajo editorial ya existente.

La auditoría encontró que el problema no era la calidad del contenido — el blog y las páginas de producto están bien escritos — sino **fallas estructurales silenciosas**: una plantilla de enlazado interno que nunca se activaba, 33 páginas sin ninguna fecha de actualización en su código (lo que hacía que el mapa del sitio le mostrara a Google una fecha falsa), y varias oportunidades de responder preguntas reales que los usuarios ya están buscando en Google pero que el sitio no contestaba todavía.

Con la aprobación explícita para avanzar, se ejecutaron y verificaron en el entorno local **las dos primeras fases del plan de acción** (de tres). Todos los cambios se probaron en el sitio corriendo localmente y, en los casos donde aplicaba, se confirmaron también contra el sitio en producción. No se detectó ningún error de plantilla ni de código en el proceso.

**Importante para la revisión:** nada de esto se ha subido todavía a producción. Son cambios en el repositorio local, listos para que el equipo los revise una última vez y los despliegue cuando lo considere oportuno. El impacto real en tráfico o posicionamiento solo podrá medirse después del despliegue y de que Google vuelva a rastrear el sitio — un proceso que normalmente toma semanas, no días.

---

## 2. Objetivo de la auditoría

Google utiliza señales de "frescura" (freshness) como uno de los factores para decidir qué tan vigente es una página al momento de posicionarla, especialmente en un sitio B2B técnico como este, donde la información (fichas de producto, guías, precios de referencia) cambia con el tiempo. Si esas señales son incorrectas o inexistentes, dos cosas pueden pasar:

- Google puede subestimar la vigencia real del contenido (páginas que sí se mantienen actualizadas, pero que no lo comunican).
- Peor aún, si Google detecta que una señal de frescura es sistemáticamente falsa (por ejemplo, un mapa del sitio donde *todas* las páginas parecen "actualizarse" el mismo día, todos los días, sin que su contenido cambie realmente), puede perder confianza en esa señal para todo el dominio.

El objetivo de este trabajo fue cerrar esa brecha: hacer que las señales de frescura que el sitio le da a Google —fechas, datos estructurados (schema), enlazado interno— reflejen la realidad del contenido, y aprovechar la revisión para cerrar brechas de contenido reales detectadas contra búsquedas que los usuarios ya están haciendo hoy.

Todo el trabajo se hizo bajo dos restricciones explícitas del proyecto, respetadas en su totalidad: **no tocar ni inventar precios**, y **usar únicamente datos reales** (nunca estimaciones o cifras hipotéticas).

---

## 3. Qué se encontró y qué se corrigió

### 3.1 Enlazado interno entre posts del blog — no funcionaba

**Qué se encontró:** el bloque "Temas relacionados que te pueden interesar", que debía aparecer al final de cada post del blog, nunca se mostraba en ninguno de los 17 posts publicados. La causa era un error en la plantilla: comparaba un campo (`tags`) que ningún post tiene definido, en lugar del campo que sí usan todos los posts (`categories`).

**Qué se corrigió:** se ajustó la plantilla para que compare por `categories`. No fue necesario modificar el contenido de ningún post.

**Por qué importa:** el enlazado interno entre contenido relacionado es una de las formas más simples y efectivas de repartir autoridad dentro de un sitio y de ayudar a Google (y a los propios usuarios) a descubrir contenido relacionado. Con 17 posts publicados, esta función estuvo inactiva desde que existe el blog. Se espera que, una vez en producción, esto empiece a reforzar gradualmente a los posts que hoy reciben menos visibilidad — es un efecto que se acumula con el tiempo, no un cambio inmediato.

### 3.2 Ninguna página de producto o institucional comunicaba su fecha real de actualización

**Qué se encontró:** 33 páginas del sitio (las 6 páginas core, las 10 páginas de categoría, 12 fichas de producto activas, 4 páginas de ciudad y la página del blog) no tenían ningún campo de fecha en su código. Esto provocaba que el mapa del sitio (`sitemap.xml`) le reportara a Google, para todas ellas, la fecha del último build del sitio completo — **no la fecha real del último cambio de cada página** — cada vez que se publicaba cualquier cosa en cualquier parte del sitio. Es, literalmente, una señal de frescura falsa.

**Qué se corrigió:** se agregó a cada una de esas 33 páginas su fecha real de última modificación, obtenida directamente del historial de Git del repositorio (no la fecha de hoy, ni una fecha estimada). Se verificó que el mapa del sitio ya refleja estas fechas reales y variadas.

**Por qué importa:** esto reemplaza una señal falsa por una señal real y verificable. Adicionalmente, esta misma fecha ahora alimenta los datos estructurados (ver punto siguiente), lo que refuerza la señal en dos lugares a la vez.

### 3.3 Datos estructurados (schema.org) sin fecha de actualización en páginas comerciales

**Qué se encontró:** ninguna página de producto, categoría o institucional tenía en su código el marcado de datos estructurados que le indica a Google cuándo se actualizó esa página (`dateModified`). Solo los posts del blog lo tenían.

**Qué se corrigió:** se agregó ese marcado a todas las páginas que no son posts ni la página de inicio, usando las fechas reales del punto anterior.

**Hallazgo adicional encontrado en el proceso:** la página de Aviso Legal estaba recibiendo, por un error de configuración, el mismo tipo de marcado que un artículo del blog — incluyendo una fecha de publicación vacía, que no es válida. Se corrigió para que reciba el marcado correcto de página institucional.

**Por qué importa:** son señales adicionales, complementarias al mapa del sitio, que refuerzan ante Google la fecha real de cada página. El error de la página legal, además, era un dato inválido en la información estructurada del sitio que ya no está presente.

### 3.4 Preguntas frecuentes: brechas reales contra búsquedas que ya existen

**Qué se encontró:** cruzando el contenido del sitio contra las búsquedas reales registradas en Search Console, se identificaron dos tipos de brecha:

- La página `/equipos/` — la segunda página con más clics de todo el sitio (390 clics en 16 meses) — no tenía ninguna sección de preguntas frecuentes, a pesar de posicionar justo en el rango (posición 9-10) donde este tipo de contenido suele ayudar a ganar visibilidad adicional en Google. La página `/insumos/` tampoco tenía.
- Tres páginas ya tenían preguntas frecuentes, pero ninguna respondía la pregunta de mayor volumen de búsqueda real para esa página específica (por ejemplo, la página de variegatos recibe 442 impresiones para la búsqueda "variegato que es", y ninguna de sus preguntas frecuentes existentes definía qué es un variegato).

**Qué se corrigió:** se agregaron preguntas frecuentes nuevas y puntuales en las cinco páginas señaladas. En todos los casos, **las respuestas se construyeron únicamente con información que ya estaba publicada en esa misma página** — no se agregó ningún dato, cifra o afirmación nueva que no existiera antes en el sitio.

**Por qué importa:** este tipo de contenido ayuda a que Google entienda con mayor precisión qué responde cada página, y en páginas que ya rankean cerca de la primera página de resultados, puede mejorar la probabilidad de aparecer con un resultado enriquecido (por ejemplo, un fragmento destacado). Es una mejora de probabilidad, no una garantía, y su efecto solo se podrá observar después de que Google vuelva a indexar estas páginas.

### 3.5 Dos páginas del sitio compitiendo por la misma búsqueda ("canibalización")

**Qué se encontró:** el hub de variegatos y el post del blog dedicado a explicar qué es un variegato estaban, sin coordinación, compitiendo parcialmente por la misma intención de búsqueda, sin que ninguna de las dos la capturara con claridad.

**Qué se corrigió:** se le dio al hub una definición corta y directa (la pregunta frecuente del punto anterior) y se completó el enlace cruzado entre ambas páginas en los dos sentidos, para que cada una tenga un rol claro: el hub responde rápido, el post profundiza.

**Por qué importa:** ayuda a que Google entienda la relación entre ambas páginas en lugar de verlas como contenido redundante o en competencia.

### 3.6 Enlace interno reforzado en una ficha de producto sub-enlazada

Se identificó que la ficha de producto de Amarena Fabbri solo recibía un enlace contextual real desde el resto del sitio, a pesar de que existe un post del blog dedicado enteramente a ese producto. Se agregó un segundo enlace natural desde ese post. Otras páginas mencionadas en el diagnóstico original como "menos prioritarias" no se tocaron, para no agregar enlaces sin un criterio claro detrás.

### 3.7 Verificaciones que confirmaron que dos hallazgos del diagnóstico ya estaban resueltos

Como parte del proceso de ejecución, cada hallazgo del diagnóstico se verificó contra el código real y, cuando fue posible, contra el sitio en producción, antes de aplicar cualquier cambio. Esto permitió confirmar que dos de los puntos identificados **no requerían ninguna acción**:

- La redirección de una URL antigua (`insumos-heladeria-medellín`) hacia la versión correcta ya existía desde marzo de este año y funciona correctamente en producción.
- Una URL de un documento interno de estrategia que quedó indexada en Google en el pasado (`/plans/plan-e-e-a-t-italgel/`) se confirmó que hoy devuelve un error 404 real (no un error "silencioso" que Google pudiera confundir con contenido válido). Se corrigió además un comentario desactualizado en el archivo `robots.txt` que ya no describía correctamente cómo se maneja esta situación.

Queda pendiente, y **esto sí requiere una acción manual de la usuaria en Google Search Console** (no es algo que se pueda ejecutar desde el código): solicitar la eliminación de esa URL del índice de Google para acelerar su salida definitiva.

---

## 4. Hallazgo relevante que queda pendiente de una decisión de negocio (no técnica)

Durante la verificación de la sección 3.6 se descubrió que dos páginas de producto, completas y bien escritas (comparativa de bases MEC3 y diferencia entre variegato y salsa), **nunca han sido publicadas** en el sitio — llevan meses listas pero marcadas como borrador. No se trata de un error técnico que haya que corregir: es una decisión editorial que le corresponde tomar al negocio.

Se identificaron dos condiciones que deben resolverse antes de publicarlas, independientemente de la decisión:

1. Una de las dos páginas incluye una tabla con precios y márgenes de referencia en pesos colombianos que deben ser validados como vigentes antes de publicar — no se tocaron ni se verificaron, por estar fuera del alcance de esta auditoría.
2. Ambas páginas hacen referencia a tres imágenes que no existen en el repositorio actual; deberían incorporarse antes de publicar, sin importar cuál sea la decisión final.

No se realizó ningún cambio sobre estas dos páginas.

---

## 5. Qué no se tocó (alcance respetado)

- **Precios:** no se revisó, sugirió ni modificó ningún precio en ninguna página del sitio, en ningún momento de este trabajo.
- **Contenido editorial:** no se reescribió ni se modificó ningún párrafo de contenido existente. Los únicos cambios de contenido visible son las preguntas frecuentes nuevas descritas en la sección 3.4, y en todos los casos se reutilizó información que ya estaba publicada — no se redactó ninguna afirmación nueva sin respaldo en el propio sitio.
- **La Fase 3 del plan de acción** (un ciclo de actualización de contenido para las páginas con caída de tráfico detectada, una revisión de título/descripción de un post específico por bajo CTR, y un ajuste pendiente en un borrador antes de publicarlo) no se ejecutó — queda para una siguiente etapa, cuando el negocio decida priorizarla.

---

## 6. Estado de verificación y despliegue

Todos los cambios se probaron sirviendo el sitio en un entorno de desarrollo local y navegándolo directamente (no solo revisando el código): se confirmó que el mapa del sitio muestra las fechas correctas, que el enlazado entre posts ya funciona, que las preguntas frecuentes nuevas aparecen y que los datos estructurados se generan sin errores. No se detectó ningún error de plantilla en ninguna página del sitio durante todo el proceso.

En total, el trabajo de esta entrega involucró **83 archivos del repositorio**, todos ellos ajustes de configuración, de una plantilla, de datos estructurados o de front matter (metadatos), y ninguno de contenido editorial existente.

Ninguno de estos cambios ha sido subido a producción todavía. Están listos en el repositorio local para que el equipo los revise una última vez y decida cuándo desplegarlos.

---

## 7. Impacto esperado

Con la debida cautela: las correcciones de esta entrega son, en su mayoría, correcciones de señales técnicas (fechas, datos estructurados, enlazado interno) y cierre de brechas de contenido puntuales. Este tipo de trabajo típicamente **no produce un cambio inmediato ni garantizado** en tráfico o posicionamiento — su efecto depende de que Google vuelva a rastrear e indexar las páginas afectadas, un proceso que puede tomar entre varias semanas y un par de meses.

Lo que sí se puede afirmar con certeza, porque fue verificado directamente:

- El sitio ya no envía a Google una señal de fecha falsa en 33 páginas.
- El enlazado interno automático entre posts, inactivo desde siempre, ya funciona.
- Un error de datos estructurados inválidos (en la página legal) ya no existe.
- Cinco páginas de alto tráfico o alto volumen de búsqueda real ahora responden preguntas que antes no respondían.

Lo razonable es esperar una mejora gradual en la calidad de las señales que Google recibe del sitio, y una mejor oportunidad de que ciertas páginas (en particular `/equipos/`, por su volumen y posición actual) gane visibilidad adicional en resultados enriquecidos. Cualquier cifra de mejora en tráfico o posición debe medirse después del despliegue, comparando Search Console antes y después, y no se debe prometer un porcentaje o plazo específico sin esa medición real.

---

## 8. Próximos pasos recomendados

1. Revisión final del equipo técnico sobre los 83 archivos modificados, y despliegue a producción (commit + push) cuando se apruebe.
2. Decisión de negocio sobre las dos páginas sin publicar (sección 4), incluyendo la validación de los precios de referencia y la incorporación de las imágenes faltantes si se decide publicarlas.
3. Solicitar en Google Search Console la eliminación de la URL interna indexada por error (sección 3.7).
4. Definir cuándo abordar la Fase 3 del plan de acción (ciclo de actualización de contenido en páginas con caída de tráfico).
5. Una vez desplegado, monitorear Search Console durante 4 a 8 semanas para medir el impacto real de estos cambios antes de sacar conclusiones sobre su efectividad.
