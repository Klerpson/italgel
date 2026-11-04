# Dirección "Mercato italiano" sobre el modelo de catálogo limpio (2026-11-04)

Decisiones del usuario:
- paleta "Mercato italiano";
- los colores del logo, solo como puntos estratégicos ("si no, satura");
- un fondo distinto en cada sección, sin crema plano;
- maquetación tomada de la plantilla de catálogo tipo Michelie que envió el usuario.

Prioridad del cliente: máquinas de helado → cafeteras Hambach → vitrinas → variegatos. Italgel **no** vende toppings ni helados listos.

## Tokens (`_includes/mercato/critico.css`)

| Rol | Valor | Uso |
|---|---|---|
| Fondo | `#FFFFFF` | hero, marcas, variegatos, garantías |
| Papel | `#F3F1EC` | panel del hero, máquinas, insumos, blog, baldosas |
| Verde botella | `#1F3B33` (texto marfil `#EDE8DC`) | café Hambach y cierre |
| Mantequilla | `#F6EBC8` | vitrinas y guía de cafeteras |
| Verde WhatsApp | `#25D366` con texto `#111B21` (contraste 8,8) | único botón sólido y flotante (recomendado frente al rosa del logo el 2026-11-04; pendiente de visto bueno) |
| Naranja del logo | `#C37033` | línea de familia de máquinas y menú activo |
| Turquesa del logo | `#6BB1BA` (texto `#2B6B73`) | línea y etiqueta de vitrinas |
| Rosa del logo | `#D36576` (texto `#A14D59`) | línea y etiqueta de variegatos |

**Tipografía:** Bodoni Moda (títulos), la tipografía de Bodoni, de Parma, y DM Sans (texto). Las dos van autoalojadas en woff2 variable (`/fonts/`, 46 KB y 36 KB). Fraunces se descartó porque el detector de Impeccable la marca como fuente sobreusada.

**Formas:** esquinas de 2 px y sin sombras, salvo el flotante. Las fotos de catálogo se funden sobre el papel con `mix-blend-mode: multiply`.

## Del modelo a Italgel

| Modelo | Italgel | Archivo |
|---|---|---|
| Hero panel gris con foto | Panel papel: H1 + diferencial + CTA + microgarantía; foto real de máquinas Coldelite (debajo en móvil) | `index.html` |
| Franja de logos | Marcas de `_data/marcas.yml` en gris | `index.html` |
| Foto grande + 2 fichas | Foto de mantecadora + 3 baldosas con sello de marca | `_data/inicio.yml` → `maquinas` |
| Bloque en espejo | Vitrinas EasyBest: ficha técnica en lista (8, 12 y 18 bandejas) + foto | `inicio.vitrinas` |
| "Deal of the week" | Banda verde de café Hambach, sin precio ni cuenta regresiva | `inicio.cafe` |
| Grilla de 4 productos | Variegatos en cubeta sobre papel | `inicio.variegatos` |
| Franja de garantías | 3 garantías con datos confirmados (`.pendiente` donde falta) | `index.html` |
| Blog en 3 tarjetas | 3 guías publicadas | `inicio.blog` |
| Pie mínimo centrado | Marca, contacto de `_config.yml`, menú y legales | `_includes/mercato/pie.html` |

**Qué no se copia:** precios, descuentos, estrellas, cuenta regresiva, carrito, botón negro, barra promocional, texto sobre la foto y flechas de carrusel. Todo eso sería inventado o propio de una tienda.

## Arquitectura

- **Layout `mercato`:** `_layouts/mercato.html`, con `mercato: true` en su front matter.
  - `head.html` elige el CSS: crítico en línea más `css/mercato.css` asíncrono.
  - Las páginas heredadas siguen con `style.css` hasta que se migren.
- **Capas:** `reset, tokens, base, primitivas, componentes, utilidades`.
- **Includes** en `_includes/mercato/`: cabecera, pie, flotante, botón, baldosa, migas y ficha de café.
- **JS:**
  - `js/mercato.js`: la barra secundaria se oculta al bajar.
  - `js/canales.js`: el flotante se oculta sobre `[data-hero]` y mide los clics de WhatsApp.

## Medido el 2026-11-04 (local)

- `auditoria.py`: cero problemas en `/` y `/equipos-cafe/`; cero `style=`.
- Lighthouse móvil: 100 en accesibilidad, buenas prácticas y SEO en las dos páginas.
- LCP de 972 ms (móvil, CPU 4×, 4G) y CLS de 0.
- Sin desborde a 390 ni a 320 px.

## Correcciones del usuario aplicadas el 2026-11-04 (segundo lote)

- **Botón de WhatsApp:** degradado de verdes (`#25D366` → `#1FBF5B` → `#17A84F`, texto `#06301A`). Al pasar el cursor el degradado se corre al verde hondo, un brillo cruza el botón y el ícono timbra. Nunca pasa a negro.
- **Firma de marca con los colores del logo:**
  - las tres bolas en las etiquetas generales;
  - una bola por familia: naranja = máquinas, turquesa = vitrinas, rosa = variegatos;
  - franja tricolor bajo el hero, en la foto de producto y sobre el pie;
  - las tres bolas a gran escala en el cierre (`.banda--marca`);
  - la línea de cada garantía en un color.
- **Sin acordeones ni desplegables en el contenido:** todo se ve sin otra acción. Las tarjetas de catálogo muestran nombre (H3), resumen y datos clave, y llevan a la página del producto.
- **Página de producto** (`_layouts/producto.html`):
  - hero con foto, lema y descripción del fabricante, datos clave y CTA;
  - índice de secciones fijo;
  - ficha técnica visible;
  - comparativa con los modelos hermanos, con la fila actual marcada;
  - otros modelos y cierre;
  - schema Product.
- **Menú:** en escritorio, cada categoría abre un top 5 de productos con página propia y un "ver más". En táctil, la categoría lleva directo a su página.
- **Índice de página** (`.indice`): marca la sección que se está leyendo.
- **Espacio negativo:** se amplió entre tarjetas, filas de tabla y garantías.
- **Flotante:** invitación con texto propio por página, una vez por sesión durante 8 s y con dos pulsos. Luego queda el ícono, y el texto vuelve con el cursor o el foco.
- **Imágenes:** salen de los catálogos originales recuperados del historial de git (`catalogos/`, commit efde767).
  - El catálogo de cafeteras trae 1 foto por modelo.
  - El de molinos suma la foto de las muelas.
  - Hambach no tiene sitio oficial con más fotos; las de marketplaces no se usan por derechos.
- **Marca de los molinos:** el catálogo de molinos no dice Hambach, así que no se les atribuye esa marca.

## Migración del resto del sitio (2026-11-04, tercer lote)

- **Layouts:** `main`, `categories`, `products` y `general` heredan de `_layouts/contenido.html` (sobre `mercato`). Este layout pone migas, hero de conversión (h1, intro, hero, CTA y microgarantía), el contenido y el cierre verde. Con eso migran 31 páginas de una vez.
- **Blog:** el índice usa `main-legado` (copia del `main` anterior) y los posts siguen con `default`. Los lleva otro chat.
- **Contenido heredado:** va dentro de `.contenido-legado` y lo re-estiliza `_includes/mercato/legado.css`:
  - tarjetas sobre papel con la línea del color de la familia;
  - cifras con borde de color del logo;
  - botones del contenido convertidos en enlaces con flecha (el único botón sólido es el del hero y el del cierre);
  - tablas desplazables en móvil y FAQ visibles.
- **PQR de /contacto/:** sus variables antiguas apuntan a los tokens nuevos (`_includes/mercato/pqr.css`). `js/app.js` se carga solo con `pqr: true`.
- **Limpieza:**
  - 45 atributos `style=` y los íconos Lordicon;
  - 30 testimonios con nombre, retirados hasta que el dueño los confirme;
  - los includes de testimonios, credenciales, experiencia, Lordicon y el carrusel de marcas (reemplazado por `mercato/marcas.html`);
  - `<main>` anidados;
  - `<details>` de despacho por ciudad, convertidos en tarjetas visibles con "según la disponibilidad del inventario".
- **Títulos y H1 de las 31 páginas:** en mayúscula de oración, con keyword y sin promesas sin fuente ("ROI comprobado", "la más vendida", "recuperan la inversión en 6 meses", plazos de 24–72 h).
- **Pendiente con datos del dueño:** las afirmaciones del cuerpo de cada página (ROI, porcentajes, "la más vendida", "+200") y las fichas propias de las máquinas (301 BIB, 603 BIB, Compacta 3, Pasmo S121, Stargel 4, Snowy 7M) y de las vitrinas. Ver `mensaje-propietario-datos.md`.
