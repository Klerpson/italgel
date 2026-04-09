/**
 * WhatsApp Integration Module
 * @version 3.0
 */

(function() {
  'use strict';

  const CONFIG = {
    phoneNumber: '573192346788',
    defaultMessage: 'Hola! Me interesa información sobre los productos que vi en ',
    scrollThreshold: 100
  };

  // ============================================
  // GENERADOR DE URLS DE WHATSAPP
  // ============================================
  const WhatsAppURL = {
    generate(message) {
      // wa.me gestiona automáticamente app vs web en cualquier dispositivo
      return `https://wa.me/${CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
    },
    getMessage() {
      return `${CONFIG.defaultMessage}${window.location.href}`;
    }
  };

  // ============================================
  // MODAL DE FALLBACK (solo si popup bloqueado)
  // ============================================
  const FallbackModal = {
    create() {
      if (document.getElementById('whatsapp-fallback-modal')) return;

      const modalHTML = `
        <div id="whatsapp-fallback-modal" class="whatsapp-modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
          <div class="whatsapp-modal-content">
            <button class="whatsapp-modal-close" aria-label="Cerrar modal">&times;</button>
            <div class="whatsapp-modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.56-.01-.188 0-.495.074-.754.371-.26.297-.99.967-.99 2.357 0 1.39 1.016 2.732 1.156 2.92.14.187 1.98 3.024 4.792 4.24.671.296 1.194.472 1.602.604.673.215 1.285.184 1.77.112.54-.081 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
              </svg>
            </div>
            <h2 id="modal-title">¿No se abrió WhatsApp?</h2>
            <p>Puedes contactarnos directamente:</p>
            <div class="whatsapp-modal-actions">
              <a href="tel:+${CONFIG.phoneNumber}" class="whatsapp-modal-btn whatsapp-modal-btn-secondary">
                📞 Llamar ahora
              </a>
              <button id="whatsapp-retry-btn" class="whatsapp-modal-btn whatsapp-modal-btn-primary">
                🔄 Intentar de nuevo
              </button>
            </div>
            <p class="whatsapp-modal-footer">
              O copia este número: <strong>+${CONFIG.phoneNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4')}</strong>
            </p>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHTML);
      this.attachEvents();
    },

    attachEvents() {
      const modal = document.getElementById('whatsapp-fallback-modal');
      const closeBtn = modal.querySelector('.whatsapp-modal-close');
      const retryBtn = document.getElementById('whatsapp-retry-btn');

      closeBtn.addEventListener('click', () => this.hide());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.hide();
      });

      retryBtn.addEventListener('click', () => {
        this.hide();
        window.open(WhatsAppURL.generate(WhatsAppURL.getMessage()), '_blank');
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          this.hide();
        }
      });
    },

    show() {
      const modal = document.getElementById('whatsapp-fallback-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    hide() {
      const modal = document.getElementById('whatsapp-fallback-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };

  // ============================================
  // MANEJADOR DE CLICKS EN WHATSAPP
  // ============================================
  const WhatsAppHandler = {
    init() {
      // .whatsapp-float cubre el botón flotante (que también tiene id="lead_whatsapp" para GTM)
      document.querySelectorAll('.whatsapp-float').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleClick();
        });
      });
    },

    handleClick() {
      const message = WhatsAppURL.getMessage();
      const url = WhatsAppURL.generate(message);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'whatsapp_click',
        whatsapp_number: CONFIG.phoneNumber,
        whatsapp_message: message,
        page_url: window.location.href,
        timestamp: new Date().toISOString()
      });

      // wa.me gestiona app vs web automáticamente en móvil y desktop
      const whatsappWindow = window.open(url, '_blank');

      // Solo mostrar modal si el popup fue bloqueado por el navegador
      if (!whatsappWindow) {
        FallbackModal.show();
      }
    }
  };

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  const ScrollButton = {
    init() {
      const btn = document.querySelector('.scroll-up-btn');
      if (!btn) return;

      window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > CONFIG.scrollThreshold);
      }, { passive: true });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  function init() {
    FallbackModal.create();
    WhatsAppHandler.init();
    ScrollButton.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
