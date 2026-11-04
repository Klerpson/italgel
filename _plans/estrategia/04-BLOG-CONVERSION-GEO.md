# El blog trae el 53 % de las impresiones y convierte poco: plan para pasarlo a Mercato (2026-11-04)

Fuentes:
- Search Console de `https://italgel.com.co/` (Composio, cuenta `seo`), del 1 nov 2025 al 1 nov 2026; la comparación es del 2 ago al 1 nov 2026 frente al 2 may al 1 ago 2026.
- Lectura de `_posts/`, `_layouts/post.html`, `_includes/` y del rediseño Mercato (`03-DIRECCION-DISENO.md`).
- Técnicas de blog de ALMO, Tatiana Leal y Hermes Gamba (rutas abajo).

## El blog trae la mitad de las impresiones y la cuarta parte de los clics

| | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| Sitio, 12 meses | 6034 | 235 621 | 2,6 % | 7,2 |
| Blog, 12 meses | 1472 (24 %) | 125 687 (53 %) | 1,2 % | 6,5 |
| Blog, últimos 3 meses frente a los 3 anteriores | 918 frente a 527 (+74 %) | 85 514 frente a 38 050 (+125 %) | | |

El 80 % de los clics del blog llega desde el móvil. La mayoría de las consultas están en las posiciones 5 a 9. Según `redaccion-geo`, es la franja que más gana con las palancas GEO.

### Los 8 posts con más impresiones

| Post | Clics | Impr. | CTR | Pos. | Consulta con intención de compra | Producto al que debe llevar |
|---|---|---|---|---|---|---|
| emulsionantes-estabilizantes | 375 | 32 952 | 1,1 % | 6,9 | mezclas en polvo para helado suave (sin post) | `/bases-helado-colombia/`, máquinas soft |
| tipos-de-toppings | 150 | 20 542 | 0,7 % | 7,8 | — | `/coberturas-salsas-helado/`, `/variegatos-helado/` |
| como-abrir-una-heladeria | 385 | 16 082 | 2,4 % | 4,5 | "cuánto dinero necesito para abrir una heladería en Colombia" (pos. 2,3) | máquinas + vitrinas + insumos según el tipo de heladería |
| que-es-un-sorbete | 32 | 14 154 | 0,2 % | 7,6 | — | mantecadoras, bases |
| rentabilidad-heladeria | 183 | 11 418 | 1,6 % | 5,1 | "cuánto gana una heladería al mes" (sin respuesta) | máquinas |
| como-calcular-overrun | 126 | 10 005 | 1,3 % | 5,2 | — | mantecadoras Coldelite/Valmar |
| toppings-mas-rentables | 84 | 7842 | 1,1 % | 7,6 | "topping para helados al por mayor" (pos. 6,6) | coberturas, variegatos |
| pasteurizacion-mezcla | 80 | 6786 | 1,2 % | 5,5 | bases para helado pasteurizadas | pasteurizadoras, bases |

## Seis problemas del blog actual

1. **El blog sigue en el diseño viejo.** `post` hereda de `default` (`style.css`, cabecera vieja, lordicon). Cuando se publique Mercato, el lector que llega desde Google, que es la mitad del tráfico, verá otro sitio.
2. **Casi no hay salida a producto.** Los posts tienen 0–1 menciones de WhatsApp y 0–3 enlaces a categorías. El único CTA está al final, en la cabecera vieja.
3. **Los posts de toppings no llevan a nada que Italgel venda.** "Tipos de toppings" es el segundo post del blog (20 542 impresiones) y canibaliza "toppings para helados" con "toppings más rentables".
4. **E-E-A-T genérico.** El autor es "Equipo Técnico Italgel", sin persona. El "más de 15 años" de `_data/authors.yml` no tiene fuente confirmada. Solo 2 posts tienen `referencias:`.
5. **Problemas técnicos en el layout.**
   - `related-posts.html` usa `style=`.
   - Las FAQ salen dos veces (front matter y cuerpo).
   - El schema es Article sin `dateModified` visible, sin speakable, sin `citation` y sin BreadcrumbList.
   - Las categorías están dispersas en 14 etiquetas: produccion, tecnica, tecnicas-heladeria, heladeria-artesanal…
6. **Hay datos que no se verificaron.**
   - Los borradores `mantecadora-italiana-vs-asiatica`, `cuanto-cuesta-producir-helado-artesanal` y `costo-porcion-toppings` traen precios, consumos y un "estudio comparativo de Coldelite" sin fuente.
   - El borrador de la mantecadora dice "cientos de heladeros" y "40-50 % más barata a 10 años".
   - Ninguno se publica hasta que el cliente confirme las cifras.

## Qué se copia de los otros clientes

| Técnica | Dónde está | Cómo queda en Italgel |
|---|---|---|
| Resumen arriba con un CTA dentro: «si se convencen con el resumen, que puedan hacer clic» | almo `_includes/resumen.html` | Bloque «En resumen» con la fecha de actualización, «Revisado por» y el único botón sólido de la primera pantalla |
| Caja del servicio justo después del resumen | tatianaleal `_includes/servicio-en-post.html`, almo `cta-service.html` | `mercato/producto-en-post.html`: baldosa del producto o la familia, 2–3 datos de la ficha y un enlace con flecha a la categoría |
| Mensaje de WhatsApp con el tema del post | tatianaleal `boton.html` (`data-extra`), hermes `wa-texto.html` | "Vengo del artículo «H1». Me interesa {producto}." y un `data-location=post-<slug>-<posición>` |
| Enlace de WhatsApp dentro de una frase | almo `_includes/enlace-whatsapp.html` | Para los CTA en mitad del cuerpo, sin un segundo botón sólido |
| Aviso de ciudad antes del clic | tatianaleal `_includes/cta-blog.html` | "Entregamos en Bogotá, Medellín, Cali, Barranquilla y Bucaramanga; para otras ciudades, consulta el envío" (dato ya publicado en la home) |
| `referencias:`, que pinta `#fuentes` y el `citation` del schema | tatianaleal `post.html:42-67`, `schema-blog.html:73-83` | Ya existe `referencias:` en 2 posts; falta el `citation` y extenderlo |
| Speakable sobre el resumen, BlogPosting y BreadcrumbList | los tres; mejor almo `schema-article.html` | Un solo bloque de schema por post (hermes lo declara tres veces: no se copia) |
| Relacionados que priorizan el mismo producto | almo `related-posts.html` | Primero el mismo `producto_relacionado`, luego la familia |
| Fuente preferida en Google | los tres | Ya está (`fuente-preferida.html`) |

Ninguno de los tres usa citas textuales de un experto ni calculadoras en los posts. Ahí Italgel puede ir más lejos (ver los lotes 2 y 3).

## Plantilla del post en Mercato (lote 1)

Se reutilizan las primitivas que ya existen: `migas`, `indice` + `data-indice`, `medida`, `datos`, `ficha-lista`, `tabla-datos`/`tabla-desplazable`, `baldosa`, `enlace-flecha`, `banda--marca`, `punto-familia` y el flotante con invitación por página. Solo se crean las piezas que faltan.

1. **`_layouts/post.html` hereda de `mercato`.** Orden de la página:
   1. migas;
   2. H1;
   3. entradilla;
   4. bloque «En resumen» con fecha y botón;
   5. caja de producto;
   6. foto real del post;
   7. índice fijo en escritorio;
   8. cuerpo a 70 ch;
   9. FAQ visibles desde el front matter, sin acordeón y sin duplicarse en el cuerpo;
   10. fuentes;
   11. autor;
   12. relacionados;
   13. cierre verde con el CTA del tema.
2. **Color de familia por post.** La línea y el punto naranja, turquesa o rosa salen de la familia del producto relacionado (`familia:` en el front matter). Es la misma firma de la home.
3. **Front matter nuevo:**
   - `familia`, `producto_relacionado` (URL de la categoría o la ficha) y `cta_texto`;
   - `revisado_por` y `referencias`.
4. **Hubs.** Las 14 categorías se agrupan en 4 familias que coinciden con el menú:
   - máquinas y producción;
   - vitrinas y conservación;
   - variegatos e ingredientes;
   - negocio y rentabilidad.

   `/blog/` pasa a Mercato con una banda por hub.
5. **Piloto con 2 posts antes de extender:**
   - `como-abrir-una-heladeria-en-colombia`: más clics e intención de compra. La caja reutiliza `inicio.tipos` (qué necesita una heladería de gelato, de helado suave o industrial).
   - `emulsionantes-estabilizantes`: más impresiones; lleva a bases y máquinas soft.

## Contenido GEO de los 8 posts (lote 2)

Por cada post: consultas de GSC → una pregunta por H2 → primera frase citable que nombre a Italgel o el producto → cifras con fuente → cita textual del técnico.

- **emulsionantes:** separar "emulsionante" y "estabilizante" en H2 propios (las dos consultas suman 6199 impresiones). Dosis de las fichas técnicas MEC3 con enlace. Sección nueva: "Cómo elegir una mezcla en polvo para helado suave en Colombia" (unas 310 impresiones sin respuesta).
- **toppings:** decidir si se fusionan los dos posts con un 301 y se reorienta el CTA a coberturas y variegatos (Italgel no vende toppings).
- **sorbete:** reescribir el title y la description para el CTR (0,2 % en la posición 7,6). Definición citable en la primera frase.
- **rentabilidad:** las consultas "cuánto gana una heladería al mes" están en las posiciones 10–14 sin respuesta. Necesita cifras reales de clientes (`[dato]`; el caso Gurcoff en borrador puede darlas).
- **overrun:** calculadora en HTML primero. Fórmula real, ejemplo resuelto en el HTML, `<output>` que se recalcula. Es la candidata a interacción firma del blog, por `jurado-animaciones`.
- **como-abrir:** está en las posiciones 1,5–4,8; se cambia por secciones y se mide antes de extender. Requisitos con fuente oficial: Invima, Cámara de Comercio, uso de suelo, Bomberos. Los enlaces se verifican antes de publicar.
- **pasteurización y gelato:** sección "gelato frente a mantecado" (42 impresiones, posición 8,1, sin respuesta).
- **qué es el variegato:** la categoría `/variegatos-helado/` se queda con 937 impresiones de "qué es variegato" y el post solo con 251. La categoría tiene que enlazar al post con esa ancla, y el post tiene que responder en la primera frase.

## Posts nuevos para consultas sin respuesta (lote 3)

| Consulta | Impr. | Hoy rankea | Falta |
|---|---|---|---|
| cuánto cuesta una máquina de helados (9 variantes) | 213 | `/maquinas-helado-soft/`, `/equipos/` | Rangos de precio reales del cliente |
| dónde comprar / proveedores de mezclas para helado suave, gelato o yogur en Colombia (~21 variantes) | ~670 | home | Marcas y presentaciones que vende Italgel |
| donde comprar base para helado | 130 | `/bases-helado-colombia/` (pos. 11) | Reforzar la categoría antes que crear un post |

## Medición

- Línea base de 28 días antes del piloto en GA4: `whatsapp_click` por `button_location` en las URLs `/blog/`.
- Comparación a los 28 días con los mismos datos de GSC (CTR por post).
- `auditoria.py`, Lighthouse móvil, sin desborde a 390 y 320 px, y `revisor-geo` en cada post reescrito.

## Datos que hay que pedir al cliente

- `[dato]` Nombre, cargo y años de experiencia del técnico que firma o revisa los posts. Confirmar también el "más de 15 años" del autor actual.
- `[dato]` 2–3 frases textuales del técnico sobre overrun, elección de máquina y errores al abrir una heladería.
- `[dato]` Rangos de precio publicables de las máquinas soft y las mantecadoras.
- `[dato]` Cifras de los borradores: consumo en kWh, vida útil, costo de mantenimiento, garantía de 12 meses y técnicos en Bogotá, Medellín y Cali con respuesta en 24–48 h.
- `[dato]` Una cifra real de ventas o margen de un cliente (Gurcoff u otro) para el post de rentabilidad.

## Pendientes técnicos encontrados

- 19 URLs del blog indexadas con barra final faltante, `/co/blog/…` o slugs mal escritos (`que-se-un-sorbete`, `tipo-de-toppings`): revisar las redirecciones.
- El `CLAUDE.md` del proyecto nombra la skill `nuevo-post-blog`, pero `.claude/skills/nuevo-post-blog/` no existe.

## Lotes 1, 2 y 3 aplicados el 2026-11-04

- **Plantilla:** `_layouts/post.html` hereda de `mercato`. Datos en `_data/blog.yml` (3 temas y 9 productos). CSS en `_includes/mercato/articulo.css` y en el bloque `.articulo-cabecera` de `critico.css`. Includes nuevos: `relacionados.html` y `calculadora-overrun.html`. Del contenido salen el resumen, el índice y las FAQ.
- **Medición en GA4** con `data-location`:
  - `post-cabecera`, `post-destacado`, `post-medio`, `post-cierre` y `flotante`;
  - `interaccion_calculadora` en el post de overrun.

  El mensaje de WhatsApp dice: "Vengo del artículo «H1» de Italgel y quiero cotizar {producto}".
- **Schema:** BlogPosting con speakable (`#en-resumen`), `citation` desde `referencias:` e `isPartOf` Blog. El autor es una Organization. En `/blog/` va un Blog con `blogPost`.
- **`/blog/` en Mercato:** los 15 posts quedan visibles, agrupados por tema. Se quitó el "cargar más", que escondía posts con `display: none`, y también los "15 años" y "nuevos artículos cada mes" sin fuente.
- **Fusión de toppings:** "toppings más rentables" y "granelas" pasan a `/blog/tipos-de-toppings-para-helado/` con redirecciones en `_redirects/blog/`.
- **Reescritura GEO de los 15 posts publicados:**
  - fuera las anécdotas inventadas y las cifras sin fuente;
  - fuentes verificadas: Universidad de Guelph, Invima (Resoluciones 2310 de 1986, 1407 de 2022 y 2674 de 2013), Alcaldía de Bogotá, Penn State, 21 CFR y las fichas de MEC3 y Fabbri;
  - un enlace de WhatsApp en mitad del texto;
  - `keyword` en el front matter.
- **Borrador nuevo** (`published: false`): `/blog/cuanto-cuesta-una-maquina-de-helados-colombia/`, a la espera de los precios.
- **Verificado:**
  - build limpio;
  - `auditoria.py` sin problemas en `/blog/`;
  - sin desborde a 320 ni a 390 px en 8 páginas;
  - calculadora probada: 12 L → 16,8 L = 40 %, con el evento enviado una sola vez.

## Datos que hay que pedir al cliente (después de la reescritura)

- **Precios publicables:**
  - Coldelite 301 BIB, Pasmo S121 y 603 BIB;
  - Stargel 4 y Snowy 7M;
  - línea Pastomaster 200 RTX + Turbomatic;
  - vitrinas EasyBest;
  - stock inicial de insumos y mantenimiento preventivo;
  - rangos de inversión por modelo de heladería.

  Sin estos datos no se publica el post de precios y el de abrir una heladería se queda sin cifras.
- **Cifras reales de un cliente** (margen bruto y neto, ventas al mes, punto de equilibrio) para el post de rentabilidad.
- **Supergelmix:** MEC3 la publica como base para helado de fruta sin emulsionantes; el sitio la vende como base para helado soft con 60–80 % de overrun. ¿Cuál es el uso real?
- **Pasta de pistacho:** la ficha de Italgel dice 40 % de pistacho de Bronte DOP y MEC3 la publica como 100 % pistacho de Sicilia. ¿Qué referencia se vende?
- **Fichas MEC3:** temperatura de pasteurización de Base 50 y rangos de overrun de Base 50, Neutralin Plus y Supergelmix.
- **Ficha del variegato:** dosis en g/L (Quella o MEC3).
- **Equipos:** confirmar que las máquinas soft de piso piden 220 V trifásico.
- **Coberturas:** confirmar las presentaciones de 5 kg y 3 kg de Quella y Fiordi.
- **Borradores sin publicar con cifras sin fuente:** `mantecadora-italiana-vs-asiatica`, `cuanto-cuesta-producir-helado-artesanal` y `caso-exito-heladeria-gurcoff`. `costo-porcion-toppings` habla de toppings, que Italgel no vende: conviene archivarlo.
