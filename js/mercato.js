// Sistema Mercato. Mejora progresiva: sin JS todo el contenido se ve y los enlaces funcionan.
// El flotante de WhatsApp lo oculta js/canales.js mientras se ve [data-hero].

// Barra secundaria del menú: se oculta al bajar y reaparece al subir.
(() => {
  const cabecera = document.querySelector('[data-cabecera]');
  if (!cabecera) return;
  let ultimo = window.scrollY;
  let pendiente = false;
  const actualizar = () => {
    const y = window.scrollY;
    if (y < 120) { cabecera.classList.remove('es-compacta'); ultimo = y; }
    else if (y > ultimo + 8) { cabecera.classList.add('es-compacta'); ultimo = y; }
    else if (y < ultimo - 8) { cabecera.classList.remove('es-compacta'); ultimo = y; }
    pendiente = false;
  };
  window.addEventListener('scroll', () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  }, { passive: true });
})();

// Flotante: se habilita (data-listo) en el mismo ciclo en que js/canales.js decide si ocultarlo sobre el hero,
// así nunca se pinta un instante encima del hero.
(() => {
  const flotante = document.querySelector('[data-flotante]');
  if (!flotante) return;
  const hero = document.querySelector('[data-hero]');
  if (!hero || !('IntersectionObserver' in window)) { flotante.setAttribute('data-listo', ''); return; }
  const io = new IntersectionObserver(() => { flotante.setAttribute('data-listo', ''); io.disconnect(); });
  io.observe(hero);
})();

// Flotante: cuando el hero sale de la vista, muestra la invitación con texto durante 6 s
// (una vez por página). En páginas sin hero, a los 5 s.
(() => {
  const flotante = document.querySelector('[data-flotante]');
  if (!flotante) return;
  let hecho = false;
  let observador;
  const invitar = () => {
    if (hecho || flotante.hasAttribute('data-oculto')) return;
    hecho = true;
    if (observador) observador.disconnect();
    setTimeout(() => {
      flotante.classList.add('es-invitando');
      setTimeout(() => flotante.classList.remove('es-invitando'), 6000);
    }, 800);
  };
  observador = new MutationObserver(invitar);
  observador.observe(flotante, { attributes: true, attributeFilter: ['data-oculto'] });
  if (!document.querySelector('[data-hero]')) setTimeout(invitar, 5000);
})();

// Índice de la página: marca la sección que se está leyendo.
(() => {
  const enlaces = [...document.querySelectorAll('[data-indice] a[href^="#"]')];
  if (!enlaces.length || !('IntersectionObserver' in window)) return;
  const porId = new Map(enlaces.map((a) => [a.hash.slice(1), a]));
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      enlaces.forEach((a) => a.removeAttribute('aria-current'));
      const actual = porId.get(entrada.target.id);
      if (actual) {
        actual.setAttribute('aria-current', 'true');
        const lista = actual.closest('ol');
        if (lista && lista.scrollWidth > lista.clientWidth) lista.scrollTo({ left: actual.offsetLeft - 16, behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  porId.forEach((_, id) => { const seccion = document.getElementById(id); if (seccion) observador.observe(seccion); });
})();

// Calculadora de overrun (posts): recalcula al escribir. Sin JS se ve el ejemplo resuelto del HTML.
// Mide el uso con interaccion_calculadora una vez por vista.
(() => {
  const form = document.querySelector('[data-calculadora-overrun]');
  if (!form) return;
  const salida = form.elements.overrun;
  const texto = form.querySelector('[data-calculadora-texto]');
  const num = (n) => n.toLocaleString('es-CO', { maximumFractionDigits: 1 });
  let medido = false;
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('input', () => {
    const mezcla = parseFloat(form.elements.mezcla.value);
    const helado = parseFloat(form.elements.helado.value);
    if (!(mezcla > 0) || !(helado > 0)) { salida.value = '—'; texto.textContent = 'Escribe los dos volúmenes en litros.'; return; }
    const overrun = ((helado - mezcla) / mezcla) * 100;
    salida.value = `${num(overrun)} %`;
    texto.textContent = `Con ${num(mezcla)} litros de mezcla y ${num(helado)} litros de helado, el overrun es de ${num(overrun)} %: (${num(helado)} − ${num(mezcla)}) ÷ ${num(mezcla)} × 100.`;
    if (!medido) {
      medido = true;
      (window.dataLayer = window.dataLayer || []).push({ event: 'interaccion_calculadora', ubicacion: 'post-overrun-calculadora', pagina: location.pathname });
    }
  });
})();

// Medición de las interacciones de catálogo: un evento por tipo y vista (GA4 vía dataLayer).
const medirInteraccion = (() => {
  const hechos = new Set();
  return (evento, ubicacion) => {
    if (hechos.has(evento)) return;
    hechos.add(evento);
    (window.dataLayer = window.dataLayer || []).push({ event: evento, ubicacion, pagina: location.pathname });
  };
})();

// Comparativa de la ficha de producto: el interruptor resalta lo que cambia (CSS con :has). Aquí solo se mide.
document.querySelectorAll('[data-resaltar]').forEach((casilla) => {
  casilla.addEventListener('change', () => medirInteraccion('interaccion_comparativa', casilla.dataset.ubicacion));
});

// Selector de sabores de la home: la vitrina se enciende con CSS (:has). Aquí solo se mide.
document.querySelectorAll('.sabores[data-ubicacion]').forEach((grupo) => {
  grupo.addEventListener('change', () => medirInteraccion('interaccion_vitrina', grupo.dataset.ubicacion));
});

// Comparador de cafeteras (/equipos-cafe/): sin JS se ve la tabla completa; con JS se eligen dos columnas
// y el interruptor oculta las filas que las dos tienen igual.
(() => {
  const comparador = document.querySelector('[data-comparador]');
  if (!comparador) return;
  const controles = comparador.querySelector('[data-comparador-controles]');
  const selA = comparador.querySelector('select[data-columna="a"]');
  const selB = comparador.querySelector('select[data-columna="b"]');
  const filas = [...comparador.querySelectorAll('tbody tr[data-fila]')];
  const celdas = [...comparador.querySelectorAll('[data-col]')];
  let previoA = selA.value;
  let previoB = selB.value;
  const aplicar = () => {
    const a = selA.value;
    const b = selB.value;
    celdas.forEach((c) => { c.hidden = c.dataset.col !== a && c.dataset.col !== b; });
    // Orden de lectura: la columna A siempre antes que la B
    comparador.querySelectorAll('tr').forEach((tr) => {
      const ca = tr.querySelector(`[data-col="${a}"]`);
      const cb = tr.querySelector(`[data-col="${b}"]`);
      if (ca && cb && (ca.compareDocumentPosition(cb) & Node.DOCUMENT_POSITION_PRECEDING)) tr.insertBefore(ca, cb);
    });
    filas.forEach((tr) => {
      const va = tr.querySelector(`[data-col="${a}"]`)?.textContent.trim();
      const vb = tr.querySelector(`[data-col="${b}"]`)?.textContent.trim();
      tr.toggleAttribute('data-igual', va === vb);
    });
  };
  // Si se elige el mismo modelo en las dos listas, la otra toma el modelo que había antes.
  selA.addEventListener('change', () => { if (selA.value === selB.value) selB.value = previoA; previoA = selA.value; previoB = selB.value; aplicar(); medirInteraccion('interaccion_comparador', 'cafe-comparador'); });
  selB.addEventListener('change', () => { if (selB.value === selA.value) selA.value = previoB; previoA = selA.value; previoB = selB.value; aplicar(); medirInteraccion('interaccion_comparador', 'cafe-comparador'); });
  comparador.querySelector('[data-solo-diferencias]')?.addEventListener('change', () => medirInteraccion('interaccion_comparador', 'cafe-comparador'));
  controles.hidden = false;
  comparador.classList.add('es-activo');
  aplicar();
})();

// Arma tu mensaje (cierre de la home): compone el texto de WhatsApp y lo pone en el botón de cierre.
(() => {
  const form = document.querySelector('[data-armar-mensaje]');
  if (!form) return;
  const boton = form.closest('.cierre')?.querySelector('a[data-location="cierre"]');
  const vista = form.querySelector('[data-mensaje-vista]');
  if (!boton || !vista) return;
  const base = new URL(boton.href);
  const general = base.searchParams.get('text') || vista.textContent.trim();
  const lista = (items) => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
  const componer = () => {
    const intereses = [...form.querySelectorAll('input[name="interes"]:checked')].map((i) => i.value);
    const ciudad = form.elements.ciudad.value;
    let texto = general;
    if (intereses.length || ciudad) {
      texto = `Hola, quiero cotizar ${intereses.length ? lista(intereses) : 'equipos o insumos para heladería'} con Italgel.`;
      if (ciudad) texto += ` Mi negocio está en ${ciudad}.`;
    }
    vista.value = texto;
    vista.textContent = texto;
    boton.href = `${base.origin}${base.pathname}?text=${encodeURIComponent(texto)}`;
  };
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('change', () => { componer(); medirInteraccion('interaccion_mensaje', form.dataset.ubicacion); });
  form.hidden = false;
})();

// Hero de la home, "¿Qué vas a cotizar?": la foto cambia con CSS (:has). Aquí, la familia elegida pasa al
// mensaje y al data-location del botón del hero y del flotante (hero-<familia>, flotante-<familia>).
// Sin elección, los dos quedan con el mensaje general de la página.
(() => {
  const grupo = document.querySelector('[data-familias-hero]');
  if (!grupo) return;
  const boton = grupo.closest('.portada')?.querySelector('a.boton');
  const flotante = document.querySelector('[data-flotante]');
  const titulo = flotante?.querySelector('.flotante__burbuja strong');
  const tel = document.body.dataset.waPhone;
  if (!boton || !tel) return;
  const href = (texto) => `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
  const aplicar = (enlace, texto, ubicacion) => {
    enlace.href = href(texto);
    enlace.dataset.waText = texto;
    enlace.dataset.location = ubicacion;
  };
  grupo.addEventListener('change', (e) => {
    const opcion = e.target;
    if (opcion.name !== 'familia-hero') return;
    aplicar(boton, opcion.dataset.mensaje, `hero-${opcion.value}`);
    if (flotante) aplicar(flotante, opcion.dataset.mensaje, `flotante-${opcion.value}`);
    if (titulo) titulo.textContent = opcion.dataset.invitacion;
    medirInteraccion('interaccion_hero_familia', 'home-hero-familia');
  });
})();

// Menú en móvil: si la categoría activa queda fuera de la vista, el menú se desplaza hasta ella.
(() => {
  const activa = document.querySelector('.menu__categoria[aria-current]');
  const menu = activa && activa.closest('.menu');
  if (!menu || menu.scrollWidth <= menu.clientWidth) return;
  menu.scrollLeft = Math.max(0, activa.parentElement.offsetLeft - 16);
})();
