# Diagnóstico SEO de italgel.com.co (4 nov 2026)

**Fuentes:** Search Console (propiedad `https://italgel.com.co/`, 4 ago – 1 nov 2026 frente a 6 may – 3 ago 2026), inspección de URL de GSC, `crawl-seo.py` sobre el sitio publicado (59 URL), `auditoria.py` sobre el build local, Ubersuggest Colombia (`locId 2170`) para cafeteras y el [análisis Ranki del 11 jul](../analisis-ranki-2026-07-11.md).
**Límites:** sin Core Web Vitals de campo ni backlinks en esta pasada. Las cifras de Ubersuggest son estimaciones mensuales.

## 1. Clics +39 % en 90 días, pero el 54 % de las impresiones viene del blog

| Periodo | Clics | Impresiones | Posición media |
|---|---|---|---|
| 6 may – 3 ago 2026 | 2.193 | 80.600 | ~7,2 |
| 4 ago – 1 nov 2026 | 3.057 | 154.266 | ~7,3 |

Por mes: mayo 625 clics, julio 953, agosto 1.070, octubre 1.005. El crecimiento se frenó en septiembre.

- El blog suma unas 84.000 impresiones (54 %) y unos 900 clics (29 %). Lo que más trae: emulsionantes (22.566 impr.), tipos de toppings (16.610) y sorbete (12.569 impr., 29 clics, CTR 0,2 %).
- Las páginas comerciales están casi todas entre la posición 6 y la 10. Según la evidencia GEO y la de CTR, es la franja donde un cambio da más resultado.
- El rastreo del sitio publicado sale limpio: 59 URL, todas 200, indexables, con canonical, `lang="es-CO"`, JSON-LD y title/description dentro de rango. El único aviso es `/cafes-de-colombia-expo/`, que no tiene enlaces internos.

## 2. Cafeteras Hambach: 11 URL publicadas el 26 oct sin una sola impresión

- `/equipos-cafe/`: **"Descubierta: actualmente sin indexar"**. Google la conoce por `/pastas-sabores-helado/pastas-premium/` y el sitemap, pero no la ha rastreado.
- `/equipos-cafe/tank-2/`: **"Google no reconoce esta URL"**.
- En 90 días no hay ni una consulta de café, cafetera o molino en GSC.

Demanda que se está perdiendo (Ubersuggest Colombia, volumen mensual, dificultad SD):

| Keyword | Vol. | SD | Página destino |
|---|---|---|---|
| máquina de café espresso | 1.300 | 8 | `/equipos-cafe/` |
| cafetera industrial | 720 | 13 | `/equipos-cafe/` y Tank 1, Tank 2, Cruiser |
| molino de café eléctrico | 1.600 | 9 | Oak 60, Ebony 64 (la intención es mixta: también doméstica) |
| molino de café industrial | 170 | 9 | Sequoia 74WT, Ebony 64 |
| cafetera industrial para negocio | 70 | 33 | Cruiser |

**Acciones**
1. **Tú, en GSC:** "Solicitar indexación" para `/equipos-cafe/` y las 10 fichas. La API no lo permite y la Indexing API de Google no aplica a este tipo de página. IndexNow (workflow `indexar-clientes`, italgel ya está en `sitios.txt`) solo avisa a Bing y Yandex.
2. Enlaces en el cuerpo, con la keyword de destino, desde las páginas que Google rastrea a diario: home, `/equipos/` y `/nosotros/`. Hoy Swan, Tank 1 y los molinos Cedar, Ebony y Oak tienen entre 4 y 6 enlaces entrantes; las demás fichas, 57.
3. Un enlace externo real a `/equipos-cafe/`, si existe: la página de distribuidores de Hambach o el listado de expositores de Cafés de Colombia Expo. `PENDIENTE`: confirmar con el dueño que existen.

## 3. Schema: reseñas 4,9/200 sin fuente y fichas sin `offers`

**3.1 Valoración 4,9 con 200 reseñas.** [_includes/trust-signals.html](../../_includes/trust-signals.html) publica un `AggregateRating` sobre la propia empresa. La cifra 200 coincide con el "+200 heladerías" que ya se retiró por no estar confirmado ([mensaje-propietario-datos.md](mensaje-propietario-datos.md) §8). Google lo detectó como "Fragmentos de reseñas" en `/equipos/` y en la ficha Coldelite (rastreos del 27 y 29 oct, antes de la migración a Mercato). En el build actual solo lo lleva `/cafes-de-colombia-expo/`, que usa el layout `default`. Las reseñas que una empresa publica sobre sí misma van contra las directrices de datos estructurados de Google, y además el dato no está confirmado. **Acción:** quitar ese JSON-LD.

**3.2 `Product` sin `offers`.** La ficha Coldelite Compacta 3 da el error "Debe especificarse offers, review o aggregateRating", y el resto de fichas de [_layouts/producto.html](../../_layouts/producto.html) tiene el mismo esquema. Sin ese campo, las fichas no pueden salir con fragmento de producto. La única salida honesta es un precio publicado ("desde $PENDIENTE") para generar `offers`. Ya está pedido al dueño (precios de máquinas); mientras no llegue, el error se queda y no penaliza.

## 4. `/equipos/` recibe 20.255 impresiones de "máquina de helados" en la posición 9,6

Google eligió `/equipos/` para la consulta principal del negocio, pero la tiene al borde de la primera página.

| Consulta | Clics | Impr. | Pos. | Sección que la responde | Estado |
|---|---|---|---|---|---|
| maquina de helados | 20 | 2.551 | 9,8 | H1 "Máquinas para hacer helado…" | débil: el H1 no usa la forma que se busca |
| maquina para hacer helados | 13 | 1.676 | 10,1 | H1 | cubierta |
| máquina de helados para negocio | 8 | 628 | 10,1 | — | falta |
| máquina de helados para negocio precio | 0 | 203 | 9,5 | — | falta (sin precio publicado) |
| maquina de helados de crema | 1 | 271 | 12,6 | — | falta |
| máquinas para hacer helados de crema en colombia | — | 147 | 9,9 | — | falta |
| máquina para hacer helados industrial | 5 | 235 | 7,1 | enlace a industrial | cubierta |

**Acciones** (página mía, layout `contenido`)
1. Title: "Máquinas de helado para negocio en Colombia | Italgel" (54 caracteres). La description mantiene "máquinas para hacer helado".
2. H1 con "máquinas de helado para negocio". H2 que respondan "¿Qué máquina de helados de crema necesita tu negocio?" y "¿Cuánto cuesta una máquina de helados para negocio en Colombia?", este último con rango de precio `PENDIENTE` o, si el dueño no lo publica, con lo que define el precio (capacidad, litros/hora, marca) y el CTA de cotización.
3. Desde el blog, enlazar a `/equipos/` con el texto "máquinas de helado para negocio".

## 5. `/maquinas-helado-soft/` le quita a `/equipos/` las consultas de precio

10.766 impresiones en la posición 9,7. Las dos páginas reciben impresiones para las mismas consultas genéricas y ninguna termina arriba:

| Consulta | `/equipos/` | `/maquinas-helado-soft/` |
|---|---|---|
| maquina de helados | pos. 9,8 (2.551 impr.) | pos. 20,1 (204) |
| maquina de helados precio | pos. 17,9 (99) | pos. 15,7 (106) |
| máquina de helados para negocio precio | pos. 9,5 (203) | pos. 9,7 (121) |
| máquina de helados de crema precio colombia | — | pos. 8,2 (131) |

**Acciones**
1. Soft se queda con lo suyo: "helado suave" (176 impr., pos. 12,7) y "helado blando" como H2/H3, "máquinas de helado suave usadas" (75 impr.) y "15–18 litros" (73 impr.) en la ficha Coldelite.
2. En soft, el término genérico "máquina de helados" se enlaza a `/equipos/` y no se usa en el H1 ni en el title.

## 6. Vitrinas, variegatos y bases están entre la posición 6 y la 10 con un CTR del 0,6 al 3 %

- **`/vitrinas-congeladores/`** (3.316 impr., pos. 6,9, CTR 3,2 %). Todas las variantes de vitrina están en las posiciones 6-8: "vitrina para helados pequeña" (42), "exhibidor de helados" (27), "vitrina congelador para helados" (24) y "vitrinas para helados usadas" (23). Van como H3 o en los alt donde sean verdad. En julio, Ranki ya marcó la caída de "vitrina de helados" del 2 al 6.
- **`/variegatos-helado/`** (1.269 impr., 7 clics). El 85 % de sus impresiones son "qué es variegato" (pos. 9,6), mientras que `/blog/que-es-el-variegato-para-helado/` solo tiene 29. Google prefiere la categoría para la definición. Hay que decidir qué URL responde: la categoría abre con una definición de una frase y enlaza al post con el texto "qué es el variegato", o el post se refuerza y la categoría deja de responderlo. El post es de la sesión del blog.
- **`/bases-helado-colombia/`** (2.598 impr.). "base para helados" está en la posición 10, "base para helado suave" (93) en la 15,5 y "crema base para helados" en la 24,6. En cambio, "base italiana para helados" va en la 4,2. Falta un H2 sobre la base para helado suave o soft, pero antes hay que resolver la contradicción de Supergelmix (soft o fruta, §7 del mensaje al dueño).

## 7. Unas 12.000 impresiones buscan productos que Italgel no vende

| Intención | Consultas | Clics | Impr. | Dónde cae |
|---|---|---|---|---|
| Toppings | 273 | 42 | 9.705 | `/blog/tipos-de-toppings-para-helado/` |
| Helado listo o al por mayor ("venta de helados al por mayor en cali", "proveedores de helados para negocio") | 123 | 34 | 2.552 | `/equipos/`, Cali, `/nosotros/` |
| Sorbete | 167 | 6 | 6.892 | post del sorbete |

- La canibalización de toppings que señaló Ranki ya está resuelta: `/blog/toppings-para-helado-mas-rentables/` redirige al post de tipos.
- Estas consultas no se persiguen. Las páginas que las reciben dejan claro que Italgel vende **insumos y máquinas para fabricar el helado** y llevan un puente a lo que sí vende: coberturas y salsas Quella, variegatos y bases. En Cali y `/nosotros/` se puede usar una frase del tipo "¿Buscas helado al por mayor? Con una base MEC3 lo produces en tu propio local", para que el visitante se identifique y siga.

## 8. Las 4 páginas de ciudad convierten mejor (CTR 4-6 %) y tienen solo 2-4 enlaces entrantes

| Página | Clics | Impr. | Pos. | Enlaces entrantes | Palabras |
|---|---|---|---|---|---|
| `/insumos-heladeria-medellin/` | 173 | 2.985 | 8,6 | 4 | 539 |
| `/insumos-heladeria-cali/` | 137 | 3.211 | 10,6 | 3 | 871 |
| `/insumos-heladeria-barranquilla/` | 90 | 1.766 | 10,2 | 3 | 843 |
| `/insumos-heladeria-bucaramanga/` | 85 | 1.483 | 9,1 | 2 | 786 |

**Acciones**
1. Enlazarlas desde `/insumos/` (un bloque "Insumos para heladería en tu ciudad") y desde el pie.
2. Medellín es la que más clics da con menos texto: hay que ampliarla y añadir la keyword en el alt de una foto donde sea verdad (lo avisa `auditoria.py`).

## 9. Pendientes técnicos menores

- `/cafes-de-colombia-expo/`: no tiene enlaces internos, tiene 3 enlaces wa.me sin `data-location`, no tiene `keyword` y lleva el `AggregateRating`. `PENDIENTE`: fecha del evento. Si ya pasó, se pone `noindex` o se convierte en página de cafeteras.
- URL inexistentes que reciben impresiones: `/co/blog/emulsionantes-…/`, `/blog/como-calcular-overrun-helado-artesanal-guide/` y `/cobertura-salsas-helado/` dan 404, con 1-2 impresiones cada una. Solo se justifica un `redirect_from` en `/cobertura-salsas-helado/` (error de escritura plausible).
- Deuda CSS heredada (reglas del proyecto, no posicionamiento): 13 archivos CSS sin `@layer` (`boton.css`, `cafe.css`, `cards.css`, `header.css`, `nav.css`, `pages.css`, etc.), 30 atributos `style=` y 62 clases o variables sin uso, según `auditoria.py`.

## 10. Orden de trabajo

| # | Acción | Responsable | Esfuerzo |
|---|---|---|---|
| 1 | Solicitar indexación de las 11 URL de café en GSC | Usuario | 10 min |
| 2 | Quitar el `AggregateRating` de `trust-signals.html` | Esta sesión | 5 min |
| 3 | Enlaces en el cuerpo hacia `/equipos-cafe/` y las fichas con menos enlaces | Esta sesión | 1 h |
| 4 | `/equipos/`: title, H1 y dos H2 (crema y precio) | Esta sesión | 2 h |
| 5 | `/maquinas-helado-soft/`: soltar lo genérico y quedarse con suave, blando y usadas | Esta sesión | 1 h |
| 6 | Enlazar las páginas de ciudad desde `/insumos/` y el pie; ampliar Medellín | Esta sesión | 2 h |
| 7 | Vitrinas: variantes en H3 y alt | Esta sesión | 1 h |
| 8 | Variegato: decidir qué URL responde "qué es" | Sesión del blog | — |
| 9 | Puentes desde toppings y sorbete hacia coberturas, variegatos y bases | Sesión del blog | — |
| 10 | Precios "desde", Supergelmix y enlace de Hambach | Dueño (mensaje-propietario-datos.md) | — |

Medición: comparar los 28 días siguientes a cada cambio con los 28 anteriores, por página, en GSC.
