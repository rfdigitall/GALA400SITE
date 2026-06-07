(function () {
  var cookieBanner = document.getElementById('cookie-banner');
  var cookieBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieBtn) {
    try {
      if (localStorage.getItem('gala400_cookie') !== '1') {
        cookieBanner.classList.remove('is-hidden');
      }
    } catch (e) {}
    cookieBtn.addEventListener('click', function () {
      try {
        localStorage.setItem('gala400_cookie', '1');
      } catch (e) {}
      cookieBanner.classList.add('is-hidden');
    });
  }

  var called = false;
  document.addEventListener(
    'click',
    function (e) {
      if (e.target.closest('a[href^="tel:"]')) called = true;
    },
    true
  );

  var gate = document.getElementById('call-gate');
  var gateClose = document.getElementById('call-gate-close');
  var isMobile = window.matchMedia('(max-width: 767px)').matches;

  function fromAds() {
    try {
      var q = new URLSearchParams(window.location.search);
      return q.has('gclid') || q.has('gbraid') || q.has('wbraid') || q.get('utm_medium') === 'cpc';
    } catch (e) {
      return false;
    }
  }

  function showGate() {
    if (!gate || called) return;
    try {
      if (sessionStorage.getItem('gala400_callgate') === '1') return;
      sessionStorage.setItem('gala400_callgate', '1');
    } catch (e) {}
    gate.classList.remove('is-hidden');
  }

  if (gate && gateClose && isMobile) {
    var delay = fromAds() ? 500 : 1200;
    setTimeout(function () {
      if (called) return;
      if (cookieBanner && !cookieBanner.classList.contains('is-hidden')) {
        cookieBtn && cookieBtn.addEventListener('click', function () {
          setTimeout(showGate, 400);
        }, { once: true });
        return;
      }
      showGate();
    }, delay);

    gateClose.addEventListener('click', function () {
      gate.classList.add('is-hidden');
    });
    gate.addEventListener('click', function (e) {
      if (e.target === gate) gate.classList.add('is-hidden');
    });
  }

  try {
    if (new URLSearchParams(window.location.search).get('ok') === '1') {
      var ok = document.getElementById('richiamata-ok');
      if (ok) ok.hidden = false;
    }
  } catch (e) {}
})();
