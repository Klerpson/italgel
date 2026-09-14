/**
 * lead-whatsapp.js — sistema único de WhatsApp para todos los sitios
 * Versión 2.1
 *
 * ---------------------------------------------------------------------------
 * QUÉ HACE, IGUAL EN TODOS LOS SITIOS
 * ---------------------------------------------------------------------------
 *   1. Cuenta TODOS los clics que salen de la web hacia WhatsApp.
 *   2. Manda el mensaje prellenado que corresponde a la página.
 *   3. Si el usuario se va a WhatsApp y vuelve enseguida sin haber escrito,
 *      le enseña un cuadro flotante para recuperar el lead.
 *
 * Lo que CAMBIA de un sitio a otro (número, mensaje, nombre del evento,
 * parámetros de analítica, CSS del cuadro) no se toca aquí: se declara en el
 * <body> desde _config.yml. Este archivo es idéntico en todos los proyectos, y
 * así se puede corregir un fallo una vez y repartirlo.
 *
 * ---------------------------------------------------------------------------
 * POR QUÉ ENGANCHA POR EL DESTINO DEL ENLACE Y NO POR UNA CLASE
 * ---------------------------------------------------------------------------
 * La primera versión de esto enganchaba por una clase CSS. Bastaba con que
 * alguien escribiera un enlace a mano, o le pasara su propia clase a un
 * include, para que ese clic dejara de contarse sin que nada avisara: en un
 * sitio eran 95 enlaces de 2 345 los que no se medían. Aquí el gancho es el
 * destino: si el enlace va a WhatsApp, se mide. No se puede olvidar, no se
 * puede sobrescribir, y los enlaces que se añadan mañana quedan cubiertos.
 *
 * ---------------------------------------------------------------------------
 * CONFIGURACIÓN — atributos del <body>, que el layout rellena desde _config.yml
 * ---------------------------------------------------------------------------
 *   data-wa-phone     Número completo con indicativo. Obligatorio.
 *   data-wa-message   Mensaje por defecto.
 *   data-wa-context   Contexto de la página (producto, servicio, tratamiento).
 *                     Viaja en la analítica. NO se añade al mensaje: el
 *                     mensaje lo compone el layout entero, en data-wa-message.
 *   data-wa-event     Nombre del evento. Por defecto "whatsapp_click". Se
 *                     configura cuando el sitio ya tiene etiquetas de GA4
 *                     esperando otro nombre: cambiarlo las rompería.
 *   data-wa-params    JSON con parámetros fijos del sitio, que se fusionan en
 *                     cada evento. Aquí viven las dimensiones propias de cada
 *                     negocio (valor de conversión, categoría, variante A/B…).
 *   data-wa-track     "off" si el sitio ya mide los clics por su cuenta. Apaga
 *                     SOLO la medición; la recuperación de lead sigue activa.
 *   data-wa-styles    "off" si el sitio define su propio CSS para el cuadro.
 *   data-wa-class     Clases del sitio para el botón principal del cuadro, para
 *                     que se vea como el resto de botones de esa web.
 *
 * Cada enlace puede pedir lo suyo:
 *   data-wa-phone     Número propio (otra oficina, otro país, otro proyecto).
 *   data-wa-text      Mensaje propio de ese botón.
 *   data-wa-location  Nombre del botón, para separarlo en los informes.
 *   data-wa-extra     Coletilla que se añade al final del mensaje.
 *   Si el href ya trae ?text=, ese mensaje manda sobre todo lo demás.
 *
 * ---------------------------------------------------------------------------
 * COMPROBAR QUE ESTÁ BIEN PUESTO
 * ---------------------------------------------------------------------------
 * En la consola del navegador:  LeadWhatsApp.diagnostico()
 */
(function () {
  "use strict";

  var VERSION = "2.1";

  // ==========================================================================
  // CONFIGURACIÓN
  // ==========================================================================

  var body = document.body;
  if (!body) return;

  function json(valor) {
    if (!valor) return {};
    try {
      var o = JSON.parse(valor);
      return o && typeof o === "object" ? o : {};
    } catch (e) {
      // Un JSON mal escrito en el layout no debe dejar el sitio sin medición.
      return {};
    }
  }

  var CONFIG = {
    phone: (body.dataset.waPhone || "").replace(/[^0-9]/g, ""),
    message: body.dataset.waMessage || "",
    context: body.dataset.waContext || "",
    evento: body.dataset.waEvent || "whatsapp_click",
    params: json(body.dataset.waParams),
    medir: body.dataset.waTrack !== "off",
    estilos: body.dataset.waStyles !== "off",
    claseBoton: body.dataset.waClass || "",
    lang: (document.documentElement.lang || "es").slice(0, 2).toLowerCase()
  };

  // Sin número no hay nada que hacer, pero los enlaces de la página pueden
  // llevarlo: se toma de ahí antes que rendirse en silencio.
  if (!CONFIG.phone) {
    var muestra = document.querySelector('a[href*="wa.me/"]');
    var m = muestra && (muestra.getAttribute("href") || "").match(/wa\.me\/(\d{6,15})/);
    if (m) CONFIG.phone = m[1];
  }

  // Todas las formas de enlazar a WhatsApp, más las convenciones de clase y
  // atributo que ya existían en los distintos sitios: así el sistema también
  // cubre los botones cuyo href lo monta el propio JavaScript.
  var SELECTOR = [
    'a[href*="wa.me/"]',
    'a[href*="api.whatsapp.com"]',
    'a[href*="web.whatsapp.com"]',
    'a[href^="whatsapp:"]',
    ".lead-whatsapp",
    ".lead_whatsapp",
    "[data-whatsapp-link]",
    "[data-whatsapp-action]",
    "[data-wa-trigger]",
    ".whatsapp-float"
  ].join(", ");

  var esMovil = /iPhone|Android|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|IEMobile|Mobile/i.test(
    navigator.userAgent
  );

  // ==========================================================================
  // ANALÍTICA
  // ==========================================================================

  var Analytics = {
    /**
     * Se empuja al dataLayer, que es lo que leen GTM y GA4. Si el sitio aún no
     * tiene contenedor configurado esto no falla: el array queda en memoria y
     * GTM lo recoge en cuanto se instale.
     */
    push: function (datos) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(datos);
      if (typeof window.gtag === "function") {
        window.gtag("event", datos.event, datos);
      }
    },

    /** Lo que el módulo sabe por sí mismo, en todos los sitios por igual. */
    base: function () {
      return {
        device_type: esMovil ? "mobile" : "desktop",
        page_path: window.location.pathname,
        page_context: CONFIG.context || "(ninguno)",
        language: CONFIG.lang
      };
    },

    clic: function (ubicacion) {
      if (!CONFIG.medir) return;
      var datos = this.base();
      datos.button_location = ubicacion || "sin-ubicacion";
      // Los parámetros del sitio se fusionan encima: son los que sus etiquetas
      // de GA4 ya esperan, así que mandan sobre los genéricos.
      for (var k in CONFIG.params) {
        if (Object.prototype.hasOwnProperty.call(CONFIG.params, k)) {
          datos[k] = CONFIG.params[k];
        }
      }
      datos.event = CONFIG.evento;
      this.push(datos);
    },

    recuperacion: function (evento) {
      var datos = this.base();
      datos.event = evento;
      this.push(datos);
    }
  };

  // ==========================================================================
  // RECUPERACIÓN DE LEAD
  // ==========================================================================

  /**
   * Detecta que el usuario pulsó WhatsApp, se fue de verdad, y volvió
   * demasiado pronto como para haber escrito.
   *
   * Hacen falta las DOS mitades, y que faltara la primera es lo que hacía que
   * el cuadro apareciera cuando no debía:
   *
   *   1. Una salida real: la página tiene que haberse ocultado estando armada.
   *      Recuperar el foco de la ventana NO cuenta — eso pasa al volver de otra
   *      pestaña, de otra aplicación o del escritorio, sin pisar WhatsApp.
   *   2. Un regreso rápido: el tiempo se mide desde que se fue, no desde el
   *      clic, y la ventana es corta.
   *
   * Sigue siendo una aproximación: el navegador no puede saber si llegó a
   * enviar el mensaje. Los umbrales están puestos para equivocarse callando.
   * Subir MAX_FUERA recupera más leads a costa de molestar a quien ya escribió.
   */
  var Recuperacion = {
    MIN_FUERA: 1500,
    MAX_FUERA: 12000,
    // La salida tiene que ser consecuencia del clic, no de cualquier cosa que
    // pase después. Ver marcarSalida.
    MAX_TRAS_CLIC: 10000,
    K_PENDIENTE: "wa_pendiente",
    K_CLIC: "wa_clic",
    K_SALIDA: "wa_salida",
    K_MOSTRADO: "wa_recuperacion_mostrada",
    K_MENSAJE: "wa_mensaje_pendiente",
    K_NUMERO: "wa_numero_pendiente",

    // sessionStorage lanza en modo privado y con el almacenamiento bloqueado.
    // Nunca debe tumbar el resto del módulo.
    leer: function (k) {
      try { return sessionStorage.getItem(k); } catch (e) { return null; }
    },
    escribir: function (k, v) {
      try { sessionStorage.setItem(k, v); } catch (e) {}
    },
    borrar: function (k) {
      try { sessionStorage.removeItem(k); } catch (e) {}
    },

    /** Se arma justo antes de saltar a WhatsApp. */
    armar: function (numero, mensaje) {
      if (this.leer(this.K_MOSTRADO)) return;
      this.escribir(this.K_PENDIENTE, "1");
      this.escribir(this.K_CLIC, String(Date.now()));
      this.borrar(this.K_SALIDA);
      // Número y mensaje se guardan porque en móvil la vuelta puede ser una
      // carga completa: entonces esta instancia ya no existe y, sin esto, el
      // cuadro ofrecería algo distinto de lo que el usuario iba a enviar.
      if (numero) this.escribir(this.K_NUMERO, numero);
      if (mensaje) this.escribir(this.K_MENSAJE, mensaje);
    },

    /**
     * Sella que la página se ocultó estando armada: se fue de verdad.
     *
     * Y que se ocultó POR EL CLIC, que es lo que faltaba: armar() no caducaba
     * nunca, así que un clic que no llegó a abrir nada dejaba wa_pendiente
     * puesto el resto de la sesión y el primer cambio de pestaña por cualquier
     * otro motivo sellaba una salida falsa. El cuadro salía sin que el usuario
     * hubiera pisado WhatsApp — el mismo fallo que se creyó arreglado quitando
     * el listener de 'focus'. La salida real llega en menos de un segundo:
     * abrir la pestaña en escritorio o descargar la página en móvil.
     */
    marcarSalida: function () {
      if (!this.leer(this.K_PENDIENTE)) return;
      if (this.leer(this.K_SALIDA)) return;

      var clic = Number(this.leer(this.K_CLIC));
      if (!clic || Date.now() - clic > this.MAX_TRAS_CLIC) {
        this.borrar(this.K_PENDIENTE);
        this.borrar(this.K_CLIC);
        return;
      }
      this.escribir(this.K_SALIDA, String(Date.now()));
    },

    procede: function () {
      if (this.leer(this.K_MOSTRADO)) return false;
      if (!this.leer(this.K_PENDIENTE)) return false;

      var salida = Number(this.leer(this.K_SALIDA));
      if (!salida) return false;

      var fuera = Date.now() - salida;
      this.borrar(this.K_PENDIENTE);
      this.borrar(this.K_CLIC);
      this.borrar(this.K_SALIDA);

      return fuera >= this.MIN_FUERA && fuera <= this.MAX_FUERA;
    },

    mensajePendiente: function () { return this.leer(this.K_MENSAJE); },
    numeroPendiente: function () { return this.leer(this.K_NUMERO); },

    marcarMostrado: function () {
      this.escribir(this.K_MOSTRADO, "1");
      this.borrar(this.K_PENDIENTE);
      this.borrar(this.K_CLIC);
      this.borrar(this.K_SALIDA);
    },

    /**
     * El tope de una aparición por sesión es deliberado: el cuadro interrumpe,
     * y repetirlo en cada botón de la página molesta más de lo que recupera.
     */
    vigilar: function (alVolver) {
      var self = this;
      var comprobar = function () {
        if (document.visibilityState !== "visible") return;
        if (!self.procede()) return;
        self.marcarMostrado();
        alVolver();
      };

      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") self.marcarSalida();
        else comprobar();
      });

      // En móvil la salida descarga la página. Según el navegador llega
      // visibilitychange, pagehide, o ambos: marcarSalida sella solo la primera
      // vez, así que escuchar las dos no duplica nada.
      window.addEventListener("pagehide", function () { self.marcarSalida(); });
      window.addEventListener("pageshow", comprobar);

      // Aquí NO se escucha 'focus' a propósito: saltaba al volver a la ventana
      // desde cualquier parte y era la causa de que el cuadro saliera sin motivo.

      // Comprobación inmediata: si el navegador no usó bfcache, la vuelta es una
      // carga completa y el evento de retorno ya pasó antes de que estos
      // listeners existieran. El sello de salida sobrevive en sessionStorage.
      comprobar();
    }
  };

  // ==========================================================================
  // CUADRO DE RECUPERACIÓN
  // ==========================================================================

  var TEXTOS = {
    es: {
      titulo: "¿Seguimos por WhatsApp?",
      subtitulo: "Si no llegaste a enviar el mensaje, retómalo desde aquí.",
      principal: "Abrir WhatsApp",
      copiar: "Copiar número",
      copiado: "¡Número copiado!",
      cerrar: "Cerrar"
    },
    en: {
      titulo: "Continue on WhatsApp?",
      subtitulo: "If you didn’t get to send your message, pick it up here.",
      principal: "Open WhatsApp",
      copiar: "Copy number",
      copiado: "Number copied!",
      cerrar: "Close"
    }
  };

  /**
   * Estilos por defecto, para que el cuadro se vea bien en cualquier sitio sin
   * tocar su cadena de CSS. Heredan la tipografía, así que adoptan la del sitio.
   *
   * Para vestirlo con el diseño propio de un proyecto hay dos vías:
   *   - data-wa-class en el <body>: las clases de sus botones se añaden al
   *     botón principal, y ya se ve como el resto de la web.
   *   - data-wa-styles="off": no se inyecta nada y el CSS del sitio manda.
   * Escribir reglas propias de .lead-wa-* también funciona sin desactivar nada:
   * al cargarse después, ganan sin necesidad de !important.
   */
  function inyectarEstilos() {
    if (!CONFIG.estilos) return;
    if (document.getElementById("lead-wa-estilos")) return;
    var css =
      // box-sizing propio: no se puede dar por hecho que el sitio traiga un
      // reset. Sin esto el padding se suma al width y el botón se desborda.
      ".lead-wa-modal,.lead-wa-modal *{box-sizing:border-box}" +
      ".lead-wa-modal{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;" +
      "display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;" +
      "visibility:hidden;transition:opacity .3s ease,visibility 0s linear .3s}" +
      ".lead-wa-modal.is-open{opacity:1;visibility:visible;transition:opacity .3s ease,visibility 0s linear 0s}" +
      ".lead-wa-card{background:#fff;color:#1a1a1a;border-radius:16px;padding:2rem 1.75rem;" +
      "max-width:400px;width:100%;position:relative;text-align:center;font-family:inherit;" +
      "box-shadow:0 20px 60px rgba(0,0,0,.25);transform:translateY(12px);transition:transform .3s ease}" +
      ".lead-wa-modal.is-open .lead-wa-card{transform:translateY(0)}" +
      ".lead-wa-card h3{margin:0 0 .5rem;font-size:1.25rem;font-family:inherit;color:inherit;" +
      "line-height:1.3;text-transform:none;letter-spacing:normal}" +
      ".lead-wa-sub{margin:0;font-size:.9rem;line-height:1.45;color:#555}" +
      ".lead-wa-acciones{display:flex;flex-direction:column;gap:.75rem;margin:1.5rem 0 0}" +
      ".lead-wa-btn{display:block;width:100%;padding:.875rem 1.25rem;border:none;border-radius:12px;" +
      "font:inherit;font-weight:600;text-decoration:none;text-align:center;cursor:pointer;" +
      "transition:background .25s ease,transform .25s ease}" +
      ".lead-wa-btn--wa{background:#25d366;color:#fff}" +
      ".lead-wa-btn--wa:hover{background:#1da851;color:#fff;transform:translateY(-2px)}" +
      ".lead-wa-btn--sec{background:#f1f1f1;color:#333}" +
      ".lead-wa-btn--sec:hover{background:#e4e4e4}" +
      ".lead-wa-cerrar{position:absolute;top:8px;right:12px;background:none;border:none;" +
      "font-size:1.5rem;line-height:1;color:#999;cursor:pointer;padding:4px 8px}" +
      ".lead-wa-cerrar:hover{color:#333}" +
      "@media (prefers-reduced-motion:reduce){.lead-wa-modal,.lead-wa-card,.lead-wa-btn{transition:none}" +
      ".lead-wa-card{transform:none}}";
    var s = document.createElement("style");
    s.id = "lead-wa-estilos";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function copiarNumero(numero) {
    // Se devuelve la promesa para que quien llame sepa si funcionó de verdad:
    // writeText rechaza sin foco o sin permiso, y anunciar "copiado" con el
    // portapapeles vacío deja al usuario sin el número.
    if (!navigator.clipboard) return Promise.reject(new Error("sin portapapeles"));
    return navigator.clipboard.writeText(numero);
  }

  function mostrarCuadro() {
    if (document.querySelector(".lead-wa-modal")) return;
    inyectarEstilos();

    var t = TEXTOS[CONFIG.lang] || TEXTOS.es;
    var numero = Recuperacion.numeroPendiente() || CONFIG.phone;
    var texto = Recuperacion.mensajePendiente() || construirMensaje(null);
    var href = destinoDe(numero, texto);

    Analytics.recuperacion("lead_recovery_shown");

    var modal = document.createElement("div");
    modal.className = "lead-wa-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", t.titulo);

    var clasesPrincipal = "lead-wa-btn lead-wa-btn--wa" +
      (CONFIG.claseBoton ? " " + CONFIG.claseBoton : "");

    modal.innerHTML =
      '<div class="lead-wa-card">' +
      "<h3>" + t.titulo + "</h3>" +
      '<p class="lead-wa-sub">' + t.subtitulo + "</p>" +
      '<div class="lead-wa-acciones">' +
      '<a class="' + clasesPrincipal + '" href="' + href +
      '" target="_blank" rel="nofollow noopener noreferrer">' + t.principal + "</a>" +
      '<button type="button" class="lead-wa-btn lead-wa-btn--sec lead-wa-copiar">' + t.copiar + "</button>" +
      "</div>" +
      '<button type="button" class="lead-wa-cerrar" aria-label="' + t.cerrar + '">&times;</button>' +
      "</div>";

    document.body.appendChild(modal);

    // Hay que forzar que el navegador calcule el estado opacity:0 ANTES de
    // añadir la clase; si no, colapsa ambos estilos y no se ve la transición.
    // Se usa un reflow síncrono y no requestAnimationFrame porque rAF no se
    // ejecuta en pestañas ocultas, y este cuadro aparece justo al volver: si la
    // pestaña se ocultara antes del primer frame, se quedaría invisible con la
    // sesión ya marcada como mostrada, y el lead se perdería en silencio.
    void modal.offsetWidth;
    modal.classList.add("is-open");

    var alPulsarTecla = function (e) {
      if (e.key === "Escape") cerrar();
    };

    function cerrar() {
      modal.classList.remove("is-open");
      document.removeEventListener("keydown", alPulsarTecla);
      // transitionend es la vía normal, pero no llega si la pestaña se oculta a
      // mitad del fundido. Sin red de seguridad el overlay se queda en el DOM
      // tapando la página entera. remove() es idempotente.
      var quitar = function () { modal.remove(); };
      modal.addEventListener("transitionend", function (e) {
        if (e.propertyName === "opacity") quitar();
      }, { once: true });
      setTimeout(quitar, 400);
    }

    modal.addEventListener("click", function (e) { if (e.target === modal) cerrar(); });
    modal.querySelector(".lead-wa-cerrar").addEventListener("click", cerrar);
    modal.querySelector(".lead-wa-btn--wa").addEventListener("click", function () {
      Analytics.recuperacion("lead_recovery_click");
      cerrar();
    });
    modal.querySelector(".lead-wa-copiar").addEventListener("click", function (e) {
      var boton = e.currentTarget;
      var original = boton.textContent;
      copiarNumero(numero)
        .then(function () { boton.textContent = t.copiado; })
        .catch(function () { boton.textContent = numero; })
        .then(function () {
          setTimeout(function () { boton.textContent = original; }, 2000);
        });
    });
    document.addEventListener("keydown", alPulsarTecla);
    modal.querySelector(".lead-wa-btn--wa").focus();
  }

  // ==========================================================================
  // NÚMERO, MENSAJE Y UBICACIÓN
  // ==========================================================================

  /**
   * Número al que va ESTE enlace.
   *
   * No se puede imponer el número del <body> a todos: hay sitios con una línea
   * por oficina, por proyecto o por país, y reescribir el href mandaría esos
   * leads al comercial equivocado. El del <body> es solo el de reserva.
   */
  function numeroDe(enlace) {
    if (enlace && enlace.dataset.waPhone) {
      return enlace.dataset.waPhone.replace(/[^0-9]/g, "");
    }
    if (enlace) {
      var href = enlace.getAttribute("href") || "";
      var m = href.match(/wa\.me\/(\d{6,15})/) || href.match(/[?&]phone=\+?(\d{6,15})/);
      if (m) return m[1];
    }
    return CONFIG.phone;
  }

  /** Único sitio donde se decide qué mensaje se manda. */
  function construirMensaje(enlace) {
    // 1. Lo que pida el enlace concreto.
    if (enlace && enlace.dataset.waText) return encodeURIComponent(enlace.dataset.waText);

    // 2. Lo que ya trajera el href (un include que compuso su propio texto).
    if (enlace) {
      var href = enlace.getAttribute("href") || "";
      var m = href.match(/[?&]text=([^&]*)/);
      if (m && m[1]) return m[1];
    }

    // 3. El mensaje del sitio tal cual. El layout lo compone entero, porque es
    //    quien sabe el idioma, el producto y el tratamiento de la página; el
    //    módulo no le añade nada por su cuenta.
    if (!CONFIG.message) return "";
    var base = CONFIG.message;

    // Salvo la coletilla del propio botón ("Me interesa: hilos tensores"), que
    // expresa la intención de ESE enlace y el layout no puede conocer.
    if (enlace) {
      var extra = enlace.dataset.waExtra || enlace.dataset.extra || "";
      if (extra) base += extra;
    }
    return encodeURIComponent(base);
  }

  /** De dónde salió el clic, para poder separarlo en los informes. */
  function ubicacionDe(enlace) {
    // Se respetan las convenciones que ya existían en cada sitio.
    var d = enlace.dataset;
    if (d.waLocation) return d.waLocation;
    if (d.wa) return d.wa;
    if (d.location) return d.location;
    if (d.buttonType) return d.buttonType;

    // Si no lo dice nadie, se deduce de la sección donde vive el enlace, que en
    // los informes es más útil que un "desconocido" repetido miles de veces.
    var zona = enlace.closest("header,nav,footer,aside,main,section,article");
    if (zona) {
      if (zona.tagName === "HEADER") return "cabecera";
      if (zona.tagName === "NAV") return "menu";
      if (zona.tagName === "FOOTER") return "pie";
      if (zona.id) return zona.id;
      if (zona.className && typeof zona.className === "string") {
        return zona.className.trim().split(/\s+/)[0] || "cuerpo";
      }
    }
    return "cuerpo";
  }

  // ==========================================================================
  // APERTURA
  // ==========================================================================

  /**
   * Siempre a wa.me, nunca al protocolo whatsapp://.
   *
   * El protocolo parecía mejor en escritorio (entrega directa a la aplicación
   * instalada) y rompía las dos cosas a la vez:
   *
   *   1. No navega ni oculta esta página. La recuperación de lead necesita que
   *      la página se oculte para sellar la salida, así que en escritorio NUNCA
   *      llegaba a sellarla: procede() devolvía false siempre y el cuadro no
   *      aparecía jamás. Comprobado: con la salida puesta a mano, el cuadro se
   *      pinta perfecto — lo que faltaba era la salida.
   *   2. El diálogo "¿Abrir WhatsApp?" de Chrome le quita el foco a la ventana,
   *      y ese blur ponía abrio = true, que cancelaba la pestaña de reserva de
   *      los 1,5 s. Quien cerrara el diálogo, o no tuviera la aplicación, se
   *      quedaba sin nada: el clic no hacía absolutamente nada visible.
   *
   * wa.me ya decide por su cuenta app de escritorio, app móvil o WhatsApp Web,
   * y tiene salida para quien no la tenga instalada.
   *
   * En escritorio se abre en pestaña nueva a propósito: esta página sigue viva
   * detrás (se oculta → sella la salida) y es a la que vuelve el usuario. En
   * móvil se navega en la misma pestaña porque es la entrega más fiable a la
   * aplicación; ahí la señal de salida es el pagehide de la descarga y el
   * regreso es el botón atrás.
   */
  function destinoDe(numero, mensaje) {
    return "https://wa.me/" + numero + (mensaje ? "?text=" + mensaje : "");
  }

  function esEnlace(el) {
    return el.tagName === "A" && el.hasAttribute("href");
  }

  // ==========================================================================
  // ARRANQUE
  // ==========================================================================

  function alHacerClic(e) {
    var enlace = e.target.closest(SELECTOR);
    if (!enlace) return;

    var numero = numeroDe(enlace);
    var mensaje = construirMensaje(enlace);
    var destino = destinoDe(numero, mensaje);

    Analytics.clic(ubicacionDe(enlace));
    Recuperacion.armar(numero, mensaje);

    // Con Ctrl/Cmd o botón central el navegador abre en otra pestaña: no se
    // interfiere, pero el clic sí se cuenta. El href se actualiza igualmente
    // para que esa pestaña lleve el mensaje de la página, no el wa.me pelado.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
      if (esEnlace(enlace)) enlace.setAttribute("href", destino);
      return;
    }

    // Móvil: misma pestaña.
    if (esMovil) {
      e.preventDefault();
      window.location.href = destino;
      return;
    }

    // Escritorio: pestaña nueva. Si el gancho es un enlace de verdad se le
    // reescribe el href y navega el navegador — ningún bloqueador de ventanas
    // emergentes puede pararlo, que es el riesgo de window.open. Solo se
    // recurre a window.open cuando el gancho no es un <a> (botones, divs), y
    // entonces va dentro del propio gesto del usuario.
    if (esEnlace(enlace)) {
      enlace.setAttribute("href", destino);
      enlace.setAttribute("target", "_blank");
      enlace.setAttribute("rel", "nofollow noopener noreferrer");
      return;
    }

    e.preventDefault();
    window.open(destino, "_blank", "noopener");
  }

  document.addEventListener("click", alHacerClic);
  Recuperacion.vigilar(mostrarCuadro);

  // Para comprobar desde la consola que el sitio quedó bien configurado.
  window.LeadWhatsApp = {
    version: VERSION,
    config: CONFIG,
    selector: SELECTOR,
    probarCuadro: mostrarCuadro,
    diagnostico: function () {
      var enlaces = document.querySelectorAll(SELECTOR);
      var numeros = {};
      Array.prototype.forEach.call(enlaces, function (a) {
        var n = numeroDe(a);
        numeros[n] = (numeros[n] || 0) + 1;
      });
      return {
        version: VERSION,
        numeroDelSitio: CONFIG.phone || "(FALTA data-wa-phone)",
        mide: CONFIG.medir,
        nombreDelEvento: CONFIG.evento,
        parametrosDelSitio: CONFIG.params,
        estilosPropios: !CONFIG.estilos,
        enlacesDetectados: enlaces.length,
        numerosEnUso: numeros,
        idioma: CONFIG.lang,
        contexto: CONFIG.context || "(ninguno)"
      };
    }
  };
})();
