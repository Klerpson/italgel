/* =======================================================================
   app.js — Italgel Colombia
   Módulos: MobileNav · SocialProof · WhatsApp · ScrollBtn · PQR
   ======================================================================= */
(() => {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────────────── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ── Config ───────────────────────────────────────────────────────── */
  const PQR_URL   = 'https://script.google.com/macros/s/AKfycbxrw1eF32HLM_-PCK7qQkAfxOmDB7nAZpYwIhf6IRjvqx_jGs7WW1GxK2F6CUP0JGCNMA/exec';

  /* ================================================================
     MOBILE NAV
     ================================================================ */
  const MobileNav = {
    init() {
      const hamburger = $('#hamburger');
      const menu      = $('#mobileMenu');
      if (!hamburger || !menu) return;

      hamburger.addEventListener('click', () => this.open(menu, hamburger));
      $('#mobileClose')?.addEventListener('click', () => this.close(menu, hamburger));

      menu.addEventListener('click', e => {
        if (e.target === menu) this.close(menu, hamburger);
      });

      $$('.mobile-accordion-btn').forEach(btn =>
        btn.addEventListener('click', () => this.toggleAccordion(btn))
      );

      menu.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => this.close(menu, hamburger))
      );

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('active'))
          this.close(menu, hamburger);
      });
    },

    open(menu, btn) {
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
      btn.setAttribute('aria-expanded', 'true');
    },

    close(menu, btn) {
      menu.classList.remove('active');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
    },

    toggleAccordion(btn) {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      $$('.mobile-accordion-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling?.classList.remove('active');
      });
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.nextElementSibling?.classList.toggle('active', !isOpen);
    }
  };

  /* ================================================================
     SOCIAL PROOF TOAST
     ================================================================ */
  const SocialProof = {
    msgs: [
      'Máquina soft comprada en Cali',
      '12 bases MEC3 compradas en Bogotá',
      'Pasta pistacho comprada en Medellín',
      '5 variegatos comprados en Barranquilla',
      'Cobertura chocolate comprada en Bucaramanga',
      'Toppings comprados en Pereira',
      'Máquina artesanal comprada en Cartagena',
      'Base Supergelmix comprada en Cúcuta',
      '8 pastas compradas en Ibagué',
      'Toppings fruta comprados en Santa Marta',
      'Base Neutralin comprada en Manizales',
      'Vitrina comprada en Armenia',
      '4 salsas especiales compradas en Neiva',
      'Máquina soft comprada en Villavicencio',
      'Bases completas compradas en Pasto',
      'Granelas cookies compradas en Popayán',
      'Pasta vainilla comprada en Valledupar',
      '6 coberturas compradas en Montería',
      'Toppings premium comprados en Sincelejo'
    ],
    shown: new Set(),

    init() {
      const toast = $('#socialProofToast');
      const text  = toast?.querySelector('.social-proof-text');
      if (!toast || !text) return;
      this.toast = toast;
      this.text  = text;
      this.schedule();
    },

    pick() {
      const available = this.msgs.filter(m => !this.shown.has(m));
      if (!available.length) this.shown.clear();
      const pool = available.length ? available : this.msgs;
      return pool[Math.floor(Math.random() * pool.length)];
    },

    schedule() {
      setTimeout(() => {
        const msg = this.pick();
        this.text.textContent = msg;
        this.toast.classList.add('show');
        this.shown.add(msg);
        setTimeout(() => { this.toast.classList.remove('show'); this.schedule(); }, 5000);
      }, Math.random() * 15000 + 20000);
    }
  };

  /* ================================================================
     WHATSAPP  —  movido a js/lead-whatsapp.js
     ================================================================
     Aqui vivian el numero y el mensaje escritos a mano, de modo que
     cambiarlos en _config.yml no cambiaba nada. Ademas, en movil se abria
     dos veces (window.open y el protocolo whatsapp://), y el modal solo
     salia si el navegador bloqueaba el popup, no cuando el usuario volvia
     sin haber escrito.

     El modulo nuevo engancha por el DESTINO del enlace, mide todos los
     clics y recupera el lead. Lee el numero de <body data-wa-phone>, que
     el layout rellena desde _config.yml.
     ================================================================ */

  /* ================================================================
     SCROLL TO TOP
     ================================================================ */
  const ScrollBtn = {
    init() {
      const btn = $('.scroll-up-btn');
      if (!btn) return;
      window.addEventListener('scroll', () => btn.classList.toggle('visible', scrollY > 100), { passive: true });
      btn.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });
    }
  };

  /* ================================================================
     PQR MODAL
     Solo se inicializa si el HTML del modal está presente en la página
     ================================================================ */
  const PQR = {
    url:  PQR_URL,
    datos: null,
    flujo: null,
    idx:   0,

    init() {
      const overlay = $('#pqr-overlay');
      if (!overlay) return;

      this.overlay     = overlay;
      this.barra       = $('#pqr-barra');
      this.progressbar = $('#pqr-progressbar');
      this.conteo      = $('#pqr-conteo');
      this.btnAtras    = $('#pqr-atras');
      this.num4        = $('#pqr-num-4');
      this.num5        = $('#pqr-num-5');

      this.attachEvents();
      this.reset();

      if (location.hash === '#pqr') setTimeout(() => this.abrir(), 600);
    },

    attachEvents() {
      $$('[data-abre-pqr]').forEach(el =>
        el.addEventListener('click', e => { e.preventDefault(); this.abrir(); })
      );

      $('#pqr-cerrar').addEventListener('click',       () => this.cerrar());
      $('#pqr-cerrar-exito').addEventListener('click', () => this.cerrar());

      this.overlay.addEventListener('click', e => {
        if (e.target === this.overlay) this.cerrar();
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.overlay.classList.contains('pqr-abierto'))
          this.cerrar();
      });

      this.btnAtras.addEventListener('click', () => {
        if (this.idx > 0) { this.idx--; this.mostrar(this.flujo[this.idx]); }
      });

      $$('.pqr-opcion').forEach(btn =>
        btn.addEventListener('click', () => this.elegir(btn))
      );

      $('#pqr-btn-1').addEventListener('click', () => {
        const nom = $('#pqr-nombre');
        const err = $('#pqr-error-nombre');
        if (!nom.value.trim()) {
          nom.classList.add('pqr-campo-error');
          err.hidden = false;
          nom.focus();
          return;
        }
        nom.classList.remove('pqr-campo-error');
        err.hidden = true;
        this.datos.nombre = nom.value.trim();
        this.avanzar();
      });

      $('#pqr-nombre').addEventListener('keydown', e => {
        if (e.key === 'Enter') $('#pqr-btn-1').click();
      });

      $('#pqr-nombre').addEventListener('input', () => {
        $('#pqr-nombre').classList.remove('pqr-campo-error');
        $('#pqr-error-nombre').hidden = true;
      });

      $('#pqr-btn-4').addEventListener('click', () => {
        this.datos.lote = $('#pqr-lote').value.trim();
        this.avanzar();
      });

      $('#pqr-lote').addEventListener('keydown', e => {
        if (e.key === 'Enter') { this.datos.lote = e.target.value.trim(); this.avanzar(); }
      });

      $('#pqr-btn-5').addEventListener('click', () => this.validarYEnviar());

      $('#pqr-desc').addEventListener('input', () => {
        $('#pqr-desc').classList.remove('pqr-campo-error');
        $('#pqr-error-desc').hidden = true;
      });
    },

    elegir(btn) {
      const { campo, valor } = btn.dataset;
      this.datos[campo] = valor;

      $$(`[data-campo="${campo}"]`).forEach(b =>
        b.classList.toggle('seleccionado', b === btn)
      );

      if (campo === 'tipo')
        this.flujo = valor === 'Comentario' ? [1, 2, 5] : [1, 2, 3, 4, 5];

      setTimeout(() => this.avanzar(), 320);
    },

    avanzar() {
      this.idx++;
      this.mostrar(this.idx >= this.flujo.length ? 6 : this.flujo[this.idx]);
    },

    mostrar(numPaso) {
      $('.pqr-paso.activo', this.overlay)?.classList.remove('activo');

      const paso = $(`#pqr-paso-${numPaso}`);
      if (!paso) return;
      paso.classList.add('activo');

      if (numPaso === 5)
        this.num5.innerHTML = `${this.flujo.length <= 3 ? '03' : '05'} <span>\u2192</span>`;

      const enExito = numPaso === 6;
      const pct     = enExito ? 100 : Math.round((this.idx / this.flujo.length) * 100);

      this.barra.style.width = `${pct}%`;
      this.progressbar.setAttribute('aria-valuenow', pct);
      this.conteo.textContent = enExito
        ? '\u00a1Enviado!'
        : `Paso ${this.idx + 1} de ${this.flujo.length}`;

      this.btnAtras.style.visibility = this.idx > 0 && !enExito ? 'visible' : 'hidden';

      setTimeout(() => {
        paso.querySelector('button:not([style*="hidden"]), input, textarea')
          ?.focus({ preventScroll: true });
      }, 80);
    },

    validarYEnviar() {
      const desc  = $('#pqr-desc');
      const errEl = $('#pqr-error-desc');

      if (!desc.value.trim()) {
        desc.classList.add('pqr-campo-error');
        errEl.hidden = false;
        desc.focus();
        return;
      }

      desc.classList.remove('pqr-campo-error');
      errEl.hidden = true;
      this.datos.comentario = desc.value.trim();
      this.enviar();
    },

    enviar() {
      const btn = $('#pqr-btn-5');
      btn.disabled    = true;
      btn.textContent = 'Enviando\u2026';

      const params = new URLSearchParams({
        fecha:      new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
        nombre:     this.datos.nombre,
        tipo:       this.datos.tipo,
        producto:   this.datos.producto,
        lote:       this.datos.lote,
        comentario: this.datos.comentario
      });

      fetch(`${this.url}?${params}`, { method: 'GET', mode: 'no-cors' })
        .catch(() => {})
        .finally(() => {
          this.idx = this.flujo.length;
          this.mostrar(6);
          btn.disabled    = false;
          btn.textContent = 'Enviar solicitud \u2713';
        });
    },

    abrir() {
      this.reset();
      this.overlay.classList.add('pqr-abierto');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const h2 = $('#pqr-h2');
        h2.setAttribute('tabindex', '-1');
        h2.focus({ preventScroll: true });
      }, 50);
    },

    cerrar() {
      this.overlay.classList.remove('pqr-abierto');
      document.body.style.overflow = '';
    },

    reset() {
      this.datos = { nombre: '', tipo: '', producto: '', lote: '', comentario: '' };
      this.flujo = [1, 2, 3, 4, 5];
      this.idx   = 0;

      $$('.pqr-paso', this.overlay).forEach(p => p.classList.remove('activo'));
      $('#pqr-paso-1').classList.add('activo');
      $$('.pqr-opcion', this.overlay).forEach(b => b.classList.remove('seleccionado'));

      $('#pqr-nombre').value = '';
      $('#pqr-nombre').classList.remove('pqr-campo-error');
      $('#pqr-error-nombre').hidden = true;

      $('#pqr-lote').value = '';
      const desc = $('#pqr-desc');
      desc.value = '';
      desc.classList.remove('pqr-campo-error');
      $('#pqr-error-desc').hidden = true;
      if (this.num5) this.num5.innerHTML = '05 <span>\u2192</span>';

      this.barra.style.width = '0%';
      this.progressbar.setAttribute('aria-valuenow', '0');
      this.conteo.textContent = 'Paso 1 de 5';
      this.btnAtras.style.visibility = 'hidden';
    }
  };

  /* ── Boot ─────────────────────────────────────────────────────────── */
  const boot = () => {
    MobileNav.init();
    SocialProof.init();
    ScrollBtn.init();
    PQR.init();
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();

})();
