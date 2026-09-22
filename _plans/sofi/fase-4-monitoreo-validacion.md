# Fase 4 — Validación y monitoreo continuo

**Objetivo:** confirmar con datos reales que las Fases 1-3 movieron las métricas en producción (no solo en laboratorio) y dejar un proceso para que el sitio no vuelva a degradarse silenciosamente con cambios futuros.
**Duración estimada:** continuo, con checkpoints a 30 y 60 días después del cierre de la Fase 3.
**Prioridad:** Media — no bloquea el trabajo de las fases anteriores, pero sin esto no hay forma de confirmar que el esfuerzo de las Fases 1-3 realmente funcionó.

---

## ⏳ Estado: EN PROGRESO (21 sep 2026)

**Resumen:** de los 3 puntos, **4.3 quedó implementado** (presupuesto de performance documentado y enlazado desde la skill de desarrollo). **4.1 y 4.2 están bloqueados a propósito**: 4.1 necesita que los cambios de las Fases 1-2 estén en producción (la usuaria los subirá cuando revise que todo esté correcto — nada se commiteó ni pusheó desde esta sesión, como en las fases anteriores). 4.2 se decidió posponer explícitamente hasta después de publicar, por indicación de la usuaria.

### 4.1 Re-auditoría completa post-implementación — 🔒 Bloqueado (pendiente de producción)

No se puede ejecutar todavía: los cambios de código de las Fases 1 y 2 siguen sin commitear ni pushear (Fase 3 no tocó código). Además, el entorno de esta sesión no tiene salida de red a `googleapis.com`, así que aunque el sitio estuviera en producción, correr PageSpeed Insights real requeriría que la usuaria (o un chat con salida a internet) lo ejecute directamente, o hacerlo manualmente desde Chrome DevTools → Lighthouse.

**Cuando el sitio esté en producción, los pasos son:**
1. Correr Lighthouse (real, con throttling) sobre las 51 URLs del CSV original.
2. Comparar contra la tabla de línea base de este documento (Performance promedio 74.5→≥85, LCP malo 39/50→≤5/50, CLS malo 6/50→0/50, TBT malo 1/50→0/50, TBT mejorable 14/50→≤5/50).
3. Documentar el comparativo antes/después en un archivo nuevo en `_plans/sofi/`.

### 4.2 Monitoreo de Core Web Vitals de campo (Search Console) — ⏸️ Pospuesto a pedido de la usuaria

La usuaria pidió explícitamente dejarlo para después de publicar, en vez de montar un proceso (manual o automatizado) ahora. Queda documentado el objetivo original: revisión mensual del reporte "Core Web Vitals" de Search Console (perfil "Trabajo SEO" de la usuaria — ver skill `perfiles-navegador-sofi`), priorizando cualquier grupo de URLs marcado como "Malo" con datos de campo reales aunque Lighthouse ya las muestre bien.

**Retomar esto cuando:** los cambios estén en producción y haya pasado suficiente tráfico (Search Console necesita ~28 días de datos de campo para que el reporte sea representativo).

### 4.3 Presupuesto de performance para páginas nuevas — ✅ Implementado

Se redactó `_plans/sofi/presupuesto-performance-contenido-nuevo.md` con:
- Los 3 umbrales mínimos para publicar (LCP <2.5s, CLS <0.1, TBT <200ms).
- Un checklist de verificación sin medición (front matter `hero_s`/`hero_w`/`hero_h`, mobile avif generado, no romper `font-size-adjust` en `layout: products`, no cargar scripts de terceros sin diferir, balance de tags) basado directamente en los bugs reales encontrados en las Fases 1-3.
- 3 métodos de medición real ordenados por precisión (PSI en producción, Lighthouse manual en DevTools local, o la medición aproximada con Performance API que se usó en la Fase 3 cuando no hay acceso a los dos anteriores).

Se agregó además una línea de referencia en el checklist pre-publicación de `.claude/skills/dev-jekyll/SKILL.md` apuntando a este nuevo documento, para que quede descubrible desde el flujo normal de trabajo y no solo archivado en `_plans/`.

---

## Checklist de cierre de Fase 4

- [ ] 4.1 Re-auditoría de las 51 URLs completada, comparativo antes/después documentado — **bloqueado, esperando producción**
- [ ] 4.2 Proceso de revisión mensual de Search Console (Core Web Vitals) establecido — **pospuesto a pedido de la usuaria, retomar después de publicar**
- [x] 4.3 Presupuesto de performance (LCP <2.5s, CLS <0.1, TBT <200ms) adoptado como criterio de publicación para contenido nuevo
