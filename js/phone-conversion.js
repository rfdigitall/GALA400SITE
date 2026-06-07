/**
 * Google Ads — conversii: tutti i tel:, form richiamata, conferma invio.
 * Tag: AW-18106797178 | Conversione: tG61CLym4LocEPqY_7lD
 */
(function () {
  var SEND_TO = 'AW-18106797178/tG61CLym4LocEPqY_7lD';

  function reportConversion(opts) {
    if (typeof gtag !== 'function') return false;
    gtag('event', 'conversion', Object.assign({ send_to: SEND_TO }, opts || {}));
    return true;
  }

  window.gala400ReportConversion = reportConversion;

  /* Tutti i link telefono (header, sticky, gate, footer, testo, CTA) */
  document.addEventListener(
    'click',
    function (e) {
      var link = e.target.closest('a[href^="tel:"]');
      if (!link) return;
      reportConversion({
        event_label: link.getAttribute('data-cta') || 'telefono',
      });
    },
    true
  );

  /* Formulario richiamata (Netlify) — su tutte le pagine */
  function bindRichiamataForm(form) {
    if (form.dataset.adsBound === '1') return;
    form.dataset.adsBound = '1';

    form.addEventListener('submit', function (e) {
      var honeypot = form.querySelector('[name="bot-field"]');
      if (honeypot && honeypot.value) return;

      if (typeof gtag !== 'function') return;

      e.preventDefault();
      var sent = false;

      function submitNative() {
        if (sent) return;
        sent = true;
        HTMLFormElement.prototype.submit.call(form);
      }

      gtag('event', 'conversion', {
        send_to: SEND_TO,
        event_label: 'richiamata-invio',
        event_callback: submitNative,
        event_timeout: 2500,
      });
      setTimeout(submitNative, 2000);
    });
  }

  function initForms() {
    document.querySelectorAll('form[name="richiamata"]').forEach(bindRichiamataForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

  /* Dopo redirect ?ok=1#richiamata */
  try {
    if (
      new URLSearchParams(window.location.search).get('ok') === '1' &&
      sessionStorage.getItem('gala400_richiamata_conv') !== '1'
    ) {
      sessionStorage.setItem('gala400_richiamata_conv', '1');
      reportConversion({ event_label: 'richiamata-confermata' });
    }
  } catch (err) {
    /* ignore */
  }
})();
