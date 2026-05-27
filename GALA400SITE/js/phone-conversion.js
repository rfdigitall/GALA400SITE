(function () {
  var SEND_TO = 'AW-18106797178/gj3KCPXd27EcEPqY_7lD';

  document.addEventListener(
    'click',
    function (e) {
      var link = e.target.closest('a[href^="tel:"]');
      if (!link || typeof gtag !== 'function') return;
      gtag('event', 'conversion', { send_to: SEND_TO });
    },
    true
  );
})();
