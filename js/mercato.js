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

// Menú en móvil: si la categoría activa queda fuera de la vista, el menú se desplaza hasta ella.
(() => {
  const activa = document.querySelector('.menu__categoria[aria-current]');
  const menu = activa && activa.closest('.menu');
  if (!menu || menu.scrollWidth <= menu.clientWidth) return;
  menu.scrollLeft = Math.max(0, activa.parentElement.offsetLeft - 16);
})();
