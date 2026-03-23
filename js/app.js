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
  const WA_PHONE  = '573192346788';
  const WA_MSG    = 'Hola! Me interesa información sobre los productos que vi en ';
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
     WHATSAPP
     ================================================================ */
  const WhatsApp = {
    getUrl() {
      const msg = encodeURIComponent(`${WA_MSG}${location.href}`);
      return `https://wa.me/${WA_PHONE}?text=${msg}`;
    },

    init() {
      this.createModal();
      $$('a#lead_whatsapp, .whatsapp-float').forEach(el =>
        el.addEventListener('click', e => { e.preventDefault(); this.click(); })
      );
    },

    click() {
      const url    = this.getUrl();
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'whatsapp_click',
        whatsapp_number: WA_PHONE,
        page_url: location.href,
        timestamp: new Date().toISOString()
      });

      const win = window.open(url, '_blank');

      if (isMobile) {
        location.href = `whatsapp://send?phone=${WA_PHONE}&text=${encodeURIComponent(`${WA_MSG}${location.href}`)}`;
      }

      setTimeout(() => { if (!win || win.closed) this.showModal(); }, 3000);
    },

    createModal() {
      if ($('#whatsapp-fallback-modal')) return;

      document.body.insertAdjacentHTML('beforeend', `
        <div id="whatsapp-fallback-modal" class="whatsapp-modal" role="dialog" aria-labelledby="wm-title" aria-modal="true">
          <div class="whatsapp-modal-content">
            <button class="whatsapp-modal-close" aria-label="Cerrar">&times;</button>
            <div class="whatsapp-modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.56-.01-.188 0-.495.074-.754.371-.26.297-.99.967-.99 2.357 0 1.39 1.016 2.732 1.156 2.92.14.187 1.98 3.024 4.792 4.24.671.296 1.194.472 1.602.604.673.215 1.285.184 1.77.112.54-.081 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
              </svg>
            </div>
            <h2 id="wm-title">¿No se abrió WhatsApp?</h2>
            <p>Puedes contactarnos directamente:</p>
            <div class="whatsapp-modal-actions">
              <a href="tel:+${WA_PHONE}" class="whatsapp-modal-btn whatsapp-modal-btn-secondary">📞 Llamar ahora</a>
              <button id="whatsapp-retry-btn" class="whatsapp-modal-btn whatsapp-modal-btn-primary">🔄 Intentar de nuevo</button>
            </div>
            <p class="whatsapp-modal-footer">
              O copia: <strong>+${WA_PHONE.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4')}</strong>
            </p>
          </div>
        </div>
      `);

      document.head.insertAdjacentHTML('beforeend', `
        <style id="whatsapp-modal-styles">
          .whatsapp-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:10001;align-items:center;justify-content:center;padding:1rem}
          .whatsapp-modal.active{display:flex;animation:wm-in .3s ease}
          .whatsapp-modal-content{background:#fff;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.3);animation:wm-up .3s ease}
          .whatsapp-modal-close{position:absolute;top:1rem;right:1rem;background:transparent;border:none;font-size:2rem;color:#666;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .2s}
          .whatsapp-modal-close:hover{background:#f0f0f0;color:#333}
          .whatsapp-modal-icon{margin-bottom:1rem}
          .whatsapp-modal h2{font-size:1.5rem;margin-bottom:.5rem;color:#333}
          .whatsapp-modal p{color:#666;margin-bottom:1.5rem}
          .whatsapp-modal-actions{display:flex;flex-direction:column;gap:.75rem;margin-bottom:1.5rem}
          .whatsapp-modal-btn{padding:.875rem 1.5rem;border-radius:8px;font-weight:600;font-size:1rem;text-decoration:none;border:none;cursor:pointer;transition:all .2s;display:inline-block}
          .whatsapp-modal-btn-primary{background:#25D366;color:#fff}
          .whatsapp-modal-btn-primary:hover{background:#128C7E;transform:translateY(-2px)}
          .whatsapp-modal-btn-secondary{background:#f0f0f0;color:#333}
          .whatsapp-modal-btn-secondary:hover{background:#e0e0e0}
          .whatsapp-modal-footer{font-size:.875rem;color:#999;margin:0}
          .whatsapp-modal-footer strong{color:#25D366;user-select:all}
          @keyframes wm-in{from{opacity:0}to{opacity:1}}
          @keyframes wm-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        </style>
      `);

      const modal = $('#whatsapp-fallback-modal');
      modal.querySelector('.whatsapp-modal-close').addEventListener('click', () => this.hideModal());
      modal.addEventListener('click', e => { if (e.target === modal) this.hideModal(); });
      $('#whatsapp-retry-btn').addEventListener('click', () => {
        this.hideModal();
        window.open(this.getUrl(), '_blank');
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) this.hideModal();
      });
    },

    showModal() { $('#whatsapp-fallback-modal')?.classList.add('active'); document.body.style.overflow = 'hidden'; },
    hideModal() { $('#whatsapp-fallback-modal')?.classList.remove('active'); document.body.style.overflow = ''; }
  };

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

      $('#pqr-btn-3').addEventListener('click', () => {
        this.datos.lote = $('#pqr-lote').value.trim();
        this.avanzar();
      });

      $('#pqr-lote').addEventListener('keydown', e => {
        if (e.key === 'Enter') { this.datos.lote = e.target.value.trim(); this.avanzar(); }
      });

      $('#pqr-btn-4').addEventListener('click', () => this.validarYEnviar());

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
        this.flujo = valor === 'Comentario' ? [1, 4] : [1, 2, 3, 4];

      setTimeout(() => this.avanzar(), 320);
    },

    avanzar() {
      this.idx++;
      this.mostrar(this.idx >= this.flujo.length ? 5 : this.flujo[this.idx]);
    },

    mostrar(numPaso) {
      $('.pqr-paso.activo', this.overlay)?.classList.remove('activo');

      const paso = $(`#pqr-paso-${numPaso}`);
      if (!paso) return;
      paso.classList.add('activo');

      if (numPaso === 4)
        this.num4.innerHTML = `${this.flujo.length <= 2 ? '02' : '04'} <span>\u2192</span>`;

      const enExito = numPaso === 5;
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
      const btn = $('#pqr-btn-4');
      btn.disabled    = true;
      btn.textContent = 'Enviando\u2026';

      const params = new URLSearchParams({
        fecha:      new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
        tipo:       this.datos.tipo,
        producto:   this.datos.producto,
        lote:       this.datos.lote,
        comentario: this.datos.comentario
      });

      fetch(`${this.url}?${params}`, { method: 'GET', mode: 'no-cors' })
        .catch(() => {})
        .finally(() => {
          this.idx = this.flujo.length;
          this.mostrar(5);
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
      this.datos = { tipo: '', producto: '', lote: '', comentario: '' };
      this.flujo = [1, 2, 3, 4];
      this.idx   = 0;

      $$('.pqr-paso', this.overlay).forEach(p => p.classList.remove('activo'));
      $('#pqr-paso-1').classList.add('activo');
      $$('.pqr-opcion', this.overlay).forEach(b => b.classList.remove('seleccionado'));

      $('#pqr-lote').value = '';
      const desc = $('#pqr-desc');
      desc.value = '';
      desc.classList.remove('pqr-campo-error');
      $('#pqr-error-desc').hidden = true;
      this.num4.innerHTML = '04 <span>\u2192</span>';

      this.barra.style.width = '0%';
      this.progressbar.setAttribute('aria-valuenow', '0');
      this.conteo.textContent = 'Paso 1 de 4';
      this.btnAtras.style.visibility = 'hidden';
    }
  };

  /* ── Boot ─────────────────────────────────────────────────────────── */
  const boot = () => {
    MobileNav.init();
    SocialProof.init();
    WhatsApp.init();
    ScrollBtn.init();
    PQR.init();
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();

})();
