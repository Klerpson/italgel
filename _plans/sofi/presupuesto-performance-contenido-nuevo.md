# Presupuesto de performance para páginas nuevas (Fase 4.3)

**Por qué existe este documento:** sin un límite claro, es fácil que una página de producto, categoría o post nuevo repita alguno de los problemas que las Fases 1-3 ya corrigieron — por ejemplo, agregar un widget de terceros sin diferirlo (como pasaba con Lordicon), usar `layout: products` esperando que el CLS ya esté resuelto sin verificarlo, u olvidar `hero_s`/`hero_w`/`hero_h` en el front matter de una página con imagen destacada (el bug recurrente que se encontró en 33 páginas en la Fase 2).

**Regla:** antes de publicar cualquier página nueva (producto, categoría o post), confirmar que cumple estos 3 umbrales.

## Los 3 umbrales mínimos para publicar

| Métrica | Umbral | Qué significa si no se cumple |
|---|---|---|
| LCP | < 2.5 s | El elemento más grande visible (normalmente la imagen hero o el `<h1>`) tarda demasiado en aparecer — revisar si la imagen está optimizada y si tiene `preload` |
| CLS | < 0.1 | Algo se mueve en pantalla mientras carga — normalmente una fuente que cambia de tamaño al cargar, o una imagen sin `width`/`height` |
| TBT | < 200 ms | El hilo principal está ocupado bloqueando la interacción — normalmente un script de terceros cargando de forma síncrona/temprana |

## Checklist de verificación antes de publicar

**Sin tocar código, solo revisando front matter y plantilla:**

- [ ] Si la página tiene imagen destacada (`hero`), el front matter incluye también `hero_s` (variante mobile), `hero_w` y `hero_h` con las dimensiones reales del archivo (usar `identify` de ImageMagick para confirmarlas, no adivinar)
- [ ] Existe el archivo `-mobile.avif` correspondiente a `hero_s`, generado en ~420-600px de ancho (según el patrón usado en Fase 2: `bases-helado-colombia`/`pastas-sabores-helado` a 420px, blog/posts a 600px)
- [ ] Si la página usa `layout: products`, confirmar que sigue usando `.hero_products .hero_title` sin overrides de `font-family`/tamaño que rompan el `font-size-adjust: 0.44` ya definido en `_includes/css/header.css`
- [ ] Si se agrega un script de terceros nuevo (tipo Lordicon, un widget de reseñas, un chat, etc.), **no cargarlo directamente en el HTML de la página** — seguir el patrón de `js/lordicon-lazy.js`: diferir la carga hasta que el elemento esté por entrar al viewport, o hasta después del evento `load`
- [ ] El HTML no tiene tags sin cerrar ni divs sobrantes (el bug de Fase 1 en `base-50-mec3.html`) — correr un chequeo de balance de tags antes de dar por buena la página

**Con medición real (cuando haya forma de medir):**

- [ ] Confirmar LCP/CLS/TBT reales sobre la página en `jekyll serve` local, con alguno de estos métodos (de más a menos preciso):
  1. **PageSpeed Insights** (`pagespeed.web.dev`) contra la URL ya en producción — el método más fiable, pero solo sirve una vez publicada. Es el método que se documentó como bloqueado desde el entorno cloud de Claude en las Fases 1-3 (sin salida de red a `googleapis.com`); la usuaria o cualquier persona con acceso normal a internet sí puede correrlo.
  2. **Chrome DevTools → pestaña Lighthouse**, manualmente, sobre `http://127.0.0.1:4000/` — reproduce el throttling real de Lighthouse (4x CPU, red simulada), a diferencia del método 3.
  3. **Medición aproximada vía Performance API del navegador** (el método usado en la Fase 3 de este plan, con Claude en Chrome): sin throttling, así que los números no son comparables 1:1 con Lighthouse, pero sirve para detectar si hay layout shifts reales o tareas largas nuevas antes de publicar. Útil cuando no hay acceso a los métodos 1 o 2.

## Qué hacer si no se cumple un umbral

No publicar hasta identificar la causa real — no asumirla. Seguir la misma lógica que se usó en las Fases 1-3 de este plan: medir primero (con evidencia de código o medición en vivo), reparar después. Documentar el hallazgo en `_plans/sofi/` si es un patrón que se repite (como se hizo con el bug de `hero_s` o el de Lordicon), para que la próxima página nueva no lo repita.

---

*Este documento es parte de la Fase 4 (`fase-4-monitoreo-validacion.md`, punto 4.3) del plan de mejora de performance de Italgel. Ver `memoria-proyecto-italgel-seo-tecnico.md` para el contexto completo del proyecto.*
