/*
 * Conexión con la API de Google Apps Script (Google Sheets como base de datos).
 * Se usa POST con Content-Type text/plain para que el navegador no haga la
 * verificación previa de CORS, que Apps Script no admite.
 *
 * API.run imita la interfaz de google.script.run:
 *   API.run.withSuccessHandler(fnOk).withFailureHandler(fnError).nombreAccion(arg1, arg2)
 */
(function () {
  var TIEMPO_MAXIMO_MS = 45000;

  function urlApi() {
    var u = (window.CONFIG && window.CONFIG.API_URL) || '';
    return /^https?:\/\//.test(u) ? u : '';
  }

  function llamar(accion, args) {
    var url = urlApi();
    if (!url) {
      return Promise.reject(new Error('Falta configurar la URL de la API en el archivo config.js del repositorio.'));
    }
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIEMPO_MAXIMO_MS);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion: accion, args: args || [] }),
      redirect: 'follow',
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('El servidor respondió con el código ' + r.status + '.');
      return r.json().catch(function () {
        throw new Error('Respuesta no válida del servidor. Revise que la implementación de Apps Script tenga acceso "Cualquier usuario".');
      });
    }).then(function (j) {
      if (!j || j.ok !== true) throw new Error((j && j.error) || 'Error desconocido del servidor.');
      return j.data;
    }).catch(function (e) {
      if (e && e.name === 'AbortError') throw new Error('El servidor tardó demasiado en responder. Intente de nuevo.');
      if (e instanceof TypeError) throw new Error('No se pudo conectar con el servidor. Revise su conexión a internet.');
      throw e;
    }).finally(function () { clearTimeout(reloj); });
  }

  function crear(ok, fallo) {
    return new Proxy({}, {
      get: function (_, nombre) {
        if (nombre === 'withSuccessHandler') return function (h) { return crear(h, fallo); };
        if (nombre === 'withFailureHandler') return function (h) { return crear(ok, h); };
        return function () {
          var args = Array.prototype.slice.call(arguments);
          llamar(String(nombre), args).then(
            function (d) { if (ok) ok(d); },
            function (e) { if (fallo) fallo(e); else console.error(e); }
          );
        };
      }
    });
  }

  window.API = { llamar: llamar, run: crear() };
})();
