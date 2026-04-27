# Guía de Uso: Tablas en Blog - ItalGel

## 📊 Resumen
Estilos CSS profesionales para tablas en artículos del blog de ItalGel, usando las variables del sitio y diseñadas para un ancho máximo de 860px (wrapper del post).

---

## 🎨 Variables CSS Utilizadas

Las tablas usan automáticamente las variables del sitio:

```css
--color-principal: #16262e   /* Azul oscuro - texto principal */
--color-secundario: #111313  /* Negro - gradiente header */
--color-accion: #b3953b      /* Dorado - acentos y bordes */
--color-gris1: #797b84       /* Gris medio - texto secundario */
--color-gris2: #c1c4ce       /* Gris claro - bordes y fondos */
--color-blanco: #fbfbfb      /* Blanco del sitio */
--shadow: /* Sombra estándar del sitio */
--radius: 24px               /* Border radius del sitio */
```

---

## 📋 Estructura Básica

### Tabla Estándar

```html
<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Columna 1</th>
        <th>Columna 2</th>
        <th>Columna 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dato 1</td>
        <td>Dato 2</td>
        <td>Dato 3</td>
      </tr>
      <tr>
        <td>Dato 4</td>
        <td>Dato 5</td>
        <td>Dato 6</td>
      </tr>
    </tbody>
  </table>
</div>
```

**IMPORTANTE:** Siempre envuelve la tabla en `<div class="table-wrapper">` para el scroll horizontal en móvil.

---

## 🎯 Variantes de Tablas

### 1. Tabla Compacta

Para tablas con mucha información, usa menos padding:

```html
<div class="table-wrapper">
  <table class="table-compact">
    <!-- contenido -->
  </table>
</div>
```

### 2. Tabla con Bordes

Para tablas que necesiten separación visual más clara:

```html
<div class="table-wrapper">
  <table class="table-bordered">
    <!-- contenido -->
  </table>
</div>
```

### 3. Combinar Variantes

Puedes combinar clases:

```html
<table class="table-compact table-bordered">
```

---

## 🔤 Clases de Alineación

### Centrar Texto

```html
<td class="text-center">Centrado</td>
<th class="text-center">Título Centrado</th>
```

### Alinear a la Derecha (ideal para números/precios)

```html
<td class="text-right">$1.200.000</td>
<td class="text-right">85%</td>
```

---

## 🏷️ Badges (Etiquetas)

Usa badges para resaltar información importante dentro de las celdas:

### Badge Éxito (verde)
```html
<span class="badge badge--success">Disponible</span>
<span class="badge badge--success">Aprobado</span>
```

### Badge Advertencia (amarillo)
```html
<span class="badge badge--warning">Moderado</span>
<span class="badge badge--warning">Pendiente</span>
```

### Badge Info (azul claro)
```html
<span class="badge badge--info">Información</span>
<span class="badge badge--info">Nuevo</span>
```

### Badge Primario (dorado del sitio)
```html
<span class="badge badge--primary">Destacado</span>
<span class="badge badge--primary">Premium</span>
```

### Ejemplo Completo con Badges

```html
<tr>
  <td>Tratamiento Láser</td>
  <td class="text-center">
    <span class="badge badge--success">Disponible</span>
  </td>
  <td class="text-right">$450.000</td>
</tr>
```

---

## 📝 Caption (Pie de Tabla)

Agrega un caption para describir la tabla:

```html
<table>
  <caption>Precios actualizados a Febrero 2026</caption>
  <thead>
    <!-- ... -->
  </thead>
  <tbody>
    <!-- ... -->
  </tbody>
</table>
```

El caption se muestra en la parte inferior con estilo discreto.

---

## 📱 Responsividad

Las tablas son completamente responsivas:

### Desktop (> 768px)
- Tabla a ancho completo (max 860px)
- Hover effect en filas
- Font-size: 1rem

### Tablet/Mobile (≤ 768px)
- Scroll horizontal automático
- Tabla con min-width: 600px
- Font-size reducido a 0.9rem
- Padding reducido para optimizar espacio

**No necesitas hacer nada especial** - el CSS maneja todo automáticamente.

---

## 🎨 Características de Diseño

### Encabezado
- Gradiente azul oscuro (principal → secundario)
- Texto blanco en uppercase
- Borde inferior dorado (color-accion)
- Padding generoso para legibilidad

### Filas del Cuerpo
- Efecto hover (fondo gris claro)
- Zebra striping (filas pares con fondo alterno)
- Primera columna en negrita (ideal para categorías/nombres)
- Bordes sutiles entre filas

### Contenedor
- Border-radius del sitio (24px)
- Box-shadow estándar
- Overflow-x auto en móvil

---

## ✅ Ejemplos de Uso Común

### Tabla de Comparación de Tratamientos

```html
<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Tratamiento</th>
        <th>Duración</th>
        <th class="text-right">Precio</th>
        <th class="text-center">Popularidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Botox</td>
        <td>15-20 min</td>
        <td class="text-right">$450.000</td>
        <td class="text-center"><span class="badge badge--success">Alta</span></td>
      </tr>
      <tr>
        <td>Ácido Hialurónico</td>
        <td>30 min</td>
        <td class="text-right">$800.000</td>
        <td class="text-center"><span class="badge badge--warning">Media</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Tabla de Preguntas Frecuentes

```html
<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Pregunta</th>
        <th>Respuesta</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>¿Es doloroso?</td>
        <td>Mínimo. Se siente como un pequeño pinchazo.</td>
      </tr>
      <tr>
        <td>¿Cuándo veré resultados?</td>
        <td>Entre 3-5 días, con efecto máximo a los 14 días.</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Tabla de Cronograma/Plan

```html
<div class="table-wrapper">
  <table class="table-compact">
    <caption>Plan de tratamiento recomendado</caption>
    <thead>
      <tr>
        <th>Semana</th>
        <th>Tratamiento</th>
        <th>Observaciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1-2</td>
        <td>Limpieza profunda</td>
        <td>Evaluación inicial</td>
      </tr>
      <tr>
        <td>3-4</td>
        <td>Peeling suave</td>
        <td>Posible descamación leve</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🚫 Errores Comunes a Evitar

### ❌ NO hacer:

```html
<!-- Sin wrapper = problemas en móvil -->
<table>
  <thead>...</thead>
</table>

<!-- Usar <div> o <span> dentro de <tr> -->
<tr>
  <div>Contenido</div>
</tr>

<!-- Olvidar cerrar tags -->
<table>
  <thead>
    <tr>
      <th>Columna
  </thead>
</table>
```

### ✅ SÍ hacer:

```html
<!-- Siempre con wrapper -->
<div class="table-wrapper">
  <table>
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>

<!-- Estructura HTML válida -->
<tr>
  <td>Contenido correcto</td>
</tr>

<!-- Tags cerrados correctamente -->
<table>
  <thead>
    <tr>
      <th>Columna</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dato</td>
    </tr>
  </tbody>
</table>
```

---

## 🔍 Dónde Está el Código CSS

El código CSS de las tablas está en:

```
_includes/css/blog.css
```

Líneas aproximadas: 634-800 (al final del archivo, antes del cierre)

---

## 📊 Casos de Uso Recomendados

✅ **Usar tablas para:**
- Comparativas de tratamientos
- Listas de precios
- Cronogramas de sesiones
- Antes/Después con métricas
- FAQ estructuradas
- Ingredientes de productos
- Tiempos de recuperación

❌ **NO usar tablas para:**
- Layouts de página (usar Grid/Flex)
- Listas simples (usar `<ul>` o `<ol>`)
- Contenido que no sea tabular

---

## 🎯 Resumen Rápido

1. **Siempre** usa `<div class="table-wrapper">` alrededor de `<table>`
2. Usa `class="text-center"` o `class="text-right"` para alineación
3. Usa `class="table-compact"` para tablas con mucha info
4. Usa `class="table-bordered"` para mayor separación visual
5. Usa badges (`badge--success`, `badge--warning`, etc.) para destacar
6. Agrega `<caption>` para descripción de la tabla
7. Primera columna será automáticamente en negrita
8. Hover y zebra striping son automáticos

---

## 💡 Tips Pro

- **Números y precios**: Siempre alinea a la derecha con `class="text-right"`
- **Estado/Categorías**: Usa badges para visual rápida
- **Tablas largas**: Considera usar `table-compact` para más filas
- **Móvil**: El scroll horizontal es automático, no te preocupes
- **Accesibilidad**: Usa `<th scope="col">` en headers para lectores de pantalla

---

**Creado:** Febrero 2026
**Proyecto:** SR Expertos en Piel & Metabolismo
**Autor:** Dev Jekyll Skill
