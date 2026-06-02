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

  var gate = document.getElementById('call-gate');
  var gateClose = document.getElementById('call-gate-close');
  if (gate && gateClose && window.matchMedia('(max-width: 767px)').matches) {
    try {
      if (sessionStorage.getItem('gala400_callgate') === '1') {
        gate.classList.add('is-hidden');
      } else {
        setTimeout(function () {
          if (cookieBanner && !cookieBanner.classList.contains('is-hidden')) return;
          try {
            sessionStorage.setItem('gala400_callgate', '1');
          } catch (e) {}
          gate.classList.remove('is-hidden');
        }, 4000);
      }
    } catch (e) {}
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
