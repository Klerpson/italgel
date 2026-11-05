/**
 * buscador.js — buscador del sitio con Pagefind (kit de metodo-web, modelo zoomforth).
 * Marcado: _includes/buscador-dialogo.html, buscador-panel.html y la página /buscar/.
 * El índice lo genera `npx pagefind --site _site` después de Jekyll (build de Netlify o
 * workflow de GitHub Actions) y solo se descarga al abrir el buscador.
 *
 * Encima del ranking de Pagefind:
 * - Pesos por tipo (_data/buscador.yml → pesos): servicios y casos suben para que el blog
 *   no los entierre.
 * - Tarjeta por intención (promos): una tarjeta fija arriba según palabras de la consulta.
 * - CTA: el <template data-buscador-cta> (el botón de conversión del sitio) se inserta tras el
 *   3.er resultado (2.º si el primero tiene peso), salvo que la tarjeta ya sea de conversión.
 *   Si el CTA es de WhatsApp y hay plantilla `wa`, el mensaje lleva el término buscado.
 * - Atribución: el último término va a sessionStorage `search_term` y se copia a cualquier
 *   <input name="search_term"> de la página.
 * - dataLayer: view_search_results, search_no_results, search_result_click, search_promo_click.
 */
(function () {
  'use strict';

  var CANDIDATOS = 24;
  var dialogo = document.getElementById('buscador');
  var raizPagina = document.querySelector('[data-buscador-pagina]');
  var cfg = {};
  try {
    cfg = JSON.parse(document.getElementById('buscador-datos').textContent) || {};
  } catch (e) { /* sin configuración: Pagefind solo */ }
  var promos = cfg.promos || [];
  var pesos = cfg.pesos || {};
  var t = cfg.t || {};

  /* Atribución: rellena el campo oculto de los formularios de esta página. */
  try {
    var guardado = sessionStorage.getItem('search_term');
    if (guardado) {
      document.querySelectorAll('input[name="search_term"]').forEach(function (i) {
        if (!i.value) i.value = guardado;
      });
    }
  } catch (e) { /* almacenamiento bloqueado */ }

  var promesaPagefind = null;
  function cargarPagefind() {
    if (!promesaPagefind) {
      promesaPagefind = import('/pagefind/pagefind.js').then(function (pf) {
        return pf.options({ excerptLength: 22 }).then(function () { pf.init(); return pf; });
      });
      promesaPagefind.catch(function () { promesaPagefind = null; });
    }
    return promesaPagefind;
  }

  function medir(evento, datos) {
    window.dataLayer = window.dataLayer || [];
    var carga = { event: evento };
    for (var k in datos) carga[k] = datos[k];
    window.dataLayer.push(carga);
  }

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Minúsculas y sin tildes: "Cirugía" y "cirugia" cuentan igual. */
  function normalizar(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function texto(clave, n) {
    return String(t[clave] || '').replace('{n}', n);
  }

  /* Pagefind devuelve coincidencias sueltas para texto sin sentido ("xyzzyqq" casaba con
     "[X%]"). Cuenta como coincidencia real si algún <mark> empieza como una palabra buscada. */
  function coincideDeVerdad(q, extracto) {
    var palabras = normalizar(q).split(/[^a-z0-9]+/).filter(Boolean);
    var marcas = (extracto.match(/<mark>([^<]*)<\/mark>/g) || []).map(function (m) {
      return normalizar(m.replace(/<\/?mark>/g, '')).replace(/[^a-z0-9]/g, '');
    });
    return marcas.some(function (m) {
      return palabras.some(function (p) {
        var n = Math.min(3, p.length);
        return m.length >= n && m.slice(0, n) === p.slice(0, n);
      });
    });
  }

  function buscarPromo(q) {
    var txt = ' ' + normalizar(q).replace(/[^a-z0-9]+/g, ' ') + ' ';
    for (var i = 0; i < promos.length; i++) {
      var palabras = promos[i].match || [];
      for (var j = 0; j < palabras.length; j++) {
        if (txt.indexOf(' ' + normalizar(palabras[j]) + ' ') !== -1) return promos[i];
      }
    }
    return null;
  }

  /* CTA de WhatsApp: el mensaje prellenado menciona lo que buscó. */
  function ctaConTermino(nodo, q) {
    var a = nodo.querySelector('a[href]');
    if (!a || !cfg.wa || !/wa\.me|whatsapp/.test(a.href)) return nodo;
    var msg = cfg.wa.replace('{q}', function () { return q; });
    try {
      var url = new URL(a.href);
      url.searchParams.set('text', msg);
      a.href = url.toString();
    } catch (e) { /* href raro: se deja el de Liquid */ }
    a.setAttribute('data-wa-text', msg);
    return nodo;
  }

  /* Una caja + panel (el diálogo, y /buscar/ en esa página). */
  function enlazar(form, panel, limite, sincronizarUrl) {
    var input = form.querySelector('[data-buscador-input]');
    var inicio = panel.querySelector('[data-buscador-inicio]');
    var estado = panel.querySelector('[data-buscador-estado]');
    var lista = panel.querySelector('[data-buscador-resultados]');
    var vacio = panel.querySelector('[data-buscador-vacio]');
    var filtros = panel.querySelector('[data-buscador-filtros]');
    var plantillaCta = panel.querySelector('template[data-buscador-cta]');
    var todos = panel.querySelector('[data-buscador-todos]');
    var ronda = 0;
    var temporizador = null;
    var temporizadorMedir = null;
    var actual = '';

    function reiniciar() {
      inicio.hidden = false;
      lista.innerHTML = '';
      vacio.hidden = true;
      filtros.hidden = true;
      todos.hidden = true;
      estado.textContent = '';
    }

    function filtrar() {
      var marcado = filtros.querySelector('input:checked');
      var tipo = marcado ? marcado.value : 'todos';
      lista.querySelectorAll('.buscador-resultado').forEach(function (li) {
        li.hidden = tipo !== 'todos' && li.getAttribute('data-tipo') !== tipo;
      });
    }
    filtros.addEventListener('change', filtrar);

    function pintar(q, resultados, promo, total) {
      lista.innerHTML = '';
      inicio.hidden = true;
      var cuentas = {};
      resultados.forEach(function (r) { cuentas[r.tipo] = (cuentas[r.tipo] || 0) + 1; });

      filtros.querySelector('input[value="todos"]').checked = true;
      filtros.querySelectorAll('label[data-tipo]').forEach(function (label) {
        var n = cuentas[label.getAttribute('data-tipo')] || 0;
        label.hidden = n === 0;
        label.querySelector('[data-cuenta]').textContent = ' ' + n;
      });
      filtros.hidden = Object.keys(cuentas).length < 2;

      if (promo) {
        var li = document.createElement('li');
        li.className = 'buscador-promo';
        li.innerHTML = '<a href="' + escapar(promo.url) + '"' +
          (promo.conversion ? ' data-location="buscador-promo"' : '') + ' data-promo>' +
          '<span class="buscador-resultado__titulo">' + escapar(promo.titulo) + '</span>' +
          (promo.texto ? '<span class="buscador-resultado__extracto">' + escapar(promo.texto) + '</span>' : '') +
          '</a>';
        lista.appendChild(li);
      }

      var sinCta = promo && promo.conversion;
      var ctaEn = resultados.length && pesos[resultados[0].tipo] ? 2 : 3;
      resultados.forEach(function (r, i) {
        if (i === ctaEn && !sinCta) lista.appendChild(ctaConTermino(plantillaCta.content.cloneNode(true), q));
        var li = document.createElement('li');
        li.className = 'buscador-resultado';
        li.setAttribute('data-tipo', r.tipo);
        li.innerHTML = '<a href="' + escapar(r.url) + '" data-posicion="' + (i + 1) + '">' +
          '<span class="buscador-resultado__tipo">' + escapar(r.tipo) + '</span>' +
          '<span class="buscador-resultado__titulo">' + escapar(r.titulo) + '</span>' +
          '<span class="buscador-resultado__extracto">' + r.extracto + '</span></a>';
        lista.appendChild(li);
      });
      if (resultados.length && resultados.length <= ctaEn && !sinCta) {
        lista.appendChild(ctaConTermino(plantillaCta.content.cloneNode(true), q));
      }

      vacio.hidden = resultados.length > 0 || !!promo;
      vacio.querySelector('[data-buscador-termino]').textContent = q;
      var ctaVacio = vacio.querySelector('[data-buscador-cta-vacio]');
      if (ctaVacio) ctaConTermino(ctaVacio, q);
      estado.textContent = total
        ? total + ' ' + (total === 1 ? t.resultado : t.resultados) + ' ' + t.para + ' “' + q + '”'
        : '';
      todos.hidden = sincronizarUrl || total <= resultados.length;
      todos.href = todos.getAttribute('data-buscador-todos') + '?q=' + encodeURIComponent(q);
      todos.textContent = texto('ver_todos', total);
    }

    function correr(q) {
      var id = ++ronda;
      actual = q;
      if (sincronizarUrl) {
        var url = new URL(window.location.href);
        if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
        history.replaceState(null, '', url);
      }
      if (!q) { reiniciar(); return; }
      var total = 0;
      cargarPagefind().then(function (pf) {
        return pf.search(q);
      }).then(function (busqueda) {
        if (id !== ronda || !busqueda) return null;
        total = busqueda.results.length;
        return Promise.all(busqueda.results.slice(0, Math.max(limite, CANDIDATOS)).map(function (res) {
          return res.data().then(function (d) {
            var tipo = (d.filters && d.filters.tipo && d.filters.tipo[0]) || t.tipo_defecto || 'Página';
            return {
              url: d.url,
              titulo: (d.meta && d.meta.title) || d.url,
              extracto: d.excerpt,
              tipo: tipo,
              puntaje: res.score * (pesos[tipo] || 1)
            };
          });
        }));
      }).then(function (resultados) {
        if (id !== ronda || !resultados) return;
        if (!resultados.some(function (r) { return coincideDeVerdad(q, r.extracto); })) { resultados = []; total = 0; }
        var promo = buscarPromo(q);
        /* La tarjeta ya enlaza a su página: se quita de la lista. */
        if (promo) {
          var antes = resultados.length;
          resultados = resultados.filter(function (r) { return r.url !== promo.url; });
          total -= antes - resultados.length;
        }
        resultados.sort(function (a, b) { return b.puntaje - a.puntaje; });
        resultados = resultados.slice(0, limite);
        pintar(q, resultados, promo, total);
        try { sessionStorage.setItem('search_term', q); } catch (e) { /* almacenamiento bloqueado */ }
        clearTimeout(temporizadorMedir);
        temporizadorMedir = setTimeout(function () {
          medir(resultados.length ? 'view_search_results' : 'search_no_results', {
            search_term: q,
            results_count: total,
            search_surface: sincronizarUrl ? 'page' : 'dialog'
          });
        }, 1000);
      }).catch(function () {
        if (id !== ronda) return;
        estado.textContent = t.no_disponible || '';
      });
    }

    input.addEventListener('input', function () {
      clearTimeout(temporizador);
      var q = input.value.trim();
      temporizador = setTimeout(function () { correr(q); }, 150);
    });

    /* Las búsquedas populares corren aquí mismo en vez de recargar /buscar/. */
    panel.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-buscador-consulta]');
      if (chip) {
        e.preventDefault();
        input.value = chip.getAttribute('data-buscador-consulta');
        correr(input.value);
        input.focus();
        return;
      }
      var enlace = e.target.closest('a[href]');
      if (!enlace || !actual) return;
      if (enlace.hasAttribute('data-promo')) {
        medir('search_promo_click', { search_term: actual, url: enlace.getAttribute('href') });
      } else if (enlace.hasAttribute('data-posicion')) {
        medir('search_result_click', {
          search_term: actual,
          position: Number(enlace.getAttribute('data-posicion')),
          result_type: enlace.closest('[data-tipo]').getAttribute('data-tipo'),
          url: enlace.getAttribute('href')
        });
      }
    });

    /* Flechas: de la caja a los resultados visibles y entre ellos. */
    form.parentNode.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var enlaces = Array.prototype.filter.call(lista.querySelectorAll('a[href]'), function (a) {
        return a.offsetParent !== null;
      });
      if (!enlaces.length) return;
      var i = enlaces.indexOf(document.activeElement);
      if (document.activeElement === input) i = -1;
      else if (i === -1) return;
      e.preventDefault();
      var sig = e.key === 'ArrowDown' ? i + 1 : i - 1;
      if (sig < 0) input.focus();
      else enlaces[Math.min(sig, enlaces.length - 1)].focus();
    });

    /* Enter envía a la página de resultados: en el diálogo el primer botón de envío es
       Cerrar (formmethod="dialog") y sin esto Enter cerraba el buscador. */
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      if (form.requestSubmit) form.requestSubmit(); else form.submit();
    });

    return { input: input, correr: correr };
  }

  var cajaDialogo = dialogo && enlazar(dialogo.querySelector('form'), dialogo.querySelector('[data-buscador-panel]'), 8, false);
  var cajaPagina = raizPagina && enlazar(raizPagina.querySelector('form'), raizPagina.querySelector('[data-buscador-panel]'), 50, true);

  if (cajaPagina) {
    var inicial = new URLSearchParams(window.location.search).get('q') || '';
    if (inicial) { cajaPagina.input.value = inicial; cajaPagina.correr(inicial.trim()); }
  }

  /* Cierra el menú móvil abierto (popover o botón con aria-expanded) antes del diálogo. */
  function cerrarMenus() {
    try {
      document.querySelectorAll(':popover-open').forEach(function (p) { p.hidePopover(); });
    } catch (e) { /* navegador sin popover */ }
    /* Solo el botón que controla el menú donde está la lupa (no las FAQ u otros acordeones). */
    document.querySelectorAll('[aria-controls][aria-expanded="true"]').forEach(function (b) {
      var menu = document.getElementById(b.getAttribute('aria-controls'));
      if (menu && menu.querySelector('[data-buscador-abrir]')) b.click();
    });
  }

  function abrir() {
    if (cajaPagina) { cajaPagina.input.focus(); cajaPagina.input.select(); return; }
    if (!dialogo || dialogo.open) return;
    cerrarMenus();
    dialogo.showModal();
    cajaDialogo.input.focus();
    cargarPagefind();
  }

  document.querySelectorAll('[data-buscador-abrir]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!dialogo && !cajaPagina) return;
      e.preventDefault();
      abrir();
    });
    /* Precarga el índice mientras el puntero va hacia el botón. */
    a.addEventListener('pointerenter', cargarPagefind, { once: true });
  });

  document.addEventListener('keydown', function (e) {
    var escribiendo = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      abrir();
    } else if (e.key === '/' && !escribiendo) {
      e.preventDefault();
      abrir();
    }
  });

  if (dialogo) {
    /* El CTA (WhatsApp, canales.js, agenda) abre cosas fuera del modal, que quedarían inertes:
       el diálogo se cierra antes, en captura sobre window para ir antes que canales.js. */
    window.addEventListener('click', function (e) {
      if (dialogo.open && dialogo.contains(e.target) &&
          e.target.closest('.buscador-cta, [data-buscador-cta-vacio], [data-promo], [data-canales], a[href*="wa.me/"], .lead_whatsapp, .lead-whatsapp')) {
        dialogo.close();
      }
    }, true);
    /* Cierre al tocar el fondo en navegadores sin closedby="any" (Safari): el clic cae en
       el propio <dialog>. */
    dialogo.addEventListener('click', function (e) {
      if (e.target === dialogo) dialogo.close();
    });
    /* En un input type="search" el primer Esc solo borra el texto: aquí cierra de una vez. */
    dialogo.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); dialogo.close(); }
    });
  }
})();
