/* =======================================================================
   lordicon-lazy.js — Italgel Colombia
   Fase 1.3 (SEO tecnico / performance, sep 2026)
   =========================================================================
   lordicon.js es la libreria de animaciones (Lottie) que dibuja los iconos
   <lord-icon>. Antes se cargaba con <script defer> en TODAS las paginas
   (51/51), porque el footer (trust-signals.html) tiene 3 iconos en cada
   pagina del sitio. En equipos.html, que suma 3 iconos propios a los 3 del
   footer (6 en total), el TBT llegaba a 780ms -- el peor del sitio.

   Este script reemplaza esa carga inmediata: espera a que el PRIMER
   <lord-icon> de la pagina (sea del footer o de contenido propio de la
   pagina) este por entrar al viewport, y recien ahi pide la libreria. En
   la mayoria de paginas eso pasa varios segundos despues del primer
   render, fuera de la ventana critica que miden LCP/TBT.

   Cubre TODOS los <lord-icon> de la pagina sin importar si vienen del
   include _includes/lordicon.html o de markup propio como
   _includes/trust-signals.html -- por eso vive una sola vez aca y no
   duplicado dentro de cada include.
   ======================================================================= */
(function () {
  'use strict';

  function cargarLordicon() {
    if (document.querySelector('script[data-lordicon-lib]')) return;
    var s = document.createElement('script');
    s.src = 'https://cdn.lordicon.com/lordicon.js';
    s.defer = true;
    s.setAttribute('data-lordicon-lib', '1');
    document.body.appendChild(s);
  }

  function init() {
    var iconos = document.querySelectorAll('lord-icon');
    if (!iconos.length) return;

    if (!('IntersectionObserver' in window)) {
      cargarLordicon();
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      var hayAlgunoVisible = entries.some(function (entry) { return entry.isIntersecting; });
      if (hayAlgunoVisible) {
        cargarLordicon();
        obs.disconnect();
      }
    }, { rootMargin: '200px' });

    iconos.forEach(function (icono) { observer.observe(icono); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
