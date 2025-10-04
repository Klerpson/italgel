/**
 * Search Module
 * Búsqueda inteligente en el sitio con SimpleJekyllSearch optimizado
 * @version 2.0
 */

(function () {
  "use strict";

  // ============================================
  // SIMPLE JEKYLL SEARCH (Minificado y optimizado)
  // ============================================
  !(function () {
    "use strict";
    var o = {
        compile: function M(r) {
          return i.template.replace(i.pattern, function (t, e) {
            var n = i.middleware(e, r[e], i.template);
            return void 0 !== n ? n : r[e] || t;
          });
        },
        setOptions: function T(t) {
          (i.pattern = t.pattern || i.pattern),
            (i.template = t.template || i.template),
            "function" == typeof t.middleware && (i.middleware = t.middleware);
        },
      },
      i = {};
    (i.pattern = /\{(.*?)\}/g),
      (i.template = ""),
      (i.middleware = function () {});
    var n = function x(t, e) {
        var n = e.length,
          r = t.length;
        if (n < r) return !1;
        if (r === n) return t === e;
        t: for (var i = 0, o = 0; i < r; i++) {
          for (var u = t.charCodeAt(i); o < n; )
            if (e.charCodeAt(o++) === u) continue t;
          return !1;
        }
        return !0;
      },
      e = new (function J() {
        this.matches = function (t, e) {
          return n(e.toLowerCase(), t.toLowerCase());
        };
      })();
    var r = new (function R() {
      this.matches = function (e, t) {
        return (
          !!e &&
          ((e = e.trim().toLowerCase()),
          (t = t.trim().toLowerCase()).split(" ").filter(function (t) {
            return 0 <= e.indexOf(t);
          }).length === t.split(" ").length)
        );
      };
    })();
    var u = {
      put: function b(t) {
        if (l(t)) return p(t);
        if (
          (function e(t) {
            return (
              Boolean(t) &&
              "[object Array]" === Object.prototype.toString.call(t)
            );
          })(t)
        )
          return (function i(t) {
            var e = [];
            f();
            for (var n = 0, r = t.length; n < r; n++)
              l(t[n]) && e.push(p(t[n]));
            return e;
          })(t);
        return undefined;
      },
      clear: f,
      search: function N(t) {
        return t
          ? (function a(t, e, n, r) {
              for (var i = [], o = 0; o < t.length && i.length < r.limit; o++) {
                var u = d(t[o], e, n, r);
                u && i.push(u);
              }
              return i;
            })(c, t, s.searchStrategy, s).sort(s.sort)
          : [];
      },
      setOptions: function E(t) {
        ((s = t || {}).fuzzy = t.fuzzy || !1),
          (s.limit = t.limit || 10),
          (s.searchStrategy = t.fuzzy ? e : r),
          (s.sort = t.sort || a);
      },
    };
    function a() {
      return 0;
    }
    var c = [],
      s = {};
    function f() {
      return (c.length = 0), c;
    }
    function l(t) {
      return (
        Boolean(t) && "[object Object]" === Object.prototype.toString.call(t)
      );
    }
    function p(t) {
      return c.push(t), c;
    }
    function d(t, e, n, r) {
      for (var i in t) if (!h(t[i], r.exclude) && n.matches(t[i], e)) return t;
    }
    function h(t, e) {
      for (var n = !1, r = 0, i = (e = e || []).length; r < i; r++) {
        var o = e[r];
        !n && new RegExp(t).test(o) && (n = !0);
      }
      return n;
    }
    (s.fuzzy = !1),
      (s.limit = 10),
      (s.searchStrategy = s.fuzzy ? e : r),
      (s.sort = a);
    var m = {
      load: function A(t, e) {
        var n = (function r() {
          return window.XMLHttpRequest
            ? new window.XMLHttpRequest()
            : new ActiveXObject("Microsoft.XMLHTTP");
        })();
        n.open("GET", t, !0),
          (n.onreadystatechange = (function i(e, n) {
            return function () {
              if (4 === e.readyState && 200 === e.status)
                try {
                  n(null, JSON.parse(e.responseText));
                } catch (t) {
                  n(t, null);
                }
            };
          })(n, e)),
          n.send();
      },
    };
    var t = function H(t) {
        if (
          !(function e(t) {
            return (
              t &&
              "undefined" != typeof t.required &&
              t.required instanceof Array
            );
          })(t)
        )
          throw new Error("-- OptionsValidator: required options missing");
        if (!(this instanceof H)) return new H(t);
        var r = t.required;
        (this.getRequiredOptions = function () {
          return r;
        }),
          (this.validate = function (e) {
            var n = [];
            return (
              r.forEach(function (t) {
                "undefined" == typeof e[t] && n.push(t);
              }),
              n
            );
          });
      },
      v = {
        merge: function X(t, e) {
          var n = {};
          for (var r in t)
            (n[r] = t[r]), "undefined" != typeof e[r] && (n[r] = e[r]);
          return n;
        },
        isJSON: function k(t) {
          try {
            return t instanceof Object && JSON.parse(JSON.stringify(t))
              ? !0
              : !1;
          } catch (e) {
            return !1;
          }
        },
      };
    var w, y, g, O, z;
    function S(t) {
      u.put(t),
        (function e() {
          y.searchInput.addEventListener("input", function (t) {
            j(), C(t.target.value);
          }),
            y.searchInput.addEventListener("focus", function () {
              y.resultsContainer.style.display = "block";
            });
        })();
    }
    function j() {
      y.resultsContainer.innerHTML = "";
    }
    function q(t) {
      y.resultsContainer.innerHTML += t;
    }
    function C(t) {
      !(function e(t) {
        return t && 0 < t.length;
      })(t) ||
        (j(),
        (function i(t, e) {
          var n = t.length;
          if (0 === n) return q(y.noResultsText);
          for (var r = 0; r < n; r++) (t[r].query = e), q(o.compile(t[r]));
        })(u.search(t), t),
        (y.resultsContainer.style.display =
          u.search(t).length > 0 ? "block" : "none"));
    }
    function L(t) {
      throw new Error("SimpleJekyllSearch --- " + t);
    }
    (w = window),
      (y = {
        searchInput: null,
        resultsContainer: null,
        json: [],
        success: Function.prototype,
        searchResultTemplate: '<li><a href="{url}">{title}</a></li>',
        templateMiddleware: Function.prototype,
        sortMiddleware: function () {
          return 0;
        },
        noResultsText: "No se encontraron resultados",
        limit: 10,
        fuzzy: !1,
        exclude: [],
      }),
      (O = t({ required: (g = ["searchInput", "resultsContainer", "json"]) })),
      (z = function (t) {
        return (
          0 < O.validate(t).length &&
            L("You must specify the following required options: " + g),
          (y = v.merge(y, t)),
          o.setOptions({
            template: y.searchResultTemplate,
            middleware: y.templateMiddleware,
          }),
          u.setOptions({
            fuzzy: y.fuzzy,
            limit: y.limit,
            sort: y.sortMiddleware,
          }),
          (v.isJSON(y.json)
            ? S
            : function e(n) {
                m.load(n, function (t, e) {
                  t && L("failed to get JSON (" + n + ")"), S(e);
                });
              })(y.json),
          { search: C }
        );
      }),
      (w.SimpleJekyllSearch = function (t) {
        var e = z(t);
        return t.success.call(e), e;
      });
  })();

  // ============================================
  // CONFIGURACIÓN DE BÚSQUEDA
  // ============================================
  const SearchConfig = {
    searchInput: "#search-input",
    resultsContainer: "#results-container",
    jsonFile: "/search.json",
    templateHTML: `
      <li class="search-result-item">
        <a href="{url}" class="search-result-link">
          <h3 class="search-result-title">{title}</h3>
        </a>
      </li>
    `,
    noResultsText: `
      <li class="search-no-results">
        <p>No encontramos resultados para tu búsqueda.</p>
        <p>Intenta con otras palabras clave.</p>
      </li>
    `,
    fuzzy: false, // Búsqueda exacta (mejor para español)
    limit: 10,
    minChars: 2, // Mínimo de caracteres para buscar
  };

  // ============================================
  // MANEJADOR DE BÚSQUEDA
  // ============================================
  const SearchHandler = {
    instance: null,
    modal: null,
    searchInput: null,
    resultsContainer: null,

    /**
     * Inicializa el sistema de búsqueda
     */
    init() {
      this.modal = document.getElementById("buscador");
      this.searchInput = document.getElementById("search-input");
      this.resultsContainer = document.getElementById("results-container");

      if (!this.searchInput || !this.resultsContainer) {
        console.warn("⚠️ Search elements not found");
        return;
      }

      // Obtener ruta del JSON desde data-attribute
      const searchJsonPath = this.modal?.getAttribute('data-search-json') || '/search.json';

      // Inicializar SimpleJekyllSearch
      this.instance = SimpleJekyllSearch({
        searchInput: this.searchInput,
        resultsContainer: this.resultsContainer,
        json: searchJsonPath, // <-- USAR LA RUTA DINÁMICA
        searchResultTemplate: SearchConfig.templateHTML,
        noResultsText: SearchConfig.noResultsText,
        fuzzy: SearchConfig.fuzzy,
        limit: SearchConfig.limit,
        success: () => {
          console.log("✅ Search initialized successfully");
        },
      });

      this.addStyles();
      this.attachEvents();
    },

    /**
     * Agrega estilos CSS para resultados
     */
    addStyles() {
      if (document.getElementById("search-styles")) return;

      const styles = `
        <style id="search-styles">
          #results-container {
            list-style: none;
            padding: 0;
            margin: 0;
            max-height: 400px;
            overflow-y: auto;
          }
          
          .search-result-item {
            border-bottom: 1px solid #EDEDED;
            transition: background 0.2s ease;
          }
          
          .search-result-item:last-child {
            border-bottom: none;
          }
          
          .search-result-link {
            display: block;
            padding: 1rem;
            text-decoration: none;
            color: #424B54;
            transition: all 0.2s ease;
          }
          
          .search-result-link:hover {
            background: #F9F9F9;
            padding-left: 1.5rem;
          }
          
          .search-result-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
            color: #424B54;
          }
          
          .search-no-results {
            padding: 2rem 1rem;
            text-align: center;
            color: #999;
          }
          
          .search-no-results p {
            margin: 0.5rem 0;
          }
          
          .search-no-results p:first-child {
            font-weight: 600;
            color: #666;
          }
          
          /* Scrollbar personalizado */
          #results-container::-webkit-scrollbar {
            width: 8px;
          }
          
          #results-container::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          #results-container::-webkit-scrollbar-thumb {
            background: #D0D0D0;
            border-radius: 4px;
          }
          
          #results-container::-webkit-scrollbar-thumb:hover {
            background: #6BB1BA;
          }
        </style>
      `;

      document.head.insertAdjacentHTML("beforeend", styles);
    },

    /**
     * Adjunta eventos adicionales
     */
    attachEvents() {
      // Limpiar resultados al cerrar modal
      if (this.modal) {
        const closeBtn = this.modal.querySelector(".cerrar");
        const clearSearch = () => {
          this.searchInput.value = "";
          this.resultsContainer.innerHTML = "";
        };

        closeBtn?.addEventListener("click", clearSearch);
        this.modal.addEventListener("click", (e) => {
          if (e.target === this.modal) clearSearch();
        });
      }

      // Focus automático al abrir modal
      const searchTrigger = document.querySelector('a[href="#buscador"]');
      if (searchTrigger && this.searchInput) {
        searchTrigger.addEventListener("click", () => {
          setTimeout(() => {
            this.searchInput.focus();
          }, 100);
        });
      }

      // Búsqueda con Enter
      this.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const firstResult = this.resultsContainer.querySelector(
            ".search-result-link"
          );
          if (firstResult) {
            firstResult.click();
          }
        }
      });

      // Validación de caracteres mínimos
      this.searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();

        if (query.length > 0 && query.length < SearchConfig.minChars) {
          this.resultsContainer.innerHTML = `
            <li class="search-no-results">
              <p>Escribe al menos ${SearchConfig.minChars} caracteres para buscar</p>
            </li>
          `;
        }
      });

      // Click en resultado cierra modal
      this.resultsContainer.addEventListener("click", () => {
        if (this.modal) {
          window.location.hash = "";
        }
      });
    },
  };

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  function init() {
    SearchHandler.init();
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
