# Auditoría de contenido y keywords del rediseño (2026-11-04)

Fuentes:
- Search Console, propiedad `https://italgel.com.co/`, del 1 nov 2025 al 1 nov 2026: 6034 clics, 235 621 impresiones, posición media 7,2.
- Ubersuggest, Colombia (`locId 2170`).

## Keyword por página del primer lote

| Página | Keyword | Por qué |
|---|---|---|
| `/` | máquinas de helado e insumos para heladería | Conserva "insumos para heladería" (posición 2–5, la fuente de los clics de la home) y suma máquinas, que tienen 19 406 impresiones en posición 10,4 |
| `/equipos-cafe/` | cafeteras espresso | 0 impresiones en GSC. Ubersuggest: "cafetera espresso" 3600/mes, "cafetera industrial" 720, "molino de cafe electrico" 1600 |

**Regla anticanibalización:** "máquina de helados" (3025 impresiones) es de `/equipos/`. La home la enlaza con el ancla "Ver todas las máquinas de helado" y no la usa como keyword exacta.

## Consultas de la home que el texto nuevo responde

| Consulta | Clics | Impr. | Pos. | Sección |
|---|---|---|---|---|
| distribuidora de insumos para heladería | 34 | 385 | 3,0 | Etiqueta del hero + description |
| insumos para heladerias | 30 | 267 | 4,7 | H1 + H2 "Bases, pastas y coberturas…" |
| insumos para helados bogotá | 28 | 267 | 2,0 | Garantía de entregas (ciudades) |
| máquina de helados para negocio | 10 | 868 | 10,2 | H2 "Máquinas de helado para negocio…" |
| vitrina para helados | 4 | 145 | 7,7 | H2 "Vitrinas para helado EasyBest…" |

## Datos inventados o sin fuente que se retiraron

- **Notificaciones de compras falsas** (`js/app.js`, en todas las páginas): mensajes al azar como "Máquina soft comprada en Villavicencio" o "Toppings premium comprados en Sincelejo". **Eliminadas del sitio entero.**
- **Testimonios de la home anterior:**
  - Ana Martínez y Roberto Gómez tenían el texto idéntico.
  - El de "Julian Franco – GurCoff" sale de un caso con `published: false`.
  - No se usan en el diseño nuevo. Siguen en `_includes/testimonials.html` y en 6 páginas heredadas.
- **Cifras de la home anterior que no se reutilizan:** "+200 heladerías", "hasta 40 % menos costo" y "25–40 % más rendimiento".
- **Granelas y toppings:**
  - `/granelas-decoracion/` se retira con redirección a `/variegatos-helado/` (cuesta 7 clics al año).
  - Se quitaron del menú y de `/insumos/`.
  - En 5 posts se quitaron los enlaces y las frases que ofrecían un catálogo de granelas.

## Pendientes para el cliente

- `[confirmar]` el plazo de entrega de "72 horas" (en la home queda marcado como `.pendiente`).
- `[confirmar]` el horario de atención. El pie heredado dice L–V de 8:00 a 17:00; el cierre heredado dice L–V de 8:00 a 18:00.
- `[confirmar]` el sello de marca por categoría: soft = Coldelite; mantecadoras = Coldelite y Valmar; industrial = Valmar.
- `[confirmar]` si `mantecadora-valmar-gelato.avif` es una foto real o un render.
- `PENDIENTE` rangos de precio reales de las máquinas: hay unas 1600 impresiones al año de consultas "…precio" sin respuesta.

## Para lotes siguientes (datos de GSC)

- `/maquinas-soft/` sigue indexada (901 impresiones): redirigirla a `/maquinas-helado-soft/`.
- `/insumos-heladeria-medell%C3%ADn/` duplica a `/insumos-heladeria-medellin/`.
- `/2024/06/11/hello-world/` y `/plans/plan-e-e-a-t-italgel/` están indexadas.
- `/equipos/` le gana a `/maquinas-helado-industrial/` sus propias consultas: quitar "industrial" del title y el H1 de `/equipos/`.
- `/variegatos-helado/` recibe consultas de "qué es variegato" (unas 1000 impresiones, 0 clics). Separar intenciones con el post `/blog/que-es-el-variegato-para-helado/`.
