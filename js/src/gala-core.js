/* GALA 400 core — hours, dynamic city, call tracking, cookie consent, UI.
   Loaded with `defer` after cookieconsent.umd.js. No innerHTML with user data. */
(function () {
  'use strict';
  var C = window.GALA_CONFIG || {};
  var D = window.GALA_CITY_DATA || { n: {}, g: {}, a: {} };

  /* ---------- hours (single source: gala-config.js) ---------- */
  function applyHours() {
    document.querySelectorAll('[data-hours]').forEach(function (el) {
      var v = el.getAttribute('data-hours') === 'long' ? C.hoursLong : C.hoursShort;
      if (v) el.textContent = v;
    });
  }

  /* ---------- dynamic city ---------- */
  function norm(s) {
    s = String(s || '').slice(0, 200);
    try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
  var BY_NORM = null;
  function index() {
    if (BY_NORM) return BY_NORM;
    BY_NORM = {};
    Object.keys(D.n).forEach(function (slug) {
      BY_NORM[norm(D.n[slug])] = slug;
      BY_NORM[norm(slug)] = slug;
    });
    Object.keys(D.a).forEach(function (k) { BY_NORM[norm(k)] = D.a[k]; });
    return BY_NORM;
  }
  /* value from {loc_physical_ms}/{loc_interest_ms}: numeric Google geo ID, or a name/slug */
  function fromLoc(v) {
    v = String(v || '').trim();
    if (!v) return null;
    if (/^\d{4,10}$/.test(v)) return Object.prototype.hasOwnProperty.call(D.g, v) ? D.g[v] : null;
    var n = norm(v), idx = index();
    return Object.prototype.hasOwnProperty.call(idx, n) ? idx[n] : null;
  }
  /* comune mentioned inside a keyword / search term, longest name first */
  function fromKeyword(v) {
    var k = norm(v);
    if (!k) return null;
    if (/\bprovincia\b/.test(k)) k = k.replace(/\bprovincia (di )?verona\b/g, ' ');
    var idx = index(), keys = Object.keys(idx).sort(function (a, b) { return b.length - a.length; });
    var p = ' ' + k + ' ';
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].length >= 3 && p.indexOf(' ' + keys[i] + ' ') !== -1) return idx[keys[i]];
    }
    return null;
  }
  function resolveCity() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return { slug: null, ad: false }; }
    var ad = ['gclid', 'gbraid', 'wbraid', 'city', 'area', 'utm_term', 'utm_keyword', 'kw'].some(function (k) { return q.has(k); }) ||
             (q.get('utm_medium') || '').toLowerCase() === 'cpc';
    var slug = fromLoc(q.get('area')) ||
               fromKeyword(q.get('utm_term') || q.get('utm_keyword') || q.get('kw')) ||
               fromLoc(q.get('city'));
    var KEY = 'gala400_city';
    try {
      if (ad) sessionStorage.setItem(KEY, slug || '-');
      else {
        var s = sessionStorage.getItem(KEY);
        if (s) { ad = true; slug = (s !== '-' && D.n[s]) ? s : null; }
      }
    } catch (e) {}
    return { slug: slug && D.n[slug] ? slug : null, ad: ad };
  }
  function prepA(name) { return (/^[AaÀà]/.test(name) ? 'ad ' : 'a ') + name; }
  function applyCity() {
    var spans = document.querySelectorAll('[data-city]');
    if (!spans.length) return;
    var r = resolveCity();
    if (!r.ad) return;                     /* organic visitor: keep static SEO text */
    var name = r.slug ? D.n[r.slug] : null;
    spans.forEach(function (el) {
      var mode = el.getAttribute('data-city');
      el.textContent = mode === 'a' ? (name ? prepA(name) : C.cityFallbackA) : (name || C.cityFallbackName);
    });
    document.documentElement.setAttribute('data-gala-city', r.slug || 'none');
    if (!name) return;
    if (/Verona e provincia/.test(document.title)) document.title = document.title.replace('Verona e provincia', name);
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
      try {
        var u = new URL(a.href), t = u.searchParams.get('text');
        if (t) { u.searchParams.set('text', t.replace(/Verona( e provincia)?/, name)); a.href = u.toString(); }
      } catch (e) {}
    });
  }
  window.galaResolveCity = resolveCity; /* exposed for QA */

  /* ---------- call tracking ---------- */
  function g() { if (typeof window.gtag === 'function') window.gtag.apply(null, arguments); }
  function applyCallForwarding() {
    /* Google forwarding number swap (website call conversion "Chiamata (349 420 8551)").
       Swaps visible "349 420 8551" + tel: links for visitors from Google Ads. */
    g('config', C.callConversion, { phone_conversion_number: C.phoneDisplay });
  }
  window.gala400ApplyCallFwd = applyCallForwarding;
  function onTelClick(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
    if (!a) return;
    /* ignore emergency/short numbers (e.g. tel:112 on the gas-safety page); the business number may be swapped by Google */
    if ((a.getAttribute('href') || '').replace(/\D/g, '').length < 9) return;
    var where = a.getAttribute('data-cta') || 'tel_link';
    /* Backup signal (SECONDARY action "Click telefono"): a tap opens the dialer, it is not a call. */
    g('event', 'conversion', { send_to: C.telClickConversion, transport_type: 'beacon' });
    g('event', 'phone_click_ga4', { event_category: 'engagement', event_label: where, method: 'phone', transport_type: 'beacon' });
  }
  function bindForms() {
    document.querySelectorAll('form[data-ads-track]').forEach(function (form) {
      form.addEventListener('submit', function () { g('event', 'generate_lead', { method: form.getAttribute('data-ads-track') || 'form' }); });
    });
  }
  function showFormSuccess() {
    var params; try { params = new URLSearchParams(location.search); } catch (e) { return; }
    if (params.get('ok') !== '1') return;
    var ok = document.getElementById('richiamata-ok'); if (ok) ok.hidden = false;
    var form = document.querySelector('form[name="richiamata"]');
    if (form) form.querySelectorAll('input, button[type="submit"]').forEach(function (el) {
      if (el.type === 'hidden' || el.name === 'bot-field') return;
      if (el.type === 'submit') el.style.display = 'none'; else el.disabled = true;
    });
    var t = document.getElementById('richiamata') || document.getElementById('contatti');
    if (t) t.scrollIntoView(true);
  }

  /* ---------- Consent Mode v2 (advanced) + cookie banner ---------- */
  function updateConsent(analytics, ads) {
    g('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: ads ? 'granted' : 'denied',
      ad_user_data: ads ? 'granted' : 'denied',
      ad_personalization: ads ? 'granted' : 'denied'
    });
    if (ads) applyCallForwarding();
  }
  window.gala400UpdateConsent = updateConsent;
  function loadCookieCss(cb) {
    if (document.querySelector('link[data-cc-css]')) { cb(); return; }
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.css';
    l.setAttribute('data-cc-css', '1'); l.onload = cb; l.onerror = cb; document.head.appendChild(l);
  }
  function runBanner() {
    if (typeof window.CookieConsent === 'undefined') return;
    var CC = window.CookieConsent;
    function onChange() {
      var acc = (CC.getUserPreferences().acceptedCategories) || [];
      updateConsent(acc.indexOf('analytics') !== -1, acc.indexOf('ads') !== -1);
    }
    CC.run({
      revision: 1,
      hideFromBots: false, /* same banner for users, crawlers and reviewers */
      cookie: { name: 'cc_cookie', expiresAfterDays: 182 },
      guiOptions: {
        consentModal: { layout: 'box', position: 'bottom left', flipButtons: false, equalWeightButtons: true },
        preferencesModal: { layout: 'box', position: 'right', flipButtons: false, equalWeightButtons: true }
      },
      categories: { necessary: { readOnly: true, enabled: true }, analytics: {}, ads: {} },
      language: { default: 'it', translations: { it: {
        consentModal: {
          title: 'Utilizziamo i cookie',
          description: 'Usiamo cookie tecnici necessari e, solo con il tuo consenso, cookie di analisi (Google Analytics) e di misurazione pubblicitaria (Google Ads). Senza consenso Google riceve solo segnali anonimi senza cookie (Consent Mode). Puoi cambiare scelta in ogni momento da "Preferenze cookie" in fondo alla pagina.',
          acceptAllBtn: 'Accetta tutti', acceptNecessaryBtn: 'Rifiuta tutti', showPreferencesBtn: 'Gestisci preferenze',
          footer: '<a href="/privacy-policy.html">Privacy Policy</a><a href="/cookie-policy.html">Cookie Policy</a>'
        },
        preferencesModal: {
          title: 'Preferenze cookie', acceptAllBtn: 'Accetta tutti', acceptNecessaryBtn: 'Rifiuta tutti',
          savePreferencesBtn: 'Salva preferenze', closeIconLabel: 'Chiudi',
          sections: [
            { title: 'Cookie tecnici necessari', description: 'Indispensabili per il funzionamento del sito. Sempre attivi.', linkedCategory: 'necessary' },
            { title: 'Cookie di analisi (Google Analytics)', description: 'Ci aiutano a capire come i visitatori usano il sito.', linkedCategory: 'analytics' },
            { title: 'Cookie pubblicitari (Google Ads)', description: 'Misurano l\'efficacia degli annunci, incluse le chiamate generate dagli annunci e dal sito.', linkedCategory: 'ads' }
          ]
        }
      } } },
      onFirstConsent: onChange, onConsent: onChange, onChange: onChange
    });
  }

  /* ---------- UI ---------- */
  function ui() {
    var hbg = document.getElementById('hbg2'), nl = document.getElementById('nav2mobile');
    if (hbg && nl) {
      hbg.setAttribute('aria-expanded', 'false');
      hbg.addEventListener('click', function () { var o = nl.classList.toggle('open'); hbg.setAttribute('aria-expanded', o ? 'true' : 'false'); });
      nl.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nl.classList.remove('open'); }); });
    }
    var on = function () { var t = document.querySelector('.ticker'); if (t) t.classList.add('is-on'); };
    if ('requestIdleCallback' in window) requestIdleCallback(on, { timeout: 2000 }); else setTimeout(on, 1200);
    document.querySelectorAll('[data-cc-open]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); if (window.CookieConsent) window.CookieConsent.showPreferences(); });
    });
  }

  function init() {
    applyHours();
    applyCity();
    document.addEventListener('click', onTelClick, true);
    bindForms();
    showFormSuccess();
    ui();
    loadCookieCss(runBanner);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
