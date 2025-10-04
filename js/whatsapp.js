/**
 * WhatsApp Integration Module
 * Maneja CTAs de WhatsApp con detección de dispositivo, app instalada y fallback modal
 * @version 2.0
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURACIÓN
  // ============================================
  const CONFIG = {
    phoneNumber: '573192346788', // Número de WhatsApp (sin + ni espacios)
    defaultMessage: 'Hola! Me interesa información sobre los productos que vi en ',
    modalTimeout: 3000, // Tiempo para detectar si se envió mensaje (ms)
    scrollThreshold: 100 // Píxeles para mostrar botón scroll-up
  };

  // ============================================
  // DETECCIÓN DE DISPOSITIVO Y APP
  // ============================================
  const DeviceDetector = {
    isMobile: /iPhone|Android|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
    isAndroid: /Android/i.test(navigator.userAgent),
    
    /**
     * Detecta si WhatsApp está instalado (solo móvil)
     * En desktop siempre retorna false para forzar WhatsApp Web
     */
    hasWhatsAppInstalled() {
      if (!this.isMobile) return false;
      
      // iOS: Intentar abrir custom URL scheme
      if (this.isIOS) {
        return true; // iOS siempre intenta abrir app, fallback automático a web
      }
      
      // Android: Asumir que está instalado (96% de dispositivos Android tienen WhatsApp)
      if (this.isAndroid) {
        return true;
      }
      
      return false;
    }
  };

  // ============================================
  // GENERADOR DE URLS DE WHATSAPP
  // ============================================
  const WhatsAppURL = {
    /**
     * Genera URL de WhatsApp según dispositivo y disponibilidad de app
     * @param {string} message - Mensaje pre-llenado
     * @returns {string} URL completa de WhatsApp
     */
    generate(message) {
      const encodedMessage = encodeURIComponent(message);
      
      // Móvil con app instalada: URL directa a la app
      if (DeviceDetector.isMobile && DeviceDetector.hasWhatsAppInstalled()) {
        return `https://wa.me/${CONFIG.phoneNumber}?text=${encodedMessage}`;
      }
      
      // Desktop o móvil sin app: WhatsApp Web
      return `https://web.whatsapp.com/send?phone=${CONFIG.phoneNumber}&text=${encodedMessage}`;
    },
    
    /**
     * Genera mensaje personalizado con URL de la página actual
     * @returns {string} Mensaje formateado
     */
    getMessage() {
      const currentURL = window.location.href;
      return `${CONFIG.defaultMessage}${currentURL}`;
    }
  };

  // ============================================
  // MODAL DE FALLBACK
  // ============================================
  const FallbackModal = {
    /**
     * Crea el modal HTML si no existe
     */
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
      this.addStyles();
      this.attachEvents();
    },
    
    /**
     * Agrega estilos CSS del modal
     */
    addStyles() {
      if (document.getElementById('whatsapp-modal-styles')) return;
      
      const styles = `
        <style id="whatsapp-modal-styles">
          .whatsapp-modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 10001;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            animation: fadeIn 0.3s ease;
          }
          
          .whatsapp-modal.active {
            display: flex;
          }
          
          .whatsapp-modal-content {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 400px;
            width: 100%;
            text-align: center;
            position: relative;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
          }
          
          .whatsapp-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: transparent;
            border: none;
            font-size: 2rem;
            color: #666;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
          }
          
          .whatsapp-modal-close:hover {
            background: #f0f0f0;
            color: #333;
          }
          
          .whatsapp-modal-icon {
            margin-bottom: 1rem;
          }
          
          .whatsapp-modal h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #333;
          }
          
          .whatsapp-modal p {
            color: #666;
            margin-bottom: 1.5rem;
          }
          
          .whatsapp-modal-actions {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }
          
          .whatsapp-modal-btn {
            padding: 0.875rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-block;
          }
          
          .whatsapp-modal-btn-primary {
            background: #25D366;
            color: white;
          }
          
          .whatsapp-modal-btn-primary:hover {
            background: #128C7E;
            transform: translateY(-2px);
          }
          
          .whatsapp-modal-btn-secondary {
            background: #f0f0f0;
            color: #333;
          }
          
          .whatsapp-modal-btn-secondary:hover {
            background: #e0e0e0;
          }
          
          .whatsapp-modal-footer {
            font-size: 0.875rem;
            color: #999;
            margin: 0;
          }
          
          .whatsapp-modal-footer strong {
            color: #25D366;
            user-select: all;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>
      `;
      
      document.head.insertAdjacentHTML('beforeend', styles);
    },
    
    /**
     * Adjunta eventos al modal
     */
    attachEvents() {
      const modal = document.getElementById('whatsapp-fallback-modal');
      const closeBtn = modal.querySelector('.whatsapp-modal-close');
      const retryBtn = document.getElementById('whatsapp-retry-btn');
      
      // Cerrar modal
      closeBtn.addEventListener('click', () => this.hide());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.hide();
      });
      
      // Reintentar
      retryBtn.addEventListener('click', () => {
        this.hide();
        const message = WhatsAppURL.getMessage();
        const url = WhatsAppURL.generate(message);
        window.open(url, '_blank');
      });
      
      // Cerrar con ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          this.hide();
        }
      });
    },
    
    /**
     * Muestra el modal
     */
    show() {
      const modal = document.getElementById('whatsapp-fallback-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },
    
    /**
     * Oculta el modal
     */
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
    /**
     * Inicializa los enlaces de WhatsApp
     */
    init() {
      const whatsappLinks = document.querySelectorAll('a#lead_whatsapp, .whatsapp-float');
      
      whatsappLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleClick();
        });
      });
    },
    
    /**
     * Maneja el click en un enlace de WhatsApp
     */
    handleClick() {
      const message = WhatsAppURL.getMessage();
      const url = WhatsAppURL.generate(message);
      
      // Abrir WhatsApp
      const whatsappWindow = window.open(url, '_blank');
      
      // Detectar si el mensaje no se envió (ventana se cerró rápido o no se abrió)
      setTimeout(() => {
        // Si la ventana se cerró o no tiene foco, mostrar modal
        if (!whatsappWindow || whatsappWindow.closed || !whatsappWindow.document.hasFocus()) {
          FallbackModal.show();
        }
      }, CONFIG.modalTimeout);
    }
  };

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  const ScrollButton = {
    init() {
      const scrollUpBtn = document.querySelector('.scroll-up-btn');
      if (!scrollUpBtn) return;
      
      // Mostrar/ocultar según scroll
      window.addEventListener('scroll', () => {
        if (window.scrollY > CONFIG.scrollThreshold) {
          scrollUpBtn.classList.add('visible');
        } else {
          scrollUpBtn.classList.remove('visible');
        }
      }, { passive: true });
      
      // Scroll suave al top
      scrollUpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  function init() {
    // Crear modal de fallback
    FallbackModal.create();
    
    // Inicializar manejadores
    WhatsAppHandler.init();
    ScrollButton.init();
    
    console.log('✅ WhatsApp Integration loaded successfully');
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();