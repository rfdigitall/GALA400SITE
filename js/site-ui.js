(function () {
  var KEY = 'gala400_cookie_ok';
  var banner = document.getElementById('cookie-banner');
  var accept = document.getElementById('cookie-accept');
  if (!banner || !accept) return;
  try {
    if (!localStorage.getItem(KEY)) {
      banner.classList.remove('is-hidden');
    }
  } catch (e) {
    banner.classList.remove('is-hidden');
  }
  accept.addEventListener('click', function () {
    banner.classList.add('is-hidden');
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  });
})();
